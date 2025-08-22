import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ClassDetail() {
  const { id } = useParams();
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", roll: 1, status: "Present", time: "08:05 AM" },
    { id: 2, name: "Jane Smith", roll: 2, status: "Absent", time: "--" },
    { id: 3, name: "Alex Lee", roll: 3, status: "Late", time: "08:20 AM" },
    { id: 4, name: "Emily Clark", roll: 4, status: "Present", time: "08:02 AM" },
  ]);
  const handleAttendanceChange = (studentId, newStatus) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: newStatus,
              time:
                newStatus === "Present"
                  ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : newStatus === "Late"
                  ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "--",
            }
          : s
      )
    );
  };
  const handleExport = () => {
    const header = ["Roll No", "Name", "Status", "Time"];
    const rows = students.map((s) => [s.roll, s.name, s.status, s.time]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `class_${id}_attendance.csv`;
    link.click();
  };

  return (
    <div className="p-6">
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/attendance" className="hover:underline">
          Attendance
        </Link>{" "}
        ›{" "}
        <Link to="/attendance/by-class" className="hover:underline">
          By Class
        </Link>{" "}
        › <span className="text-gray-700 font-medium">Class {id}</span>
      </nav>
      <h1 className="text-2xl font-bold text-gray-700 mb-4">
        Class {id} - Attendance
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Present</p>
          <h2 className="text-xl font-bold text-green-600">
            {students.filter((s) => s.status === "Present").length}
          </h2>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Absent</p>
          <h2 className="text-xl font-bold text-red-600">
            {students.filter((s) => s.status === "Absent").length}
          </h2>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Late</p>
          <h2 className="text-xl font-bold text-orange-500">
            {students.filter((s) => s.status === "Late").length}
          </h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Roll No</th>
              <th className="p-2">Student Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Time</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{s.roll}</td>
                <td className="p-2">{s.name}</td>
                <td
                  className={`p-2 font-semibold ${
                    s.status === "Present"
                      ? "text-green-600"
                      : s.status === "Absent"
                      ? "text-red-600"
                      : "text-orange-500"
                  }`}
                >
                  {s.status}
                </td>
                <td className="p-2">{s.time}</td>
                <td className="p-2">
                  <select
                    value={s.status}
                    onChange={(e) => handleAttendanceChange(s.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Late</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => alert("Attendance saved!")}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Save Attendance
        </button>
        <button
          onClick={handleExport}
          className="bg-gray-200 px-4 py-2 rounded shadow hover:bg-gray-300"
        >
          Export Report
        </button>
      </div>
    </div>
  );
}
