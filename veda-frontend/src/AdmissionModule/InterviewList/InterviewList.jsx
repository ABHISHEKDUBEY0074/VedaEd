// src/AdmissionModule/InterviewList/InterviewList.jsx
import React, { useState } from "react";
import { FiCalendar, FiSend, FiDownload, FiFilter } from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";
export default function InterviewList() {
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [venue, setVenue] = useState("");
  const [lastSchedule, setLastSchedule] = useState(null);
  const [classFilter, setClassFilter] = useState("All");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [qualifiedMsg, setQualifiedMsg] = useState(
    "Congratulations! You have qualified for the final admission round."
  );
  const [disqualifiedMsg, setDisqualifiedMsg] = useState(
    "We regret to inform you that you have not qualified in the interview."
  );

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      classApplied: "Class 5",
      phone: "9876543210",
      email: "aarav@example.com",
      result: "Qualified",
      interviewStatus: "Pending",
    },
    {
      id: 2,
      name: "Isha Verma",
      classApplied: "Class 7",
      phone: "9876501234",
      email: "isha@example.com",
      result: "Disqualified",
      interviewStatus: "Pending",
    },
    {
      id: 3,
      name: "Karan Singh",
      classApplied: "Class 5",
      phone: "9876512345",
      email: "karan@example.com",
      result: "Qualified",
      interviewStatus: "Pending",
    },
  ]);

  const handleScheduleInterview = () => {
    if (!interviewDate || !interviewTime || !venue)
      return alert("Please fill all fields!");

    const qualified = students.filter((s) => s.result === "Qualified");
    if (qualified.length === 0)
      return alert("No qualified students to schedule!");

    setLoading(true);
    setTimeout(() => {
      setStudents(
        students.map((s) =>
          s.result === "Qualified"
            ? { ...s, interviewStatus: "Scheduled" }
            : s
        )
      );
      setLastSchedule({ interviewDate, interviewTime, venue });
      setLoading(false);
      alert("Interview scheduled successfully!");
      setInterviewDate("");
      setInterviewTime("");
      setVenue("");
    }, 800);
  };

  const handleResultChange = (id, value) => {
    setStudents(
      students.map((s) =>
        s.id === id ? { ...s, result: value, interviewStatus: "Completed" } : s
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
          : "Interview result not declared.";
      console.log(`EMAIL+SMS → ${s.name}: ${msg} (Interview Result)`);
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
      "Interview Status",
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
          s.interviewStatus,
          s.result,
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview_list.csv";
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
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Interview List &gt;</span>
        <span>Interview Management</span>
      </div>

      <div className="flex items-center justify-between mb-6">
             <h2 className="text-2xl font-bold">Interview List</h2>
           <HelpInfo
  title="Interview List Help"
  description={`1.1 Overview

This page helps you manage the list of students scheduled for interviews. You can track interview details and communicate results efficiently.

2.1 Interview Schedule

View the scheduled date, time, and venue for each student's interview. Use the available options to update or send reminders.

3.1 Custom Message Templates

Predefined messages assist in communicating interview outcomes:
- "Congratulations! You have qualified for the next round."
- "We regret to inform you that you were not selected this time."

4.1 Interviewee List Table

The table displays details of students attending interviews:

- ID: Unique identifier for each student.
- Name: Full name of the student.
- Class: The grade or class of the student.
- Phone: Contact number for communication.
- Email: Email address to send interview details or results.
- Status: Current status of the interview (e.g., Scheduled, Completed).
- Result: Interview outcome (e.g., Not Declared, Selected, Not Selected).

Use options like 'Export' to download the list and 'Send Email + SMS' to notify students about interview schedules or results.`}
/>

           </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      {/* Main content box */}
      <div className="bg-gray-200 p-6 border border-gray-100">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Schedule Interview */}
<div className="border rounded-lg p-4 mb-6 bg-gray-50">
  <h3 className="font-medium mb-3">Schedule Interview</h3>

  {/* Qualified Students Preview */}
  <div className="mb-4 bg-white border rounded p-3">
    <h4 className="text-sm font-semibold mb-2 text-gray-700">
      Qualified Students for Interview
    </h4>
    {students.filter((s) => s.result === "Qualified").length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Class</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter((s) => s.result === "Qualified")
              .map((s, i) => (
                <tr key={s.id} className="text-center">
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.classApplied}</td>
                  <td className="border p-2">{s.phone}</td>
                  <td className="border p-2">{s.email}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-sm text-gray-500 italic">
        No qualified students yet.
      </p>
    )}
  </div>

  {/* Schedule Inputs */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <input
      type="date"
      value={interviewDate}
      onChange={(e) => setInterviewDate(e.target.value)}
      className="border rounded p-2"
    />
    <input
      type="time"
      value={interviewTime}
      onChange={(e) => setInterviewTime(e.target.value)}
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
      onClick={handleScheduleInterview}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 flex items-center justify-center gap-2"
    >
      <FiSend /> {loading ? "Scheduling..." : "Send Schedule"}
    </button>
  </div>

  {lastSchedule && (
    <p className="mt-3 text-sm text-gray-700 bg-white border rounded p-2">
      Last Scheduled: {lastSchedule.interviewDate} at{" "}
      {lastSchedule.interviewTime} | Venue: {lastSchedule.venue}
    </p>
  )}
</div>


          {/* Custom Message Templates */}
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="font-medium mb-2">
              Custom Interview Result Templates
            </h3>
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
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
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
            <table className="min-w-full text-sm border">
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
                  <th className="border p-2">Interview Status</th>
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
                    <td className="border p-2">{s.interviewStatus}</td>
                    <td className="border p-2">
                      <select
                        value={s.result}
                        onChange={(e) =>
                          handleResultChange(s.id, e.target.value)
                        }
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
    </div>
  );
}
