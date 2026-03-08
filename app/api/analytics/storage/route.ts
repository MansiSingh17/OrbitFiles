import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getOrSet, CacheKey, TTL } from "@/lib/redis/cache";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const requestUserId = request.nextUrl.searchParams.get("userId");
    if (requestUserId !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const analytics = await getOrSet(
      CacheKey.storageAnalytics(userId),
      TTL.STORAGE_ANALYTICS,
      async () => {
        const userFiles = await db.select().from(files).where(and(eq(files.userId, userId), eq(files.isTrash, false), eq(files.isFolder, false)));
        const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
        const totalFiles = userFiles.length;
        const storageLimit = 5 * 1024 * 1024 * 1024;
        const fileTypeBreakdown = { images: { count: 0, size: 0 }, documents: { count: 0, size: 0 }, videos: { count: 0, size: 0 }, audio: { count: 0, size: 0 }, others: { count: 0, size: 0 } };
        userFiles.forEach((file) => {
          const type = file.type.split("/")[0];
          if (type === "image") { fileTypeBreakdown.images.count++; fileTypeBreakdown.images.size += file.size; }
          else if (file.type.includes("pdf") || file.type.includes("document") || file.type.includes("text") || file.type.includes("sheet") || file.type.includes("presentation")) { fileTypeBreakdown.documents.count++; fileTypeBreakdown.documents.size += file.size; }
          else if (type === "video") { fileTypeBreakdown.videos.count++; fileTypeBreakdown.videos.size += file.size; }
          else if (type === "audio") { fileTypeBreakdown.audio.count++; fileTypeBreakdown.audio.size += file.size; }
          else { fileTypeBreakdown.others.count++; fileTypeBreakdown.others.size += file.size; }
        });
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const recentActivity = { today: userFiles.filter((f) => new Date(f.createdAt) >= today).length, thisWeek: userFiles.filter((f) => new Date(f.createdAt) >= weekAgo).length, thisMonth: userFiles.filter((f) => new Date(f.createdAt) >= monthAgo).length };
        return { totalSize, totalFiles, storageLimit, fileTypeBreakdown, recentActivity };
      }
    );

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching storage analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
