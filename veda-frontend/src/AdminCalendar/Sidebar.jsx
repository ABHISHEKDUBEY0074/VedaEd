import { NavLink } from "react-router-dom";
import { FiCalendar, FiList, FiClock } from "react-icons/fi";

export default function AdminCalendarSidebar() {
  const menuItems = [
    {
      to: "/admincalendar/annualcalendar",
      icon: <FiCalendar size={20} />,
      label: "Annual Calendar",
    },
    {
      to: "/admincalendar/eventtype",
      icon: <FiList size={20} />,
      label: "Event Type",
    },
    {
      to: "/admincalendar/timetablesetup",
      icon: <FiClock size={20} />,
      label: "Timetable Setup",
    },
  ];

  return (
    <div className="w-64 bg-white shadow h-full flex flex-col">
      <div className="p-4 font-bold text-lg border-b">Admin Calendar</div>

      <nav className="flex-1 px-2 py-3 space-y-1 text-gray-700">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
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
