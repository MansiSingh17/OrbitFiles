"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { FileUp, FileText, User, Sparkles, Copy, Zap } from "lucide-react";
import FileUploadForm from "@/components/FileUploadForm";
import FileList from "@/components/FileList";
import UserProfile from "@/components/UserProfile";
import DuplicateFinder from "@/components/DuplicateFinder";
import { useSearchParams } from "next/navigation";
import StorageAnalytics from "@/components/StorageAnalytics";
import ActivityTimeline from "@/components/ActivityTimeline";

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({
  userId,
  userName,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string>("files");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  useEffect(() => {
    if (tabParam === "profile") {
      setActiveTab("profile");
    } else if (tabParam === "duplicates") {
      setActiveTab("duplicates");
    } else {
      setActiveTab("files");
    }
  }, [tabParam]);

  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleFolderChange = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
  }, []);

  const handleActivityChange = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-10 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg mb-4">
          <Sparkles className="h-4 w-4 text-white" />
          <span className="text-sm text-white font-semibold">Dashboard</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Hi,{" "}
          <span className="gradient-text">
            {userName?.length > 15
              ? `${userName?.substring(0, 15)}...`
              : userName?.split(" ")[0] || "there"}
          </span>
          !
        </h2>
        <p className="text-gray-600 text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Your files are waiting for you.
        </p>
      </div>

      <div className="mb-10">
        <StorageAnalytics userId={userId} />
      </div>

      <div className="mb-10">
        <ActivityTimeline userId={userId} limit={5} refreshTrigger={refreshTrigger} />
      </div>

      {/* Tabs */}
      <Tabs
        aria-label="Dashboard Tabs"
        color="primary"
        variant="underlined"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        classNames={{
          tabList: "gap-8 border-b-2 border-gray-200",
          tab: "py-4 px-2",
          cursor: "bg-gradient-to-r from-blue-500 to-purple-600 h-1",
          tabContent: "group-data-[selected=true]:text-blue-600 text-gray-600 font-semibold"
        }}
      >
        <Tab
          key="files"
          title={
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">My Files</span>
            </div>
          }
        >
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <Card className="glass-card card-hover border-2 border-blue-100 shadow-xl">
                <CardHeader className="flex gap-3 border-b-2 border-blue-50 pb-5 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <FileUp className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Upload</h2>
                </CardHeader>
                <CardBody className="pt-6">
                  <FileUploadForm
                    userId={userId}
                    onUploadSuccess={handleFileUploadSuccess}
                    currentFolder={currentFolder}
                  />
                </CardBody>
              </Card>
            </div>

            {/* Files Section */}
            <div className="lg:col-span-2">
              <Card className="glass-card card-hover border-2 border-blue-100 shadow-xl">
                <CardHeader className="flex gap-3 border-b-2 border-blue-50 pb-5 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Your Files</h2>
                </CardHeader>
                <CardBody className="pt-6">
                  <FileList
                    userId={userId}
                    refreshTrigger={refreshTrigger}
                    onFolderChange={handleFolderChange}
                    onActivityChange={handleActivityChange}
                  />
                </CardBody>
              </Card>
            </div>
          </div>
        </Tab>

        <Tab
          key="duplicates"
          title={
            <div className="flex items-center gap-3">
              <Copy className="h-5 w-5" />
              <span className="font-semibold">Duplicates</span>
            </div>
          }
        >
          <div className="mt-10">
            <DuplicateFinder userId={userId} />
          </div>
        </Tab>

        <Tab
          key="profile"
          title={
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              <span className="font-semibold">Profile</span>
            </div>
          }
        >
          <div className="mt-10">
            <Card className="glass-card border-2 border-blue-100 shadow-xl max-w-4xl mx-auto">
              <CardBody className="p-10">
                <UserProfile />
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </>
  );
}