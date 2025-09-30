import { NavLink, Outlet } from "react-router-dom";

export default function Attendance() {
  return (
   <div className="p-6">
<div className="text-gray-500 text-sm mb-2">Attendance &gt;</div>

     

        <h2 className="text-2xl font-bold mb-6">Attendance</h2>
       <div className="flex border-b border-gray-200 mb-6 space-x-8">

        <NavLink
          to="/attendance/overview"
          className={({ isActive }) =>
            `pb-2 2 border-b-2 transition ${
              isActive
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`
          }
        >
          Overview
        </NavLink>
        <NavLink
          to="/attendance/by-class"
          className={({ isActive }) =>
            `pb-2 2 border-b-2 transition ${
              isActive
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`
          }
        >
          By Class
        </NavLink>
        <NavLink
          to="/attendance/by-student"
          className={({ isActive }) =>
            `pb-2 2 border-b-2 transition ${
              isActive
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`
          }
        >
          By Student
        </NavLink>
      </div>
      <Outlet />
    </div>
    
  );
}

