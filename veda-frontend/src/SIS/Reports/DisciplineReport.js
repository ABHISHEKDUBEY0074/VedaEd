import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";

const ADMIN_DISCIPLINE_HELP = `Page Description: Give the Admin SIS team a live command center for behaviour incidents, escalations, recognitions, and stakeholder follow-ups.

1.1 Overview & Priority Cards

Use the KPI tiles to understand daily load—open cases, follow-ups, escalations, and positive recognitions.

Sections:
- Summary Cards: Admin-level totals across the institution
- Header Actions: Escalate to student services or export the current audit trail

1.2 Activity & Follow-ups

Charts and logs provide context before intervening.

Sections:
- Discipline Activity Chart: incidents vs recognitions per student
- Recent Incident Log: severity, next action, and status tags
- Scheduled Follow-ups: upcoming counsellor/parent syncs

1.3 Tracker & Timeline

Log new cases, edit records, or mark resolution.

Sections:
- Record Form: student, class, incident, severity, status, action, date
- Tracker Table: inline edit/delete with status chips
- Escalation Timeline: teacher, parent, counsellor stages

1.4 Recognition & Directory

Balance discipline with celebration and quick contacts.

Sections:
- Recognition Wall: recent shout-outs to broadcast culture wins
- Key Contacts: Discipline lead, counsellor, and escalation desk`;

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
    detail: "Class Teacher + Parent",
  },
  {
    title: "Restorative circle • Grade 7B",
    date: "21 Sep 2025 • 09:00 AM",
    detail: "Counsellor + Students",
  },
  {
    title: "Behaviour review • Arjun Singh",
    date: "23 Sep 2025 • 01:15 PM",
    detail: "Counsellor + House Mentor",
  },
];

