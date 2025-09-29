import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../SIS/Navbar";
import StudentSidebar from "./Sidebar";
import { useState } from "react";
import {
  FiMenu,
  FiHome,
  FiBookOpen,
  FiClipboard,
  FiCalendar,
  FiAward,
  FiUser,
  FiBook,
} from "react-icons/fi";

export default function StudentDashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { to: "/student", icon: <FiHome size={20} />, label: "Home", end: true },
    {
      to: "/student/classes",
      icon: <FiBookOpen size={20} />,
      label: "My Classes",
    },
    {
      to: "/student/curriculum",
      icon: <FiBook size={20} />,
      label: "Curriculum",
    },
    {
      to: "/student/timetable",
      icon: <FiCalendar size={20} />,
      label: "Timetable",
    },
    {
      to: "/student/assignments",
      icon: <FiClipboard size={20} />,
      label: "Assignments",
    },
    { to: "/student/exams", icon: <FiAward size={20} />, label: "Exams" },
    { to: "/student/profile", icon: <FiUser size={20} />, label: "Profile" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Fixed Strip (menu toggle + icons when collapsed) */}
      <div className="w-12 flex-shrink-0 bg-white shadow relative z-20 flex flex-col items-center">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="mt-3 p-2 rounded-md hover:bg-gray-200"
        >
          <FiMenu size={20} />
        </button>

        {!isSidebarOpen && (
          <div className="mt-6 flex flex-col space-y-6 text-gray-600">
            {menuItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group relative flex items-center justify-center p-2 rounded-md hover:bg-gray-200 ${
                    isActive ? "bg-blue-100 text-blue-600" : ""
                  }`
                }
              >
                {item.icon}
                <span
                  className="absolute left-12 top-1/2 -translate-y-1/2 
                                 px-2 py-1 text-xs rounded bg-gray-800 text-white 
                                 opacity-0 group-hover:opacity-100 whitespace-nowrap"
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar (full) */}
      {isSidebarOpen && <StudentSidebar searchQuery={searchQuery} />}

      {/* Right side: Navbar + Outlet */}
      <div className="flex flex-col flex-1">
        <div className="h-14 flex-shrink-0">
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
