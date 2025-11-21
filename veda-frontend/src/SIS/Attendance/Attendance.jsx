import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import HelpInfo from "../../components/HelpInfo";


export default function Attendance() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Update activeTab based on current route
  useEffect(() => {
    if (location.pathname.includes("by-class")) setActiveTab("by-class");
    else if (location.pathname.includes("by-student")) setActiveTab("by-student");
    else setActiveTab("overview");
  }, [location.pathname]);

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button
          onClick={() => {
            setActiveTab("overview");
            navigate("/attendance/overview"); // ✅ navigate to overview route
          }}
          className="hover:underline"
        >
          Attendance
        </button>
        <span>&gt;</span>
        <span>
          {activeTab === "overview" && "Overview"}
          {activeTab === "by-class" && "By Class"}
          {activeTab === "by-student" && "By Student"}
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">
    {activeTab === "overview"
      ? "Overview"
      : activeTab === "by-class"
      ? "By Class"
      : "By Student"}
  </h2>

  <HelpInfo
    title="Attendance Help"
    description="This attendance module allows you to view attendance by overview, class-wise and student-wise. Use this help box to understand how each section works."
    steps={[
      "Overview: Shows total presents/absents and quick stats.",
      "By Class: Select a class to view attendance for a particular section.",
      "By Student: Search and check complete student attendance."
    ]}
  />
</div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 space-x-8">
        <NavLink
          to="/attendance/overview"
          className={({ isActive }) =>
            `pb-2 border-b-2 transition ${
              isActive
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/attendance/by-class"
          className={({ isActive }) =>
            `pb-2 border-b-2 transition ${
              isActive
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`
          }
        >
          By Class
        </NavLink>
        <NavLink
          to="/attendance/by-student"
          className={({ isActive }) =>
            `pb-2 border-b-2 transition ${
              isActive
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`
          }
        >
          By Student
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}
