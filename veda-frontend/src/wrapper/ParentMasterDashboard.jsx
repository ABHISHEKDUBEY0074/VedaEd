import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import {
  FiUsers,
  FiClipboard,
  FiCalendar,
  FiDollarSign,
  FiAlertCircle,
  FiBookOpen,
  FiActivity,
} from "react-icons/fi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ================= DUMMY DATA ================= */

const ATTENDANCE_DATA = [
  { month: "Jan", value: 90 },
  { month: "Feb", value: 87 },
  { month: "Mar", value: 92 },
];

const SUBJECT_PROGRESS = [
  { name: "Maths", value: 82 },
  { name: "Science", value: 78 },
  { name: "English", value: 88 },
];

const COLORS = ["#6366F1", "#22C55E", "#F59E0B"];

/* ================= DASHBOARD ================= */

export default function ParentMasterDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user._id) {
          const res = await axios.get(`${config.API_BASE_URL}/parents/${user._id}/dashboard-stats`);
          if (res.data.success) {
            setStats(res.data.stats);
          }
        }
      } catch (err) {
        console.error("Error fetching parent master stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading Parent Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Children" value={stats?.childrenCount || 0} icon={<FiUsers />} />
        <Stat title="Attendance" value={`${stats?.attendanceAverage || 0}%`} icon={<FiActivity />} />
        <Stat title="Pending Fees" value={`₹${(stats?.pendingFees || 0).toLocaleString()}`} icon={<FiDollarSign />} />
        <Stat title="Complaints" value="2 Open" icon={<FiAlertCircle />} />
      </div>

      {/* GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance */}
        <Card title="Monthly Attendance (%)">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={ATTENDANCE_DATA}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Academic Performance */}
        <Card title="Subject Performance">
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={SUBJECT_PROGRESS} dataKey="value" outerRadius={80}>
                  {SUBJECT_PROGRESS.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ACADEMICS + FEES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Academic Summary">
          <List title="Overall Grade" meta="A" />
          <List title="PTA Status" meta={stats?.upcomingPTA || "No upcoming PTM"} />
        </Card>

        <Card title="Fees Status">
          <List title="Collected Fees" meta={`₹${(stats?.totalFees || 0).toLocaleString()}`} />
          <List title="Pending" meta={`₹${(stats?.pendingFees || 0).toLocaleString()}`} />
        </Card>

        <Card title="Fee Notices">
          <List title="Final Fee Reminder" meta="Due this week" />
          <List title="Late Fee Policy Update" meta="View details" />
        </Card>
      </div>

      {/* EVENTS + COMPLAINTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Upcoming Events">
          <List title="PTM Meeting" meta="22 Feb" />
          <List title="Unit Test" meta="26 Feb" />
          <List title="Annual Day" meta="1 March" />
        </Card>

        <Card title="Complaints / Queries">
          <List title="Bus Route Delay" meta="Open · Submitted 10 Feb" />
          <List title="Homework Clarification" meta="Resolved · 5 Feb" />
        </Card>
      </div>

      {/* NOTICES */}
      <Card title="School Notices">
        <List title="Exam Schedule Released" meta="View PDF" />
        <List title="Holiday Announcement" meta="2 March" />
        <List title="Updated Uniform Guidelines" meta="Read notice" />
      </Card>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Stat = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
    <div className="text-indigo-600 text-xl">{icon}</div>
    <div>
      <div className="font-bold">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-4 space-y-3">
    <h2 className="font-semibold">{title}</h2>
    {children}
  </div>
);

const List = ({ title, meta }) => (
  <div className="border-b last:border-none pb-2">
    <div className="font-medium">{title}</div>
    <div className="text-xs text-gray-400">{meta}</div>
  </div>
);
