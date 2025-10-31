import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";
import {
  FiMenu,
  FiHome,
  FiUsers,
  FiUser,
  FiCalendar,
  FiUserCheck,
  FiCheckSquare,
  FiBarChart2,
} from "react-icons/fi";

export default function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { to: "/", icon: <FiHome size={20} />, label: "Dashboard Home" },
    { to: "/students", icon: <FiUsers size={20} />, label: "Students" },
    { to: "/parents", icon: <FiUser size={20} />, label: "Parents" },
    {
      to: "/classes-schedules/Classes",
      icon: <FiCalendar size={20} />,
      label: "Classes & Schedules",
    },
    { to: "/staff", icon: <FiUserCheck size={20} />, label: "Staff" },
    {
      to: "/attendance",
      icon: <FiCheckSquare size={20} />,
      label: "Attendance",
    },
    { to: "/reports", icon: <FiBarChart2 size={20} />, label: "Reports" },
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
                className={({ isActive }) =>
                  `group relative flex items-center justify-center p-2 rounded-md hover:bg-gray-200 ${
                    isActive ? "bg-blue-100 text-blue-600" : ""
                  }`
                }
              >
                {item.icon}
                {/* Tooltip */}
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

      {/* Sidebar (toggleable) */}
      {isSidebarOpen && <Sidebar searchQuery={searchQuery} />}

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
