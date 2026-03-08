import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { documentChunks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId, question } = await request.json();

    console.log("💬 Chat question:", question);

    // Get all chunks for this file
    const chunks = await db
      .select()
      .from(documentChunks)
      .where(eq(documentChunks.fileId, fileId));

    console.log("📚 Found chunks in database:", chunks.length);

    if (chunks.length === 0) {
      return NextResponse.json(
        { 
          error: "Document not processed yet. Please click 'Process Document' first.",
          answer: "Please process the document first by clicking the 'Process Document' button."
        },
        { status: 400 }
      );
    }

    // Create embedding for the question
    const questionEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });

    const queryEmbedding = questionEmbedding.data[0].embedding;

    // Find most similar chunks
    const chunksWithSimilarity = chunks
      .map((chunk) => ({
        ...chunk,
        similarity: cosineSimilarity(queryEmbedding, chunk.embedding as number[]),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3); // Top 3 most relevant chunks

    console.log("🔍 Most relevant chunks:", chunksWithSimilarity.map(c => ({
      index: c.chunkIndex,
      similarity: c.similarity.toFixed(3),
      preview: c.chunkText.substring(0, 100) + '...'
    })));

    // Build context from relevant chunks
    const context = chunksWithSimilarity
      .map((chunk, idx) => `[Chunk ${idx + 1}]\n${chunk.chunkText}`)
      .join("\n\n---\n\n");

    // Ask GPT with context
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful document assistant. Answer questions based ONLY on the provided document excerpts. 
If the answer is not in the excerpts, say "I don't see that information in the document."
Be specific and cite relevant details from the text.`,
        },
        {
          role: "user",
          content: `Document excerpts:\n\n${context}\n\n---\n\nQuestion: ${question}\n\nAnswer based on the document excerpts above:`,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const answer = chatResponse.choices[0].message.content || "I couldn't generate an answer.";

    console.log("✅ Answer:", answer.substring(0, 100) + "...");

    return NextResponse.json({ 
      answer,
      relevantChunks: chunksWithSimilarity.length,
    });
  } catch (error: any) {
    console.error("❌ Error in chat:", error);
    return NextResponse.json(
      { 
        error: "Failed to answer question",
        answer: "Sorry, there was an error processing your question. Please try again."
      },
      { status: 500 }
    );
  }
}