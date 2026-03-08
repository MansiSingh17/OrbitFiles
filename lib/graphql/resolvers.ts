import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files, activityLogs } from "@/lib/db/schema";
import { eq, and, isNull, isNotNull, sql } from "drizzle-orm";
import { getOrSet, invalidateUserCache, CacheKey, TTL } from "@/lib/redis/cache";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export const resolvers = {
  Query: {
    files: async (_: unknown, { parentId }: { parentId?: string }) => {
      const userId = await requireAuth();
      return getOrSet(
        CacheKey.filesList(userId, parentId),
        TTL.FILES_LIST,
        async () => {
          if (parentId) {
            return db.select().from(files).where(and(eq(files.userId, userId), eq(files.parentId, parentId)));
          }
          return db.select().from(files).where(and(eq(files.userId, userId), isNull(files.parentId)));
        }
      );
    },

    file: async (_: unknown, { id }: { id: string }) => {
      const userId = await requireAuth();
      const [file] = await db.select().from(files).where(and(eq(files.id, id), eq(files.userId, userId)));
      return file ?? null;
    },

    starredFiles: async () => {
      const userId = await requireAuth();
      return getOrSet(
        CacheKey.starredFiles(userId),
        TTL.STARRED_FILES,
        async () =>
          db.select().from(files).where(and(eq(files.userId, userId), eq(files.isStarred, true), eq(files.isTrash, false)))
      );
    },

    trashedFiles: async () => {
      const userId = await requireAuth();
      return db.select().from(files).where(and(eq(files.userId, userId), eq(files.isTrash, true)));
    },

    duplicates: async () => {
      const userId = await requireAuth();
      return getOrSet(
        CacheKey.duplicates(userId),
        TTL.DUPLICATES,
        async () => {
          const dupes = await db
            .select({ contentHash: files.contentHash, count: sql<number>`count(*)::int` })
            .from(files)
            .where(and(eq(files.userId, userId), eq(files.isFolder, false), eq(files.isTrash, false), isNotNull(files.contentHash)))
            .groupBy(files.contentHash)
            .having(sql`count(*) > 1`);

          const duplicateGroups = await Promise.all(
            dupes.map(async (dup) => {
              const groupFiles = await db
                .select()
                .from(files)
                .where(and(eq(files.userId, userId), eq(files.contentHash, dup.contentHash!), eq(files.isTrash, false)))
                .orderBy(files.createdAt);
              return { contentHash: dup.contentHash!, count: dup.count, files: groupFiles };
            })
          );

          return { duplicates: duplicateGroups, totalGroups: duplicateGroups.length };
        }
      );
    },

    storageAnalytics: async () => {
      const userId = await requireAuth();
      return getOrSet(
        CacheKey.storageAnalytics(userId),
        TTL.STORAGE_ANALYTICS,
        async () => {
          const userFiles = await db
            .select()
            .from(files)
            .where(and(eq(files.userId, userId), eq(files.isTrash, false), eq(files.isFolder, false)));

          const totalSize = userFiles.reduce((sum, f) => sum + f.size, 0);
          const storageLimit = 5 * 1024 * 1024 * 1024;
          const fileTypeBreakdown = {
            images: { count: 0, size: 0 },
            documents: { count: 0, size: 0 },
            videos: { count: 0, size: 0 },
            audio: { count: 0, size: 0 },
            others: { count: 0, size: 0 },
          };

          userFiles.forEach((f) => {
            const type = f.type.split("/")[0];
            if (type === "image") { fileTypeBreakdown.images.count++; fileTypeBreakdown.images.size += f.size; }
            else if (f.type.includes("pdf") || f.type.includes("document") || f.type.includes("text") || f.type.includes("sheet")) { fileTypeBreakdown.documents.count++; fileTypeBreakdown.documents.size += f.size; }
            else if (type === "video") { fileTypeBreakdown.videos.count++; fileTypeBreakdown.videos.size += f.size; }
            else if (type === "audio") { fileTypeBreakdown.audio.count++; fileTypeBreakdown.audio.size += f.size; }
            else { fileTypeBreakdown.others.count++; fileTypeBreakdown.others.size += f.size; }
          });

          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

          return {
            totalSize,
            totalFiles: userFiles.length,
            storageLimit,
            fileTypeBreakdown,
            recentActivity: {
              today: userFiles.filter((f) => new Date(f.createdAt) >= today).length,
              thisWeek: userFiles.filter((f) => new Date(f.createdAt) >= weekAgo).length,
              thisMonth: userFiles.filter((f) => new Date(f.createdAt) >= monthAgo).length,
            },
          };
        }
      );
    },

    activityLogs: async (_: unknown, { limit = 20 }: { limit?: number }) => {
      const userId = await requireAuth();
      return db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.userId, userId))
        .orderBy(activityLogs.createdAt)
        .limit(limit);
    },
  },

  Mutation: {
    starFile: async (_: unknown, { id }: { id: string }) => {
      const userId = await requireAuth();
      const [file] = await db.select().from(files).where(and(eq(files.id, id), eq(files.userId, userId)));
      if (!file) throw new Error("File not found");
      const [updated] = await db.update(files).set({ isStarred: !file.isStarred, updatedAt: new Date() }).where(eq(files.id, id)).returning();
      await invalidateUserCache(userId, file.parentId ?? undefined);
      return updated;
    },

    trashFile: async (_: unknown, { id }: { id: string }) => {
      const userId = await requireAuth();
      const [file] = await db.select().from(files).where(and(eq(files.id, id), eq(files.userId, userId)));
      if (!file) throw new Error("File not found");
      const [updated] = await db.update(files).set({ isTrash: !file.isTrash }).where(and(eq(files.id, id), eq(files.userId, userId))).returning();
      await invalidateUserCache(userId, file.parentId ?? undefined);
      return updated;
    },

    deleteFile: async (_: unknown, { id }: { id: string }) => {
      const userId = await requireAuth();
      const [file] = await db.select().from(files).where(and(eq(files.id, id), eq(files.userId, userId)));
      if (!file) throw new Error("File not found");
      if (!file.isFolder && file.fileUrl) {
        try {
          const imagekitFileId = file.fileUrl.split("?")[0].split("/").pop();
          if (imagekitFileId) await imagekit.deleteFile(imagekitFileId);
        } catch (e) {
          console.error("ImageKit delete failed:", e);
        }
      }
      await db.delete(files).where(and(eq(files.id, id), eq(files.userId, userId)));
      await invalidateUserCache(userId, file.parentId ?? undefined);
      return { success: true, message: "File deleted successfully" };
    },

    createFolder: async (_: unknown, { name, parentId }: { name: string; parentId?: string }) => {
      const userId = await requireAuth();
      const path = parentId ? `/${parentId}/${name}` : `/${name}`;
      const [folder] = await db.insert(files).values({ userId, name, path, size: 0, type: "folder", fileUrl: "", parentId: parentId ?? null, isFolder: true }).returning();
      await invalidateUserCache(userId, parentId);
      return folder;
    },

    emptyTrash: async () => {
      const userId = await requireAuth();
      const trashedFiles = await db.select().from(files).where(and(eq(files.userId, userId), eq(files.isTrash, true)));
      await Promise.allSettled(
        trashedFiles.filter((f) => !f.isFolder && f.fileUrl).map(async (f) => {
          const imagekitFileId = f.fileUrl.split("?")[0].split("/").pop();
          if (imagekitFileId) await imagekit.deleteFile(imagekitFileId);
        })
      );
      await db.delete(files).where(and(eq(files.userId, userId), eq(files.isTrash, true)));
      await invalidateUserCache(userId);
      return { success: true, message: `Deleted ${trashedFiles.length} files` };
    },
  },

  File: {
    children: async (parent: { id: string; userId: string }) => {
      return db.select().from(files).where(and(eq(files.parentId, parent.id), eq(files.userId, parent.userId)));
    },
    tags: (parent: { tags: unknown }) => parent.tags ?? [],
  },
};
