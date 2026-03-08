"use client";

import { Tag, Sparkles } from "lucide-react";
import type { File as FileType } from "@/lib/db/schema";

interface FileTagsProps {
  file: FileType;
  searchQuery?: string;
}

export default function FileTags({ file, searchQuery = "" }: FileTagsProps) {
  if (!file.tags || file.tags.length === 0) return null;

  const highlightTag = (tag: string) => {
    if (searchQuery && tag.toLowerCase().includes(searchQuery.toLowerCase())) {
      return "bg-blue-100 text-blue-800 border border-blue-300";
    }
    return "bg-blue-50 text-blue-700";
  };

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {file.tags.slice(0, 3).map((tag, index) => (
        <span
          key={index}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${highlightTag(tag)}`}
        >
          <Tag className="h-3 w-3" />
          {tag}
        </span>
      ))}
      {file.tags.length > 3 && (
        <span className="text-xs text-gray-500">+{file.tags.length - 3} more</span>
      )}
      {file.aiDescription && searchQuery && file.aiDescription.toLowerCase().includes(searchQuery.toLowerCase()) && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
          <Sparkles className="h-3 w-3" />
          AI Match
        </span>
      )}
    </div>
  );
}