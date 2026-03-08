"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { 
  X, 
  Download, 
  ExternalLink,
  FileText,
  Music as MusicIcon,
  Archive
} from "lucide-react";
import type { File as FileType } from "@/lib/db/schema";
import DocumentChat from "./DocumentChat";

interface FilePreviewModalProps {
  file: FileType | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (file: FileType) => void;
}

export default function FilePreviewModal({
  file,
  isOpen,
  onClose,
  onDownload,
}: FilePreviewModalProps) {
  if (!file) return null;

  const fileType = file.type.split("/")[0];

  const renderPreview = () => {
    // Images - Full size display
    if (fileType === "image") {
      const imageUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,f-auto/${file.path}`;
      
      return (
        <div className="w-full bg-gray-50 rounded-lg overflow-auto" style={{ maxHeight: '80vh' }}>
          <img
            src={imageUrl}
            alt={file.name}
            className="w-full h-auto"
            style={{ display: 'block' }}
          />
        </div>
      );
    }

    // PDFs - Viewer + Chat Interface
    if (file.type === "application/pdf") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* PDF Viewer */}
          <div className="w-full bg-gray-50 rounded-lg" style={{ height: '70vh' }}>
            <iframe
              src={file.fileUrl}
              className="w-full h-full rounded-lg"
              title={file.name}
            />
          </div>
          
          {/* Chat Interface */}
          <div className="w-full" style={{ height: '70vh' }}>
            <DocumentChat file={file} />
          </div>
        </div>
      );
    }

    // Videos
    if (fileType === "video") {
      return (
        <div className="w-full bg-gray-50 rounded-lg overflow-hidden">
          <video
            src={file.fileUrl}
            controls
            className="w-full"
            style={{ maxHeight: '80vh' }}
          >
            Your browser does not support video playback.
          </video>
        </div>
      );
    }

    // Audio
    if (fileType === "audio") {
      return (
        <div className="w-full p-12 bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-6">
          <MusicIcon className="h-24 w-24 text-blue-500" />
          <audio src={file.fileUrl} controls className="w-full max-w-md">
            Your browser does not support audio playback.
          </audio>
          <p className="text-gray-600 text-center font-medium">
            {file.name}
          </p>
        </div>
      );
    }

    // Documents (Word, Excel, PowerPoint)
    if (
      file.type.includes("document") ||
      file.type.includes("sheet") ||
      file.type.includes("presentation") ||
      file.type.includes("text")
    ) {
      return (
        <div className="w-full p-12 bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-6">
          <FileText className="h-24 w-24 text-blue-500" />
          <div className="text-center">
            <p className="font-semibold text-gray-900 mb-2 text-lg">
              {file.name}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {file.type.includes("word") ? "Word Document" :
               file.type.includes("sheet") ? "Spreadsheet" :
               file.type.includes("presentation") ? "Presentation" :
               "Text Document"}
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Preview not available for this file type
            </p>
            <Button
              color="primary"
              startContent={<Download className="h-4 w-4" />}
              onClick={() => onDownload(file)}
            >
              Download to View
            </Button>
          </div>
        </div>
      );
    }

    // Archives
    if (file.type.includes("zip") || file.type.includes("rar")) {
      return (
        <div className="w-full p-12 bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-6">
          <Archive className="h-24 w-24 text-blue-500" />
          <div className="text-center">
            <p className="font-semibold text-gray-900 mb-2 text-lg">
              {file.name}
            </p>
            <p className="text-sm text-gray-600 mb-4">Archive File</p>
            <p className="text-xs text-gray-500 mb-6">
              Download to extract contents
            </p>
            <Button
              color="primary"
              startContent={<Download className="h-4 w-4" />}
              onClick={() => onDownload(file)}
            >
              Download Archive
            </Button>
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="w-full p-12 bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-6">
        <FileText className="h-24 w-24 text-gray-400" />
        <div className="text-center">
          <p className="font-semibold text-gray-900 mb-2 text-lg">
            {file.name}
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Preview not available
          </p>
          <Button
            color="primary"
            startContent={<Download className="h-4 w-4" />}
            onClick={() => onDownload(file)}
          >
            Download File
          </Button>
        </div>
      </div>
    );
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white border-2 border-blue-200 m-4",
        header: "border-b border-gray-200",
        body: "p-6",
        footer: "border-t border-gray-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {file.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {formatBytes(file.size)} • {formatDate(file.createdAt instanceof Date ? file.createdAt.toISOString() : file.createdAt as string)}
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          {renderPreview()}
        </ModalBody>

        <ModalFooter className="flex gap-2">
          <Button
            variant="flat"
            color="default"
            onClick={onClose}
            startContent={<X className="h-4 w-4" />}
          >
            Close
          </Button>
          
          <Button
            color="primary"
            onClick={() => onDownload(file)}
            startContent={<Download className="h-4 w-4" />}
          >
            Download
          </Button>

          {(fileType === "image" || file.type === "application/pdf") && (
            <Button
              color="primary"
              variant="bordered"
              onClick={() => window.open(file.fileUrl, "_blank")}
              startContent={<ExternalLink className="h-4 w-4" />}
            >
              Open in New Tab
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}