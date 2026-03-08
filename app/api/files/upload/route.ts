import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files, activityLogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { invalidateUserCache } from "@/lib/redis/cache";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const formUserId = formData.get("userId") as string;
    const parentId = (formData.get("parentId") as string) || null;

    if (formUserId !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (parentId) {
      const [parentFolder] = await db.select().from(files).where(and(eq(files.id, parentId), eq(files.userId, userId), eq(files.isFolder, true)));
      if (!parentFolder) return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
    }

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const contentHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
    const originalFilename = file.name;
    const fileExtension = originalFilename.split(".").pop() || "";
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const folderPath = parentId ? `user_${userId}/${parentId}` : `user_${userId}`;

    const result = await imagekit.upload({ file: fileBuffer, fileName: uniqueFilename, folder: folderPath });

    let aiTags: string[] = [];
    let aiDescription = null;

    if (file.type === "application/pdf") {
      const nameParts = originalFilename.toLowerCase().replace(/\.pdf$/i, "").replace(/[^a-z0-9]/g, " ").split(/\s+/).filter((p) => p.length > 3);
      aiTags = [...new Set(nameParts.slice(0, 5))];
      aiDescription = "PDF document";
    } else if (file.type.startsWith("image/")) {
      const nameParts = originalFilename.toLowerCase().replace(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i, "").replace(/[^a-z0-9]/g, " ").split(/\s+/).filter((p) => p.length > 2);
      const imageType = file.type.split("/")[1].toLowerCase();
      aiTags = [...new Set([...nameParts.slice(0, 4), fileExtension.toLowerCase(), imageType, "image"])];
      aiDescription = `${imageType.toUpperCase()} image`;
    } else if (file.type.includes("document") || file.type.includes("word") || file.type.includes("text")) {
      const nameParts = originalFilename.toLowerCase().replace(/\.(doc|docx|txt|rtf)$/i, "").replace(/[^a-z0-9]/g, " ").split(/\s+/).filter((p) => p.length > 3);
      aiTags = [...new Set([...nameParts.slice(0, 5), "document"])];
      aiDescription = "Text document";
    }

    const fullPath = parentId ? `/${parentId}/${originalFilename}` : `/${originalFilename}`;

    const [insertedFile] = await db.insert(files).values({
      userId: formUserId, name: originalFilename, path: fullPath, size: file.size, type: file.type,
      fileUrl: result.url, thumbnailUrl: result.thumbnailUrl, parentId, isFolder: false,
      tags: aiTags, aiDescription, contentHash,
    }).returning();

    await invalidateUserCache(userId, parentId ?? undefined);

    await db.insert(activityLogs).values({
      userId: formUserId, fileId: insertedFile.id, fileName: originalFilename, action: "upload",
      details: { size: file.size, type: file.type, parentId, tags: aiTags },
    });

    return NextResponse.json({ success: true, file: insertedFile });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
