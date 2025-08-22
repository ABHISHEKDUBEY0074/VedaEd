import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col h-screen">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex flex-1">
        <Sidebar searchQuery={searchQuery} />
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}
  
