import React, { useMemo, useState, useEffect } from "react";
import {
  FiBookOpen,
  FiTrendingUp,
  FiAlertTriangle,
  FiClipboard,
  FiCheckCircle,
  FiUploadCloud,
  FiDownload,
  FiPlus,
  FiEdit3,
  FiTrash2,
} from "react-icons/fi";
import HelpInfo from "../components/HelpInfo";

/**
 * TeacherGradebook (Discipline-style layout)
 * - Uses compact white cards with `p-3 rounded-lg shadow-sm border mb-4`
 * - Headings and subheadings are compact (text-sm / text-xs)
 * - Tables and forms follow the same spacing as the Discipline page
 *
 * Functionality preserved from the original Gradebook:
 * - Class cards, stats, assessment breakdown, pending actions
 * - Live performance log form + records table with add/edit/delete
 */

const GRADEBOOK_HELP = `Page Description: Track every class’s academic health, monitor alerts, and update marks from a single teacher-gradebook workspace.

1.1 Class Snapshot Cards
Switch between classes using the KPI cards at the top.

Sections:
- Average Score + Assessments: quick pulse of performance
- Pending Reviews & Topper: highlights who needs attention
- Focus Tag: shows the active skill or unit for that class

1.2 Performance & Alerts
Use the white panels to analyze grade distribution and tasks.

Sections:
- Recent Assessment Overview: weightage-wise progress bars
- Pending Actions: reminders for grading, publishing, and syncing data
- Student Performance Tracker: sortable table for score trends and completion rates

1.3 Live Performance Log
Add or edit student scores without leaving the page.
`;

const classSummaries = [
  {
    id: "cl-8a",
    className: "Grade 8 - Section A",
    avgScore: 86,
    assignments: 14,
    pendingReviews: 2,
    topper: "Aditi Rao",
    focus: "Algebra Applications",
    section: "A",
  },
  {
    id: "cl-8b",
    className: "Grade 8 - Section B",
    avgScore: 82,
    assignments: 13,
    pendingReviews: 1,
    topper: "Ishaan Verma",
    focus: "Fractions Lab",
    section: "B",
  },
  {
    id: "cl-7a",
    className: "Grade 7 - Section A",
    avgScore: 78,
    assignments: 11,
    pendingReviews: 4,
    topper: "Mira Shah",
    focus: "Geometry Basics",
    section: "A",
  },
];

const classMeta = {
  "cl-8a": {
    grade: "Grade 8",
    section: "A",
    subjects: ["Mathematics", "Science", "English", "Social Studies"],
  },
  "cl-8b": {
    grade: "Grade 8",
    section: "B",
    subjects: ["Mathematics", "Science", "English", "Computer Science"],
  },
  "cl-7a": {
    grade: "Grade 7",
    section: "A",
    subjects: ["Mathematics", "Science", "English", "History"],
  },
};

const assessmentBreakdown = [
  { component: "Quizzes", weight: 25, avg: 81 },
  { component: "Class Tests", weight: 35, avg: 79 },
  { component: "Projects", weight: 20, avg: 88 },
  { component: "Assignments", weight: 20, avg: 84 },
];

const pendingActions = [
  { id: "ac-1", title: "Review Lab Report - 8A", status: "Due Today" },
  { id: "ac-2", title: "Publish Quiz 4 Grades", status: "Due Tomorrow" },
  { id: "ac-3", title: "Sync Scores to Parent App", status: "Pending" },
];

const gradeTable = [
  {
    student: "Ananya Patel",
    className: "8A",
    lastScore: 94,
    trend: "+2",
    completion: 100,
  },
  {
    student: "Kabir Singh",
    className: "8A",
    lastScore: 72,
    trend: "-6",
    completion: 86,
  },
  {
    student: "Samaira Jain",
    className: "8B",
    lastScore: 88,
    trend: "+4",
    completion: 96,
  },
  {
    student: "Vivaan Narang",
    className: "7A",
    lastScore: 68,
    trend: "-3",
    completion: 74,
  },
  {
    student: "Ira Malhotra",
    className: "7A",
    lastScore: 90,
    trend: "+5",
    completion: 100,
  },
];

