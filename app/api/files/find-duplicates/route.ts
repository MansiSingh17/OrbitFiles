import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, isNotNull, sql } from "drizzle-orm";

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

    console.log("🔍 Starting duplicate scan for user:", userId);

    // First, let's see ALL non-trashed files with their hashes
    const allFiles = await db
      .select()
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.isFolder, false),
          eq(files.isTrash, false), // ← Added: Exclude trashed files
          isNotNull(files.contentHash)
        )
      );

    console.log("📁 Total active files found:", allFiles.length);
    console.log(
      "🔑 File hashes:",
      allFiles.map((f) => ({ name: f.name, hash: f.contentHash }))
    );

    // Find duplicates using SQL GROUP BY
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
          eq(files.isTrash, false), // ← Added: Exclude trashed files
          isNotNull(files.contentHash)
        )
      )
      .groupBy(files.contentHash)
      .having(sql`count(*) > 1`);

    console.log("🔄 Duplicate hashes found:", duplicates.length);
    console.log("🔄 Duplicate details:", duplicates);

    // Get full file details for each duplicate group
    const duplicateGroups = await Promise.all(
      duplicates.map(async (dup) => {
        const groupFiles = await db
          .select()
          .from(files)
          .where(
            and(
              eq(files.userId, userId),
              eq(files.contentHash, dup.contentHash!),
              eq(files.isTrash, false) // ← Added: Exclude trashed files
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

    return NextResponse.json({
      duplicates: duplicateGroups,
      totalGroups: duplicateGroups.length,
    });
  } catch (error) {
    console.error("❌ Error finding duplicates:", error);
    return NextResponse.json(
      { error: "Failed to find duplicates" },
      { status: 500 }
    );
  }
}