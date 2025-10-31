import { NavLink } from "react-router-dom";
import { FiHome, FiUserPlus, FiClipboard, FiFileText, FiList, FiBookOpen, FiDollarSign } from "react-icons/fi";

export default function AdmissionSidebar({ searchQuery }) {
  const menuItems = [
    { to: "/admission", icon: <FiHome size={18} />, label: "Dashboard" },
    { to: "/admission/admission-enquiry", icon: <FiUserPlus size={18} />, label: "Admission Enquiry" },
    { to: "/admission/entrance-list", icon: <FiClipboard size={18} />, label: "Entrance List" },
    { to: "/admission/interview-list", icon: <FiFileText size={18} />, label: "Interview List" },
    { to: "/admission/admission-form", icon: <FiList size={18} />, label: "Admission Form" },
    { to: "/admission/Document-Verification", icon: <FiBookOpen size={18} />, label: "Document Verification" },
    { to: "/admission/registration-fees", icon: <FiDollarSign size={18} />, label: "Registration Fees" },
  ];

  return (
    <div className="w-60 bg-white border-r shadow-md p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Admission Module</h2>
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
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
