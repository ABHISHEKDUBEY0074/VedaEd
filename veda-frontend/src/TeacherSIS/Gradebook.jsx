import React, { useMemo, useState } from "react";
import {
  FiBookOpen,
  FiTrendingUp,
  FiAlertTriangle,
  FiClipboard,
  FiCheckCircle,
  FiUploadCloud,
  FiDownload,
} from "react-icons/fi";

const classSummaries = [
  {
    id: "cl-8a",
    className: "Grade 8 - Section A",
    avgScore: 86,
    assignments: 14,
    pendingReviews: 2,
    topper: "Aditi Rao",
    focus: "Algebra Applications",
  },
  {
    id: "cl-8b",
    className: "Grade 8 - Section B",
    avgScore: 82,
    assignments: 13,
    pendingReviews: 1,
    topper: "Ishaan Verma",
    focus: "Fractions Lab",
  },
  {
    id: "cl-7a",
    className: "Grade 7 - Section A",
    avgScore: 78,
    assignments: 11,
    pendingReviews: 4,
    topper: "Mira Shah",
    focus: "Geometry Basics",
  },
];

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

export default function TeacherGradebook() {
  const [selectedClass, setSelectedClass] = useState("cl-8a");

  const currentClass = useMemo(
    () => classSummaries.find((cls) => cls.id === selectedClass),
    [selectedClass]
  );

  return (
    <div className="p-6">
      <p className="text-gray-500 text-sm mb-2">Teacher &gt; Gradebook</p>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiBookOpen /> Performance & Gradebook
        </h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg">
            <FiUploadCloud /> Import Grades
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg">
            <FiDownload /> Export Report
          </button>
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
              <p className="text-xs text-blue-600 mt-2">
                Focus: {cls.focus}
              </p>
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
                value={`${
                  100 - currentClass.pendingReviews * 4
                }%`}
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
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

