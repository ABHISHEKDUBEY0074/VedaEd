import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import HelpInfo from "../../components/HelpInfo";
const ClassesSchedules = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("classes");

  // Update activeTab based on current route
  useEffect(() => {
    if (location.pathname.includes("subject-group")) setActiveTab("subject-group");
    else if (location.pathname.includes("assign-teacher")) setActiveTab("assign-teacher");
    else if (location.pathname.includes("timetable")) setActiveTab("timetable");
    else setActiveTab("classes");
  }, [location.pathname]);

  return (
    <div className="p-6 ">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button
          onClick={() => {
            setActiveTab("classes");
            navigate("/classes-schedules/classes"); // navigate to default tab
          }}
          className="hover:underline"
        >
          Classes & Schedules
        </button>
        <span>&gt;</span>
        <span>
          {activeTab === "classes" && "Classes"}
          {activeTab === "subject-group" && "Subject Group"}
          {activeTab === "assign-teacher" && "Assign Teacher"}
          {activeTab === "timetable" && "Timetable"}
        </span>
      </div>

     <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Classes and Schedule</h2>

  <HelpInfo
    title="Staff Module Help"
    description="This module allows you to manage all staff records, login access, roles, and other information."
    steps={[
      "Use All Staff tab to view and manage staff details.",
      "Use Manage Login tab to update login credentials.",
      "Use Others tab for additional staff-related tools."
    ]}
  />
</div>


      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <NavLink
          to="classes"
          className={({ isActive }) =>
            `pb-2 ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`
          }
        >
          Classes
        </NavLink>

        <NavLink
          to="subject-group"
          className={({ isActive }) =>
            `pb-2 ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`
          }
        >
          Subject Group
        </NavLink>

        <NavLink
          to="assign-teacher"
          className={({ isActive }) =>
            `pb-2 ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`
          }
        >
          Assign Teacher
        </NavLink>

        <NavLink
          to="timetable"
          className={({ isActive }) =>
            `pb-2 ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`
          }
        >
          Timetable
        </NavLink>
      </div>

      {/* Tab Content */}
      <div>
        <Outlet /> {/* Tab content will render here */}
      </div>
    </div>
  );
};

export default ClassesSchedules;
