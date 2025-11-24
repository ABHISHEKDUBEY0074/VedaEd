import React, { useState, useRef, useEffect } from "react";
import PostNotices from "./PostNotices";
import NoticeTemplates from "./NoticeTemplates";
import OthersNotices from "./OthersNotices";
import { FiDownload } from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";

export default function Notices() {
  const [activeTab, setActiveTab] = useState("post"); // default Post Notices
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "post": return <PostNotices />;
      case "templates": return <NoticeTemplates />;
      case "others": return <OthersNotices />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button
          onClick={() => setActiveTab("post")}
          className="hover:underline"
        >
          Notices
        </button>
        <span>&gt;</span>
        <span>
          {activeTab === "post" && "Post Notices"}
          {activeTab === "templates" && "Notice Templates"}
          {activeTab === "others" && "Others"}
        </span>
      </div>

    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">Notices</h2>
    
      <HelpInfo
        title="Communication Module Help"
        description="This module allows you to manage all Parents records, login access, roles, and other information."
        steps={[
          "Use All Staff tab to view and manage Parents details.",
          "Use Manage Login tab to update login credentials.",
          "Use Others tab for additional Parents-related tools."
        ]}
      />
    </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300">
        {["post", "templates", "others"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 ${
              activeTab === tab
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab === "post"
              ? "Post Notices"
              : tab === "templates"
              ? "Notice Templates"
              : "Others"}
          </button>
        ))}

        
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTab()}</div>
    </div>
  );
}
