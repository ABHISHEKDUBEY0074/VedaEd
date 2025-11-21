import { NavLink, useLocation } from "react-router-dom";
import { FiFileText, FiMail, FiSend, FiMessageCircle } from "react-icons/fi";

export default function TeacherCommunicationSidebar() {
  const location = useLocation();
  
  const menuItems = [
    { to: "/teacher-communication/logs", icon: <FiFileText size={20} />, label: "Logs" },
    { to: "/teacher-communication/notices", icon: <FiMail size={20} />, label: "Notices" },
    { to: "/teacher-communication/messages", icon: <FiSend size={20} />, label: "Messages" },
    { to: "/teacher-communication/complaints", icon: <FiMessageCircle size={20} />, label: "Complaints" },
  ];

  return (
    <div className="w-64 bg-white shadow h-full flex flex-col">
      <div className="p-4 font-bold text-lg">Communication Teacher</div>
      <nav className="flex-1 px-2 space-y-1 text-gray-700">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.to || 
                          (item.to !== "/teacher-communication/logs" && location.pathname.startsWith(item.to));
          
          return (
            <NavLink
              key={idx}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
                isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
