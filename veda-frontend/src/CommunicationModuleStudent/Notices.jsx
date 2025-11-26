import React, { useState, useRef, useEffect } from "react";
import NoticesOverview from "./Notices/NoticesOverview";
import HelpInfo from "../components/HelpInfo";

export default function Notices() {
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
        return <NoticesOverview />;
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
          Notices
        </button>
        <span>&gt;</span>
        <span>{activeTab === "overview" && "Overview"}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Notices</h2>

        <HelpInfo
          title="Student Notices Help"
          description={`Page Description: View important announcements published for students—exam alerts, events, schedule changes, and more.


10.2 Student Notice Overview

One overview tab that lists every notice targeted to you.

Sections:
- Overview Tab: Cards/table entries with notice title, summary, author, and publish date
- Breadcrumb & Header: Keeps you oriented in the Communication > Notices path
- Notice Detail View: Expand a notice to read the full content or download attachments
- Status Badges: Mark new/unread notices with visual cues
- Filters/Search: Tools (if provided) to narrow notices by subject, category, or date range`}
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
