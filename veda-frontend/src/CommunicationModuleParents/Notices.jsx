import React, { useState, useRef, useEffect } from "react";
import NoticesOverview from "./Notices/NoticesOverview";
import HelpInfo from "../components/HelpInfo";

export default function NoticesParents() {
  const [activeTab, setActiveTab] = useState("overview");
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
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Communication</span>
        <span>&gt;</span>
        <span>Notices</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notices</h2>
        <HelpInfo
          title="Parent Notices Help"
          description={`Page Description: Review all school notices that apply to your children. Stay informed about events, exams, and administrative updates.


9.2 Parent Notice Center

Single overview tab summarizing every notice you've received.

Sections:
- Overview Tab: Cards/table rows showing notice title, date, sender, and child association
- Breadcrumb & Header: Keeps you oriented within the Communication module
- Filter/Search Tools: Built into the overview (if provided) to narrow notices by date or category
- Notice Detail: Click a notice to expand or view full content, attachments, or download links
- Status Badges: Indicate unread/new notices for quick attention`}
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
