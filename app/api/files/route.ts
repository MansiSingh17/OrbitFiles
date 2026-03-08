import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { getOrSet, CacheKey, TTL } from "@/lib/redis/cache";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const requestUserId = searchParams.get("userId");
    const parentId = searchParams.get("parentId") ?? undefined;

    if (requestUserId !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userFiles = await getOrSet(
      CacheKey.filesList(userId, parentId),
      TTL.FILES_LIST,
      async () => {
        if (parentId) {
          return db.select().from(files).where(and(eq(files.userId, userId), eq(files.parentId, parentId)));
        }
        return db.select().from(files).where(and(eq(files.userId, userId), isNull(files.parentId)));
      }
    );

    return NextResponse.json(userFiles);
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}
