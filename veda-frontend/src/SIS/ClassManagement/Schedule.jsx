import React, { useState } from "react";
import * as XLSX from "xlsx";

const CLASSES = ["Nursery","KG","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
const SECTIONS = ["A","B","C"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Schedule() {
  const [activeTab, setActiveTab] = useState("Daily");
  const [allSchedules, setAllSchedules] = useState({
    "10th-A": [
      { id: 1, day: "Monday", period: "1", subject: "Math", teacher: "Mr. Verma", time: "9:00 - 9:45" },
      { id: 2, day: "Monday", period: "2", subject: "Science", teacher: "Ms. Gupta", time: "9:50 - 10:35" },
      { id: 3, day: "Tuesday", period: "1", subject: "English", teacher: "Mr. Khan", time: "9:00 - 9:45" },
    ],
  });

  const [activeClass, setActiveClass] = useState("10th");
  const [activeSection, setActiveSection] = useState("A");
  const [activeDay, setActiveDay] = useState("Monday");

  const key = `${activeClass}-${activeSection}`;
  const schedules = allSchedules[key] || [];

  const [newSchedule, setNewSchedule] = useState({ day: activeDay, period: "", subject: "", teacher: "", time: "" });
  const [editId, setEditId] = useState(null);
  const addSchedule = () => {
    if (!newSchedule.period || !newSchedule.subject) {
      alert("Please fill required fields");
      return;
    }
    const updated = [...schedules, { id: Date.now(), ...newSchedule }];
    setAllSchedules({ ...allSchedules, [key]: updated });
    setNewSchedule({ day: activeDay, period: "", subject: "", teacher: "", time: "" });
  };
  const updateSchedule = () => {
    const updated = schedules.map((s) => (s.id === editId ? { ...s, ...newSchedule } : s));
    setAllSchedules({ ...allSchedules, [key]: updated });
    setEditId(null);
    setNewSchedule({ day: activeDay, period: "", subject: "", teacher: "", time: "" });
  };
  const deleteSchedule = (id) => {
    const updated = schedules.filter((s) => s.id !== id);
    setAllSchedules({ ...allSchedules, [key]: updated });
  };
  const exportToExcel = (filterDay = null) => {
    const data = filterDay ? schedules.filter((s) => s.day === filterDay) : schedules;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");
    XLSX.writeFile(workbook, `schedule_${key}${filterDay ? "_" + filterDay : ""}.xlsx`);
  };

  const daySchedules = schedules.filter((s) => s.day === activeDay);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6"> Class Schedule</h1>
      <div className="flex gap-4 mb-6">
        <select
          className="border rounded p-2"
          value={activeClass}
          onChange={(e) => setActiveClass(e.target.value)}
        >
          {CLASSES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value)}
        >
          {SECTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2 mb-6">
        {["Daily", "Weekly Timetable"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "Daily" && (
        <div>
          <div className="flex space-x-2 mb-4">
            {DAYS.map((day) => (
              <button
                key={day}
                className={`px-4 py-2 rounded ${
                  activeDay === day ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => {
                  setActiveDay(day);
                  setNewSchedule({ ...newSchedule, day });
                  setEditId(null);
                }}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">
              {activeClass}-{activeSection} | {activeDay}
            </h2>
            {daySchedules.length === 0 ? (
              <p className="text-gray-500">No schedule added for {activeDay}</p>
            ) : (
              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Period</th>
                    <th className="border p-2">Subject</th>
                    <th className="border p-2">Teacher</th>
                    <th className="border p-2">Time</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {daySchedules.map((s) => (
                    <tr key={s.id}>
                      <td className="border p-2">{s.period}</td>
                      <td className="border p-2">{s.subject}</td>
                      <td className="border p-2">{s.teacher}</td>
                      <td className="border p-2">{s.time}</td>
                      <td className="border p-2">
                        <button
                          className="px-2 py-1 bg-yellow-500 text-white rounded"
                          onClick={() => {
                            setEditId(s.id);
                            setNewSchedule(s);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                          onClick={() => deleteSchedule(s.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-3 space-x-2">
              <button
                className="px-3 py-1 bg-green-500 text-white rounded"
                onClick={() => exportToExcel(activeDay)}
              >
                Export {activeDay}
              </button>
              <button
                className="px-3 py-1 bg-green-700 text-white rounded"
                onClick={() => exportToExcel()}
              >
                Export All
              </button>
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow mt-6">
            <h2 className="text-lg font-semibold mb-3">
              {editId ? "✏️ Edit Schedule" : "➕ Add Schedule"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input
                className="border p-2 rounded"
                placeholder="Period"
                value={newSchedule.period}
                onChange={(e) => setNewSchedule({ ...newSchedule, period: e.target.value })}
              />
              <input
                className="border p-2 rounded"
                placeholder="Subject"
                value={newSchedule.subject}
                onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
              />
              <input
                className="border p-2 rounded"
                placeholder="Teacher"
                value={newSchedule.teacher}
                onChange={(e) => setNewSchedule({ ...newSchedule, teacher: e.target.value })}
              />
              <input
                className="border p-2 rounded"
                placeholder="Time (e.g., 9:00 - 9:45)"
                value={newSchedule.time}
                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
              />
            </div>

            <div className="mt-3">
              {editId ? (
                <button
                  className="px-3 py-1 bg-yellow-600 text-white rounded"
                  onClick={updateSchedule}
                >
                  Update
                </button>
              ) : (
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={addSchedule}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {activeTab === "Weekly Timetable" && (
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <h2 className="text-lg font-semibold mb-3">
             Weekly Timetable ({activeClass}-{activeSection})
          </h2>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Period</th>
                {DAYS.map((day) => (
                  <th key={day} className="border p-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7].map((period) => (
                <tr key={period}>
                  <td className="border p-2 font-medium">Period {period}</td>
                  {DAYS.map((day) => {
                    const entry = schedules.find((s) => s.day === day && s.period === period.toString());
                    return (
                      <td key={day} className="border p-2 text-center">
                        {entry ? (
                          <>
                            <div className="font-semibold">{entry.subject}</div>
                            <div className="text-xs text-gray-600">{entry.teacher}</div>
                            <div className="text-xs">{entry.time}</div>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={() => exportToExcel()}
            >
              Export Weekly Timetable
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
