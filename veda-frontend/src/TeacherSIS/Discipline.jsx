import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiShield,
  FiUsers,
  FiAlertTriangle,
  FiClock,
  FiSmile,
  FiPhone,
  FiMail,
  FiExternalLink,
  FiSend,
} from "react-icons/fi";

const summaryCards = [
  {
    label: "Open Cases",
    value: 6,
    icon: <FiAlertTriangle className="text-red-500" />,
    bg: "bg-red-50",
  },
  {
    label: "Follow-ups due",
    value: 3,
    icon: <FiClock className="text-yellow-500" />,
    bg: "bg-yellow-50",
  },
  {
    label: "Escalations",
    value: 1,
    icon: <FiUsers className="text-purple-500" />,
    bg: "bg-purple-50",
  },
  {
    label: "Positive recognitions",
    value: 5,
    icon: <FiSmile className="text-green-500" />,
    bg: "bg-green-50",
  },
];

const disciplineActivity = [
  { name: "Rohan Patel", incidents: 3, recognition: 1 },
  { name: "Sanya Kapoor", incidents: 1, recognition: 2 },
  { name: "Arjun Singh", incidents: 2, recognition: 0 },
  { name: "Nikita Shah", incidents: 1, recognition: 1 },
  { name: "Dev Khurana", incidents: 2, recognition: 0 },
  { name: "Advika Rao", incidents: 0, recognition: 3 },
];

const incidentLogs = [
  {
    student: "Rohan Patel • 8A",
    incident: "Classroom Disruption",
    date: "18 Sep 2025",
    action: "Parent call scheduled",
    status: "Pending Review",
    severity: "High",
  },
  {
    student: "Sanya Kapoor • 7B",
    incident: "Homework Non-compliance",
    date: "17 Sep 2025",
    action: "Shared study plan",
    status: "Resolved",
    severity: "Low",
  },
  {
    student: "Arjun Singh • 8C",
    incident: "Peer Conflict",
    date: "16 Sep 2025",
    action: "Counsellor session",
    status: "Under Observation",
    severity: "Medium",
  },
];

const followups = [
  {
    title: "Parent check-in • Rohan Patel",
    date: "19 Sep 2025 • 04:30 PM",
    detail: "With Class Teacher, Parent",
  },
  {
    title: "Restorative circle • Grade 7B",
    date: "21 Sep 2025 • 09:00 AM",
    detail: "With Counsellor, Students",
  },
  {
    title: "Behaviour review • Arjun Singh",
    date: "23 Sep 2025 • 01:15 PM",
    detail: "With Counsellor, House Mentor",
  },
];

const tracker = [
  {
    student: "Nikita Shah",
    className: "8B",
    incident: "Late submission pattern",
    severity: "Low",
    status: "Monitoring",
    action: "Shared tracker template",
  },
  {
    student: "Dev Khurana",
    className: "7A",
    incident: "Repeated dress code violations",
    severity: "Medium",
    status: "Open",
    action: "Detention served",
  },
  {
    student: "Ishita Tyagi",
    className: "8C",
    incident: "Peer bullying report",
    severity: "High",
    status: "Escalated",
    action: "Counsellor assigned",
  },
  {
    student: "Tanish Mehra",
    className: "7B",
    incident: "Incomplete assignments",
    severity: "Low",
    status: "Resolved",
    action: "Parent email sent",
  },
];

const escalationTimeline = [
  {
    title: "Teacher Intervention",
    detail: "Initial counselling and classroom strategy shared.",
    status: "Completed",
  },
  {
    title: "Parent Collaboration",
    detail: "Parent call booked to co-create action items.",
    status: "Scheduled",
  },
  {
    title: "Counsellor Review",
    detail: "Schedule counselling session if no improvement.",
    status: "Pending",
  },
];

const recognition = [
  {
    name: "Meera Desai",
    detail: "Consistent leadership in morning assemblies",
    date: "18 Sep 2025",
  },
  {
    name: "Kabir Mehta",
    detail: "Resolved transport dispute responsibly",
    date: "17 Sep 2025",
  },
  {
    name: "Advika Rao",
    detail: "Initiated peer tutoring for math support",
    date: "16 Sep 2025",
  },
];

const directory = [
  {
    title: "Discipline Lead",
    name: "Ms. Garima Yadav",
    contact: "garima.y@veda.edu",
    icon: <FiMail />,
  },
  {
    title: "Counsellor Desk",
    name: "+91 98451 11345",
    contact: "Daily • 9 AM - 4 PM",
    icon: <FiPhone />,
  },
  {
    title: "House Mentor",
    name: "Mr. Ishan Verma",
    contact: "teams://house-mentor",
    icon: <FiExternalLink />,
  },
];

