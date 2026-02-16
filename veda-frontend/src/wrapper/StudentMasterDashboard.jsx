import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import {
  FiBookOpen,
  FiClipboard,
  FiAward,
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

const ATTENDANCE_DATA = [
  { month: "Jan", value: 92 },
  { month: "Feb", value: 88 },
  { month: "Mar", value: 94 },
];

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

export default function StudentMasterDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user._id) {
          const res = await axios.get(`${config.API_BASE_URL}/students/${user._id}/dashboard-stats`);
          if (res.data.success) {
            setStats(res.data.stats);
          }
        }
      } catch (err) {
        console.error("Error fetching student master stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const SUBJECT_PROGRESS = [
    { name: "Maths", value: 85 },
    { name: "Science", value: 78 },
    { name: "English", value: 90 },
  ];

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading Student Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Subjects" value="7" icon={<FiBookOpen />} />
        <Stat title="Assignments" value={`${stats?.assignments || 0} Total`} icon={<FiClipboard />} />
        <Stat title="Attendance" value={`${stats?.attendance || 0}%`} icon={<FiActivity />} />
        <Stat title="Exams" value={`${stats?.exams || 0} Upcoming`} icon={<FiAward />} />
      </div>

      {/* GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Graph */}
        <Card title="Monthly Attendance (%)">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={ATTENDANCE_DATA}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subject Progress */}
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

      {/* TIMETABLE + CALENDAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today Classes */}
        <Card title="Today's Classes">
          <List title="Maths" meta="09:00 – 09:45" />
          <List title="Science" meta="10:00 – 10:45" />
          <List title="English" meta="11:00 – 11:45" />
        </Card>

        {/* Assignments */}
        <Card title="Assignments">
          <List title="Algebra Worksheet" meta="Due Tomorrow" />
          <List title="Physics Notes" meta="Due in 2 days" />
          <List title="Essay Writing" meta="Due Friday" />
        </Card>

        {/* Mini Calendar */}
        <Card title="Upcoming Events">
          <List title="Unit Test" meta="20 Feb" />
          <List title="Sports Day" meta="25 Feb" />
          <List title="Holiday" meta="2 March" />
        </Card>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

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
  <div>
    <div className="font-medium">{title}</div>
    <div className="text-xs text-gray-400">{meta}</div>
  </div>
);
