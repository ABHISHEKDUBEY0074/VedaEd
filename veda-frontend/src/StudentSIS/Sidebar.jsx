import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiClipboard,
  FiCalendar,
  FiAward,
  FiUser,
} from "react-icons/fi";

export default function StudentSidebar({ searchQuery }) {
  const menuItems = [
    { to: "/student", icon: <FiHome size={20} />, label: "Home", end: true },
    { to: "/student/classes", icon: <FiBookOpen size={20} />, label: "My Classes" },
    { to: "/student/timetable", icon: <FiCalendar size={20} />, label: "Timetable" },
    { to: "/student/attendance", icon: <FiCalendar size={20} />, label: "Attendance" }, // ✅ नया जोड़ा
    { to: "/student/assignments", icon: <FiClipboard size={20} />, label: "Assignments" },
    { to: "/student/exams", icon: <FiAward size={20} />, label: "Exams" },
    { to: "/student/profile", icon: <FiUser size={20} />, label: "Profile" },
  ];

  return (
    <div className="w-64 bg-white shadow h-full flex flex-col">
      <div className="p-4 font-bold text-lg">Student SIS</div>

      <nav className="flex-1 px-2 space-y-1 text-gray-700">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
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
