import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function DashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen w-full overflow-hidden">
      
      <Sidebar searchQuery={searchQuery} />

      
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
