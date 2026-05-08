import { NavLink, useLocation } from "react-router-dom";
import {
  FiCalendar,
  FiMenu,
  FiUser,
} from "react-icons/fi";
import { useEffect } from "react";

export default function ParentCalendarSidebar({
  searchQuery = "",
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isSidebarOpen ? "256px" : "56px"
    );
  }, [isSidebarOpen]);

  /* ================= ONLY ONE PAGE ================= */
 const menuItems = [
  {
    name: "Annual Calendar",
    path: "/parent-calendar",
    icon: <FiCalendar size={18} />,
    end: true,
  },
];

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`
        fixed left-0 bg-white border-r shadow-sm
        transition-all duration-300 z-30 overflow-hidden
        ${isSidebarOpen ? "w-64" : "w-14"}
      `}
      style={{
        top: "64px",
        height: "calc(100vh - 64px)",
      }}
    >
      {/* INNER WRAPPER */}
      <div className="relative h-full flex flex-col">

        {/* TOGGLE */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-3 left-3 p-2 rounded-md hover:bg-gray-200 transition"
        >
          <FiMenu size={20} />
        </button>

        {/* MENU */}
        <ul className="mt-14 flex-1 overflow-y-auto space-y-1 px-3">
          {filteredItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={`flex items-center h-10 rounded-lg transition-all
                  ${isSidebarOpen ? "px-3 gap-3" : "px-0 justify-center"}
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
              >
                <span className="flex w-6 justify-center">
                  {item.icon}
                </span>

                {isSidebarOpen && (
                  <span className="whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </ul>

        {/* USER INFO */}
        <div className="border-t p-2">
          <div className="mt-2">
            {isSidebarOpen ? (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium">
                  Parent User
                </div>

                <div className="text-xs text-gray-500">
                  Parent Calendar Access
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-2">
                <FiUser size={20} className="text-gray-600" />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}