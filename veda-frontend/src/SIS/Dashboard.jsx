import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  // API state
  const [dashboardStats, setDashboardStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    other: 0,
  });
  const [studentApiData, setStudentApiData] = useState([]);
  const [attendanceApiData, setAttendanceApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const dashboardRes = await axios.get(
          "http://localhost:5000/api/dashboard/stats"
        );
        setDashboardStats(dashboardRes.data);

        // Fetch student stats
        const studentRes = await axios.get(
          "http://localhost:5000/api/students/stats"
        );
        if (studentRes.data.success) {
          setStudentApiData(studentRes.data.stats.studentsByClass || []);
        }

        // Fetch attendance stats
        const attendanceRes = await axios.get(
          "http://localhost:5000/api/attendance/weekly"
        );
        if (attendanceRes.data.success) {
          setAttendanceApiData(attendanceRes.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format student data for chart
  const studentData =
    studentApiData.length > 0
      ? studentApiData.map((item) => ({
          name: `Class ${item._id}`,
          value: item.count,
        }))
      : [
          { name: "Grade 1", value: 400 },
          { name: "Grade 2", value: 300 },
          { name: "Grade 3", value: 200 },
          { name: "Grade 4", value: 100 },
        ];

  const COLORS = ["#4F46E5", "#3B82F6", "#22C55E", "#FACC15"];

  // Use attendance data from API or fallback to hardcoded
  const attendanceData =
    attendanceApiData.length > 0
      ? attendanceApiData
      : [
          { day: "Mon", attendance: 85 },
          { day: "Tue", attendance: 90 },
          { day: "Wed", attendance: 75 },
          { day: "Thu", attendance: 95 },
          { day: "Fri", attendance: 80 },
        ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Link
          to="/students"
          className="bg-white p-4 rounded-xl shadow hover:shadow-md"
        >
          <h3 className="text-sm font-medium text-blue-600">Total Students</h3>
          <p className="text-2xl font-bold">
            {loading ? "..." : dashboardStats.students.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Active students</p>
        </Link>

        <Link
          to="/staff"
          className="bg-white p-4 rounded-xl shadow hover:shadow-md"
        >
          <h3 className="text-sm font-medium text-blue-600">Teachers</h3>
          <p className="text-2xl font-bold">
            {loading ? "..." : dashboardStats.teachers.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Total staff members</p>
        </Link>

        <Link
          to="/classes-schedules/classes"
          className="bg-white p-4 rounded-xl shadow hover:shadow-md"
        >
          <h3 className="text-sm font-medium text-blue-600">Classes</h3>
          <p className="text-2xl font-bold">
            {loading ? "..." : dashboardStats.classes.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Total classes</p>
        </Link>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-sm font-medium text-blue-600">Other</h3>
          <p className="text-2xl font-bold">
            {loading ? "..." : dashboardStats.other.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Additional metrics</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-sm font-medium text-blue-600">Other</h3>
          <p className="text-2xl font-bold">
            {loading ? "..." : dashboardStats.other.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Additional metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Key Metrics</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Students chart */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-medium">Students by Class</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {studentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-medium">Weekly Attendance</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="attendance"
                    fill="#3B82F6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Link
              to="/attendance/overview"
              className="text-sm text-blue-600 underline"
            >
              View Details
            </Link>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-medium">Today's Schedule</h3>
            <div className="h-40 flex items-center justify-center text-gray-400">
              [Schedule Data]
            </div>
            <Link
              to="/classes-schedules/timetable"
              className="text-sm text-blue-600 underline"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Teacher Class */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-medium">Teacher Class</h3>
        <div className="h-32 flex items-center justify-center text-gray-400">
          [Class Data]
        </div>
      </div>

      {/* Academic Reports + Other */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/reports"
          className="bg-white p-4 rounded-xl shadow hover:shadow-md"
        >
          <h3 className="font-medium">Academic Reports</h3>
          <p className="text-xs text-gray-500">
            Recent grade distributions and trends
          </p>
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
            <Link
              to="/students"
              className="px-3 py-2 border rounded-md hover:bg-gray-100"
            >
              Add New Student
            </Link>
            <Link
              to="/staff"
              className="px-3 py-2 border rounded-md hover:bg-gray-100"
            >
              Add New Staff
            </Link>
            <Link
              to="/classes-schedules"
              className="px-3 py-2 border rounded-md hover:bg-gray-100"
            >
              Create Schedule
            </Link>
          </div>
        </div>

        {/* Calendar + Notifications */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-medium">Class Calendar</h3>
            <div className="h-40 flex items-center justify-center text-gray-400">
              [Calendar]
            </div>
            <Link
              to="/classes-schedules"
              className="text-sm text-blue-600 underline"
            >
              Manage Class
            </Link>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-medium">Recent Notifications</h3>
            <ul className="text-sm space-y-2 mt-2">
              <li className="bg-blue-50 px-3 py-2 rounded">
                📅 Parent-Teacher Meeting - Tomorrow at 10:00 AM
              </li>
              <li className="bg-blue-50 px-3 py-2 rounded">
                💰 Fee Payment Due - 3 students pending
              </li>
              <li className="bg-blue-50 px-3 py-2 rounded">
                📊 Exam Results Published - Grade 10 results available
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
