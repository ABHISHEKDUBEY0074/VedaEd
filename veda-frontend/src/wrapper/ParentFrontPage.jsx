import { useNavigate } from "react-router-dom";
import { FiUsers, FiMessageCircle, FiCalendar, FiBriefcase, FiClipboard, FiBookOpen, FiArrowLeft } from "react-icons/fi";

const MODULES = [
  { name: "Parent SIS", path: "/parent" },
  { name: "Parent Communication", path: "/parent/communication" },
];


export default function AdminFrontPage() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("veda_role");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 relative">
      <button onClick={logout} className="absolute top-6 left-6 bg-white px-4 py-2 rounded shadow flex gap-2">
        <FiArrowLeft /> Logout
      </button>

      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700">
        Parent Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {MODULES.map(m => (
          <div
            key={m.name}
            onClick={() => navigate(m.path)}
            className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-xl transition"
          >
            <div className="text-3xl text-indigo-600 mb-3">{m.icon}</div>
            <h3 className="font-semibold">{m.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
