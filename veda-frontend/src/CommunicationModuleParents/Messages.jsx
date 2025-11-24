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
