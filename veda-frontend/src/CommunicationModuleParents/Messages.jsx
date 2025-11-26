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
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button
          onClick={() => setActiveTab("overview")}
          className="hover:underline"
        >
          Messages
        </button>
        <span>&gt;</span>
        <span>{activeTab === "overview" && "Overview"}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
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
      <div className="flex gap-4 border-b border-gray-300">
        {["overview"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 ${
              activeTab === tab
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab === "overview" ? "Overview" : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTab()}</div>
    </div>
  );
}
