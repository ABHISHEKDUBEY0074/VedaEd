import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiShield,
  FiUsers,
  FiUser,
  FiBook,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

const roles = [
  { key: "admin", label: "Admin", icon: <FiShield /> },
  { key: "staff", label: "Staff", icon: <FiUsers /> },
  { key: "student", label: "Student", icon: <FiBook /> },
  { key: "parent", label: "Parent", icon: <FiUser /> },
];

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // TEMP LOGIN (NO AUTH)
    setTimeout(() => {
      localStorage.setItem("veda_role", selectedRole);

      if (selectedRole === "admin") navigate("/admin-front");
      if (selectedRole === "staff") navigate("/staff-front");
      if (selectedRole === "student") navigate("/student-front");
      if (selectedRole === "parent") navigate("/parent-front");

      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ================= LEFT BRAND ================= */}
      <div className="hidden lg:flex flex-col justify-center px-16
                      bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-700
                      text-white">
        <h1 className="text-4xl font-extrabold mb-4">
          VedaSchool
        </h1>

        <p className="text-lg text-indigo-100 mb-8 max-w-md">
          A complete digital ecosystem for modern schools —
          administration, academics, communication & growth.
        </p>

        <div className="space-y-4 text-indigo-100">
          {[
            "Admin, Teacher, Student & Parent Dashboards",
            "Integrated Communication & Calendar",
            "Secure, Scalable & Cloud Ready",
          ].map((text) => (
            <div key={text} className="flex items-center gap-3">
              <FiCheckCircle className="text-xl text-white" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-sm text-indigo-200">
          © {new Date().getFullYear()} VedaSchool
        </div>
      </div>

      {/* ================= RIGHT LOGIN ================= */}
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-2xl
                     shadow-xl p-8"
        >
          {/* HEADER */}
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-extrabold text-indigo-700">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Login to your dashboard
            </p>
          </div>

          {/* ROLE SELECT */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {roles.map((role) => (
              <button
                type="button"
                key={role.key}
                onClick={() => setSelectedRole(role.key)}
                className={`
                  border rounded-xl p-4 text-center transition-all
                  ${
                    selectedRole === role.key
                      ? "border-indigo-600 bg-indigo-50 scale-105 shadow-sm"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <div
                  className={`text-2xl mb-2 mx-auto
                    ${
                      selectedRole === role.key
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }
                  `}
                >
                  {role.icon}
                </div>
                <p className="text-sm font-semibold">
                  {role.label}
                </p>
              </button>
            ))}
          </div>

          {/* INPUTS (DUMMY) */}
          <div className="space-y-3">
            <input
              type="text"
              defaultValue="demo@veda"
              placeholder="Username"
              className="w-full rounded-lg border px-3 py-2
                         focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="password"
              defaultValue="123456"
              placeholder="Password"
              className="w-full rounded-lg border px-3 py-2
                         focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2
                       bg-indigo-600 hover:bg-indigo-700
                       text-white py-2.5 rounded-lg font-semibold
                       transition disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
            {!loading && <FiArrowRight />}
          </button>

          <p className="text-xs text-gray-400 text-center mt-5">
            Secure login • Role-based access
          </p>
        </form>
      </div>
    </div>
  );
}
