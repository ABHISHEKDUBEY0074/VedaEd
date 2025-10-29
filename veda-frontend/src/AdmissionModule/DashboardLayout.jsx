import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../SIS/Navbar"; // universal navbar
import Sidebar from "./Sidebar"; // yahi wala sidebar use hoga (jo tumne diya tha)
import { useState } from "react";
import {
  FiMenu,
  FiUserPlus,
  FiList,
  FiUserCheck,
  FiFileText,
  FiLayers,
  FiDollarSign,
  FiHome,
} from "react-icons/fi";

export default function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { to: "/admission/dashboard", icon: <FiHome size={20} />, label: "Dashboard" },
    { to: "/admission/admission-enquiry", icon: <FiUserPlus size={20} />, label: "Admission Enquiry" },
    { to: "/admission/entrance-list", icon: <FiList size={20} />, label: "Entrance List" },
    { to: "/admission/interview-list", icon: <FiUserCheck size={20} />, label: "Interview List" },
    { to: "/admission/admission-form", icon: <FiFileText size={20} />, label: "Admission Form" },
    { to: "/admission/vacant-seats", icon: <FiLayers size={20} />, label: "Vacant Seats" },
    { to: "/admission/registration-fees", icon: <FiDollarSign size={20} />, label: "Registration Fees" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Fixed Strip */}
      <div className="w-12 flex-shrink-0 bg-white shadow relative z-20 flex flex-col items-center">
        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="mt-3 p-2 rounded-md hover:bg-gray-200"
        >
          <FiMenu size={20} />
        </button>

        {/* Icons when sidebar closed */}
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
