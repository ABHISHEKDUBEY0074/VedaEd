import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiUser,
  FiUsers,
  FiBookOpen,
  FiMessageCircle,
  FiCalendar,
  FiBriefcase,
  FiClipboard,
  FiArrowLeft,
} from "react-icons/fi";

const ROLE_MODULES = {
  admin: [
    { name: "Admin SIS", path: "/admin", icon: <FiUsers /> },
    { name: "Communication", path: "/communication", icon: <FiMessageCircle /> },
    { name: "Admin Calendar", path: "/admincalendar", icon: <FiCalendar /> },
    { name: "HR Module", path: "/hr", icon: <FiBriefcase /> },
    { name: "Receptionist", path: "/receptionist", icon: <FiClipboard /> },
    { name: "Admission", path: "/admission", icon: <FiBookOpen /> },
  ],
  staff: [
    { name: "Teacher SIS", path: "/teacher", icon: <FiUser /> },
    { name: "Teacher Communication", path: "/teacher-communication", icon: <FiMessageCircle /> },
    { name: "Teacher Calendar", path: "/teacher/calendar", icon: <FiCalendar /> },
    { name: "HR Module", path: "/hr", icon: <FiBriefcase /> },
    { name: "Receptionist", path: "/receptionist", icon: <FiClipboard /> },
    { name: "Admission", path: "/admission", icon: <FiBookOpen /> },
  ],
  student: [
    { name: "Student SIS", path: "/student", icon: <FiUser /> },
    { name: "Student Communication", path: "/student/communication", icon: <FiMessageCircle /> },
    { name: "Student Calendar", path: "/student/calendar", icon: <FiCalendar /> },
  ],
  parent: [
    { name: "Parent SIS", path: "/parent", icon: <FiUsers /> },
    { name: "Parent Communication", path: "/parent/communication", icon: <FiMessageCircle /> },
  ],
};

export default function FrontPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("veda_role");
    if (!savedRole) {
      navigate("/");
    } else {
      setRole(savedRole);
    }
  }, [navigate]);

  const handleBackToLogin = () => {
    localStorage.removeItem("veda_role"); // logout
    navigate("/");
  };

  if (!role) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 relative">

      {/* BACK BUTTON */}
      <button
        onClick={handleBackToLogin}
        className="absolute top-6 left-6 flex items-center gap-2
                   bg-white px-4 py-2 rounded-lg shadow
                   hover:bg-gray-100 transition"
      >
        <FiArrowLeft />
        Back to Login
      </button>

      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        VedaSchool – {role.toUpperCase()} Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {ROLE_MODULES[role].map((mod) => (
          <div
            key={mod.name}
            onClick={() => navigate(mod.path)}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6
                       hover:shadow-xl hover:-translate-y-1 transition-all
                       border border-indigo-100"
          >
            <div className="text-3xl text-indigo-600 mb-4">
              {mod.icon}
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              {mod.name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Click to open
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
