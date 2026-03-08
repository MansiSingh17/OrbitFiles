import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";

export async function logActivity(
  userId: string,
  action: string,
  fileName: string,
  fileId?: string,
  details?: Record<string, any>
) {
  try {
    await db.insert(activityLogs).values({
      userId,
      action,
      fileName,
      fileId: fileId || null,
      details: details || null,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}