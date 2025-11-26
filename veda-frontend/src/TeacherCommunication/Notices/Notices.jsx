import React, { useState, useRef, useEffect } from "react";
import NoticesOverview from "./NoticesOverview";
import PostNotices from "./PostNotices";
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

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Notices</h2>

        <HelpInfo
          title="Teacher Notices Help"
          description={`Page Description: Draft and publish notices from a teacher account or review notice analytics to stay informed about prior sends.


8.1 Overview Tab

High-level snapshot of notices you’ve already sent.

Sections:
- Recent Notices List: Displays title, recipients, status (Draft/Sent), and time
- Status Chips: Visual badges for scheduled, sent, or failed notices
- Quick Filters: Narrow the list by class, date, or channel
- Insight Cards: Counters showing total notices sent, scheduled, or awaiting approval


8.2 Post Notices Tab

Composer for creating a new teacher notice.

Sections:
- Notice Form: Inputs for title, subject, body, importance, and attachments
- Audience Selection: Choose which class/section or student groups to notify
- Channel Settings: Toggle App, Email, or SMS delivery
- Schedule Controls: Send immediately or schedule with date/time picker
- Preview & Send Buttons: Review the notice and publish when ready`}
        />
      </div>

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
