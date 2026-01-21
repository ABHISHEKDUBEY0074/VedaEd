// src/Student SIS/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiClipboard,
  FiCalendar,
  FiAward,
  FiUser,
  FiBook,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import React, { useEffect, useState } from "react";

export default function StudentSidebar({
  searchQuery,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isSidebarOpen ? "256px" : "56px"
    );
  }, [isSidebarOpen]);

  const menuItems = [
    { name: "Dashboard", path: "/student", icon: <FiHome size={18} /> },
    { name: "My Classes", path: "/student/classes", icon: <FiBookOpen size={18} /> },
    { name: "Curriculum", path: "/student/curriculum", icon: <FiBook size={18} /> },
    { name: "Timetable", path: "/student/timetable", icon: <FiCalendar size={18} /> },
    { name: "Attendance", path: "/student/attendance", icon: <FiCalendar size={18} /> },
    { name: "Activities", path: "/student/activities", icon: <FiAward size={18} /> },

    { name: "Assignments", path: "/student/assignments", icon: <FiClipboard size={18} /> },
    { name: "Exams", path: "/student/exams", icon: <FiAward size={18} /> },
    { name: "Profile", path: "/student/profile", icon: <FiUser size={18} /> },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white border-r shadow-sm
      transition-all duration-300 z-30 overflow-hidden
      ${isSidebarOpen ? "w-64" : "w-14"}`}
    >
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-3 left-3 p-2 rounded-md hover:bg-gray-200 transition"
      >
        <FiMenu size={20} />
      </button>

      {/* SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto scrollbar-none mt-14 px-3 space-y-1">
        {/* MENU ITEMS */}
        {filteredItems.map((item) => {
          const isActive =
            item.path === "/student"
              ? location.pathname === "/student"
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center h-10 rounded-lg transition-all
                ${isSidebarOpen ? "px-3 gap-3" : "px-0 justify-center"}
                ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <span className="flex w-6 justify-center">{item.icon}</span>
              {isSidebarOpen && (
                <span className="whitespace-nowrap">{item.name}</span>
              )}
            </NavLink>
          );
        })}

        {/* SETTINGS BUTTON (same as Teacher) */}
        <div className="absolute bottom-4 w-full px-2">
         <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className={`flex items-center h-10 w-full rounded-lg px-2 gap-3
            text-gray-700 hover:bg-gray-100 transition-colors mt-4`}
                >
                  <span className="flex w-6 justify-center">
                    <FiSettings size={18} />
                  </span>
                  {isSidebarOpen && <span>Settings</span>}
                </button>

        {/* SETTINGS DROPDOWN */}
        {settingsOpen && isSidebarOpen && (
          <div className="ml-10 mt-2 space-y-2 text-sm text-gray-700">
            <NavLink className="hover:text-blue-600 block">
              Profile Settings
            </NavLink>
            <NavLink className="hover:text-blue-600 block">
              Account Settings
            </NavLink>
            <NavLink className="hover:text-blue-600 block">
              Preferences
            </NavLink>
          </div>
        )}

        {/* USER INFO BOX */}
        <div className="mt-4">
          {isSidebarOpen ? (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium">Student User</div>
              <div className="text-xs text-gray-500">Student</div>
            </div>
          ) : (
            <div className="flex justify-center py-2">
              <FiUser size={20} className="text-gray-600" />
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
