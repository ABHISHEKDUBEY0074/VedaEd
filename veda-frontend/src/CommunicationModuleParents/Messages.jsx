import React, { useState, useRef, useEffect } from "react";
import MessagesOverview from "./Messages/MessagesOverview";
import HelpInfo from "../components/HelpInfo";

export default function MessagesParents() {
  const [activeTab, setActiveTab] = useState("overview"); // default Overview
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
        return <MessagesOverview />;
      default:
        return null;
    }
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Communication</span>
        <span>&gt;</span>
        <span>Messages</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Parents Messages</h2>
        <HelpInfo
          title="Parent Messages Help"
          description={`Page Description: View message summaries delivered to you as a parent. Track which teacher/admin sent the update and read message content inside the overview.


9.1 Parent Messaging Overview

Single-tab layout that highlights the latest communications for your children.

Sections:
- Breadcrumb & Header: Confirms you are viewing the Messages overview
- Overview Tab: Cards/lists showing message subject, sender, channel, and time
- Detail Drawer/Preview: Click entries to read the full message content (component driven)
- Status Pills: Visual indicators for unread/read or important notices
- Search/Filter Controls: Located inside the overview to narrow messages by child or category`}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
        {["overview"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 ${
              activeTab === tab
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "overview" ? "Overview" : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        {renderTab()}
      </div>
    </div>
  );
}
