"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Input } from "@heroui/input";
import {
  Upload,
  X,
  FileUp,
  AlertTriangle,
  FolderPlus,
  ArrowRight,
  Sparkles,  // Add this
} from "lucide-react";
import { addToast } from "@heroui/toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import axios from "axios";

interface FileUploadFormProps {
  userId: string;
  onUploadSuccess?: () => void;
  currentFolder?: string | null;
}

// Allowed file types
const ALLOWED_TYPES = {
  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  
  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  
  // Spreadsheets
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/csv': ['.csv'],
  
  // Presentations
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  
  // Videos
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
  'video/x-matroska': ['.mkv'],
  
  // Audio
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/mp4': ['.m4a'],
  
  // Archives
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function FileUploadForm({
  userId,
  onUploadSuccess,
  currentFolder = null,
}: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Folder creation state
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const validateFile = (selectedFile: File): string | null => {
    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
    }

    // Check file type
    if (!ALLOWED_TYPES[selectedFile.type as keyof typeof ALLOWED_TYPES]) {
      return "File type not supported";
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validationError = validateFile(selectedFile);

      if (validationError) {
        setError(validationError);
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validationError = validateFile(droppedFile);

      if (validationError) {
        setError(validationError);
        return;
      }

      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (currentFolder) {
      formData.append("parentId", currentFolder);
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      addToast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully.`,
        color: "success",
      });

      clearFile();

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
      addToast({
        title: "Upload Failed",
        description: "We couldn't upload your file. Please try again.",
        color: "danger",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      addToast({
        title: "Invalid Folder Name",
        description: "Please enter a valid folder name.",
        color: "danger",
      });
      return;
    }

    setCreatingFolder(true);

    try {
      await axios.post("/api/folders/create", {
        name: folderName.trim(),
        userId: userId,
        parentId: currentFolder,
      });

      addToast({
        title: "Folder Created",
        description: `Folder "${folderName}" has been created successfully.`,
        color: "success",
      });

      setFolderName("");
      setFolderModalOpen(false);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      addToast({
        title: "Folder Creation Failed",
        description: "We couldn't create the folder. Please try again.",
        color: "danger",
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return <FileUp className="h-12 w-12 mx-auto text-blue-500" />;
    
    const type = file.type.split('/')[0];
    if (type === 'image') return '🖼️';
    if (type === 'video') return '🎥';
    if (type === 'audio') return '🎵';
    if (file.type.includes('pdf')) return '📄';
    if (file.type.includes('word')) return '📝';
    if (file.type.includes('sheet') || file.type.includes('excel')) return '📊';
    if (file.type.includes('presentation') || file.type.includes('powerpoint')) return '📊';
    if (file.type.includes('zip') || file.type.includes('rar')) return '📦';
    return '📄';
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-2 mb-2">
        <Button
          color="primary"
          variant="flat"
          startContent={<FolderPlus className="h-4 w-4" />}
          onClick={() => setFolderModalOpen(true)}
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
        >
          New Folder
        </Button>
        <Button
          color="primary"
          variant="flat"
          startContent={<FileUp className="h-4 w-4" />}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
        >
          Add File
        </Button>
      </div>

      {/* File drop area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          error
            ? "border-red-300 bg-red-50"
            : file
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
        }`}
      >
        {!file ? (
          <div className="space-y-3">
            <FileUp className="h-12 w-12 mx-auto text-blue-500" />
            <div>
              <p className="text-gray-700">
                Drag and drop your file here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 cursor-pointer font-medium inline bg-transparent border-0 p-0 m-0 hover:text-blue-700"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">Files up to 100MB</p>
            </div>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={Object.values(ALLOWED_TYPES).flat().join(',')}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{getFileIcon()}</div>
                <div className="text-left">
                  <p className="text-sm font-medium truncate max-w-[180px] text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.size < 1024
                      ? `${file.size} B`
                      : file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
              </div>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={clearFile}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 border border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {uploading && (
              <Progress
                value={progress}
                color="primary"
                size="sm"
                showValueLabel={true}
                className="max-w-full"
              />
            )}

            <Button
              color="primary"
              startContent={<Upload className="h-4 w-4" />}
              endContent={!uploading && <ArrowRight className="h-4 w-4" />}
              onClick={handleUpload}
              isLoading={uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:shadow-lg"
              isDisabled={!!error}
            >
              {uploading ? `Uploading... ${progress}%` : "Upload File"}
            </Button>
          </div>
        )}
      </div>

      {/* Upload tips */}
<div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-2xl border-2 border-blue-200 shadow-md">
  <h4 className="text-sm font-bold mb-3 text-gray-900 flex items-center gap-2">
    <Sparkles className="h-4 w-4 text-purple-600" />
    Tips
  </h4>
  <ul className="text-xs text-gray-700 space-y-2 font-medium">
    <li className="flex items-start gap-2">
      <span className="text-blue-600 font-bold">•</span>
      <span>Files are private and only visible to you</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-blue-600 font-bold">•</span>
      <span>Supported: Images, Documents, Videos, Audio, Archives</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-blue-600 font-bold">•</span>
      <span>Maximum file size: 100MB</span>
    </li>
  </ul>
</div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={folderModalOpen}
        onOpenChange={setFolderModalOpen}
        backdrop="blur"
        classNames={{
          base: "border-2 border-blue-200 bg-white",
          header: "border-b border-blue-100",
          footer: "border-t border-blue-100",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex gap-2 items-center">
            <FolderPlus className="h-5 w-5 text-blue-600" />
            <span className="text-gray-900">New Folder</span>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter a name for your folder:
              </p>
              <Input
                type="text"
                label="Folder Name"
                placeholder="My Files"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
                classNames={{
                  input: "text-gray-900",
                  inputWrapper: "border-blue-200"
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              color="default"
              onClick={() => setFolderModalOpen(false)}
              className="text-gray-700"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleCreateFolder}
              isLoading={creatingFolder}
              isDisabled={!folderName.trim()}
              endContent={!creatingFolder && <ArrowRight className="h-4 w-4" />}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}