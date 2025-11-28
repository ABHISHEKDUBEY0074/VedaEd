// src/Teacher SIS/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";

export default function TeacherSidebar({ searchQuery }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/teacher" },
    { name: "Classes", path: "/teacher/classes" },
    { name: "Attendance", path: "/teacher/attendance" },
    { name: "Assignment", path: "/teacher/assignment" },
    { name: "Exams", path: "/teacher/exams" },
    { name: "Timetable", path: "/teacher/timetable" },
    { name: "Gradebook", path: "/teacher/gradebook" },
    { name: "Disciplinary & Activity Records", path: "/teacher/discipline" },
    { name: "Communication", path: "/teacher/communication" },

    // ⭐ NEW ITEM ADDED HERE
    { name: "Student Health", path: "/teacher/student-health" },

    { name: "Profile", path: "/teacher/profile" },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-white border-r h-full p-4 flex flex-col justify-between">
      <ul className="space-y-1 text-gray-700">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isActive =
              item.path === "/teacher"
                ? location.pathname === "/teacher"
                : location.pathname === item.path ||
                  location.pathname.startsWith(item.path + "/");

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </NavLink>
              </li>
            );
          })
        ) : (
          <p className="text-sm text-gray-400 px-3">No results found</p>
        )}
      </ul>

      <div className="flex items-center space-x-2 px-2 mt-4 border-t pt-3">
        <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
        <div>
          <p className="text-sm font-semibold">Teacher User</p>
          <p className="text-xs text-gray-500">Teacher</p>
        </div>
      </div>
    </div>
  );
}
