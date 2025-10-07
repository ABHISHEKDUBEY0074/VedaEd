import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../SIS/Navbar";
import CommunicationSidebar from "./CommunicationSidebar";
import { useState } from "react";
import { FiMenu, FiMail, FiFileText, FiSend, FiMessageCircle } from "react-icons/fi";

export default function CommunicationAdminLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { to: "/communication/logs", icon: <FiFileText size={20} />, label: "Logs", end: true },
    { to: "/communication/notices", icon: <FiMail size={20} />, label: "Notices" },
    { to: "/communication/send", icon: <FiSend size={20} />, label: "Send" },
    { to: "/communication/complaints", icon: <FiMessageCircle size={20} />, label: "Complaints" },
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

      {/* Sidebar (full) */}
      {isSidebarOpen && <CommunicationSidebar searchQuery={searchQuery} />}

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
