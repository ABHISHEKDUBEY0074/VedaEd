import React, { useState } from "react";
import AllLogs from "./AllLogs";
import ScheduleLogs from "./ScheduleLogs";
import HelpInfo from "../../components/HelpInfo";

export default function Logs() {
  const [activeTab, setActiveTab] = useState("all");

  const renderTab = () => {
    switch (activeTab) {
      case "all":
        return <AllLogs />;
      case "schedule":
        return <ScheduleLogs />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button onClick={() => setActiveTab("all")} className="hover:underline">
          Logs
        </button>
        <span>&gt;</span>
        <span>
          {activeTab === "all" && "All Logs"}
          {activeTab === "schedule" && "Schedule Logs"}
        </span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Logs</h2>

        <HelpInfo
          title="Teacher Logs Help"
          description={`Page Description: Review all messages or notices you’ve sent. Switch between live history and scheduled batches for future sends.


8.1 All Logs Tab

Chronological record of every sent communication.

Sections:
- Log Table: Columns for title, recipient type, channels, and timestamp
- Filters/Search: Narrow results by class, recipient, or date range
- Channel Badges: Quickly see whether the message used App, Email, or SMS
- Detail Drawer: Click a row to inspect message content or delivery report


8.2 Schedule Logs Tab

List of upcoming or previously executed scheduled jobs.

Sections:
- Job Cards/Table: Show job name, target audience, scheduled date/time, and status
- Action Buttons: Pause, resume, or cancel pending jobs
- Execution Summary: Notes actual send time and success/failure counts`}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300">
        {["all", "schedule"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative capitalize pb-2 ${
              activeTab === tab
                ? "text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab === "all" ? "All Logs" : "Schedule Logs"}
            {activeTab === tab && (
              <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-blue-600"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTab()}</div>
    </div>
  );
}
