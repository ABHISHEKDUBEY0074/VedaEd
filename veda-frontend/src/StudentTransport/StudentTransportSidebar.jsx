import { NavLink } from "react-router-dom";
import { FiTruck, FiMenu } from "react-icons/fi";

export default function StudentTransportSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white border-r z-30 transition-all ${
        isSidebarOpen ? "w-64" : "w-14"
      }`}
    >
      {/* TOGGLE */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-600 hover:text-black"
        >
          <FiMenu size={18} />
        </button>
      </div>

      {/* MENU */}
      <nav className="mt-2">
        <NavLink
          to="/student/transport"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 text-sm font-medium ${
              isActive
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <FiTruck size={18} />
          {isSidebarOpen && <span>Transport Route</span>}
        </NavLink>
      </nav>
    </div>
  );
}