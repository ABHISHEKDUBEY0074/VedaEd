import React from "react";
import {
  FiMenu,
  FiCalendar,
} from "react-icons/fi";

import ProfileAvatar, {
  resolveProfileImage,
} from "../components/ProfileAvatar";

export default function TeacherCalendarSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  // =========================
  // CURRENT USER
  // =========================
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userName =
    currentUser?.name ||
    currentUser?.fullName ||
    currentUser?.username ||
    "Teacher";

  const userImage = resolveProfileImage(
    currentUser?.profileImage ||
      currentUser?.profile_image ||
      currentUser?.avatar ||
      currentUser?.image
  );

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
        transition-all
        duration-300
        z-30
        flex
        flex-col
        overflow-hidden
        ${isSidebarOpen ? "w-64" : "w-14"}
      `}
    >

      {/* =========================
          TOGGLE BUTTON
      ========================= */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="
          absolute
          top-3
          left-3
          p-2
          rounded-md
          hover:bg-gray-100
          transition
          z-10
        "
        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <FiMenu size={20} />
      </button>


      {/* =========================
          MENU
      ========================= */}
      <div className="flex-1 min-h-0 overflow-y-auto mt-14 px-3">

        {isSidebarOpen && (
          <div className="px-2 mb-2 text-sm text-gray-500 font-semibold">
            Main
          </div>
        )}

        <div
          className={`
            flex
            items-center
            h-10
            rounded-lg
            bg-blue-100
            text-blue-700
            font-medium
            transition-all
            ${
              isSidebarOpen
                ? "px-3 gap-3"
                : "justify-center"
            }
          `}
        >
          <span className="flex w-6 justify-center shrink-0">
            <FiCalendar size={18} />
          </span>

          {isSidebarOpen && (
            <span className="whitespace-nowrap">
              Annual Calendar
            </span>
          )}
        </div>
      </div>


      {/* =========================
          TEACHER PROFILE
      ========================= */}
      <div className="shrink-0 border-t border-gray-200 p-3">
        <div
          className={`
            flex
            items-center
            ${
              isSidebarOpen
                ? "gap-3"
                : "justify-center"
            }
          `}
        >

          {/* Avatar */}
          <ProfileAvatar
            name={userName}
            image={userImage}
            size={36}
          />

          {/* Name + Role */}
          {isSidebarOpen && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {userName}
              </p>

              <p className="text-xs text-gray-500 truncate">
                Teacher
              </p>
            </div>
          )}

        </div>
      </div>

    </aside>
  );
}