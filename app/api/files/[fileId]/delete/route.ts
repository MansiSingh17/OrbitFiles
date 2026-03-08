import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, isNotNull, sql } from "drizzle-orm";
import { getOrSet, CacheKey, TTL } from "@/lib/redis/cache";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId");

    if (queryUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getOrSet(
      CacheKey.duplicates(userId),
      TTL.DUPLICATES,
      async () => {
        console.log("🔍 Starting duplicate scan for user:", userId);

        const allFiles = await db
          .select()
          .from(files)
          .where(
            and(
              eq(files.userId, userId),
              eq(files.isFolder, false),
              eq(files.isTrash, false),
              isNotNull(files.contentHash)
            )
          );

        console.log("📁 Total active files found:", allFiles.length);

        const duplicates = await db
          .select({
            contentHash: files.contentHash,
            count: sql<number>`count(*)::int`,
          })
          .from(files)
          .where(
            and(
              eq(files.userId, userId),
              eq(files.isFolder, false),
              eq(files.isTrash, false),
              isNotNull(files.contentHash)
            )
          )
          .groupBy(files.contentHash)
          .having(sql`count(*) > 1`);

        console.log("🔄 Duplicate hashes found:", duplicates.length);

        const duplicateGroups = await Promise.all(
          duplicates.map(async (dup) => {
            const groupFiles = await db
              .select()
              .from(files)
              .where(
                and(
                  eq(files.userId, userId),
                  eq(files.contentHash, dup.contentHash!),
                  eq(files.isTrash, false)
                )
              )
              .orderBy(files.createdAt);

            return {
              contentHash: dup.contentHash,
              count: dup.count,
              files: groupFiles,
            };
          })
        );

        console.log("🔍 Found duplicate groups:", duplicateGroups.length);

        return { duplicates: duplicateGroups, totalGroups: duplicateGroups.length };
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error finding duplicates:", error);
    return NextResponse.json(
      { error: "Failed to find duplicates" },
      { status: 500 }
    );
  }
}