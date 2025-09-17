import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function TTimetable() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => navigate("/teacher/timetable/my")}
          className={`pb-2 ${
            currentPath.includes("/my")
              ? "font-semibold text-blue-600"
              : "text-gray-600"
          }`}
        >
          My Timetable
        </button>
        <button
          onClick={() => navigate("/teacher/timetable/class")}
          className={`pb-2 ${
            currentPath.includes("/class")
              ? "font-semibold text-blue-600"
              : "text-gray-600"
          }`}
        >
          Class Timetable
        </button>
      </div>

      {/* Render active tab */}
      <Outlet />
    </div>
  );
}
