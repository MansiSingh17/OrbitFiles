"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Folder, FileText, FileImage, FileVideo, FileAudio, 
  FileSpreadsheet, FileCode, Archive, File as FileFallbackIcon 
} from "lucide-react";
import type { File as FileType } from "@/lib/db/schema";

interface FileIconProps {
  file: FileType;
}

export default function FileIcon({ file }: FileIconProps) {
  const [imageError, setImageError] = useState(false);

  if (file.isFolder) {
    return <Folder className="h-5 w-5 text-blue-500" />;
  }

  const fileType = file.type.split("/")[0];
  const fullType = file.type;

  // Images - show thumbnail with error handling
  if (fileType === "image" && !imageError) {
    // Use thumbnailUrl if available, otherwise use fileUrl
    const imageUrl = file.thumbnailUrl || file.fileUrl;
    
    return (
      <div className="h-12 w-12 relative overflow-hidden rounded bg-gray-100 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={file.name}
          width={48}
          height={48}
          className="object-cover"
          onError={() => {
            console.error("Failed to load image thumbnail:", file.name, imageUrl);
            setImageError(true);
          }}
          unoptimized // Important for external URLs
        />
      </div>
    );
  }

  // If image failed to load, show file icon
  if (fileType === "image" && imageError) {
    return (
      <div className="h-12 w-12 relative overflow-hidden rounded bg-gray-100 flex items-center justify-center">
        <FileImage className="h-6 w-6 text-gray-400" />
      </div>
    );
  }

  // Videos
  if (fileType === "video") {
    return <FileVideo className="h-5 w-5 text-purple-500" />;
  }

  // Audio
  if (fileType === "audio") {
    return <FileAudio className="h-5 w-5 text-pink-500" />;
  }

  // Documents
  if (fullType.includes("pdf")) {
    return <FileText className="h-5 w-5 text-red-500" />;
  }

  if (fullType.includes("word") || fullType.includes("document")) {
    return <FileText className="h-5 w-5 text-blue-600" />;
  }

  if (fullType.includes("text")) {
    return <FileText className="h-5 w-5 text-gray-500" />;
  }

  // Spreadsheets
  if (fullType.includes("sheet") || fullType.includes("excel") || fullType.includes("csv")) {
    return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
  }

  // Presentations
  if (fullType.includes("presentation") || fullType.includes("powerpoint")) {
    return <FileSpreadsheet className="h-5 w-5 text-orange-500" />;
  }

  // Code files
  if (fullType.includes("javascript") || fullType.includes("typescript") || 
      fullType.includes("python") || fullType.includes("java")) {
    return <FileCode className="h-5 w-5 text-indigo-500" />;
  }

  // Archives
  if (fullType.includes("zip") || fullType.includes("rar") || fullType.includes("7z") || 
      fullType.includes("tar") || fullType.includes("gz")) {
    return <Archive className="h-5 w-5 text-yellow-600" />;
  }

  // Default
  return <FileFallbackIcon className="h-5 w-5 text-gray-500" />;
}