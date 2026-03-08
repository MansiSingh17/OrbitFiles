import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl, fileName, fileType } = await request.json();

    let analysisResult = {
      tags: [] as string[],
      description: "",
      suggestedFolder: "",
    };

    // Analyze Images
    if (fileType.startsWith("image/")) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this image and provide:
1. 5-7 relevant tags (comma-separated, lowercase)
2. A brief 1-sentence description
3. A suggested folder category (e.g., "Photos/Vacation", "Work/Screenshots", "Personal/Family")

Format your response as JSON:
{
  "tags": ["tag1", "tag2", "tag3"],
  "description": "Brief description here",
  "suggestedFolder": "Category/Subcategory"
}`,
              },
              {
                type: "image_url",
                image_url: { url: fileUrl },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      const content = response.choices[0].message.content || "";
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysisResult = {
          tags: parsed.tags || [],
          description: parsed.description || "",
          suggestedFolder: parsed.suggestedFolder || "",
        };
      }
    }

    // Analyze PDFs and Documents (filename-based)
    else if (
      fileType === "application/pdf" ||
      fileType.includes("document") ||
      fileType.includes("text")
    ) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Based on the filename "${fileName}", suggest:
1. 5 relevant tags that might describe this document (comma-separated, lowercase)
2. A likely description
3. A folder category

Format as JSON:
{
  "tags": ["tag1", "tag2", "tag3"],
  "description": "Likely a document about...",
  "suggestedFolder": "Category/Subcategory"
}`,
          },
        ],
        max_tokens: 300,
      });

      const content = response.choices[0].message.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysisResult = {
          tags: parsed.tags || [],
          description: parsed.description || "",
          suggestedFolder: parsed.suggestedFolder || "",
        };
      }
    }

    // For other file types
    else {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Based on the filename "${fileName}" and file type "${fileType}", suggest:
1. 3-5 relevant tags (comma-separated, lowercase)
2. A suggested folder category

Format as JSON:
{
  "tags": ["tag1", "tag2"],
  "description": "File description",
  "suggestedFolder": "Category"
}`,
          },
        ],
        max_tokens: 200,
      });

      const content = response.choices[0].message.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysisResult = {
          tags: parsed.tags || [],
          description: parsed.description || "",
          suggestedFolder: parsed.suggestedFolder || "",
        };
      }
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error analyzing file:", error);
    return NextResponse.json(
      { error: "Failed to analyze file" },
      { status: 500 }
    );
  }
}