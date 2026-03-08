import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logActivity } from "@/lib/activityLogger";

export async function POST(request: NextRequest) {
  try {
    const { userId: authUserId } = await auth();
    if (!authUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, action, fileName, fileId, details } = await request.json();

    if (authUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await logActivity(userId, action, fileName, fileId, details);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}