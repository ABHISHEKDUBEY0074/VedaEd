import React, { useState, useRef, useEffect } from "react";
import MessagesOverview from "./Messages/MessagesOverview";
import HelpInfo from "../components/HelpInfo";

export default function Messages() {
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
        <h2 className="text-2xl font-bold">Messages</h2>

        <HelpInfo
          title="Student Messages Help"
          description={`Page Description: Check all messages sent to you as a student. Review sender details, message text, and timestamps inside the overview.


10.1 Student Messaging Overview

Single overview tab showing the most recent conversations delivered to your account.

Sections:
- Breadcrumb & Header: Confirms you're on the Messages overview
- Overview Tab: Cards/list entries for each message with sender, channel, and time
- Message Detail Panel: Click an entry to open the full message, attachments, or replies
- Status Indicators: Icons/labels for unread, urgent, or important messages
- Filters & Search: Tools (if provided) to filter by channel or timeframe`}
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
