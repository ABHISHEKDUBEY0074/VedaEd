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

Sections:
- Data Entry Row: fields for student, subject, assessment, score, focus area, remarks
- Action Buttons: Save entry in log, Clear form, or toggle edit mode per row
- Records Table: shows latest entries with edit/delete controls`;

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

const progressAlerts = [
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
    <div className="p-6">
      <p className="text-gray-500 text-sm mb-2">Teacher &gt; Gradebook</p>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiBookOpen /> Performance & Gradebook
        </h2>
        <div className="flex items-center gap-3">
          <HelpInfo title="Gradebook Help" description={GRADEBOOK_HELP} />
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg">
              <FiUploadCloud /> Import Grades
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg">
              <FiDownload /> Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 p-6 rounded-2xl border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classSummaries.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`text-left rounded-2xl border p-4 shadow-sm bg-white transition-all ${
                selectedClass === cls.id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <p className="text-xs uppercase text-gray-400">{cls.className}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {cls.avgScore}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Avg Score • {cls.assignments} assessments
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Pending reviews: {cls.pendingReviews}</span>
                <span>Topper: {cls.topper}</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">Focus: {cls.focus}</p>
            </button>
          ))}
        </div>

        {currentClass && (
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <header className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentClass.className} Snapshot
              </h3>
              <span className="text-sm text-gray-500">
                {currentClass.assignments} graded components
              </span>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
              <HighlightCard
                icon={<FiCheckCircle />}
                label="Completion Rate"
                value={`${100 - currentClass.pendingReviews * 4}%`}
                tone="text-purple-600"
              />
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Assessment Overview
            </h3>
            <div className="space-y-4">
              {assessmentBreakdown.map((item) => (
                <div key={item.component}>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {item.component} ({item.weight}% weightage)
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
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Pending Actions
            </h3>
            <div className="space-y-3">
              {pendingActions.map((action) => (
                <article
                  key={action.id}
                  className="p-4 border border-gray-100 rounded-lg bg-gray-50"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {action.title}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">{action.status}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <header className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Student Performance Tracker
            </h3>
            <button className="text-sm text-blue-600">View all</button>
          </header>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Class</th>
                  <th className="pb-3">Last Score</th>
                  <th className="pb-3">Trend</th>
                  <th className="pb-3">Completion</th>
                </tr>
              </thead>
              <tbody>
                {gradeTable.map((row) => (
                  <tr key={row.student} className="border-t">
                    <td className="py-3 font-medium text-gray-800">
                      {row.student}
                    </td>
                    <td className="py-3 text-gray-500">{row.className}</td>
                    <td className="py-3 text-gray-800">{row.lastScore}%</td>
                    <td
                      className={`py-3 font-semibold ${
                        row.trend.startsWith("+")
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {row.trend}%
                    </td>
                    <td className="py-3">
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
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <header className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Live Performance Log
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Add or edit marks for{" "}
                {selectedMeta.grade || currentClass?.className}
              </p>
            </div>
            <div className="text-xs text-gray-500 text-right">
              Section {selectedMeta.section || "–"}
              <br />
              {classRecords.length} tracked entries
            </div>
          </header>

          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <input
                className="border p-2 rounded col-span-2"
                placeholder="Student name"
                value={recordForm.student}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, student: e.target.value })
                }
              />
              {selectedMeta.subjects?.length ? (
                <select
                  className="border p-2 rounded"
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
                  className="border p-2 rounded"
                  placeholder="Subject"
                  value={recordForm.subject}
                  onChange={(e) =>
                    setRecordForm({ ...recordForm, subject: e.target.value })
                  }
                />
              )}
              <input
                className="border p-2 rounded"
                placeholder="Assessment"
                value={recordForm.assessment}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, assessment: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Score"
                type="number"
                value={recordForm.score}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, score: e.target.value })
                }
              />
              <input
                className="border p-2 rounded"
                placeholder="Total"
                type="number"
                value={recordForm.total}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, total: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <input
                className="border p-2 rounded"
                placeholder="Focus area / skill"
                value={recordForm.focusArea}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, focusArea: e.target.value })
                }
              />
              <textarea
                className="border p-2 rounded md:col-span-2"
                rows={2}
                placeholder="Notes for parents or reminders"
                value={recordForm.remarks}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, remarks: e.target.value })
                }
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={handleRecordSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm"
              >
                {editingRecordId ? <FiEdit3 /> : <FiPlus />}
                {editingRecordId ? "Update Entry" : "Add Entry"}
              </button>
              <button
                onClick={resetRecordForm}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600"
              >
                Clear
              </button>
              {editingRecordId && (
                <p className="text-xs text-gray-500 self-center">
                  Editing record #{editingRecordId.split("-").pop()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 overflow-auto">
            <table className="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
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
                      className="py-4 px-3 text-center text-gray-500"
                      colSpan={10}
                    >
                      No records yet. Use the form above to start tracking
                      performance.
                    </td>
                  </tr>
                ) : (
                  classRecords.map((record) => (
                    <tr key={record.id} className="border-t">
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
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-3 justify-center text-gray-500">
                          <button
                            onClick={() => handleRecordEdit(record)}
                            className="hover:text-blue-600"
                            title="Edit record"
                          >
                            <FiEdit3 />
                          </button>
                          <button
                            onClick={() => handleRecordDelete(record.id)}
                            className="hover:text-red-500"
                            title="Delete record"
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
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Students Needing Attention
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progressAlerts.map((alert) => (
              <article
                key={alert.id}
                className="p-4 border border-gray-100 rounded-lg bg-red-50"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {alert.student} • {alert.className}
                </p>
                <p className="text-xs text-red-600 mt-1">{alert.concern}</p>
                <p className="text-xs text-gray-600 mt-2">
                  Suggested action: {alert.action}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function HighlightCard({ icon, label, value, tone }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex items-center gap-3">
      <div className={`text-lg ${tone}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
