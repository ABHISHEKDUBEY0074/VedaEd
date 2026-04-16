// src/superadmin-landing-page/SuperAdminProfile.jsx
import React, { useState } from "react";
import SchoolInfo from "./SchoolInfo";
import Theme from "./Theme";
import Other from "./Other";
import HelpInfo from "../components/HelpInfo";

export default function SuperAdminProfile() {
  const [activeTab, setActiveTab] = useState("school-info");

  const renderTab = () => {
    switch (activeTab) {
      case "school-info":
        return <SchoolInfo />;
      case "theme":
        return <Theme />;
      case "other":
        return <Other />;
      default:
        return null;
    }
  };

  return (
    <div className="p-0 m-0">

      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>SuperAdmin</span>
        <span>&gt;</span>
        <span>Settings</span>
        <span>&gt;</span>
        <span>
          {activeTab === "school-info"
            ? "School Info"
            : activeTab === "theme"
            ? "Theme"
            : "Other"}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Profile Settings</h2>

        <HelpInfo
          title="Profile Settings Help"
          description="Manage school information, customize theme, and configure other settings for the system."
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
        <button
          onClick={() => setActiveTab("school-info")}
          className={`pb-2 ${
            activeTab === "school-info"
              ? "text-blue-600 font-semibold border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          School Info
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`pb-2 ${
            activeTab === "theme"
              ? "text-blue-600 font-semibold border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Theme
        </button>

        <button
          onClick={() => setActiveTab("other")}
          className={`pb-2 ${
            activeTab === "other"
              ? "text-blue-600 font-semibold border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Other
        </button>
      </div>

      {/* Tab Content */}
      {renderTab()}
    </div>
  );
}