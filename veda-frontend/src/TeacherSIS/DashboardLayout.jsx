import { Outlet } from "react-router-dom";
import Navbar from "../SIS/Navbar";
import TeacherSidebar from "./Sidebar";
import { useState, useEffect } from "react";
import staffAPI from "../services/staffAPI";

export default function TeacherDashboardLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // DEV: Auto-login as first teacher if no user found
  useEffect(() => {
    const checkUser = async () => {
      const stored = localStorage.getItem("user");
      if (!stored) {
        try {
          const staffResponse = await staffAPI.getAllStaff();
          const list = staffResponse.data || staffResponse || [];
          const firstTeacher = list.find(s => s.personalInfo?.role === "Teacher");
          
          if (firstTeacher) {
            const userObj = {
              _id: firstTeacher._id,
              role: "Teacher",
              name: firstTeacher.personalInfo?.name,
              email: firstTeacher.personalInfo?.email
            };
            localStorage.setItem("user", JSON.stringify(userObj));
            console.log("DEV: Auto-logged in as teacher", userObj.name);
          }
        } catch (e) {
          console.error("DEV: Teacher auto-login failed", e);
        }
      }
    };
    checkUser();
  }, []);

  return (
    <div className="flex w-full h-screen bg-gray-100 overflow-hidden">

      {/* FIXED NAVBAR (same as Admin layout) */}
      <div className="fixed top-0 left-0 w-full h-16 bg-white border-b z-30">
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* SIDEBAR (Admin style) */}
      <TeacherSidebar
        searchQuery={searchQuery}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* MAIN CONTENT AREA */}
      <div
        className="flex-1 pt-16 overflow-y-auto transition-all"
        style={{
          marginLeft: isSidebarOpen ? "256px" : "56px",
          transition: "margin-left 0.3s"
        }}
      >

        <div className="p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
