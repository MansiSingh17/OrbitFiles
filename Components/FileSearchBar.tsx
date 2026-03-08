"use client";

import { Input } from "@heroui/input";
import { Search, X } from "lucide-react";

interface FileSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function FileSearchBar({ searchQuery, onSearchChange }: FileSearchBarProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search files, tags, or descriptions..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        startContent={<Search className="h-4 w-4 text-gray-400" />}
        endContent={
          searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              type="button"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )
        }
        classNames={{
          input: "text-sm",
          inputWrapper: "bg-white border border-gray-200 hover:border-blue-300 transition-colors",
        }}
      />
    </div>
  );
}