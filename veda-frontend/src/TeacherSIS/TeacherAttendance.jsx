import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FiSearch, FiSave, FiDownload, FiMessageSquare } from "react-icons/fi";

const CLASSES = [
  { id: 1, name: "Class 6", sections: ["A", "B", "C"] },
  { id: 2, name: "Class 7", sections: ["A", "B"] },
  { id: 3, name: "Class 8", sections: ["A"] },
];

const DUMMY_STUDENTS = [
  { id: "STU001", rollNo: "101", name: "Amit Sharma", parentName: "Rajesh Sharma", parentContact: "9876543210" },
  { id: "STU002", rollNo: "102", name: "Priya Verma", parentName: "Sunita Verma", parentContact: "9876501234" },
  { id: "STU003", rollNo: "103", name: "Rohan Gupta", parentName: "Vikas Gupta", parentContact: "9998887777" },
  { id: "STU004", rollNo: "104", name: "Zoya Khan", parentName: "Imran Khan", parentContact: "9123456789" },
];

export default function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // 🔎 Load Students
  const handleSearch = () => {
    if (!selectedClass || !selectedSection || !date) {
      alert("Please select class, section, and date");
      return;
    }
    setStudents(DUMMY_STUDENTS);
    const initialAttendance = {};
    DUMMY_STUDENTS.forEach((stu) => {
      initialAttendance[stu.id] = "present";
    });
    setAttendance(initialAttendance);
  };

  // 🎯 Mark attendance
  const handleAttendanceChange = (studentId, value) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  // ↕️ Sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...students].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setStudents(sorted);
  };

  // 🔍 Filter
  const filteredStudents = students.filter((stu) =>
    stu.name.toLowerCase().includes(search.toLowerCase())
  );

  // 💾 Save
  const handleSave = async () => {
    const payload = {
      class: selectedClass,
      section: selectedSection,
      date,
      records: students.map((stu) => ({
        studentId: stu.id,
        status: attendance[stu.id],
      })),
    };
    console.log("Payload:", payload);
    try {
      // await axios.post("/api/teacher/attendance/save", payload);
      alert("Attendance saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving attendance");
    }
  };

  // 📤 Export Excel
  const exportExcel = () => {
    const wsData = [
      ["Roll No", "Student ID", "Name", "Parent Name", "Parent Contact", "Status"],
      ...filteredStudents.map((stu) => [
        stu.rollNo,
        stu.id,
        stu.name,
        stu.parentName,
        stu.parentContact,
        attendance[stu.id],
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `Attendance_${selectedClass}_${selectedSection}_${date}.xlsx`);
  };

  // 📄 Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Attendance Report - ${selectedClass} ${selectedSection} (${date})`, 14, 15);
    const tableData = filteredStudents.map((stu) => [
      stu.rollNo,
      stu.id,
      stu.name,
      stu.parentName,
      stu.parentContact,
      attendance[stu.id],
    ]);
    doc.autoTable({
      head: [["Roll No", "Student ID", "Name", "Parent Name", "Parent Contact", "Status"]],
      body: tableData,
      startY: 20,
    });
    doc.save(`Attendance_${selectedClass}_${selectedSection}_${date}.pdf`);
  };

  // 📱 Send SMS
  const sendAbsentSMS = () => {
    const absentStudents = filteredStudents.filter((stu) => attendance[stu.id] === "absent");
    if (absentStudents.length === 0) {
      alert("No absent students today.");
      return;
    }
    absentStudents.forEach((stu) => {
      console.log(`📲 SMS sent to ${stu.parentContact} (Parent of ${stu.name})`);
    });
    alert("SMS sent to all absent students' parents!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Attendance </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {CLASSES.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          disabled={!selectedClass}
        >
          <option value="">Select Section</option>
          {CLASSES.find((c) => c.name === selectedClass)?.sections.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-2"
        >
          <FiSearch /> Load
        </button>
      </div>

      {/* Search Bar */}
      {students.length > 0 && (
        <div className="flex items-center gap-3 mb-4 max-w-md">
          <FiSearch className="text-blue-600 text-lg" />
          <input
            type="text"
            placeholder="Search student by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Students Table */}
      {filteredStudents.length > 0 ? (
        <table className="w-full border rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th
                className="p-3 border cursor-pointer"
                onClick={() => handleSort("rollNo")}
              >
                Roll No {sortConfig.key === "rollNo" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 border">Student ID</th>
              <th
                className="p-3 border cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 border">Parent Name</th>
              <th className="p-3 border">Parent Contact</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((stu, i) => (
              <tr
                key={stu.id}
                className={`text-center ${i % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}
              >
                <td className="p-2 border">{stu.rollNo}</td>
                <td className="p-2 border">{stu.id}</td>
                <td className="p-2 border">{stu.name}</td>
                <td className="p-2 border">{stu.parentName}</td>
                <td className="p-2 border">{stu.parentContact}</td>
                <td className="p-2 border">
                  <select
                    value={attendance[stu.id] || ""}
                    onChange={(e) => handleAttendanceChange(stu.id, e.target.value)}
                    className="border p-1 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : students.length > 0 ? (
        <p className="text-gray-500 mt-3">No student matched your search.</p>
      ) : (
        <p className="text-gray-500 mt-3">No students loaded.</p>
      )}

      {/* Action Buttons */}
      {students.length > 0 && (
        <div className="mt-6 flex gap-4 flex-wrap">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-2"
          >
            <FiSave /> Save
          </button>
          <button
            onClick={exportExcel}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded flex items-center gap-2"
          >
            <FiDownload /> Excel
          </button>
          <button
            onClick={exportPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded flex items-center gap-2"
          >
            <FiDownload /> PDF
          </button>
          <button
            onClick={sendAbsentSMS}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded flex items-center gap-2"
          >
            <FiMessageSquare /> Notify Parents
          </button>
        </div>
      )}
    </div>
  );
}
