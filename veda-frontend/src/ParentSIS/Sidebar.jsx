import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiClipboard,
  FiCalendar,
  FiAward,
  FiUser,
  FiBook,
  FiDollarSign,
  FiMessageCircle,
} from "react-icons/fi";

export default function ParentSidebar({ searchQuery }) {
  const menuItems = [
    { to: "/parent", icon: <FiHome size={20} />, label: "Home", end: true },
    {
      to: "/parent/classes",
      icon: <FiBookOpen size={20} />,
      label: "My Child's Classes",
    },
    {
      to: "/parent/curriculum",
      icon: <FiBook size={20} />,
      label: "Curriculum",
    },
    {
      to: "/parent/timetable",
      icon: <FiCalendar size={20} />,
      label: "Timetable",
    },
    {
      to: "/parent/attendance",
      icon: <FiCalendar size={20} />,
      label: "Attendance",
    },
    {
      to: "/parent/assignments",
      icon: <FiClipboard size={20} />,
      label: "Assignments",
    },
    { to: "/parent/exams", icon: <FiAward size={20} />, label: "Exams" },
    { to: "/parent/fees", icon: <FiDollarSign size={20} />, label: "Fees" },
    {
      to: "/parent/communication",
      icon: <FiMessageCircle size={20} />,
      label: "Communication",
    },
    { to: "/parent/profile", icon: <FiUser size={20} />, label: "Profile" },
  ];

  return (
    <div className="w-64 bg-white shadow h-full flex flex-col">
      <div className="p-4 font-bold text-lg">Parent SIS</div>

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
