import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function TTimetable() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
        <p className="text-gray-500 text-sm mb-2">Timetable &gt;</p>
<h2 className="text-2xl font-bold mb-6">Timetable</h2>
  <div className="bg-gray-200 p-6 rounded-lg shadow-sm border border-gray-100">

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => navigate("/teacher/timetable/my")}
          className={`pb-2 ${
            currentPath.includes("/my")
              ? "text-blue-600 font-semibold border-b-2 border-blue-600"
    : "text-gray-600"
          }`}
        >
          My Timetable
        </button>
        <button
          onClick={() => navigate("/teacher/timetable/class")}
          className={`pb-2 ${
            currentPath.includes("/class")
               ? "text-blue-600 font-semibold border-b-2 border-blue-600"
    : "text-gray-600"
          }`}
        >
          Class Timetable
        </button>
      </div>

      {/* Render active tab */}
      <Outlet />
    </div>
     </div>
  );
}