const initialTracker = [
  {
    id: 1,
    student: "Nikita Shah",
    className: "8B",
    incident: "Late submission pattern",
    severity: "Low",
    status: "Monitoring",
    action: "Shared tracker template",
    date: "2025-01-15",
  },
  {
    id: 2,
    student: "Dev Khurana",
    className: "7A",
    incident: "Dress code violations",
    severity: "Medium",
    status: "Open",
    action: "Detention served",
    date: "2025-01-14",
  },
  {
    id: 3,
    student: "Ishita Tyagi",
    className: "8C",
    incident: "Peer bullying report",
    severity: "High",
    status: "Escalated",
    action: "Counsellor assigned",
    date: "2025-01-13",
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
    detail: "Consistent leadership in assemblies",
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
    title: "Escalation Desk",
    name: "teams://discipline-escalations",
    contact: "Escalation Workflow",
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

export default function DisciplineReport() {
  const [tracker, setTracker] = useState(initialTracker);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    student: "",
    className: "",
    incident: "",
    severity: "Low",
    status: "Open",
    action: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (record) => {
    setForm({
      student: record.student,
      className: record.className,
      incident: record.incident,
      severity: record.severity,
      status: record.status,
      action: record.action,
      date: record.date || new Date().toISOString().split("T")[0],
    });
    setEditingId(record.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this discipline record?")) return;
    setTracker((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    if (!form.student || !form.incident) {
      alert("Please enter student name and incident details.");
      return;
    }

    if (editingId) {
      setTracker((prev) =>
        prev.map((r) => (r.id === editingId ? { ...form, id: editingId } : r))
      );
    } else {
      setTracker((prev) => [{ ...form, id: Date.now() }, ...prev]);
    }

    setForm({
      student: "",
      className: "",
      incident: "",
      severity: "Low",
      status: "Open",
      action: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setForm({
      student: "",
      className: "",
      incident: "",
      severity: "Low",
      status: "Open",
      action: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <header>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FiShield /> Behaviour & Discipline Center
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track institution-wide incidents, approvals, and restorative workstreams.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <HelpInfo title="Discipline Help" description={ADMIN_DISCIPLINE_HELP} />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <FiSend /> Escalate Case
              </button>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                Export Summary
              </button>
            </div>
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
            <span className="text-xs text-gray-400">Live comparison</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={disciplineActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#f87171" name="Incidents" />
              <Bar dataKey="recognition" fill="#34d399" name="Recognitions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Scheduled Follow-ups</h3>
            <span className="text-xs text-gray-400">{followups.length} upcoming</span>
          </div>
          {followups.map((item) => (
            <div
              key={item.title}
              className="border border-gray-100 rounded-xl p-4 shadow-sm"
            >
              <p className="font-semibold text-gray-800">{item.title}</p>
              <p className="text-sm text-gray-500">{item.detail}</p>
              <p className="text-xs text-blue-600 mt-1">{item.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Incident Log</h3>
          <div className="space-y-4">
            {incidentLogs.map((log) => (
              <div
                key={log.student}
                className="border border-gray-100 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">{log.student}</p>
                  <span className="text-xs text-gray-500">{log.date}</span>
                </div>
                <p className="text-sm text-gray-600">{log.incident}</p>
                <p className="text-xs text-blue-600 mt-1">{log.action}</p>
                <div className="flex gap-2 mt-3">
                  <StatusBadge label={log.status} tone="blue" />
                  <StatusBadge label={log.severity} tone="red" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Escalation Timeline</h3>
          <div className="space-y-4">
            {escalationTimeline.map((step) => (
              <div key={step.title} className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
                  {step.title.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.detail}</p>
                  <StatusBadge label={step.status} tone="gray" className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Discipline Tracker</h3>
            <p className="text-xs text-gray-500">
              {tracker.length} records • inline edits supported
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm((prev) => !prev);
              if (!showForm) {
                setForm({
                  student: "",
                  className: "",
                  incident: "",
                  severity: "Low",
                  status: "Open",
                  action: "",
                  date: new Date().toISOString().split("T")[0],
                });
                setEditingId(null);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <FiPlus /> {showForm ? "Close Form" : "Add Record"}
          </button>
        </div>

        {showForm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-gray-100 rounded-xl p-4">
            <label className="text-sm text-gray-600">
              Student Name
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.student}
                onChange={(e) => setForm((p) => ({ ...p, student: e.target.value }))}
              />
            </label>
            <label className="text-sm text-gray-600">
              Class / Section
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.className}
                onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))}
              />
            </label>
            <label className="text-sm text-gray-600">
              Incident
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.incident}
                onChange={(e) => setForm((p) => ({ ...p, incident: e.target.value }))}
              />
            </label>
            <label className="text-sm text-gray-600">
              Severity
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.severity}
                onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
            <label className="text-sm text-gray-600">
              Status
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="Open">Open</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Escalated">Escalated</option>
                <option value="Resolved">Resolved</option>
              </select>
            </label>
            <label className="text-sm text-gray-600">
              Next Action
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.action}
                onChange={(e) => setForm((p) => ({ ...p, action: e.target.value }))}
              />
            </label>
            <label className="text-sm text-gray-600">
              Review Date
              <input
                type="date"
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg"
              >
                {editingId ? "Update" : "Save"} Record
              </button>
              {editingId && (
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Incident</th>
                <th className="p-3 text-left">Severity</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tracker.map((record) => (
                <tr key={record.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{record.student}</td>
                  <td className="p-3 text-gray-600">{record.className}</td>
                  <td className="p-3 text-gray-600">{record.incident}</td>
                  <td className="p-3">
                    <StatusBadge label={record.severity} tone="red" />
                  </td>
                  <td className="p-3">
                    <StatusBadge label={record.status} tone="blue" />
                  </td>
                  <td className="p-3 text-gray-600">{record.action}</td>
                  <td className="p-3 text-gray-500">{record.date}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800"
                      aria-label="Edit record"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="inline-flex items-center justify-center text-red-500 hover:text-red-700"
                      aria-label="Delete record"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Recognition Wall</h3>
          <div className="space-y-3">
            {recognition.map((item) => (
              <div key={item.name} className="border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.detail}</p>
                <p className="text-xs text-blue-600 mt-1">{item.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Key Contacts</h3>
          <div className="space-y-3">
            {directory.map((item) => (
              <div key={item.title} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 shadow-sm">
                <div className="text-blue-600 text-xl">{item.icon}</div>
                <div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.contact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Complaints Queue</h3>
          <div className="space-y-3">
            {complaintQueue.map((item) => (
              <div key={item.student} className="border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">{item.student}</p>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
                <p className="text-sm text-gray-600">{item.detail}</p>
                <StatusBadge label={item.severity} tone="red" className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ label, tone, className = "" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        tones[tone] || "bg-gray-100 text-gray-600"
      } ${className}`}
    >
      {label}
    </span>
  );
}

