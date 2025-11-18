import React, { useState, useEffect, useRef } from "react";
import { FiDownload } from "react-icons/fi";
import AcademicReport from "./AcademicReport";
import AttendanceReport from "./AttendanceReport";
import DisciplineReport from "./DisciplineReport";
import HealthReport from "./HealthReport";
import ActivitiesReport from "./ActivitiesReport";
import ProgressReport from "./ProgressReport";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("academic");
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
      case "academic": return <AcademicReport />;
      case "attendance": return <AttendanceReport />;
      case "discipline": return <DisciplineReport />;
      case "health": return <HealthReport />;
      case "activities": return <ActivitiesReport />;
      case "progress": return <ProgressReport />;

      // ⭐ NEW TAB (BLANK PAGE)
      case "ai-automation": 
        return (
          <div className="p-6 text-center text-gray-600">
            <h3 className="text-xl font-semibold mb-2">AI Automation</h3>
            <p>This section will contain AI-generated automated insights.</p>
          </div>
        );

      default: 
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button
          onClick={() => setActiveTab("academic")}
          className="hover:underline"
        >
          Reports
        </button>

        <span>&gt;</span>

        <span>
          {activeTab === "academic" && "Academic"}
          {activeTab === "attendance" && "Attendance"}
          {activeTab === "discipline" && "Discipline"}
          {activeTab === "health" && "Health"}
          {activeTab === "activities" && "Activities"}
          {activeTab === "progress" && "Progress"}

          {/* ⭐ NEW BREADCRUMB */}
          {activeTab === "ai-automation" && "AI Automation"}
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-6">Reports</h2>
      <div className="flex gap-4 border-b pb-2">

        {/* ⭐ Added new tab in the list */}
        {[
          "academic",
          "attendance",
          "discipline",
          "health",
          "activities",
          "progress",
          "ai-automation"  // NEW TAB
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 ${
              activeTab === tab
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}

        <div className="ml-auto relative" ref={dropdownRef}></div>
      </div>

      <div className="mt-4">{renderTab()}</div>
    </div>
  );
}
