import { NavLink, Outlet } from "react-router-dom";

export default function Attendance() {
  return (
   <div className="p-6">
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Attendance</h1>
        <div className="flex space-x-6 border-b mb-6">
        <NavLink
          to="/attendance/overview"
          className={({ isActive }) =>
            `pb-2  transition ${
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
            `pb-2  transition ${
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
            `pb-2  transition ${
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
     </div>
  );
}

