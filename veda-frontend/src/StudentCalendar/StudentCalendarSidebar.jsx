import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiCalendar } from "react-icons/fi";

export default function StudentCalendarSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userName =
    currentUser?.name ||
    currentUser?.fullName ||
    currentUser?.username ||
    "Student";

  const userImage =
    currentUser?.profileImage ||
    currentUser?.profile_image ||
    currentUser?.avatar ||
    currentUser?.image ||
    "";

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--student-calendar-sidebar-width",
      isSidebarOpen ? "256px" : "56px"
    );

    return () => {
      document.documentElement.style.removeProperty(
        "--student-calendar-sidebar-width"
      );
    };
  }, [isSidebarOpen]);

  return (
    <aside
      className={`
        fixed
        top-16
        left-0
        h-[calc(100vh-64px)]
        bg-white
        border-r
        border-gray-200
        shadow-sm
        z-30
        flex
        flex-col
        overflow-hidden
        transition-all
        duration-300
        ${isSidebarOpen ? "w-64" : "w-14"}
      `}
    >
      {/* ================= MENU BUTTON ================= */}
      <div className="absolute top-3 left-3">
  <button
    type="button"
    onClick={() => setIsSidebarOpen((prev) => !prev)}
    className="
      w-9 h-9
      flex items-center justify-center
      rounded-lg
      text-gray-600
      hover:bg-gray-100
      hover:text-gray-900
      transition
    "
    title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
  >
    <FiMenu size={21} />
  </button>
</div>

      {/* ================= MAIN MENU ================= */}
      <div className="flex-1 overflow-y-auto mt-14 px-3">
        {isSidebarOpen && (
          <div className="px-3 mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main
            </p>
          </div>
        )}

        <ul className="space-y-1">
          <li>
            <NavLink
              to="/student/calendar"
              className={({ isActive }) => `
                flex items-center
                ${isSidebarOpen ? "gap-3 px-3" : "justify-center"}
                py-2.5
                rounded-lg
                text-sm
                font-medium
                transition-all
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
              title={!isSidebarOpen ? "Annual Calendar" : undefined}
            >
              <FiCalendar size={20} className="shrink-0" />

              {isSidebarOpen && (
                <span className="whitespace-nowrap">
                  Annual Calendar
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </div>

      {/* ================= STUDENT PROFILE ================= */}
      <div className="shrink-0 border-t border-gray-200 p-3">
        <div
          className={`
            flex items-center
            ${isSidebarOpen ? "gap-3" : "justify-center"}
          `}
        >
          {/* Profile Image */}
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div
              className="
                w-9 h-9
                rounded-full
                bg-blue-100
                text-blue-600
                flex items-center justify-center
                font-semibold
                text-sm
              "
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          )}

          {isSidebarOpen && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {userName}
              </p>

              <p className="text-xs text-gray-500 truncate">
                Student
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}