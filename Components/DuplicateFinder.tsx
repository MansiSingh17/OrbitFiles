"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Search, Trash2, FileText, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";

interface File {
  id: string;
  name: string;
  size: number;
  fileUrl: string;
  thumbnailUrl?: string | null;
  createdAt: Date;
  type: string;
}

interface DuplicateGroup {
  contentHash: string;
  count: number;
  files: File[];
}

interface DuplicateFinderProps {
  userId: string;
}

export default function DuplicateFinder({ userId }: DuplicateFinderProps) {
  const [scanning, setScanning] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Automatically scan on mount
  useEffect(() => {
    scanForDuplicates(true);
  }, [userId]);

  const scanForDuplicates = async (isInitialLoad = false) => {
    setScanning(true);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/files/find-duplicates?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to scan for duplicates");
      }

      const data = await response.json();
      setDuplicates(data.duplicates || []);

      if (!isInitialLoad) {
        if (data.totalGroups === 0) {
          setMessage({ type: "success", text: "No duplicates found! 🎉" });
        } else {
          setMessage({
            type: "success",
            text: `Found ${data.totalGroups} duplicate group${
              data.totalGroups > 1 ? "s" : ""
            }`,
          });
        }
      }
    } catch (error) {
      console.error("Error scanning for duplicates:", error);
      setMessage({ type: "error", text: "Failed to scan for duplicates" });
    } finally {
      setScanning(false);
      if (isInitialLoad) {
        setInitialLoad(false);
      }
    }
  };

  const deleteFile = async (fileId: string, groupHash: string) => {
    setDeleting(fileId);
    setMessage(null);
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      setMessage({ type: "success", text: "File deleted successfully" });

      // Update the duplicates state
      setDuplicates((prev) =>
        prev
          .map((group) => {
            if (group.contentHash === groupHash) {
              const updatedFiles = group.files.filter((f) => f.id !== fileId);
              return {
                ...group,
                files: updatedFiles,
                count: updatedFiles.length,
              };
            }
            return group;
          })
          .filter((group) => group.files.length > 1)
      );
    } catch (error) {
      console.error("Error deleting file:", error);
      setMessage({ type: "error", text: "Failed to delete file" });
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Initial loading state
  if (initialLoad && scanning) {
    return (
      <div className="space-y-6">
        <Card className="bg-white border-2 border-blue-100">
          <CardBody className="py-16">
            <div className="flex flex-col items-center justify-center">
              <Spinner size="lg" color="primary" />
              <p className="mt-4 text-gray-600">
                Scanning your files for duplicates...
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message && (
        <Card
          className={`border-2 ${
            message.type === "success"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <CardBody className="py-3">
            <p
              className={`text-sm font-medium ${
                message.type === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message.text}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Header */}
      <Card className="bg-white border-2 border-blue-100">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Duplicate Finder
                </h2>
                <p className="text-sm text-gray-600">
                  {duplicates.length > 0
                    ? `${duplicates.length} duplicate group${duplicates.length > 1 ? "s" : ""} found`
                    : "No duplicate files found"}
                </p>
              </div>
            </div>
            <Button
              color="primary"
              size="lg"
              onClick={() => scanForDuplicates(false)}
              isLoading={scanning}
              startContent={!scanning && <RefreshCw className="h-5 w-5" />}
            >
              {scanning ? "Scanning..." : "Re-scan"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Results */}
      {!scanning && duplicates.length === 0 && (
        <Card className="bg-white border-2 border-gray-100">
          <CardBody className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-green-100 rounded-full mb-4">
                <FileText className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No duplicates found!
              </h3>
              <p className="text-gray-600 mb-6">
                Your storage is clean. All files are unique! 🎉
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {scanning && !initialLoad && (
        <Card className="bg-white border-2 border-blue-100">
          <CardBody className="py-16">
            <div className="flex flex-col items-center justify-center">
              <Spinner size="lg" color="primary" />
              <p className="mt-4 text-gray-600">
                Re-scanning your files for duplicates...
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Duplicate Groups */}
      {!scanning && duplicates.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Found <strong>{duplicates.length}</strong> duplicate group
              {duplicates.length > 1 ? "s" : ""}. Keep one file from each group
              and delete the rest to free up storage space.
            </p>
          </div>

          {duplicates.map((group, groupIndex) => (
            <Card
              key={group.contentHash}
              className="bg-white border-2 border-red-100"
            >
              <CardHeader className="border-b border-red-50 bg-red-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Duplicate Group {groupIndex + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {group.count} identical files •{" "}
                      {formatFileSize(group.files[0].size)} each •{" "}
                      <span className="text-red-600 font-medium">
                        Wasting {formatFileSize((group.count - 1) * group.files[0].size)}
                      </span>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-4">
                  {group.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          {file.thumbnailUrl ? (
                            <Image
                              src={file.thumbnailUrl}
                              alt={file.name}
                              width={60}
                              height={60}
                              className="rounded object-cover"
                            />
                          ) : (
                            <div className="w-[60px] h-[60px] bg-gray-100 rounded flex items-center justify-center">
                              <FileText className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{formatDate(file.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <Button
                          color="danger"
                          variant="flat"
                          size="sm"
                          onClick={() => deleteFile(file.id, group.contentHash)}
                          isLoading={deleting === file.id}
                          startContent={
                            deleting !== file.id && (
                              <Trash2 className="h-4 w-4" />
                            )
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}