const complaintQueue = [
  {
    student: "Rohan Patel",
    date: "18 Sep 2025",
    detail: "Repeated classroom disruption during lab hours.",
    severity: "High",
  },
  {
    student: "Dev Khurana",
    date: "17 Sep 2025",
    detail: "Dress code non-compliance despite counselling.",
    severity: "Medium",
  },
];

export default function TeacherDiscipline() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <header>
        <p className="text-sm text-gray-500">Teacher &gt; Discipline</p>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FiShield /> Faculty Discipline Center
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor incidents, follow restorative actions, and highlight
              positive behaviours for your cohort.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100">
              Log Incident
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Export Summary
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl p-5 border border-gray-100 shadow-sm ${card.bg}`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">{card.label}</div>
              {card.icon}
            </div>
            <p className="text-3xl font-semibold text-gray-900 mt-3">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">
              Student Discipline Activity
            </h3>
            <span className="text-xs text-gray-400">
              Mirrors Admin &gt; Activities snapshot
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={disciplineActivity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="incidents"
                stackId="a"
                fill="#4673FF"
                radius={[4, 4, 0, 0]}
                name="Incidents"
              />
              <Bar
                dataKey="recognition"
                stackId="a"
                fill="#78E7B2"
                radius={[4, 4, 0, 0]}
                name="Recognitions"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                Recent Incident Log
              </h3>
              <span className="text-xs text-gray-500">3 active cases</span>
            </div>
            <div className="space-y-3">
              {incidentLogs.map((log) => (
                <div
                  key={log.student}
                  className="border border-gray-100 rounded-xl p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800 text-sm">
                      {log.student}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {log.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{log.incident}</p>
                  <p className="text-xs text-gray-400 mt-1">{log.date}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Next action: {log.action}
                  </p>
                  <span className="text-xs text-blue-600 font-medium">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                Scheduled Follow-ups
              </h3>
              <span className="text-xs text-gray-500">Weekly</span>
            </div>
            <div className="space-y-3">
              {followups.map((item) => (
                <div
                  key={item.title}
                  className="border border-gray-100 rounded-xl p-3"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Discipline Tracker</h3>
          <button className="text-sm text-blue-600 hover:underline">
            View archive
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2">Student</th>
                <th>Class</th>
                <th>Incident</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Last Action</th>
              </tr>
            </thead>
            <tbody>
              {tracker.map((row) => (
                <tr
                  key={row.student}
                  className="border-t border-gray-100 text-gray-700"
                >
                  <td className="py-3 font-semibold text-gray-900">
                    {row.student}
                  </td>
                  <td>{row.className}</td>
                  <td>{row.incident}</td>
                  <td>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {row.severity}
                    </span>
                  </td>
                  <td>
                    <span className="text-blue-600 font-medium">
                      {row.status}
                    </span>
                  </td>
                  <td>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-semibold text-gray-800">Escalation Timeline</h3>
          {escalationTimeline.map((item) => (
            <div
              key={item.title}
              className="p-3 border border-gray-100 rounded-xl"
            >
              <p className="font-semibold text-gray-800 text-sm">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
              <span className="text-xs text-blue-600 font-medium">
                {item.status}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-semibold text-gray-800">Positive Recognition</h3>
          {recognition.map((item) => (
            <div
              key={item.name}
              className="p-3 border border-gray-100 rounded-xl"
            >
              <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
              <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-semibold text-gray-800">Support Directory</h3>
          {directory.map((item) => (
            <div
              key={item.title}
              className="p-3 border border-gray-100 rounded-xl"
            >
              <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                {item.icon}
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">{item.name}</p>
              <span className="text-xs text-gray-400">{item.contact}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">
            Raise a Complaint
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Student
              </label>
              <input
                type="text"
                placeholder="e.g. Rohan Patel"
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Severity
              </label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option>Medium</option>
                <option>Low</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Concern Details
              </label>
              <textarea
                rows={3}
                placeholder="Describe the behaviour or request support..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <FiSend />
              Submit Complaint
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Complaint Queue</h3>
          <div className="space-y-3">
            {complaintQueue.map((item) => (
              <div
                key={item.student}
                className="p-3 border border-gray-100 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">{item.student}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                    {item.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                <p className="text-sm text-gray-600 mt-2">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
