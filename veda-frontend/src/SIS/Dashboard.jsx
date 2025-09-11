import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Link to="/students" className="bg-white p-4 rounded-xl shadow hover:shadow-md">
          <h3 className="text-sm font-medium text-blue-600">Total Students</h3>
          <p className="text-2xl font-bold">1,250</p>
          <p className="text-xs text-gray-500">some other details</p>
        </Link>

        <Link to="/staff" className="bg-white p-4 rounded-xl shadow hover:shadow-md">
          <h3 className="text-sm font-medium text-blue-600">Teachers</h3>
          <p className="text-2xl font-bold">64</p>
          <p className="text-xs text-gray-500">some other details</p>
        </Link>

        <Link to="/classes-schedules/classes" className="bg-white p-4 rounded-xl shadow hover:shadow-md">
          <h3 className="text-sm font-medium text-blue-600">Classes</h3>
          <p className="text-2xl font-bold">10</p>
          <p className="text-xs text-gray-500">some other details</p>
        </Link>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-sm font-medium text-blue-600">Other</h3>
          <p className="text-2xl font-bold">1234</p>
          <p className="text-xs text-gray-500">some other details</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-sm font-medium text-blue-600">Other</h3>
          <p className="text-2xl font-bold">1234</p>
          <p className="text-xs text-gray-500">some other details</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Key Metrics</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Students chart placeholder */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-medium">Students</h3>
            <div className="h-40 flex items-center justify-center text-gray-400">[Chart]</div>
          </div>

          {/* Attendance Overview */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-medium">Attendance Overview</h3>
            <div className="h-40 flex items-center justify-center text-gray-400">[Bar Graph]</div>
            <Link to="/attendance/overview" className="text-sm text-blue-600 underline">
              View Details
            </Link>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-medium">Today's Schedule</h3>
            <div className="h-40 flex items-center justify-center text-gray-400">[Schedule Data]</div>
            <Link to="/classes-schedules/timetable" className="text-sm text-blue-600 underline">
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Teacher Class */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-medium">Teacher Class</h3>
        <div className="h-32 flex items-center justify-center text-gray-400">[Class Data]</div>
      </div>

      {/* Academic Reports + Other */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/reports" className="bg-white p-4 rounded-xl shadow hover:shadow-md">
          <h3 className="font-medium">Academic Reports</h3>
          <p className="text-xs text-gray-500">Recent grade distributions and trends</p>
        </Link>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-medium">Other</h3>
          <p className="text-xs text-gray-500">Detail about card</p>
        </div>
      </div>

      {/* Quick Actions + Calendar + Notifications */}
      <div className="grid grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-xl shadow col-span-2">
          <h3 className="font-medium mb-3">Quick Actions</h3>
          <div className="flex gap-3">
            <Link to="/students" className="px-3 py-2 border rounded-md hover:bg-gray-100">Add New Student</Link>
            <Link to="/staff" className="px-3 py-2 border rounded-md hover:bg-gray-100">Add New Staff</Link>
            <Link to="/classes-schedules" className="px-3 py-2 border rounded-md hover:bg-gray-100">Create Schedule</Link>
          </div>
        </div>

        {/* Calendar + Notifications */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-medium">Class Calendar</h3>
            <div className="h-40 flex items-center justify-center text-gray-400">[Calendar]</div>
            <Link to="/classes-schedules" className="text-sm text-blue-600 underline">
              Manage Class
            </Link>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-medium">Recent Notifications</h3>
            <ul className="text-sm space-y-2 mt-2">
              <li className="bg-blue-50 px-3 py-2 rounded">📅 Parent-Teacher Meeting - Tomorrow at 10:00 AM</li>
              <li className="bg-blue-50 px-3 py-2 rounded">💰 Fee Payment Due - 3 students pending</li>
              <li className="bg-blue-50 px-3 py-2 rounded">📊 Exam Results Published - Grade 10 results available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
