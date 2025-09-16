import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const ClassesSchedules = () => {
  return (
    <div className="p-6">
        <div className="text-gray-500 text-sm mb-2">Classes & Schedules &gt;</div>
      {/* Page Title */}
      <h2 className="text-2xl font-bold mb-6">Classes & Schedules</h2>

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
        <Outlet /> {/* yaha tab ka content load hoga */}
      </div>
    </div>
  );
};

export default ClassesSchedules;
