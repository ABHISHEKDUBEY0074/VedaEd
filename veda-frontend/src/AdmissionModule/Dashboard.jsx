import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiClock,
  FiFileText,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiBookOpen,
} from "react-icons/fi";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function AdmissionDashboard() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("6months");

  /* ===================== STATS ===================== */
  const stats = [
    {
      title: "Admission Enquiries",
      value: 320,
      icon: <FiBookOpen size={20} />,
      color: "border-indigo-500",
    },
    {
      title: "Total Applications",
      value: 245,
      icon: <FiFileText size={20} />,
      color: "border-blue-500",
    },
    {
      title: "Selected Students",
      value: 150,
      icon: <FiUserCheck size={20} />,
      color: "border-green-500",
    },
    {
      title: "Documents Verified",
      value: 130,
      icon: <FiCheckCircle size={20} />,
      color: "border-emerald-500",
    },
    {
      title: "Entrance Qualified",
      value: 180,
      icon: <FiTrendingUp size={20} />,
      color: "border-purple-500",
    },
    {
      title: "Pending Applications",
      value: 85,
      icon: <FiClock size={20} />,
      color: "border-yellow-500",
    },
    {
      title: "Rejected",
      value: 40,
      icon: <FiAlertCircle size={20} />,
      color: "border-red-500",
    },
    {
      title: "Total Students",
      value: 540,
      icon: <FiUsers size={20} />,
      color: "border-pink-500",
    },
  ];

  /* ===================== MONTHLY DATA ===================== */
  const monthlyData = [
    { month: "Jan", enquiries: 40, applications: 30 },
    { month: "Feb", enquiries: 60, applications: 45 },
    { month: "Mar", enquiries: 75, applications: 60 },
    { month: "Apr", enquiries: 50, applications: 40 },
    { month: "May", enquiries: 90, applications: 75 },
    { month: "Jun", enquiries: 70, applications: 55 },
  ];

  /* ===================== PIE STATUS DATA ===================== */
  const statusData = [
    { name: "Selected", value: 150 },
    { name: "Pending", value: 85 },
    { name: "Rejected", value: 40 },
  ];
  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  /* ===================== CLASS VACANCY ===================== */
  const vacancyData = [
    { class: "6th", seats: 60, filled: 50 },
    { class: "7th", seats: 60, filled: 45 },
    { class: "8th", seats: 60, filled: 55 },
    { class: "9th", seats: 60, filled: 48 },
    { class: "10th", seats: 60, filled: 58 },
  ];

  /* ===================== RECENT APPLICATIONS ===================== */
  const applications = [
    { id: "APP001", name: "Rahul Sharma", class: "10th", status: "Selected" },
    { id: "APP002", name: "Ananya Verma", class: "9th", status: "Pending" },
    { id: "APP003", name: "Aman Singh", class: "8th", status: "Rejected" },
    { id: "APP004", name: "Priya Mehta", class: "7th", status: "Selected" },
  ];

  return (
    <div className="p-0 m-0 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
         
        </h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 1 Year</option>
        </select>
      </div>

      {/* ===================== STAT CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${item.color}`}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">
                  {item.value}
                </h2>
              </div>
              <div className="text-gray-400">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== CHART SECTION ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">
            Monthly Enquiries & Applications
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="enquiries" fill="#6366f1" />
                <Bar dataKey="applications" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold mb-4">Application Status</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ===================== CLASS VACANCY ===================== */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="font-semibold mb-4">Class-wise Seat Vacancy</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vacancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="seats" fill="#94a3b8" />
              <Bar dataKey="filled" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===================== APPLICATION TABLE ===================== */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="font-semibold mb-4">Application List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-3">ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3">{app.id}</td>
                  <td>{app.name}</td>
                  <td>{app.class}</td>
                  <td className="font-medium">{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
