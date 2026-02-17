import { Link } from "react-router-dom";
import {
  FiUsers,
  FiClock,
  FiDollarSign,
  FiUserPlus,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

export default function HRDashboard() {

  /* ===================== MAIN STATS ===================== */
  const stats = [
    { title: "Total Staff", value: 124, icon: <FiUsers size={22} />, color: "border-blue-500" },
    { title: "Pending Leaves", value: 9, icon: <FiClock size={22} />, color: "border-yellow-500" },
    { title: "Payroll This Month", value: "₹12.4L", icon: <FiDollarSign size={22} />, color: "border-green-500" },
    { title: "New Hires", value: 6, icon: <FiUserPlus size={22} />, color: "border-purple-500" },
  ];

  /* ===================== ROLE CARDS ===================== */
  const roleStats = [
    { role: "Admin", count: 1 },
    { role: "Teacher", count: 45 },
    { role: "Accountant", count: 2 },
    { role: "Librarian", count: 1 },
    { role: "Receptionist", count: 2 },
    { role: "Support Staff", count: 8 },
  ];

  /* ===================== CHART DATA ===================== */
  const hiringData = [
    { month: "Jan", hires: 3 },
    { month: "Feb", hires: 4 },
    { month: "Mar", hires: 2 },
    { month: "Apr", hires: 5 },
    { month: "May", hires: 6 },
  ];

  const salaryTrend = [
    { month: "Apr", amount: 850000 },
    { month: "May", amount: 920000 },
    { month: "Jun", amount: 870000 },
    { month: "Jul", amount: 910000 },
    { month: "Aug", amount: 950000 },
  ];

  const attendanceData = [
    { name: "Present", value: 110 },
    { name: "Absent", value: 14 },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="space-y-8">

      {/* ===================== TOP STAT CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index}
            className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${item.color}`}>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <h2 className="text-2xl font-bold mt-1">{item.value}</h2>
              </div>
              <div className="text-gray-500">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== ANALYTICS SECTION ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Hiring Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FiTrendingUp /> Monthly Hiring Trend
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hiringData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hires" fill="#3b82f6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Donut */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Today Attendance</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={attendanceData}
                dataKey="value"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ===================== SALARY TREND ===================== */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4">Salary Expense Trend (Session 2025-26)</h3>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={salaryTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===================== ROLE COUNT GRID ===================== */}
      <div>
        <h3 className="font-semibold mb-4">Staff Overview</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {roleStats.map((role, index) => (
            <div key={index}
              className="bg-white p-5 rounded-xl shadow-sm text-center">
              <p className="text-gray-500 text-sm">{role.role}</p>
              <h2 className="text-2xl font-bold mt-2">{role.count}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== HR ACTIVITY ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Recent HR Activities</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>👤 New English Teacher hired</li>
            <li>📄 5 Leave requests approved</li>
            <li>💰 Payroll processed for February</li>
            <li>📋 Interview conducted</li>
            <li>🕒 Attendance updated</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Upcoming Events</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>📅 Staff Meeting - 18 Feb</li>
            <li>📅 Payroll Release - 28 Feb</li>
            <li>📅 Interview Round - 20 Feb</li>
            <li>📅 Annual Review - 25 Feb</li>
          </ul>
        </div>

      </div>

    </div>
  );
}
