import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { logActivity } from "@/lib/activityLogger";
import { invalidateUserCache } from "@/lib/redis/cache";

export async function PATCH(request: NextRequest, props: { params: Promise<{ fileId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fileId } = await props.params;
    const [file] = await db.select().from(files).where(and(eq(files.id, fileId), eq(files.userId, userId)));
    if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });

    const newStarredState = !file.isStarred;
    await db.update(files).set({ isStarred: newStarredState, updatedAt: new Date() }).where(eq(files.id, fileId));
    await invalidateUserCache(userId, file.parentId ?? undefined);
    await logActivity(userId, newStarredState ? "star" : "unstar", file.name, fileId);

    return NextResponse.json({ isStarred: newStarredState });
  } catch (error) {
    console.error("Error starring file:", error);
    return NextResponse.json({ error: "Failed to update star status" }, { status: 500 });
  }
}
