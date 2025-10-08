import React, { useState, useRef, useEffect } from "react";
import AllLogs from "./AllLogs";
import ScheduleLogs from "./ScheduleLogs";
import Others from "./Others";
import { FiDownload } from "react-icons/fi";

export default function Logs() {
  const [activeTab, setActiveTab] = useState("all"); // default AllLogs
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
      case "all": return <AllLogs />;
      case "schedule": return <ScheduleLogs />;
      case "others": return <Others />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button
          onClick={() => setActiveTab("all")}
          className="hover:underline"
        >
          Logs
        </button>
        <span>&gt;</span>
        <span>
          {activeTab === "all" && "All Logs"}
          {activeTab === "schedule" && "Schedule Logs"}
          {activeTab === "others" && "Others"}
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-6">Logs</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300">
  {["all", "schedule", "others"].map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`relative capitalize pb-2 ${
        activeTab === tab
          ? "text-blue-600 font-semibold"
          : "text-gray-500"
      }`}
    >
      {tab === "all" ? "All Logs" : tab === "schedule" ? "Schedule Logs" : "Others"}
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
