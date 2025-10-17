import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../SIS/Navbar";
import HRSidebar from "./HRSidebar";
import { useState } from "react";
import { FiMenu, FiUsers, FiClock, FiDollarSign, FiCheckSquare } from "react-icons/fi";

export default function HRDashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { to: "/hr/staff-directory", icon: <FiUsers size={20} />, label: "Staff Directory", end: true },
    { to: "/hr/staff-attendance", icon: <FiClock size={20} />, label: "Staff Attendance" },
    { to: "/hr/payroll", icon: <FiDollarSign size={20} />, label: "Payroll" },
    { to: "/hr/approve-leave", icon: <FiCheckSquare size={20} />, label: "Approve Leave" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Fixed Strip */}
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

      {/* Sidebar (Full) */}
      {isSidebarOpen && <HRSidebar searchQuery={searchQuery} />}

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
