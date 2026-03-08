import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { documentChunks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

// Force Node.js runtime (not Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function chunkText(text: string, chunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = "";
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId, fileUrl, fileName } = await request.json();

    console.log("📄 Processing PDF:", fileName);

    // Download PDF
    const pdfResponse = await fetch(fileUrl);
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);
    
    // Dynamic import of pdf-parse-fork
    const pdfParse = (await import('pdf-parse-fork')).default;
    
    // Extract text
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;
    
    console.log("📝 Extracted text length:", text.length);
    console.log("📄 Number of pages:", pdfData.numpages);

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Could not extract meaningful text from PDF. The PDF might be image-based or encrypted." },
        { status: 400 }
      );
    }

    // Split into chunks
    const chunks = chunkText(text, 1000);
    console.log("🔪 Created chunks:", chunks.length);

    // Delete existing chunks for this file
    await db.delete(documentChunks).where(eq(documentChunks.fileId, fileId));

    // Create embeddings and store chunks (process first 15 to save costs)
    const chunksToProcess = chunks.slice(0, 15);
    
    for (let i = 0; i < chunksToProcess.length; i++) {
      const chunk = chunksToProcess[i];
      
      console.log(`📊 Processing chunk ${i + 1}/${chunksToProcess.length}`);
      
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });
      
      const embedding = embeddingResponse.data[0].embedding;
      
      await db.insert(documentChunks).values({
        fileId,
        userId,
        chunkText: chunk,
        chunkIndex: i,
        embedding: embedding,
      });
    }

    console.log("✅ PDF processed successfully -", chunksToProcess.length, "chunks stored");

    return NextResponse.json({ 
      success: true, 
      chunksCreated: chunksToProcess.length,
      totalPages: pdfData.numpages,
      message: "PDF processed and ready for chat"
    });
  } catch (error: any) {
    console.error("❌ Error processing PDF:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process PDF" },
      { status: 500 }
    );
  }
}