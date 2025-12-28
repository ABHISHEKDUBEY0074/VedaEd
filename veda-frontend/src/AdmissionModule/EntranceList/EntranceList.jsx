// src/AdmissionModule/EntranceList/EntranceList.jsx
import React, { useState } from "react";
import { FiCalendar, FiSend, FiDownload, FiFilter } from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";
export default function EntranceList() {
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [venue, setVenue] = useState("");
  const [lastSchedule, setLastSchedule] = useState(null);
  const [classFilter, setClassFilter] = useState("All");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [qualifiedMsg, setQualifiedMsg] = useState(
    "Congratulations! You have qualified for the interview round."
  );
  const [disqualifiedMsg, setDisqualifiedMsg] = useState(
    "We regret to inform you that you were not qualified this time."
  );

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      classApplied: "Class 5",
      phone: "9876543210",
      email: "aarav@example.com",
      examStatus: "Pending",
      result: "Not Declared",
    },
    {
      id: 2,
      name: "Isha Verma",
      classApplied: "Class 7",
      phone: "9876501234",
      email: "isha@example.com",
      examStatus: "Pending",
      result: "Not Declared",
    },
    {
      id: 3,
      name: "Karan Singh",
      classApplied: "Class 5",
      phone: "9876512345",
      email: "karan@example.com",
      examStatus: "Pending",
      result: "Not Declared",
    },
  ]);

  const handleScheduleExam = () => {
    if (!examDate || !examTime || !venue)
      return alert("Please fill all fields!");
    setLoading(true);
    setTimeout(() => {
      setStudents(students.map((s) => ({ ...s, examStatus: "Scheduled" })));
      setLastSchedule({ examDate, examTime, venue });
      setLoading(false);
      alert("Exam scheduled successfully!");
      setExamDate("");
      setExamTime("");
      setVenue("");
    }, 800);
  };

  const handleResultChange = (id, value) => {
    setStudents(
      students.map((s) =>
        s.id === id ? { ...s, result: value, examStatus: "Completed" } : s
      )
    );
  };

  const handleSelectAll = (checked) =>
    setSelectedStudents(checked ? filteredStudents.map((s) => s.id) : []);

  const handleSelectStudent = (id) =>
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

  const handleSendAll = () => {
    if (selectedStudents.length === 0)
      return alert("Please select at least one student!");
    const selected = students.filter((s) => selectedStudents.includes(s.id));
    selected.forEach((s) => {
      const msg =
        s.result === "Qualified"
          ? qualifiedMsg
          : s.result === "Disqualified"
          ? disqualifiedMsg
          : "Exam result not declared.";
      console.log(`EMAIL+SMS → ${s.name}: ${msg}`);
    });
    alert(`Messages sent to ${selected.length} students!`);
    setSelectedStudents([]);
  };

  const handleExport = () => {
    const header = [
      "ID",
      "Name",
      "Class",
      "Phone",
      "Email",
      "Exam Status",
      "Result",
    ];
    const csv = [
      header.join(","),
      ...students.map((s) =>
        [
          s.id,
          s.name,
          s.classApplied,
          s.phone,
          s.email,
          s.examStatus,
          s.result,
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "entrance_list.csv";
    a.click();
  };

  const classOptions = [
    "All",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];
  const filteredStudents =
    classFilter === "All"
      ? students
      : students.filter((s) => s.classApplied === classFilter);

  const allSelected =
    filteredStudents.length > 0 &&
    selectedStudents.length === filteredStudents.length;

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission</span>
        <span>&gt;</span>
        <span>Entrance List</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Entrance List</h2>
        <HelpInfo
          title="Entrance Exam Schedule Help"
          description={`1.1 Overview

This page allows you to schedule entrance exams for students, manage exam details, and communicate results effectively.

2.1 Schedule Entrance Exam

Set the exam date and time using the date and time fields. Specify the venue where the exam will be conducted. After setting these details, use the 'Send Schedule' button to notify students.

3.1 Custom Message Templates

Predefined messages help you communicate exam results easily:
- "Congratulations! You have qualified for the interview round."
- "We regret to inform you that you were not qualified this time."

4.1 Student List and Status Table

The table displays the list of students registered for the exam along with their details:

- ID: Unique identifier for each student.
- Name: Full name of the student.
- Class: The class or grade of the student.
- Phone: Contact number for SMS or calls.
- Email: Email address for communication.
- Status: Current status of exam participation (e.g., Pending).
- Result: Outcome of the exam (e.g., Not Declared, Qualified, Disqualified).

Use the 'Export' option to download the list, and 'Send Email + SMS' to notify students about their exam schedule or results.`}
        />
      </div>
{/* Tabs */}
        <div className="mb-3 flex flex-wrap gap-2">
          <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
            Overview
          </button>
        </div>

      <div className="bg-white p-3 rounded-lg shadow-sm border">
        

        {/* Schedule Exam */}
        <div className="border rounded-lg p-4 mb-3 bg-gray-50">
          <h3 className="font-medium mb-2">Schedule Entrance Exam</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="time"
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="border rounded p-2"
            />
            <button
              onClick={handleScheduleExam}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 flex items-center justify-center gap-2"
            >
              <FiSend /> {loading ? "Scheduling..." : "Send Schedule"}
            </button>
          </div>
          {lastSchedule && (
            <p className="mt-3 text-sm text-gray-700 bg-white border rounded p-2">
              Last Scheduled: {lastSchedule.examDate} at {lastSchedule.examTime}{" "}
              | Venue: {lastSchedule.venue}
            </p>
          )}
        </div>

        {/* Custom Messages */}
        <div className="border rounded-lg p-4 mb-3 bg-gray-50">
          <h3 className="font-medium mb-2">Custom Message Templates</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              rows="3"
              value={qualifiedMsg}
              onChange={(e) => setQualifiedMsg(e.target.value)}
              className="border rounded p-2"
              placeholder="Qualified message"
            />
            <textarea
              rows="3"
              value={disqualifiedMsg}
              onChange={(e) => setDisqualifiedMsg(e.target.value)}
              className="border rounded p-2"
              placeholder="Disqualified message"
            />
          </div>
        </div>

        {/* Filters + Actions */}
        <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
          <div className="flex items-center gap-2">
            <FiFilter />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="border rounded p-2"
            >
              {classOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2 text-sm"
            >
              <FiDownload /> Export
            </button>
            <button
              onClick={handleSendAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded flex items-center gap-2 text-sm"
            >
              <FiSend /> Send Email + SMS
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="border p-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id} className="text-center">
                  <td className="border p-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(s.id)}
                      onChange={() => handleSelectStudent(s.id)}
                    />
                  </td>
                  <td className="border p-2">{s.id}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.classApplied}</td>
                  <td className="border p-2">{s.phone}</td>
                  <td className="border p-2">{s.email}</td>
                  <td className="border p-2">{s.examStatus}</td>
                  <td className="border p-2">
                    <select
                      value={s.result}
                      onChange={(e) => handleResultChange(s.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option>Not Declared</option>
                      <option>Qualified</option>
                      <option>Disqualified</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-4 text-gray-500 italic"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
