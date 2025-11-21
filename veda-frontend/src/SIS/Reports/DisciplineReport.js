import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import SmallModal from "./SmallModal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { studentAPI } from "../../services/studentAPI";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0"];

export default function DisciplineReport() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  
  // Class and Section filters
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const rowsPerPage = 6;

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/classes");
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setClasses(result.data || []);
          }
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await studentAPI.getAllStudents();
        if (result.success) {
          setStudents(result.students || []);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Update sections when class changes
  useEffect(() => {
    if (selectedClass && students.length > 0) {
      const classStudents = students.filter(
        (s) => s.personalInfo?.class === selectedClass || 
               (typeof s.personalInfo?.class === 'object' && s.personalInfo?.class?._id === selectedClass) ||
               (typeof s.personalInfo?.class === 'object' && s.personalInfo?.class?.name === selectedClass)
      );
      const uniqueSections = [
        ...new Set(
          classStudents
            .map((s) => {
              const section = s.personalInfo?.section;
              if (typeof section === 'object') return section?.name || section?._id;
              return section;
            })
            .filter(Boolean)
        ),
      ];
      setSections(uniqueSections);
      setSelectedSection(""); // Reset section when class changes
    } else {
      setSections([]);
      setSelectedSection("");
    }
  }, [selectedClass, students]);

  // Filter students by class and section
  useEffect(() => {
    if (selectedClass && selectedSection && students.length > 0) {
      const filtered = students.filter((s) => {
        const studentClass = typeof s.personalInfo?.class === 'object' 
          ? (s.personalInfo?.class?.name || s.personalInfo?.class?._id)
          : s.personalInfo?.class;
        const studentSection = typeof s.personalInfo?.section === 'object'
          ? (s.personalInfo?.section?.name || s.personalInfo?.section?._id)
          : s.personalInfo?.section;
        return studentClass === selectedClass && studentSection === selectedSection;
      });
      setFilteredStudents(filtered);
    } else if (selectedClass && students.length > 0) {
      const filtered = students.filter((s) => {
        const studentClass = typeof s.personalInfo?.class === 'object'
          ? (s.personalInfo?.class?.name || s.personalInfo?.class?._id)
          : s.personalInfo?.class;
        return studentClass === selectedClass;
      });
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedClass, selectedSection, students]);

  // ✅ Dummy Data Load on Mount (with class/section structure for future)
  useEffect(() => {
    const dummy = [
      {
        id: 1,
        name: "Rohan Sharma",
        studentId: null,
        class: "",
        section: "",
        type: "Late Submission",
        severity: "Low",
        date: "2025-01-14",
        createdBy: "Ms. Priya Sharma",
        updatedBy: "Ms. Priya Sharma"
      },
      {
        id: 2,
        name: "Priya Gupta",
        studentId: null,
        class: "",
        section: "",
        type: "Class Disturbance",
        severity: "Medium",
        date: "2025-01-13",
        createdBy: "Mr. Rajesh Kumar",
        updatedBy: "Mr. Rajesh Kumar"
      },
      {
        id: 3,
        name: "Amit Verma",
        studentId: null,
        class: "",
        section: "",
        type: "Bullying",
        severity: "High",
        date: "2025-01-12",
        createdBy: "Ms. Anjali Mehta",
        updatedBy: "Ms. Anjali Mehta"
      },
      {
        id: 4,
        name: "Karan Patel",
        studentId: null,
        class: "",
        section: "",
        type: "Late Submission",
        severity: "Low",
        date: "2025-01-10",
        createdBy: "Mr. Vikram Singh",
        updatedBy: "Mr. Vikram Singh"
      },
      {
        id: 5,
        name: "Neha Singh",
        studentId: null,
        class: "",
        section: "",
        type: "Dress Code Violation",
        severity: "Low",
        date: "2025-01-08",
        createdBy: "Ms. Sunita Reddy",
        updatedBy: "Ms. Sunita Reddy"
      },
    ];
    setData(dummy);
  }, []);

  // ✅ Add / Update (NO API — Only State Update) - Now includes class/section/studentId
  const handleSave = (record) => {
    // TODO: Get actual teacher name from auth context
    const currentTeacher = record.createdBy || record.updatedBy || "Current Teacher";
    
    const enhancedRecord = {
      ...record,
      class: record.class || selectedClass || "",
      section: record.section || selectedSection || "",
      studentId: record.studentId || null,
    };
    if (editRow) {
      // Update - preserve createdBy, update updatedBy
      setData((prev) =>
        prev.map((r) =>
          r.id === editRow.id 
            ? { 
                ...enhancedRecord, 
                id: editRow.id,
                createdBy: r.createdBy || currentTeacher,
                updatedBy: currentTeacher
              } 
            : r
        )
      );
    } else {
      // Add - set both createdBy and updatedBy
      setData((prev) => [
        { 
          ...enhancedRecord, 
          id: Date.now(),
          createdBy: currentTeacher,
          updatedBy: currentTeacher
        },
        ...prev
      ]);
    }
  };

  // ✅ Delete (NO API)
  const handleDelete = (id) => {
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  // ✅ Import Excel (Only Add to State)
  const handleImport = (rows) => {
    // TODO: Get actual teacher name from auth context
    const currentTeacher = "Current Teacher";
    const formatted = rows.map((r) => ({
      id: Date.now() + Math.random(),
      name: r.name || "",
      type: r.type || "",
      severity: r.severity || "",
      date: r.date || "",
      createdBy: r.createdBy || r["Created By"] || currentTeacher,
      updatedBy: r.updatedBy || r["Updated By"] || currentTeacher,
    }));
    setData((prev) => [...formatted, ...prev]);
  };

  // ✅ Filter + Sort (with class/section filters)
  const filteredData = useMemo(() => {
    let d = data.filter((item) => {
      const matchesSearch = (item.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = !selectedClass || item.class === selectedClass || 
        (typeof item.class === 'object' && (item.class?.name === selectedClass || item.class?._id === selectedClass));
      const matchesSection = !selectedSection || item.section === selectedSection ||
        (typeof item.section === 'object' && (item.section?.name === selectedSection || item.section?._id === selectedSection));
      return matchesSearch && matchesClass && matchesSection;
    });
    d = d.sort((a, b) =>
      sortOrder === "asc"
        ? (a.name || "").localeCompare(b.name || "")
        : (b.name || "").localeCompare(a.name || "")
    );
    return d;
  }, [searchTerm, sortOrder, data, selectedClass, selectedSection]);

  // ✅ Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;

  // ✅ Charts — Type Count
  const typeCounts = data.reduce((acc, cur) => {
    const t = cur.type || "Unknown";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.keys(typeCounts).map((t) => ({ type: t, count: typeCounts[t] }));

  // ✅ Charts — Severity Pie
  const severityCounts = data.reduce((acc, cur) => {
    const s = cur.severity || "NA";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.keys(severityCounts).map((s) => ({ name: s, value: severityCounts[s] }));

  // ✅ Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map(({ id, ...rest }) => rest)
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Discipline");
    XLSX.writeFile(wb, "discipline_report.xlsx");
  };

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Discipline Report", 14, 10);
    autoTable(doc, {
      head: [["Name", "Incident Type", "Severity", "Date", "Created/Updated By"]],
      body: data.map((r) => [
        r.name, 
        r.type, 
        r.severity, 
        r.date,
        r.updatedBy || r.createdBy || "—"
      ]),
      startY: 16,
    });
    doc.save("discipline_report.pdf");
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Class & Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id || cls.id} value={cls.name || cls._id || cls.id}>
                {cls.name || cls.className || "Unknown"}
              </option>
            ))}
            {/* Also show unique classes from students if not in classes list */}
            {students.length > 0 && (
              <>
                {[...new Set(students.map(s => {
                  const cls = s.personalInfo?.class;
                  return typeof cls === 'object' ? (cls?.name || cls?._id) : cls;
                }).filter(Boolean))].filter(clsName => 
                  !classes.some(c => (c.name || c.className) === clsName)
                ).map((clsName, idx) => (
                  <option key={`student-class-${idx}`} value={clsName}>{clsName}</option>
                ))}
              </>
            )}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="border px-3 py-2 rounded-md"
            disabled={!selectedClass}
          >
            <option value="">All Sections</option>
            {sections.map((sec, idx) => (
              <option key={idx} value={sec}>{sec}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-gray-200 px-3 py-2 rounded-md text-sm"
            >
              Sort ({sortOrder === "asc" ? "↑" : "↓"})
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-3">
        <div className="text-sm text-gray-600">
          Showing {filteredData.length} record(s)
          {selectedClass && ` • Class: ${selectedClass}`}
          {selectedSection && ` • Section: ${selectedSection}`}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditRow(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md"
          >
            <FiPlus /> Add Record
          </button>

          <button onClick={exportExcel} className="bg-blue-600 text-white px-3 py-1 rounded-md">
            Export Excel
          </button>

          <button onClick={exportPDF} className="bg-red-600 text-white px-3 py-1 rounded-md">
            Export PDF
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Incidents by Type</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No data to display</p>
          )}
        </div>

        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Severity Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">No data to display</p>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="w-full border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Class</th>
            <th className="border px-2 py-1">Section</th>
            <th className="border px-2 py-1">Incident Type</th>
            <th className="border px-2 py-1">Severity</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Created/Updated By</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id}>
              <td className="border px-2 py-1">{row.name}</td>
              <td className="border px-2 py-1">
                {typeof row.class === 'object' ? (row.class?.name || row.class?._id || '—') : (row.class || '—')}
              </td>
              <td className="border px-2 py-1">
                {typeof row.section === 'object' ? (row.section?.name || row.section?._id || '—') : (row.section || '—')}
              </td>
              <td className="border px-2 py-1">{row.type}</td>
              <td className="border px-2 py-1">{row.severity}</td>
              <td className="border px-2 py-1">{row.date}</td>
              <td className="border px-2 py-1 text-sm text-gray-600">
                {row.updatedBy || row.createdBy || '—'}
              </td>

              <td className="border px-2 py-1 text-center">
                <button
                  className="p-1 text-blue-600"
                  onClick={() => {
                    setEditRow(row);
                    setModalOpen(true);
                  }}
                >
                  <FiEdit />
                </button>
                <button
                  className="p-1 text-red-600"
                  onClick={() => handleDelete(row.id)}
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Enhanced Modal with Class/Section/Student Selection */}
      {modalOpen && (
        <DisciplineModal
          open={modalOpen}
          title={editRow ? "Edit Incident" : "Add Incident"}
          editRow={editRow}
          onSave={(record) => {
            handleSave(record);
            setModalOpen(false);
          }}
          onImport={handleImport}
          onClose={() => {
            setModalOpen(false);
            setEditRow(null);
          }}
          classes={classes}
          sections={sections}
          students={filteredStudents.length > 0 ? filteredStudents : students}
          selectedClass={selectedClass}
          selectedSection={selectedSection}
        />
      )}
    </div>
  );
}

// Enhanced Modal Component with Class/Section/Student Selection
function DisciplineModal({
  open,
  title,
  editRow,
  onSave,
  onImport,
  onClose,
  classes,
  sections,
  students,
  selectedClass,
  selectedSection,
}) {
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    class: selectedClass || "",
    section: selectedSection || "",
    type: "",
    severity: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (editRow) {
      setForm({
        name: editRow.name || "",
        studentId: editRow.studentId || "",
        class: editRow.class || selectedClass || "",
        section: editRow.section || selectedSection || "",
        type: editRow.type || "",
        severity: editRow.severity || "",
        date: editRow.date || new Date().toISOString().split("T")[0],
      });
    } else {
      setForm({
        name: "",
        studentId: "",
        class: selectedClass || "",
        section: selectedSection || "",
        type: "",
        severity: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [editRow, open, selectedClass, selectedSection]);

  const handleStudentChange = (studentId) => {
    const student = students.find((s) => s._id === studentId || s.id === studentId);
    if (student) {
      const studentClass = typeof student.personalInfo?.class === 'object'
        ? (student.personalInfo?.class?.name || student.personalInfo?.class?._id)
        : student.personalInfo?.class;
      const studentSection = typeof student.personalInfo?.section === 'object'
        ? (student.personalInfo?.section?.name || student.personalInfo?.section?._id)
        : student.personalInfo?.section;
      setForm({
        ...form,
        studentId: studentId,
        name: student.personalInfo?.name || "",
        class: studentClass || form.class,
        section: studentSection || form.section,
      });
    }
  };

  const availableStudents = students.filter((s) => {
    if (!form.class) return true;
    const studentClass = typeof s.personalInfo?.class === 'object'
      ? (s.personalInfo?.class?.name || s.personalInfo?.class?._id)
      : s.personalInfo?.class;
    if (form.class !== studentClass) return false;
    if (!form.section) return true;
    const studentSection = typeof s.personalInfo?.section === 'object'
      ? (s.personalInfo?.section?.name || s.personalInfo?.section?._id)
      : s.personalInfo?.section;
    return form.section === studentSection;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              value={form.class}
              onChange={(e) => {
                setForm({ ...form, class: e.target.value, section: "", studentId: "", name: "" });
              }}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id || cls.id} value={cls.name || cls._id || cls.id}>
                  {cls.name || cls.className || "Unknown"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Section</label>
            <select
              value={form.section}
              onChange={(e) => {
                setForm({ ...form, section: e.target.value, studentId: "", name: "" });
              }}
              className="w-full border px-3 py-2 rounded-md"
              disabled={!form.class}
            >
              <option value="">Select Section</option>
              {sections.map((sec, idx) => (
                <option key={idx} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <select
              value={form.studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select Student</option>
              {availableStudents.map((s) => (
                <option key={s._id || s.id} value={s._id || s.id}>
                  {s.personalInfo?.name || s.name || "Unknown"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Student Name (or enter manually)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter student name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Incident Type</label>
            <input
              type="text"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="e.g., Late Submission, Class Disturbance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Severity</label>
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Import Excel</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (evt) => {
                  const data = new Uint8Array(evt.target.result);
                  const workbook = XLSX.read(data, { type: "array" });
                  const sheet = workbook.Sheets[workbook.SheetNames[0]];
                  const json = XLSX.utils.sheet_to_json(sheet);
                  onImport(json);
                };
                reader.readAsArrayBuffer(file);
              }}
              className="w-full border px-3 py-2 rounded-md file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => {
              onSave(form);
              setForm({
                name: "",
                studentId: "",
                class: "",
                section: "",
                type: "",
                severity: "",
                date: new Date().toISOString().split("T")[0],
              });
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            onClick={() => {
              setForm({
                name: "",
                studentId: "",
                class: "",
                section: "",
                type: "",
                severity: "",
                date: new Date().toISOString().split("T")[0],
              });
              onClose();
            }}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
