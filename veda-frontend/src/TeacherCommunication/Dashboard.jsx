import { Link } from "react-router-dom";
import {
  FiMessageSquare,
  FiAlertCircle,
  FiBell,
  FiUsers,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TeacherCommunicationDashboard() {
  /* Dummy Data (Replace with API later) */
  const stats = [
    {
      title: "Total Messages",
      value: 128,
      icon: <FiMessageSquare size={22} />,
      color: "border-blue-500",
      link: "/teacher-communication/messages",
    },
    {
      title: "Complaints",
      value: 12,
      icon: <FiAlertCircle size={22} />,
      color: "border-red-500",
      link: "/teacher-communication/complaints",
    },
    {
      title: "Notices",
      value: 34,
      icon: <FiBell size={22} />,
      color: "border-green-500",
      link: "/teacher-communication/notices",
    },
    {
      title: "Parents Contacted",
      value: 89,
      icon: <FiUsers size={22} />,
      color: "border-purple-500",
      link: "/teacher-communication/logs",
    },
  ];

  const chartData = [
    { name: "Mon", messages: 20 },
    { name: "Tue", messages: 35 },
    { name: "Wed", messages: 28 },
    { name: "Thu", messages: 40 },
    { name: "Fri", messages: 22 },
  ];

  return (
    <div className="space-y-6">

      {/* 🔹 HEADER */}
     

      {/* 🔹 STAT CARDS */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((item, index) => (
          <Link to={item.link} key={index}>
            <div
              className={`bg-white p-5 rounded-lg shadow-sm border-l-4 ${item.color}
              hover:shadow-md transition cursor-pointer`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h2 className="text-2xl font-semibold">{item.value}</h2>
                </div>
                <div className="text-gray-600">{item.icon}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 🔹 CHART + RECENT ACTIVITY */}
      <div className="grid grid-cols-2 gap-4">

        {/* Weekly Messages Chart */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h3 className="text-md font-semibold mb-4">
            Weekly Messages Overview
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h3 className="text-md font-semibold mb-4">
            Recent Activity
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>📩 Message sent to Class 10A parents</li>
            <li>📢 Notice uploaded for PTM meeting</li>
            <li>⚠ Complaint resolved (Transport issue)</li>
            <li>📩 Homework reminder sent</li>
            <li>📢 Holiday announcement posted</li>
          </ul>
        </div>
      </div>

      {/* 🔹 QUICK ACCESS SECTION */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="text-md font-semibold mb-4">
          Quick Actions
        </h3>

        <div className="flex gap-4">
          <Link
            to="/teacher-communication/messages"
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          >
            Send Message
          </Link>

          <Link
            to="/teacher-communication/notices"
            className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
          >
            Create Notice
          </Link>

          <Link
            to="/teacher-communication/complaints"
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
          >
            View Complaints
          </Link>
        </div>
      </div>
    </div>
  );
}
