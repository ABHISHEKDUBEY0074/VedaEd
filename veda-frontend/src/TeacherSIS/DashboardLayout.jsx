import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../SIS/Navbar";
import TeacherSidebar from "./Sidebar";
import { useState } from "react";
import {
  FiMenu,
  FiHome,
  FiBookOpen,
  FiUsers,
  FiClipboard,
  FiCheckSquare,
  FiBarChart2,
  FiCalendar,
  FiAward,
  FiMessageCircle,
  FiUser,
} from "react-icons/fi";

export default function TeacherDashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Teacher modules menu
  const menuItems = [
   { to: "/teacher", icon: <FiHome size={20} />, label: "Home", end: true },
    { to: "/teacher/classes", icon: <FiBookOpen size={20} />, label: "Classes" },
    { to: "/teacher/attendance", icon: <FiCheckSquare size={20} />, label: "Attendance" },
    { to: "/teacher/assignment", icon: <FiClipboard size={20} />, label: "Assignments" },
    { to: "/teacher/exams", icon: <FiAward size={20} />, label: "Exams" },
    { to: "/teacher/timetable", icon: <FiCalendar size={20} />, label: "Timetable" },
    { to: "/teacher/gradebook", icon: <FiBarChart2 size={20} />, label: "Gradebook" },
    { to: "/teacher/discipline", icon: <FiUsers size={20} />, label: "Discipline" },
    { to: "/teacher/communication", icon: <FiMessageCircle size={20} />, label: "Communication" },
    { to: "/teacher/profile", icon: <FiUser size={20} />, label: "Profile" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Fixed Strip (Menu + Icons if sidebar closed) */}
      <div className="w-12 flex-shrink-0 bg-white shadow relative z-20 flex flex-col items-center">
        {/* Menu Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="mt-3 p-2 rounded-md hover:bg-gray-200"
        >
          <FiMenu size={20} />
        </button>

        {/* Icons show only when sidebar is closed */}
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
  <span className="absolute left-12 top-1/2 -translate-y-1/2 
                   px-2 py-1 text-xs rounded bg-gray-800 text-white 
                   opacity-0 group-hover:opacity-100 whitespace-nowrap">
    {item.label}
  </span>
</NavLink>

            ))}
          </div>
        )}
      </div>

      {/* Sidebar (toggleable) */}
      {isSidebarOpen && <TeacherSidebar searchQuery={searchQuery} />}

      {/* Right side: Navbar + Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <div className="h-14 flex-shrink-0">
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Main Outlet */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
