import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import SmallModal from "./SmallModal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { studentAPI } from "../../services/studentAPI";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d32f2f"];

//    Backend ka base URL
const BASE_URL = "http://localhost:5000";

export default function ActivitiesReport() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  // Class and Section filters
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const rowsPerPage = 10;

  // Dummy data for demonstration
  const dummyActivitiesData = [
    { id: 1, student: "John Smith", activity: "Basketball", participation: "Yes", performance: "Excellent" },
    { id: 2, student: "Sarah Johnson", activity: "Debate Club", participation: "Yes", performance: "Good" },
    { id: 3, student: "Michael Brown", activity: "Music Band", participation: "Yes", performance: "Excellent" },
    { id: 4, student: "Emily Davis", activity: "Chess Club", participation: "Yes", performance: "Good" },
    { id: 5, student: "David Wilson", activity: "Basketball", participation: "Yes", performance: "Excellent" },
    { id: 6, student: "Jessica Martinez", activity: "Drama Club", participation: "Yes", performance: "Good" },
    { id: 7, student: "Christopher Lee", activity: "Debate Club", participation: "Yes", performance: "Excellent" },
    { id: 8, student: "Amanda Taylor", activity: "Music Band", participation: "Yes", performance: "Good" },
    { id: 9, student: "James Anderson", activity: "Chess Club", participation: "No", performance: "N/A" },
    { id: 10, student: "Lisa Thomas", activity: "Drama Club", participation: "Yes", performance: "Excellent" },
    { id: 11, student: "Robert Jackson", activity: "Basketball", participation: "Yes", performance: "Good" },
    { id: 12, student: "Michelle White", activity: "Debate Club", participation: "Yes", performance: "Excellent" },
    { id: 13, student: "Daniel Harris", activity: "Music Band", participation: "No", performance: "N/A" },
    { id: 14, student: "Jennifer Clark", activity: "Chess Club", participation: "Yes", performance: "Good" },
    { id: 15, student: "Matthew Lewis", activity: "Drama Club", participation: "Yes", performance: "Excellent" },
    { id: 16, student: "Nicole Garcia", activity: "Basketball", participation: "Yes", performance: "Good" },
    { id: 17, student: "Andrew Rodriguez", activity: "Debate Club", participation: "Yes", performance: "Excellent" },
    { id: 18, student: "Stephanie Martinez", activity: "Music Band", participation: "Yes", performance: "Good" },
  ];

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/classes`);
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

  //  Fetch data from API
  useEffect(() => {
    fetch(`${BASE_URL}/api/activities`)
      .then((res) => res.json())
      .then((json) => {
        if (json && json.length > 0) {
          // Ensure data has class/section structure
          const enhanced = json.map(item => ({
            ...item,
            class: item.class || "",
            section: item.section || "",
            studentId: item.studentId || null,
          }));
          setData(enhanced);
        } else {
          // Use dummy data if API returns empty (with class/section structure)
          const enhanced = dummyActivitiesData.map(item => ({
            ...item,
            class: item.class || "",
            section: item.section || "",
            studentId: item.studentId || null,
          }));
          setData(enhanced);
        }
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        // Use dummy data on error
        const enhanced = dummyActivitiesData.map(item => ({
          ...item,
          class: item.class || "",
          section: item.section || "",
          studentId: item.studentId || null,
        }));
        setData(enhanced);
      });
  }, []);

  const filteredData = useMemo(() => {
    let d = data.filter((item) => {
      const matchesSearch = (item.student || "").toLowerCase().includes((searchTerm || "").toLowerCase());
      const matchesClass = !selectedClass || item.class === selectedClass || 
        (typeof item.class === 'object' && (item.class?.name === selectedClass || item.class?._id === selectedClass));
      const matchesSection = !selectedSection || item.section === selectedSection ||
        (typeof item.section === 'object' && (item.section?.name === selectedSection || item.section?._id === selectedSection));
      return matchesSearch && matchesClass && matchesSection;
    });
    d = d.sort((a, b) =>
      sortOrder === "asc"
        ? (a.student || "").localeCompare(b.student || "")
        : (b.student || "").localeCompare(a.student || "")
    );
    return d;
  }, [sortOrder, searchTerm, data, selectedClass, selectedSection]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const performanceDistribution = useMemo(() => {
    const grouped = {};
    data.forEach((d) => {
      const perf = d.performance || "NA";
      grouped[perf] = (grouped[perf] || 0) + 1;
    });
    return Object.entries(grouped).map(([performance, count]) => ({
      performance,
      count,
    }));
  }, [data]);

  const participationCount = useMemo(() => {
    let yes = data.filter((d) => d.participation === "Yes").length;
    let no = data.filter((d) => d.participation !== "Yes").length;
    return [
      { status: "Participated", count: yes },
      { status: "Not Participated", count: no },
    ];
  }, [data]);

  //  Save (Add/Update) record - Now includes class/section/studentId
  const handleSave = async (record) => {
    const enhancedRecord = {
      ...record,
      class: record.class || selectedClass || "",
      section: record.section || selectedSection || "",
      studentId: record.studentId || null,
    };
    if (editRow) {
      await fetch(`${BASE_URL}/api/activities/${editRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enhancedRecord),
      });
    } else {
      await fetch(`${BASE_URL}/api/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enhancedRecord),
      });
    }

    const res = await fetch(`${BASE_URL}/api/activities`);
    const json = await res.json();
    if (json && json.length > 0) {
      const enhanced = json.map(item => ({
        ...item,
        class: item.class || "",
        section: item.section || "",
        studentId: item.studentId || null,
      }));
      setData(enhanced);
    } else {
      setData((prev) => {
        if (editRow) {
          return prev.map((r) => (r.id === editRow.id ? { ...enhancedRecord, id: editRow.id } : r));
        } else {
          return [{ ...enhancedRecord, id: Date.now() }, ...prev];
        }
      });
    }
  };

  //  Import multiple records
  const handleImport = async (records) => {
    for (let r of records) {
      await fetch(`${BASE_URL}/api/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
      });
    }
    const res = await fetch(`${BASE_URL}/api/activities`);
    setData(await res.json());
  };

  // Delete record
  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/api/activities/${id}`, { method: "DELETE" });
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Activities Report");
    XLSX.writeFile(wb, "activities_report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Activities Report", 14, 10);
    autoTable(doc, {
      head: [["Student", "Activity", "Participation", "Performance"]],
      body: data.map((row) => [
        row.student,
        row.activity,
        row.participation,
        row.performance,
      ]),
    });
    doc.save("activities_report.pdf");
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
            placeholder="Search by student..."
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
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-3 py-1 rounded-md"
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-500 text-white px-3 py-1 rounded-md"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-white shadow rounded-md p-4">
          <h3 className="text-sm text-gray-600 mb-1">Total Records</h3>
          <p className="text-2xl font-bold text-blue-600">{data.length}</p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <h3 className="text-sm text-gray-600 mb-1">Participated</h3>
          <p className="text-2xl font-bold text-green-600">
            {data.filter(d => d.participation === "Yes").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <h3 className="text-sm text-gray-600 mb-1">Excellent Performance</h3>
          <p className="text-2xl font-bold text-purple-600">
            {data.filter(d => d.performance === "Excellent").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-md p-4">
          <h3 className="text-sm text-gray-600 mb-1">Total Activities</h3>
          <p className="text-2xl font-bold text-orange-600">
            {new Set(data.map(d => d.activity)).size}
          </p>
        </div>
      </div>

      {/* 🔹 Charts */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Participation Status</h3>
          {participationCount.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={participationCount}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {participationCount.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Performance Distribution</h3>
          {performanceDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="performance" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Activity Participation Chart */}
      <div className="bg-white shadow rounded-md p-4 mt-6">
        <h3 className="font-semibold mb-2">Participation by Activity</h3>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(() => {
              const activityGroups = {};
              data.forEach((d) => {
                const act = d.activity || "Unknown";
                if (!activityGroups[act]) {
                  activityGroups[act] = { activity: act, participated: 0, notParticipated: 0 };
                }
                if (d.participation === "Yes") {
                  activityGroups[act].participated++;
                } else {
                  activityGroups[act].notParticipated++;
                }
              });
              return Object.values(activityGroups);
            })()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="activity" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="participated" stackId="a" fill="#00C49F" name="Participated" />
              <Bar dataKey="notParticipated" stackId="a" fill="#FF8042" name="Not Participated" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            No data available
          </div>
        )}
      </div>

      <table className="w-full border mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Student</th>
            <th className="border px-2 py-1">Class</th>
            <th className="border px-2 py-1">Section</th>
            <th className="border px-2 py-1">Activity</th>
            <th className="border px-2 py-1">Participation</th>
            <th className="border px-2 py-1">Performance</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id}>
              <td className="border px-2 py-1">{row.student || ""}</td>
              <td className="border px-2 py-1">
                {typeof row.class === 'object' ? (row.class?.name || row.class?._id || '—') : (row.class || '—')}
              </td>
              <td className="border px-2 py-1">
                {typeof row.section === 'object' ? (row.section?.name || row.section?._id || '—') : (row.section || '—')}
              </td>
              <td className="border px-2 py-1">{row.activity || ""}</td>
              <td className="border px-2 py-1">{row.participation || ""}</td>
              <td className="border px-2 py-1">{row.performance || ""}</td>
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
        <ActivityModal
          open={modalOpen}
          title="Activities Report"
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
function ActivityModal({
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
    student: "",
    studentId: "",
    class: selectedClass || "",
    section: selectedSection || "",
    activity: "",
    participation: "",
    performance: "",
  });

  useEffect(() => {
    if (editRow) {
      setForm({
        student: editRow.student || "",
        studentId: editRow.studentId || "",
        class: editRow.class || selectedClass || "",
        section: editRow.section || selectedSection || "",
        activity: editRow.activity || "",
        participation: editRow.participation || "",
        performance: editRow.performance || "",
      });
    } else {
      setForm({
        student: "",
        studentId: "",
        class: selectedClass || "",
        section: selectedSection || "",
        activity: "",
        participation: "",
        performance: "",
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
        student: student.personalInfo?.name || "",
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
                setForm({ ...form, class: e.target.value, section: "", studentId: "", student: "" });
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
                setForm({ ...form, section: e.target.value, studentId: "", student: "" });
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
              value={form.student}
              onChange={(e) => setForm({ ...form, student: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="Enter student name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Activity</label>
            <input
              type="text"
              value={form.activity}
              onChange={(e) => setForm({ ...form, activity: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
              placeholder="e.g., Basketball, Debate Club"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Participation</label>
            <select
              value={form.participation}
              onChange={(e) => setForm({ ...form, participation: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Performance</label>
            <select
              value={form.performance}
              onChange={(e) => setForm({ ...form, performance: e.target.value })}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="N/A">N/A</option>
            </select>
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
                student: "",
                studentId: "",
                class: "",
                section: "",
                activity: "",
                participation: "",
                performance: "",
              });
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            onClick={() => {
              setForm({
                student: "",
                studentId: "",
                class: "",
                section: "",
                activity: "",
                participation: "",
                performance: "",
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
