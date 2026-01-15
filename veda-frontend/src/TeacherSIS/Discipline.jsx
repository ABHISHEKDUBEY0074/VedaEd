import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiX,
} from "react-icons/fi";
import * as XLSX from "xlsx";
import HelpInfo from "../components/HelpInfo";

/* ================= CLASS → SECTION → STUDENTS ================= */
const CLASS_DATA = {
  7: {
    A: ["Dev Khurana"],
    B: ["Tanish Mehra"],
  },
  8: {
    A: ["Rohan Patel"],
    B: ["Nikita Shah"],
    C: ["Ishita Tyagi", "Arjun Singh"],
  },
};

/* ================= INITIAL TRACKER ================= */
const initialTracker = [
  {
    id: 1,
    className: "8",
    section: "B",
    student: "Nikita Shah",
    incident: "Late submission pattern",
    severity: "Low",
    status: "Monitoring",
    action: "Shared tracker template",
    date: "2025-01-15",
  },
  {
    id: 2,
    className: "7",
    section: "A",
    student: "Dev Khurana",
    incident: "Repeated dress code violations",
    severity: "Medium",
    status: "Open",
    action: "Detention served",
    date: "2025-01-14",
  },
  {
    id: 3,
    className: "8",
    section: "C",
    student: "Ishita Tyagi",
    incident: "Peer bullying report",
    severity: "High",
    status: "Escalated",
    action: "Counsellor assigned",
    date: "2025-01-13",
  },
];

/* ================= SIDE DATA ================= */
const recognition = [
  {
    name: "Meera Desai",
    detail: "Consistent leadership in assemblies",
    date: "18 Sep 2025",
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
    contact: "9 AM – 4 PM",
    icon: <FiPhone />,
  },
];

/* ============================================================= */

