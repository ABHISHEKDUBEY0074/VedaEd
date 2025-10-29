import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiFileText,
  FiList,
  FiUserCheck,
  FiEdit,
  FiUsers,
  FiCreditCard,
} from "react-icons/fi";

export default function Sidebar() {
  const menuItems = [
    { name: "Admission Enquiry", path: "admission-enquiry", icon: <FiFileText /> },
    { name: "Entrance List", path: "entrance-list", icon: <FiList /> },
    { name: "Interview List", path: "interview-list", icon: <FiUserCheck /> },
    { name: "Admission Form", path: "admission-form", icon: <FiEdit /> },
    { name: "Vacant Seats", path: "vacant-seats", icon: <FiUsers /> },
    { name: "Registration Fees", path: "registration-fees", icon: <FiCreditCard /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Admission Module</h2>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition ${
                isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
