import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminCalendarSidebar from "./Sidebar";

export default function AdminCalendarLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex w-full h-screen bg-gray-100 overflow-hidden">
      
      {/* SIDEBAR (no navbar) */}
      <AdminCalendarSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div
        className="flex-1 overflow-y-auto transition-all"
        style={{
          marginLeft: isSidebarOpen ? "256px" : "56px",
          transition: "margin-left 0.3s",
        }}
      >
        <div className="p-3">
          <Outlet />
        </div>
      </div>

    </div>
  );
}