export default function TeacherDiscipline() {
  const navigate = useNavigate();
  const rowRefs = useRef({});

  const [tracker, setTracker] = useState(initialTracker);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  /* -------- filters & search -------- */
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  /* -------- form -------- */
  const [form, setForm] = useState({
    className: "",
    section: "",
    student: "",
    incident: "",
    severity: "Low",
    status: "Open",
    action: "",
    date: new Date().toISOString().split("T")[0],
  });

  /* ================= DERIVED REAL DATA ================= */

  const filteredTracker = useMemo(() => {
    return tracker.filter((r) => {
      const matchSearch =
        r.student.toLowerCase().includes(search.toLowerCase()) ||
        r.incident.toLowerCase().includes(search.toLowerCase());

      const matchClass = filterClass
        ? r.className === filterClass
        : true;

      const matchStatus = filterStatus
        ? r.status === filterStatus
        : true;

      return matchSearch && matchClass && matchStatus;
    });
  }, [tracker, search, filterClass, filterStatus]);

  const summary = {
    open: tracker.filter((r) => r.status === "Open").length,
    followups: tracker.filter((r) => r.status === "Monitoring").length,
    escalations: tracker.filter((r) => r.status === "Escalated").length,
    recognitions: recognition.length,
  };

  const recentIncidents = tracker
    .filter((r) => r.status !== "Resolved")
    .slice(0, 3);

  const disciplineActivity = Object.values(
    tracker.reduce((acc, r) => {
      if (!acc[r.student]) {
        acc[r.student] = {
          name: r.student,
          incidents: 0,
          recognition: 0,
        };
      }
      acc[r.student].incidents += 1;
      return acc;
    }, {})
  );

  const complaintQueue = tracker.filter(
    (r) =>
      r.status === "Escalated" ||
      (r.severity === "High" && r.status !== "Resolved")
  );

  /* ================= ACTIONS ================= */

  const resetForm = () => {
    setForm({
      className: "",
      section: "",
      student: "",
      incident: "",
      severity: "Low",
      status: "Open",
      action: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.className || !form.section || !form.student || !form.incident) {
      alert("Please complete all required fields");
      return;
    }

    if (editingId) {
      setTracker((prev) =>
        prev.map((r) => (r.id === editingId ? { ...form, id: editingId } : r))
      );
    } else {
      setTracker((prev) => [{ ...form, id: Date.now() }, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setTracker((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Export Excel function
  const handleExportExcel = () => {
    const exportData = tracker.map((r) => ({
      Class: `${r.className}${r.section}`,
      Student: r.student,
      Incident: r.incident,
      Severity: r.severity,
      Status: r.status,
      Action: r.action,
      Date: r.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Discipline Records");

    XLSX.writeFile(workbook, "discipline-records.xlsx");
  };

  /* ================= UI ================= */

  return (
    <div className="p-0 min-h-screen ">
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Teacher</span>
        <span>&gt;</span>
        <span>Discipline</span>
      </div>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          Discipline Center
        </h2>
        <div className="flex mb-3 gap-2">
          <HelpInfo title="Discipline Help" description="Teacher discipline tracker" />
        
          <button
            onClick={() => navigate("/teacher-communication/complaints")}
            className="bg-blue-600 text-white px-2 py-1 rounded"
          >
             Raise Complaint
          </button>
        </div>
      </div>

      {/* Summary */}
           <div className="bg-white mb-3 border rounded-lg p-3 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4  gap-3">
        {[["Open Cases", summary.open, "bg-red-50", <FiAlertTriangle />],
          ["Follow-ups", summary.followups, "bg-yellow-50", <FiClock />],
          ["Escalations", summary.escalations, "bg-purple-50", <FiUsers />],
          ["Recognitions", summary.recognitions, "bg-green-50", <FiSmile />],
        ].map(([l, v, bg, icon]) => (
          <div key={l} className={`p-3 rounded-lg border ${bg}`}>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{l}</span>
              {icon}
            </div>
            <p className="text-xl font-bold">{v}</p>
          </div>
        ))}
      </div>
</div>
      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 mb-3 gap-3">
        <div className="bg-white border rounded-lg p-3">
          <h3 className="font-semibold mb-2">Student Discipline Activity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={disciplineActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#4673FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-lg p-3">
          <h3 className="font-semibold mb-2">Recent Incidents</h3>
          <div className="space-y-2">
            {recentIncidents.map((r) => (
              <div
                key={r.id}
                onClick={() =>
                  rowRefs.current[r.id]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }
                className="p-2 border rounded cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between">
                  <p className="font-semibold">{r.student}</p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs
                    ${
                      r.severity === "High"
                        ? "bg-red-100 text-red-700"
                        : r.severity === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {r.severity}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{r.incident}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tracker */}
     <div className="bg-white mb-3 border rounded-lg p-3 space-y-3">
  <div className="flex justify-between items-center">
    <h3 className="font-semibold">Discipline Tracker</h3>
    <div className="flex gap-2">
      <button
        onClick={handleExportExcel}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Export Excel
      </button>
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Add Record
      </button>
    </div>
  </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center border rounded px-2">
            <FiSearch className="text-gray-400" />
            <input
              placeholder="Search student / incident"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-2 py-1 outline-none"
            />
          </div>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Classes</option>
            {Object.keys(CLASS_DATA).map((c) => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Status</option>
            <option>Open</option>
            <option>Monitoring</option>
            <option>Resolved</option>
            <option>Escalated</option>
          </select>
        </div>

        {/* Table */}
    <div className="mt-4 overflow-x-auto">
    <table className="w-full text-sm border border-gray-100 rounded-lg overflow-hidden">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="py-2 px-3">Student</th>
          <th className="py-2 px-3">Class</th>
          <th className="py-2 px-3">Incident</th>
          <th className="py-2 px-3">Severity</th>
          <th className="py-2 px-3">Status</th>
          <th className="py-2 px-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredTracker.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="py-6 px-3 text-center text-gray-500"
            >
              No records found.
            </td>
          </tr>
        ) : (
          filteredTracker.map((r) => (
            <tr
              key={r.id}
              ref={(el) => (rowRefs.current[r.id] = el)}
              className="border-t hover:bg-blue-50/20"
            >
              <td className="py-2 px-3 font-medium text-gray-800">{r.student}</td>
              <td className="py-2 px-3 text-gray-600">
                {r.className}
                {r.section}
              </td>
              <td className="py-2 px-3 text-gray-600">{r.incident}</td>
              <td className="py-2 px-3 text-gray-600">{r.severity}</td>
              <td className="py-2 px-3 text-gray-600">{r.status}</td>
              <td className="py-2 px-3 text-center">
                <div className="flex items-center gap-3 justify-center text-gray-500">
                  <button
                    onClick={() => handleEdit(r)}
                    className="hover:text-blue-600"
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="hover:text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
        </div>
      </div>

      {/* Complaint Queue */}
      <div className="bg-white border rounded-lg mb-3 p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Complaint Queue</h3>
          <button
            onClick={() => navigate("/teacher-communication/complaints")}
            className="text-blue-600 flex items-center gap-1"
          >
            View All <FiExternalLink />
          </button>
        </div>
        <div className="space-y-2">
          {complaintQueue.map((c, i) => (
            <div
              key={`${c.student}-${i}`}
              className="border rounded p-2"
            >
              <div className="flex justify-between">
                <p className="font-semibold">{c.student}</p>
                <span className="text-xs bg-red-100 text-red-700 px-2 rounded">
                  {c.severity}
                </span>
              </div>
              <p className="text-sm text-gray-600">{c.incident}</p>
              <p className="text-xs text-gray-400">
                Class {c.className}
                {c.section}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================== ADD / EDIT FORM MODAL ================== */}
     {showForm && (
<div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-6 z-50 overflow-auto">
    <div className="bg-white rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] p-6 overflow-y-auto relative">
      <button
        onClick={resetForm}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
        aria-label="Close modal"
      >
        <FiX size={20} />
      </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Record" : "Add Record"}
            </h2>

            {/* Class Select */}
            <label className="block mb-2 font-semibold">
              Class <span className="text-red-600">*</span>
            </label>
            <select
              value={form.className}
              onChange={(e) => {
                setForm({
                  ...form,
                  className: e.target.value,
                  section: "",
                  student: "",
                });
              }}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="">Select Class</option>
              {Object.keys(CLASS_DATA).map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>

            {/* Section Select */}
            <label className="block mb-2 font-semibold">
              Section <span className="text-red-600">*</span>
            </label>
            <select
              value={form.section}
              onChange={(e) => {
                setForm({
                  ...form,
                  section: e.target.value,
                  student: "",
                });
              }}
              disabled={!form.className}
              className="w-full border rounded px-3 py-2 mb-4 disabled:bg-gray-100"
            >
              <option value="">Select Section</option>
              {form.className &&
                Object.keys(CLASS_DATA[form.className]).map((sec) => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
            </select>

            {/* Student Select */}
            <label className="block mb-2 font-semibold">
              Student <span className="text-red-600">*</span>
            </label>
            <select
              value={form.student}
              onChange={(e) =>
                setForm({ ...form, student: e.target.value })
              }
              disabled={!form.section}
              className="w-full border rounded px-3 py-2 mb-4 disabled:bg-gray-100"
            >
              <option value="">Select Student</option>
              {form.className &&
                form.section &&
                CLASS_DATA[form.className][form.section].map((stu) => (
                  <option key={stu} value={stu}>
                    {stu}
                  </option>
                ))}
            </select>

            {/* Incident */}
            <label className="block mb-2 font-semibold">
              Incident <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={3}
              value={form.incident}
              onChange={(e) =>
                setForm({ ...form, incident: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Describe the incident"
            />

            {/* Severity */}
            <label className="block mb-2 font-semibold">
              Severity
            </label>
            <select
              value={form.severity}
              onChange={(e) =>
                setForm({ ...form, severity: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            {/* Status */}
            <label className="block mb-2 font-semibold">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option>Open</option>
              <option>Monitoring</option>
              <option>Resolved</option>
              <option>Escalated</option>
            </select>

            {/* Action */}
            <label className="block mb-2 font-semibold">
              Action Taken
            </label>
            <textarea
              rows={2}
              value={form.action}
              onChange={(e) =>
                setForm({ ...form, action: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Describe any action taken"
            />

            {/* Date */}
            <label className="block mb-2 font-semibold">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-4"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
