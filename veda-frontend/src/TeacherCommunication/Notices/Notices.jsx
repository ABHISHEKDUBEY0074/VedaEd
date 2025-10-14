import React, { useState, useRef, useEffect } from "react";
import NoticesOverview from "./NoticesOverview";
import PostNotices from "./PostNotices";

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
      case "overview":
        return <NoticesOverview />;
      case "post":
        return <PostNotices />;
      default:
        return null;
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
          {activeTab === "overview" && "Overview"}
          {activeTab === "post" && "Post Notices"}
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-6">Teacher Notices</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300">
        {["overview", "post"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 ${
              activeTab === tab
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab === "overview"
              ? "Overview"
              : tab === "post"
              ? "Post Notices"
              : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTab()}</div>
    </div>
  );
}
