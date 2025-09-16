import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

export default function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/*  Left Fixed Strip (Menu Button)  */}
      <div className="w-12 flex-shrink-0 bg-white shadow relative z-20 flex items-start justify-center">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="mt-3 p-2 rounded-md hover:bg-gray-200"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Sidebar (toggleable)  */}
      {isSidebarOpen && (
        <Sidebar searchQuery={searchQuery} />
      )}

      {/*  Right side: Navbar + Main Content  */}
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
