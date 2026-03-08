"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { 
  Upload, 
  Download, 
  Star, 
  Trash2, 
  FolderPlus,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  action: string;
  fileName: string;
  createdAt: string;
  details?: Record<string, any>;
}

interface ActivityTimelineProps {
  userId: string;
  limit?: number;
  refreshTrigger?: number;
}

export default function ActivityTimeline({ userId, limit = 10, refreshTrigger = 0 }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [userId, refreshTrigger]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        `/api/activity?userId=${userId}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "upload":
        return <Upload className="h-4 w-4 text-blue-600" />;
      case "download":
        return <Download className="h-4 w-4 text-green-600" />;
      case "star":
        return <Star className="h-4 w-4 text-yellow-600" />;
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case "create_folder":
        return <FolderPlus className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.action) {
      case "upload":
        return `Uploaded ${activity.fileName}`;
      case "download":
        return `Downloaded ${activity.fileName}`;
      case "star":
        return `Starred ${activity.fileName}`;
      case "unstar":
        return `Unstarred ${activity.fileName}`;
      case "delete":
        return `Deleted ${activity.fileName}`;
      case "create_folder":
        return `Created folder "${activity.fileName}"`;
      case "move":
        return `Moved ${activity.fileName}`;
      default:
        return `${activity.action} ${activity.fileName}`;
    }
  };

  if (loading) {
    return (
      <Card className="bg-white border-2 border-blue-100">
        <CardBody className="p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-2 border-blue-100 shadow-lg">
      <CardHeader className="border-b border-blue-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
      </CardHeader>
      <CardBody className="p-6">
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No activity yet</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="mt-1 p-2 bg-gray-50 rounded-lg flex-shrink-0">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}