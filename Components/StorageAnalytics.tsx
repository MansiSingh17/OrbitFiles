"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { 
  HardDrive, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music,
  File as FileIcon,
  TrendingUp,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface StorageStats {
  totalSize: number;
  totalFiles: number;
  storageLimit: number;
  fileTypeBreakdown: {
    images: { count: number; size: number };
    documents: { count: number; size: number };
    videos: { count: number; size: number };
    audio: { count: number; size: number };
    others: { count: number; size: number };
  };
  recentActivity: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

interface StorageAnalyticsProps {
  userId: string;
}

export default function StorageAnalytics({ userId }: StorageAnalyticsProps) {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await axios.get(`/api/analytics/storage?userId=${userId}`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching storage stats:", error);
      setError("Failed to load analytics. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl"></div>
        <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl"></div>
        <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="bg-red-50 border-2 border-red-200 shadow-lg">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <div>
              <p className="font-semibold">Unable to load analytics</p>
              <p className="text-sm">{error || "An error occurred"}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  const storagePercentage = (stats.totalSize / stats.storageLimit) * 100;

  return (
    <div className="space-y-8">
      {/* Storage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Storage */}
        <Card className="glass-card card-hover border-2 border-blue-200 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -mr-16 -mt-16"></div>
          <CardBody className="p-6 relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <HardDrive className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Storage Used</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatBytes(stats.totalSize)}
                </p>
              </div>
            </div>
            <Progress 
              value={storagePercentage} 
              color="primary"
              size="md"
              className="mb-2"
              classNames={{
                indicator: "bg-gradient-to-r from-blue-500 to-purple-600"
              }}
            />
            <p className="text-xs text-gray-600 font-medium">
              {storagePercentage.toFixed(1)}% of {formatBytes(stats.storageLimit)}
            </p>
          </CardBody>
        </Card>

        {/* Total Files */}
        <Card className="glass-card card-hover border-2 border-green-200 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -mr-16 -mt-16"></div>
          <CardBody className="p-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Files</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalFiles}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-2 font-semibold">
                  <TrendingUp className="h-3 w-3" />
                  {stats.recentActivity.thisWeek} this week
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card card-hover border-2 border-purple-200 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -mr-16 -mt-16"></div>
          <CardBody className="p-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Recent Activity</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.recentActivity.today}
                </p>
                <p className="text-xs text-gray-600 mt-2 font-medium">
                  uploads today
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* File Type Breakdown */}
      {stats.totalFiles > 0 && (
        <Card className="glass-card border-2 border-blue-100 shadow-xl">
          <CardHeader className="border-b-2 border-blue-50 pb-5 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-xl font-bold text-gray-900">Storage by File Type</h3>
          </CardHeader>
          <CardBody className="p-8">
            <div className="space-y-6">
              {stats.fileTypeBreakdown.images.count > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                        <ImageIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Images</p>
                        <p className="text-sm text-gray-600">
                          {stats.fileTypeBreakdown.images.count} files
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">
                      {formatBytes(stats.fileTypeBreakdown.images.size)}
                    </p>
                  </div>
                  <Progress 
                    value={(stats.fileTypeBreakdown.images.size / stats.totalSize) * 100}
                    color="primary"
                    size="md"
                    classNames={{
                      indicator: "bg-gradient-to-r from-blue-500 to-blue-600"
                    }}
                  />
                </div>
              )}

              {stats.fileTypeBreakdown.documents.count > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Documents</p>
                        <p className="text-sm text-gray-600">
                          {stats.fileTypeBreakdown.documents.count} files
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">
                      {formatBytes(stats.fileTypeBreakdown.documents.size)}
                    </p>
                  </div>
                  <Progress 
                    value={(stats.fileTypeBreakdown.documents.size / stats.totalSize) * 100}
                    color="danger"
                    size="md"
                    classNames={{
                      indicator: "bg-gradient-to-r from-red-500 to-red-600"
                    }}
                  />
                </div>
              )}

              {stats.fileTypeBreakdown.videos.count > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Videos</p>
                        <p className="text-sm text-gray-600">
                          {stats.fileTypeBreakdown.videos.count} files
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">
                      {formatBytes(stats.fileTypeBreakdown.videos.size)}
                    </p>
                  </div>
                  <Progress 
                    value={(stats.fileTypeBreakdown.videos.size / stats.totalSize) * 100}
                    color="secondary"
                    size="md"
                    classNames={{
                      indicator: "bg-gradient-to-r from-purple-500 to-purple-600"
                    }}
                  />
                </div>
              )}

              {stats.fileTypeBreakdown.audio.count > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                        <Music className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Audio</p>
                        <p className="text-sm text-gray-600">
                          {stats.fileTypeBreakdown.audio.count} files
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">
                      {formatBytes(stats.fileTypeBreakdown.audio.size)}
                    </p>
                  </div>
                  <Progress 
                    value={(stats.fileTypeBreakdown.audio.size / stats.totalSize) * 100}
                    color="success"
                    size="md"
                    classNames={{
                      indicator: "bg-gradient-to-r from-green-500 to-green-600"
                    }}
                  />
                </div>
              )}

              {stats.fileTypeBreakdown.others.count > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-md">
                        <FileIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Others</p>
                        <p className="text-sm text-gray-600">
                          {stats.fileTypeBreakdown.others.count} files
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">
                      {formatBytes(stats.fileTypeBreakdown.others.size)}
                    </p>
                  </div>
                  <Progress 
                    value={(stats.fileTypeBreakdown.others.size / stats.totalSize) * 100}
                    color="default"
                    size="md"
                    classNames={{
                      indicator: "bg-gradient-to-r from-gray-500 to-gray-600"
                    }}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}