const seededPerformanceRecords = {
  "cl-8a": [
    {
      id: "8a-1",
      student: "Rahul Mehta",
      subject: "Mathematics",
      assessment: "Quiz 4",
      score: 42,
      total: 50,
      focusArea: "Algebra tiles",
      remarks: "Drop of 12% in last 2 assessments",
      lastUpdated: "2025-01-10T09:30:00Z",
    },
    {
      id: "8a-2",
      student: "Aditi Rao",
      subject: "Science",
      assessment: "Lab Report",
      score: 48,
      total: 50,
      focusArea: "Inheritance",
      remarks: "Excellent lab documentation",
      lastUpdated: "2025-01-12T12:15:00Z",
    },
  ],
  "cl-8b": [
    {
      id: "8b-1",
      student: "Ishaan Verma",
      subject: "English",
      assessment: "Reading Project",
      score: 44,
      total: 50,
      focusArea: "Inference",
      remarks: "Presentation scheduled tomorrow",
      lastUpdated: "2025-01-09T14:05:00Z",
    },
  ],
  "cl-7a": [
    {
      id: "7a-1",
      student: "Mira Shah",
      subject: "Mathematics",
      assessment: "Geometry Drill",
      score: 89,
      total: 100,
      focusArea: "Angles",
      remarks: "Ready for enrichment tasks",
      lastUpdated: "2025-01-11T08:00:00Z",
    },
  ],
};

const emptyRecord = (classId) => ({
  student: "",
  subject: classMeta[classId]?.subjects?.[0] || "",
  assessment: "",
  score: "",
  total: "",
  focusArea: "",
  remarks: "",
});

const computePercent = (score, total) => {
  const safeScore = Number(score);
  const safeTotal = Number(total) || 0;
  if (!safeTotal || Number.isNaN(safeScore)) return "0.0";
  return ((safeScore / safeTotal) * 100).toFixed(1);
};

