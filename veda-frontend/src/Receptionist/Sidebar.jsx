import { NavLink } from "react-router-dom";
import { FiUserPlus, FiBookOpen, FiSettings, FiUsers, FiVideo } from "react-icons/fi";

export default function ReceptionistSidebar({ searchQuery }) {
  const menuItems = [
    { to: "/receptionist/admission-enquiry", icon: <FiUserPlus size={20} />, label: "Admission Enquiry" },
    { to: "/receptionist/visitor-book", icon: <FiBookOpen size={20} />, label: "Visitor Book" },
    { to: "/receptionist/setup-front-office", icon: <FiSettings size={20} />, label: "Setup Front Office" },
    { to: "/receptionist/student-details", icon: <FiUsers size={20} />, label: "Student Details" },
    { to: "/receptionist/zoom-live-classes", icon: <FiVideo size={20} />, label: "Zoom Live Classes" },
  ];

  return (
    <div className="w-64 bg-white shadow h-full flex flex-col">
      <div className="p-4 font-bold text-lg">Front Office Management</div>

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
