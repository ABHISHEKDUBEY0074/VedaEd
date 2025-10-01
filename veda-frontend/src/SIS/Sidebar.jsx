import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar({ searchQuery }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard Home", path: "/" },
    { name: "Students", path: "/students" },
    { name: "Parents", path: "/parents" },
    { name: "Classes & Schedules", path: "/classes-schedules" },
    { name: "Staff", path: "/staff" },
    { name: "Attendance", path: "/attendance" },
    { name: "Reports", path: "/reports" },
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
  item.path === "/classes-schedules"
    ? location.pathname.startsWith("/classes-schedules") ||
      location.pathname.startsWith("/add-class") ||
      location.pathname.startsWith("/add-subject") ||
      location.pathname.startsWith("/class-detail")
    : item.path === "/students"
    ? location.pathname.startsWith("/students") ||
      location.pathname.startsWith("/student-profile")
    : item.path === "/staff"
    ? location.pathname.startsWith("/staff") ||
      location.pathname.startsWith("/staff-profile")
    : item.path === "/parents"
    ? location.pathname.startsWith("/parents") ||
      location.pathname.startsWith("/parent-profile")
    : location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/");


            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
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

      <div className="flex items-center space-x-2 px-2 mt-4">
        <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
        <div>
          <p className="text-sm font-semibold">Admin User</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
      </div>
    </div>
  );
}
