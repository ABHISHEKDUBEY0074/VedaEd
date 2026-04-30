import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiSearch, FiSave, FiDownload, FiMessageSquare } from "react-icons/fi";
import HelpInfo from "../components/HelpInfo";
import config from "../config";
import api from "../services/apiClient";

export default function TeacherAttendance() {
  const FILTER_STORAGE_KEY = "teacherAttendanceFilters";
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);

  // Restore saved filters when returning to the page
  useEffect(() => {
    try {
      const savedFilters = JSON.parse(
        localStorage.getItem(FILTER_STORAGE_KEY) || "{}"
      );
      if (savedFilters.selectedClass) setSelectedClass(savedFilters.selectedClass);
      if (savedFilters.selectedSection)
        setSelectedSection(savedFilters.selectedSection);
      if (savedFilters.date) setDate(savedFilters.date);
      if (savedFilters.search) setSearch(savedFilters.search);
    } catch (err) {
      console.error("Error restoring attendance filters:", err);
    }
  }, []);

  // Persist filters so they survive navigation
  useEffect(() => {
    localStorage.setItem(
      FILTER_STORAGE_KEY,
      JSON.stringify({
        selectedClass,
        selectedSection,
        date,
        search,
      })
    );
  }, [selectedClass, selectedSection, date, search]);

  // Fetch classes and sections from backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get("/classes");
        if (response.data.success) {
          setClasses(response.data.data); // Use 'data' instead of 'classes'
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        setClasses([]);
      }
    };
    fetchClasses();
  }, []);

  // 🔎 Load Students
  const handleSearch = async () => {
    if (!selectedClass || !selectedSection || !date) {
      alert("Please select class, section, and date");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, get students for the selected class and section
      const studentsResponse = await api.get("/students", {
        params: {
          class: selectedClass,
          section: selectedSection,
        },
      });

      if (studentsResponse.data.success) {
        const filteredStudents = studentsResponse.data.students || [];

        // Transform to frontend format
        const transformedStudents = filteredStudents.map((student) => ({
          dbId: String(student._id || ""),
          studentId: student.personalInfo?.stdId || String(student._id || ""),
          rollNo: student.personalInfo?.rollNo || "",
          name: student.personalInfo?.name || "",
          className: student.personalInfo?.class || selectedClass || "",
          sectionName: student.personalInfo?.section || selectedSection || "",
          parentName:
            student.parent?.fatherName || student.parent?.motherName || "N/A",
        }));

        setStudents(transformedStudents);

        // Check if attendance already exists for this date
        try {
          // Find the class and section IDs from the classes data
          const selectedClassData = classes.find(
            (c) => c.name === selectedClass
          );
          const selectedSectionData = selectedClassData?.sections.find(
            (s) => (s.name || s) === selectedSection
          );

          if (selectedClassData && selectedSectionData) {
            const classId = selectedClassData._id;
            const sectionId = selectedSectionData._id || selectedSectionData;

            const attendanceResponse = await axios.get(
              `${config.API_BASE_URL}/attendance/class/${classId}/${sectionId}/${date}`
            );

            if (
              attendanceResponse.data.success &&
              attendanceResponse.data.data.length > 0
            ) {
              // Load existing attendance
              const existingAttendance = {};
              attendanceResponse.data.data.forEach((record) => {
                existingAttendance[String(record.student?._id || "")] =
                  record.status.toLowerCase();
              });
              setAttendance(existingAttendance);
            } else {
              // Initialize with all present
              const initialAttendance = {};
              transformedStudents.forEach((stu) => {
                initialAttendance[stu.dbId] = "present";
              });
              setAttendance(initialAttendance);
            }
          } else {
            // Initialize with all present if class/section not found
            const initialAttendance = {};
            transformedStudents.forEach((stu) => {
              initialAttendance[stu.dbId] = "present";
            });
            setAttendance(initialAttendance);
          }
        } catch (attendanceErr) {
          // If no existing attendance, initialize with all present
          const initialAttendance = {};
          transformedStudents.forEach((stu) => {
            initialAttendance[stu.dbId] = "present";
          });
          setAttendance(initialAttendance);
        }
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      const serverMessage = err.response?.data?.message;
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to view students.");
      } else {
        setError(serverMessage || "Failed to load students");
      }
      setStudents([]);
      setAttendance({});
    } finally {
      setLoading(false);
    }
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
    if (!selectedClass || !selectedSection || !date) {
      alert("Please select class, section, and date");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Find the class and section IDs from the classes data
      const selectedClassData = classes.find((c) => c.name === selectedClass);
      if (!selectedClassData) {
        throw new Error("Selected class not found");
      }

      const selectedSectionData = selectedClassData.sections.find(
        (s) => (s.name || s) === selectedSection
      );
      if (!selectedSectionData) {
        throw new Error("Selected section not found");
      }

      const payload = {
        classId: selectedClassData._id, // Use ObjectId instead of name
        sectionId: selectedSectionData._id || selectedSectionData, // Use ObjectId instead of name
        date,
        records: students.map((stu) => ({
          studentId: stu.dbId,
          status:
            attendance[stu.dbId] === "present"
              ? "Present"
              : attendance[stu.dbId] === "absent"
              ? "Absent"
              : "Late",
          time:
            attendance[stu.dbId] === "present"
              ? new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null,
        })),
      };

      console.log("Payload:", payload);

      const response = await axios.post(
        `${config.API_BASE_URL}/attendance/class`,
        payload
      );

      if (response.data.success) {
        alert("Attendance saved successfully!");
      }
    } catch (err) {
      console.error("Error saving attendance:", err);
      setError(
        "Failed to save attendance: " +
          (err.response?.data?.message || err.message)
      );
      alert(
        "Error saving attendance: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // 📤 Export Excel
  const exportExcel = () => {
    const wsData = [
      ["Student ID", "Name", "Roll Number", "Class", "Section", "Parent Name", "Status"],
      ...filteredStudents.map((stu) => [
        stu.studentId,
        stu.name,
        stu.rollNo,
        stu.className,
        stu.sectionName,
        stu.parentName,
        attendance[stu.dbId],
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(
      wb,
      `Attendance_${selectedClass}_${selectedSection}_${date}.xlsx`
    );
  };

  // 📄 Export PDF
  const exportPDF = () => {
    try {
      if (filteredStudents.length === 0) {
        alert("No students available to export.");
        return;
      }

      const doc = new jsPDF();
      doc.text(
        `Attendance Report - ${selectedClass} ${selectedSection} (${date})`,
        14,
        15
      );

      const tableData = filteredStudents.map((stu) => [
        stu.studentId,
        stu.name,
        stu.rollNo,
        stu.className,
        stu.sectionName,
        stu.parentName,
        attendance[stu.dbId] || "present",
      ]);

      autoTable(doc, {
        head: [[
          "Student ID",
          "Name",
          "Roll Number",
          "Class",
          "Section",
          "Parent Name",
          "Status",
        ]],
        body: tableData,
        startY: 20,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [55, 65, 81] },
      });

      doc.save(`Attendance_${selectedClass}_${selectedSection}_${date}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please try again.");
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // 📱 Send SMS
  const sendAbsentSMS = () => {
    const absentStudents = filteredStudents.filter(
      (stu) => attendance[stu.dbId] === "absent"
    );
    if (absentStudents.length === 0) {
      alert("No absent students today.");
      return;
    }
    absentStudents.forEach((stu) => {
      console.log(`📲 SMS sent to parent of ${stu.name}`);
    });
    alert("SMS sent to all absent students' parents!");
  };

  return (
    <div className="p-0 m-0 min-h-screen">
       <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">Attendance &gt;</p>
<div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Attendance</h2>

  <HelpInfo
  title="Teacher Attendance"
  description={`2.1 Teacher Attendance (Attendance Overview)

Mark and manage student attendance for assigned classes. Easily track attendance patterns, view history, and generate attendance-based reports.

Sections:
- Class Selection: Choose class and section to take attendance
- Date Selection: Pick a date for marking attendance
- Attendance Marking Interface: Mark students as present or absent
- Attendance History: View past attendance entries for all assigned classes
- Attendance Reports: Generate summary and detailed attendance reports
- Student Attendance Details: View individual student attendance patterns


2.1.1 Daily Attendance Marking Card

This section allows teachers to mark attendance for a selected class on a chosen date.

Each attendance card includes:
- Selected class and section
- Selected date display
- Student list with Present/Absent toggle
- Bulk Mark: Mark all present or all absent
- Save Attendance button
- Auto-highlight for absent students


2.1.2 Attendance Tools & Reports Card

Tools available for attendance management:
- Attendance History Viewer
- Monthly Attendance Reports
- Class-wise attendance percentage
- Student-wise attendance summaries
- Alerts for low-attendance students
- Export attendance as Excel or PDF
`}
  steps={[
    "Select class & date to mark attendance",
    "Use Present/Absent toggles for each student",
    "Save attendance record for the day",
    "Open history or reports for detailed analytics"
  ]}
/>

</div>

      <div className="bg-white p-3 rounded-lg shadow-sm border">
        
<h3 className="text-lg font-semibold mb-4">Class Attendance</h3>
    {/* Filters */}
<div className="flex items-end justify-between mb-4">

  {/* Left Filters */}
  <div className="flex items-start gap-3">

    {/* Class */}
    <div className="flex flex-col">

      <select
        className="border px-3 py-2 rounded-md bg-white  w-[160px]"
        value={selectedClass}
        onChange={(e) => {
          setSelectedClass(e.target.value);
          setSelectedSection("");
        }}
      >
        <option value="">Select Class</option>
        {classes?.map((c) => (
          <option key={c._id || c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>

    {/* Section */}
    <div className="flex flex-col">
      
      <select
        className="border px-3 py-2 rounded-md bg-white  w-[160px]"
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        disabled={!selectedClass}
      >
        <option value="">Select Section</option>
        {classes
          ?.find((c) => c.name === selectedClass)
          ?.sections?.map((s) => (
            <option key={s._id || s} value={s.name || s}>
              {s.name || s}
            </option>
          ))}
      </select>
    </div>

    {/* Date */}
    <div className="flex flex-col">
      
      <input
        type="date"
        className="border px-3 py-2 rounded-md bg-white  w-[160px]"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>

  </div>

  {/* Right Load Button */}
  <button
    onClick={handleSearch}
    disabled={loading}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md  shadow flex items-center gap-2 disabled:opacity-50"
  >
    <FiSearch className="" />
    {loading ? "Loading..." : "Search"}
  </button>

</div>


      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Search Bar */}
      {students.length > 0 && (
        <div className="flex items-center gap-3 mb-4 max-w-md">
          <FiSearch className="text-blue-600 " />
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
                onClick={() => handleSort("studentId")}
              >
                Student ID{" "}
                {sortConfig.key === "studentId" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-3 border cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-3 border cursor-pointer"
                onClick={() => handleSort("rollNo")}
              >
                Roll Number{" "}
                {sortConfig.key === "rollNo" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-3 border">Class</th>
              <th className="p-3 border">Section</th>
              <th className="p-3 border">Parent Name</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((stu, i) => (
              <tr
                key={stu.dbId}
                className={`text-center ${
                  i % 2 === 0 ? "bg-white" : "bg-blue-50"
                } hover:bg-blue-100`}
              >
                <td className="p-2 border">{stu.studentId}</td>
                <td className="p-2 border">{stu.name}</td>
                <td className="p-2 border">{stu.rollNo}</td>
                <td className="p-2 border">{stu.className}</td>
                <td className="p-2 border">{stu.sectionName}</td>
                <td className="p-2 border">{stu.parentName}</td>
                <td className="p-2 border">
                  <select
                    value={attendance[stu.dbId] || ""}
                    onChange={(e) =>
                      handleAttendanceChange(stu.dbId, e.target.value)
                    }
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
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          >
            <FiSave /> {loading ? "Saving..." : "Save"}
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
    </div>
    
  );
}