export default function TeacherGradebook() {
  const [selectedClass, setSelectedClass] = useState("cl-8a");
  const [performanceRecords, setPerformanceRecords] = useState(
    seededPerformanceRecords
  );
  const [recordForm, setRecordForm] = useState(() => emptyRecord("cl-8a"));
  const [editingRecordId, setEditingRecordId] = useState(null);

  const currentClass = useMemo(
    () => classSummaries.find((cls) => cls.id === selectedClass),
    [selectedClass]
  );

  const selectedMeta = classMeta[selectedClass] || {
    grade: "",
    section: "",
    subjects: [],
  };
  const classRecords = performanceRecords[selectedClass] || [];

  useEffect(() => {
    setRecordForm(emptyRecord(selectedClass));
    setEditingRecordId(null);
  }, [selectedClass]);

  const handleRecordSave = () => {
    if (!recordForm.student.trim() || !recordForm.assessment.trim()) {
      alert("Student name and assessment title are required.");
      return;
    }
    if (!recordForm.subject) {
      alert("Pick a subject for this entry.");
      return;
    }
    if (recordForm.score === "" || recordForm.total === "") {
      alert("Enter both score and total marks.");
      return;
    }

    const payload = {
      ...recordForm,
      id: editingRecordId || `${selectedClass}-${Date.now()}`,
      score: Number(recordForm.score),
      total: Number(recordForm.total),
      lastUpdated: new Date().toISOString(),
    };

    setPerformanceRecords((prev) => {
      const existing = prev[selectedClass] || [];
      const nextList = editingRecordId
        ? existing.map((rec) => (rec.id === editingRecordId ? payload : rec))
        : [payload, ...existing];
      return { ...prev, [selectedClass]: nextList };
    });
    setRecordForm(emptyRecord(selectedClass));
    setEditingRecordId(null);
  };

  const handleRecordEdit = (record) => {
    setRecordForm({
      student: record.student,
      subject: record.subject,
      assessment: record.assessment,
      score: String(record.score),
      total: String(record.total),
      focusArea: record.focusArea || "",
      remarks: record.remarks || "",
    });
    setEditingRecordId(record.id);
  };

  const handleRecordDelete = (recordId) => {
    if (!window.confirm("Remove this performance entry?")) return;
    setPerformanceRecords((prev) => {
      const existing = prev[selectedClass] || [];
      return {
        ...prev,
        [selectedClass]: existing.filter((rec) => rec.id !== recordId),
      };
    });
    if (editingRecordId === recordId) {
      setRecordForm(emptyRecord(selectedClass));
      setEditingRecordId(null);
    }
  };

  const resetRecordForm = () => {
    setRecordForm(emptyRecord(selectedClass));
    setEditingRecordId(null);
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumb + Header outside container (match admin student) */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Teacher</span>
        <span>&gt;</span>
        <span>Gradebook</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Performance & Gradebook</h2>
        <div className="flex items-center gap-3">
          <HelpInfo title="Gradebook Help" description={GRADEBOOK_HELP} />
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded text-sm flex items-center gap-2">
              <FiUploadCloud /> Import
            </button>
            <button className="px-3 py-1 border rounded text-sm flex items-center gap-2">
              <FiDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Container 1: Class KPIs ---------- */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {classSummaries.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`text-left rounded-lg border p-3 shadow-sm bg-white transition-all ${
                selectedClass === cls.id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <p className=" uppercase text-gray-400">{cls.className}</p>
              <p className=" font-semibold text-gray-800 mt-1">
                {cls.avgScore}%
              </p>
              <p className=" text-gray-500 mt-1">
                Avg Score • {cls.assignments} assessments
              </p>
              <div className="mt-2 flex items-center justify-between text-gray-500">
                <span>Pending: {cls.pendingReviews}</span>
                <span>Topper: {cls.topper}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Container 2: Snapshot & Highlights ---------- */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        {currentClass && (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {currentClass.className} Snapshot
              </h3>
              <p className=" text-gray-500 mt-1">
                {currentClass.assignments} graded components
              </p>
            </div>

            <div className="flex gap-3">
              <HighlightCard
                icon={<FiTrendingUp />}
                label="Average Score"
                value={`${currentClass.avgScore}%`}
                tone="text-green-600"
              />
              <HighlightCard
                icon={<FiClipboard />}
                label="Assignments Posted"
                value={currentClass.assignments}
                tone="text-blue-600"
              />
              <HighlightCard
                icon={<FiAlertTriangle />}
                label="Pending Reviews"
                value={currentClass.pendingReviews}
                tone="text-orange-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* ---------- Container 3: Assessment Overview + Pending Actions ---------- */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border rounded-lg p-3">
            <h4 className="text-lg font-semibold mb-3">
              Recent Assessment Overview
            </h4>
            <div className="space-y-3">
              {assessmentBreakdown.map((item) => (
                <div key={item.component}>
                  <div className="flex items-center justify-between  text-gray-600">
                    <span>
                      {item.component} ({item.weight}% weight)
                    </span>
                    <span>{item.avg}% avg</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.avg}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-3">
            <h4 className="text-lg font-semibold mb-3">Pending Actions</h4>
            <div className="space-y-2">
              {pendingActions.map((a) => (
                <div
                  key={a.id}
                  className="p-2 border rounded bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">{a.title}</p>
                    <span className=" text-blue-600">{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Container 4: Student Performance Tracker (table) ---------- */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-lg font-semibold">
              Student Performance Tracker
            </h4>
            <p className=" text-gray-500 mt-1">
              Quick view of student performance
            </p>
          </div>
          <button className="px-3 py-1 bg-blue-600 text-white rounded ">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full ">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">Student</th>
                <th className="px-3 py-2 text-left">Class</th>
                <th className="px-3 py-2 text-left">Last Score</th>
                <th className="px-3 py-2 text-left">Trend</th>
                <th className="px-3 py-2 text-left">Completion</th>
              </tr>
            </thead>
            <tbody>
              {gradeTable.map((row) => (
                <tr key={row.student} className="border-t hover:bg-blue-50/40">
                  <td className="px-3 py-3 font-medium text-gray-800">
                    {row.student}
                  </td>
                  <td className="px-3 py-3 text-gray-600">{row.className}</td>
                  <td className="px-3 py-3 text-gray-800">{row.lastScore}%</td>
                  <td
                    className={`px-3 py-3 font-semibold ${
                      row.trend.startsWith("+")
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {row.trend}
                  </td>
                  <td className="px-3 py-3">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${row.completion}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- Container 5: Live Performance Log (form + table) ---------- */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-lg font-semibold">Live Performance Log</h4>
            <p className=" text-gray-500 mt-1">
              Add or edit marks for the selected class
            </p>
          </div>
          <div className=" text-gray-500">
            Section {selectedMeta.section || "–"}
            <br />
            {classRecords.length} tracked entries
          </div>
        </div>

        {/* dashed form area (compact) */}
        <div className="border border-dashed border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            <input
              className="border px-2 py-2 rounded col-span-2"
              placeholder="Student name"
              value={recordForm.student}
              onChange={(e) =>
                setRecordForm({ ...recordForm, student: e.target.value })
              }
            />
            {selectedMeta.subjects?.length ? (
              <select
                className="border px-2 py-2 rounded"
                value={recordForm.subject}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, subject: e.target.value })
                }
              >
                {selectedMeta.subjects.map((subjectOption) => (
                  <option key={subjectOption} value={subjectOption}>
                    {subjectOption}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="border px-2 py-2 rounded"
                placeholder="Subject"
                value={recordForm.subject}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, subject: e.target.value })
                }
              />
            )}
            <input
              className="border px-2 py-2 rounded"
              placeholder="Assessment"
              value={recordForm.assessment}
              onChange={(e) =>
                setRecordForm({ ...recordForm, assessment: e.target.value })
              }
            />
            <input
              className="border px-2 py-2 rounded"
              placeholder="Score"
              type="number"
              value={recordForm.score}
              onChange={(e) =>
                setRecordForm({ ...recordForm, score: e.target.value })
              }
            />
            <input
              className="border px-2 py-2 rounded"
              placeholder="Total"
              type="number"
              value={recordForm.total}
              onChange={(e) =>
                setRecordForm({ ...recordForm, total: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <input
              className="border px-2 py-2 rounded"
              placeholder="Focus area / skill"
              value={recordForm.focusArea}
              onChange={(e) =>
                setRecordForm({ ...recordForm, focusArea: e.target.value })
              }
            />
            <textarea
              className="border px-2 py-2 rounded md:col-span-2"
              rows={2}
              placeholder="Notes for parents or reminders"
              value={recordForm.remarks}
              onChange={(e) =>
                setRecordForm({ ...recordForm, remarks: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleRecordSave}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white  rounded"
            >
              {editingRecordId ? <FiEdit3 /> : <FiPlus />}{" "}
              {editingRecordId ? "Update" : "Add"}
            </button>
            <button
              onClick={resetRecordForm}
              className="px-3 py-1 border rounded text-sm"
            >
              Clear
            </button>
            {editingRecordId && (
              <p className=" text-gray-500 self-center">
                Editing #{editingRecordId.split("-").pop()}
              </p>
            )}
          </div>
        </div>

        {/* records table (compact) */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border border-gray-100 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="py-2 px-3">Student</th>
                <th className="py-2 px-3">Subject</th>
                <th className="py-2 px-3">Assessment</th>
                <th className="py-2 px-3 text-right">Score</th>
                <th className="py-2 px-3 text-right">Total</th>
                <th className="py-2 px-3 text-right">% </th>
                <th className="py-2 px-3">Focus</th>
                <th className="py-2 px-3">Notes</th>
                <th className="py-2 px-3">Updated</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-6 px-3 text-center text-gray-500"
                  >
                    No records yet. Use the form above to start tracking
                    performance.
                  </td>
                </tr>
              ) : (
                classRecords.map((record) => (
                  <tr key={record.id} className="border-t hover:bg-blue-50/20">
                    <td className="py-2 px-3 font-medium text-gray-800">
                      {record.student}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {record.subject}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {record.assessment}
                    </td>
                    <td className="py-2 px-3 text-right">{record.score}</td>
                    <td className="py-2 px-3 text-right">{record.total}</td>
                    <td className="py-2 px-3 text-right font-semibold">
                      {computePercent(record.score, record.total)}%
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {record.focusArea || "—"}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {record.remarks || "—"}
                    </td>
                    <td className="py-2 px-3 text-gray-500 text-xs">
                      {new Date(record.lastUpdated).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center gap-3 justify-center text-gray-500">
                        <button
                          onClick={() => handleRecordEdit(record)}
                          className="hover:text-blue-600"
                          title="Edit"
                        >
                          <FiEdit3 />
                        </button>
                        <button
                          onClick={() => handleRecordDelete(record.id)}
                          className="hover:text-red-500"
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

      {/* ---------- Container 6: Students Needing Attention ---------- */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        <h4 className="text-lg font-semibold mb-3">
          Students Needing Attention
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              id: "pa-1",
              student: "Rahul Mehta",
              className: "8A",
              concern: "Drop of 12% in last 2 assessments",
              action: "Schedule re-teaching session",
            },
            {
              id: "pa-2",
              student: "Sara Khan",
              className: "7A",
              concern: "Missing project submission",
              action: "Send reminder to parent",
            },
          ].map((alert) => (
            <article
              key={alert.id}
              className="p-3 border rounded text-sm bg-red-50"
            >
              <p className="font-semibold text-gray-800">
                {alert.student} • {alert.className}
              </p>
              <p className="text-red-600 mt-1">{alert.concern}</p>
              <p className="text-gray-600 mt-2">
                Action: {alert.action}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------- Small helper components ----------------- */

function HighlightCard({ icon, label, value, tone }) {
  return (
    <div className="border border-gray-100 rounded-lg p-3 bg-white flex items-center gap-3">
      <div className={`text-lg ${tone}`}>{icon}</div>
      <div>
        <p className=" text-gray-500 uppercase tracking-wide">{label}</p>
        <p className=" font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
