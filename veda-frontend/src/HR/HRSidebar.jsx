import { NavLink } from "react-router-dom";
import { FiUsers, FiClock, FiDollarSign, FiCheckSquare } from "react-icons/fi";

export default function HRSidebar({ searchQuery }) {
  const menuItems = [
    { to: "/hr/staff-directory", icon: <FiUsers size={20} />, label: "Staff Directory", end: true },
    { to: "/hr/staff-attendance", icon: <FiClock size={20} />, label: "Staff Attendance" },
    { to: "/hr/payroll", icon: <FiDollarSign size={20} />, label: "Payroll" },
    { to: "/hr/approve-leave", icon: <FiCheckSquare size={20} />, label: "Approve Leave" },
  ];

  return (
    <div className="w-64 bg-white shadow h-full flex flex-col">
      <div className="p-4 font-bold text-lg">HR Management</div>

      <nav className="flex-1 px-2 space-y-1 text-gray-700">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition ${
                isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
