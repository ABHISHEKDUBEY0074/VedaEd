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

const API_BASE = "http://localhost:5000";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d32f2f"];

// ------------------------------
// Auto Grade Logic
// ------------------------------
const calculateGrade = (marks) => {
  const m = Number(marks);
  if (Number.isNaN(m)) return "N/A";
  if (m >= 90) return "A";
  if (m >= 75) return "B";
  if (m >= 60) return "C";
  if (m >= 45) return "D";
  return "E";
};

export default function AcademicReport() {
  // data + UI state
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc"); // desc by default (higher marks first)
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const [filterClass, setFilterClass] = useState("All");
  const [filterSection, setFilterSection] = useState("All");

  const rowsPerPage = 10;

  // -------------------------------------------
  // Dummy + API Load
  // -------------------------------------------
  useEffect(() => {
    const dummy = [
      {
        id: 1,
        name: "Aarav Sharma",
        class: "5",
        section: "A",
        subject: "Math",
        marks: 92,
        grade: "A",
        prevMarks: 87,
      },
      {
        id: 2,
        name: "Priya Verma",
        class: "5",
        section: "B",
        subject: "Science",
        marks: 85,
        grade: "B",
        prevMarks: 78,
      },
      {
        id: 3,
        name: "Rohan Singh",
        class: "6",
        section: "A",
        subject: "English",
        marks: 78,
        grade: "C",
        prevMarks: 74,
      },
      {
        id: 4,
        name: "Ananya Gupta",
        class: "6",
        section: "A",
        subject: "Math",
        marks: 66,
        grade: "D",
        prevMarks: 69,
      },
      {
        id: 5,
        name: "Vikram Malhotra",
        class: "7",
        section: "C",
        subject: "Science",
        marks: 59,
        grade: "E",
        prevMarks: 61,
      },
      {
        id: 6,
        name: "Kavya Kapoor",
        class: "5",
        section: "A",
        subject: "English",
        marks: 88,
        grade: "B",
        prevMarks: 81,
      },
    ];

    // immediate dummy show for snappy UI
    setData(dummy);

    // try fetching real data (if available)
    fetch(`${API_BASE}/api/academic`)
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json) && json.length > 0) setData(json);
      })
      .catch(() => {
        // ignore network errors — dummy remains
      });
  }, []);

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterClass, filterSection, sortOrder]);

  // ------------------------------
  // FILTERED + SEARCH + SORT
  // ------------------------------
  const filteredData = useMemo(() => {
    let d = [...data];

    // Search
    if (searchTerm?.trim()) {
      d = d.filter((item) =>
        (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Class Filter
    if (filterClass && filterClass !== "All") {
      d = d.filter((it) => String(it.class) === String(filterClass));
    }

    // Section Filter
    if (filterSection && filterSection !== "All") {
      d = d.filter((it) => String(it.section) === String(filterSection));
    }

    // Sort by marks
    d = d.sort((a, b) =>
      sortOrder === "asc" ? a.marks - b.marks : b.marks - a.marks
    );

    return d;
  }, [data, searchTerm, sortOrder, filterClass, filterSection]);

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  // ------------------------------
  // ANALYTICS  (Gradebook Style)
  // ------------------------------

  // Subject average (based on filtered data so charts reflect filters)
  const subjectAvg = useMemo(() => {
    const group = {};
    filteredData.forEach((d) => {
      const subj = d.subject || "Unknown";
      if (!group[subj]) group[subj] = [];
      group[subj].push(Number(d.marks || 0));
    });

    return Object.entries(group).map(([subject, arr]) => ({
      subject,
      avg: arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "0",
    }));
  }, [filteredData]);

  // Grade distribution (filtered)
  const gradeDistribution = useMemo(() => {
    const g = {};
    filteredData.forEach((d) => {
      const gg = d.grade || calculateGrade(d.marks || 0);
      g[gg] = (g[gg] || 0) + 1;
    });
    return Object.entries(g).map(([grade, count]) => ({ grade, count }));
  }, [filteredData]);

  // Top performers list (filtered)
  const topPerformers = useMemo(() => {
    return [...filteredData]
      .sort((a, b) => b.marks - a.marks)
      .slice(0, 5); // top 5
  }, [filteredData]);

  // Pass / Fail counts
  const passFail = useMemo(() => {
    let pass = 0,
      fail = 0;
    filteredData.forEach((d) => {
      if (Number(d.marks) >= 40) pass++;
      else fail++;
    });
    return { pass, fail };
  }, [filteredData]);

  // Overall average
  const overallAvg = useMemo(() => {
    if (!filteredData.length) return "0.0";
    const avg =
      filteredData.reduce((acc, r) => acc + Number(r.marks || 0), 0) / filteredData.length;
    return avg.toFixed(1);
  }, [filteredData]);

  // Improvement stats
  const improvementStats = useMemo(() => {
    return filteredData.map((d) => ({
      id: d.id,
      name: d.name,
      prev: Number(d.prevMarks || 0),
      now: Number(d.marks || 0),
      change: Number(d.marks || 0) - Number(d.prevMarks || 0),
    }));
  }, [filteredData]);

  // ------------------------------
  // SAVE / UPDATE
  // ------------------------------
  const handleSave = async (record) => {
    // ensure marks numeric
    const payload = { ...record };
    if (payload.marks !== undefined) payload.marks = Number(payload.marks);

    // auto-grade if missing
    if (!payload.grade && payload.marks !== undefined) {
      payload.grade = calculateGrade(payload.marks);
    }

    if (editRow) {
      // update
      try {
        await fetch(`${API_BASE}/api/academic/${editRow.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        // ignore network failure: optimistic UI handled by refetch
      }
    } else {
      // create
      try {
        await fetch(`${API_BASE}/api/academic`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {}
    }

    // refresh (try API, fallback to local merge)
    try {
      const res = await fetch(`${API_BASE}/api/academic`);
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch {
      // if API not available, merge local change
      if (editRow) {
        setData((prev) => prev.map((r) => (r.id === editRow.id ? { ...r, ...payload } : r)));
      } else {
        const id = Date.now();
        setData((prev) => [{ id, ...payload }, ...prev]);
      }
    }

    setEditRow(null);
    setModalOpen(false);
  };

  // Import (array of records)
  const handleImport = async (records) => {
    const toSend = records.map((r) => ({ ...r, grade: r.grade || calculateGrade(r.marks) }));
    // POST each or do batch depending on API; using sequential for reliability
    for (const rec of toSend) {
      try {
        await fetch(`${API_BASE}/api/academic`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rec),
        });
      } catch {}
    }

    // refresh
    try {
      const res = await fetch(`${API_BASE}/api/academic`);
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch {
      // fallback: append locally
      setData((prev) => [...toSend.map((r, i) => ({ id: Date.now() + i, ...r })), ...prev]);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this record?")) return;
    try {
      await fetch(`${API_BASE}/api/academic/${id}`, { method: "DELETE" });
      // optimistic update
      setData((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // fallback local
      setData((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Export filteredData to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Academic Report");
    XLSX.writeFile(wb, "academic_report.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Academic Report", 14, 10);
    autoTable(doc, {
      head: [["Name", "Class", "Section", "Subject", "Marks", "Grade"]],
      body: filteredData.map((row) => [
        row.name,
        row.class,
        row.section,
        row.subject,
        row.marks,
        row.grade,
      ]),
    });
    doc.save("academic_report.pdf");
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Academic Report
        </h2>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            Showing {filteredData.length} records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Export Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
            >
              Export PDF
            </button>
            <button
              onClick={() => {
                setEditRow(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-md text-sm"
            >
              <FiPlus /> Add Record
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex gap-2 items-center">
          <select
            className="border px-3 py-1 rounded-md"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="All">All Classes</option>
            {/* you can change these options to dynamic */}
            <option value="5">Class 5</option>
            <option value="6">Class 6</option>
            <option value="7">Class 7</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
          </select>

          <select
            className="border px-3 py-1 rounded-md"
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>

          <input
            type="text"
            placeholder="Search by student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-1 rounded-md"
          />
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
            className="bg-gray-100 px-3 py-1 rounded-md text-sm"
          >
            Sort by Marks ({sortOrder === "asc" ? "↑" : "↓"})
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Overall Average</p>
          <p className="text-2xl font-semibold text-gray-800 mt-2">{overallAvg}%</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Pass</p>
          <p className="text-2xl font-semibold text-green-600 mt-2">{passFail.pass}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Fail</p>
          <p className="text-2xl font-semibold text-red-600 mt-2">{passFail.fail}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Top Performers</p>
          <div className="mt-2 space-y-1">
            {topPerformers.slice(0, 3).map((t) => (
              <div key={t.id} className="text-sm text-gray-700">
                {t.name} <span className="text-xs text-gray-400">• {t.marks}%</span>
              </div>
            ))}
            {!topPerformers.length && <div className="text-sm text-gray-400">—</div>}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Subject Wise Average</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAvg}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avg" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-3">Grade Distribution</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  dataKey="count"
                  nameKey="grade"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {gradeDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ---------------- Enhanced Gradebook Table ---------------- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm">Student</th>
              <th className="px-4 py-3 text-sm text-center">Class</th>
              <th className="px-4 py-3 text-sm text-center">Section</th>
              <th className="px-4 py-3 text-left text-sm">Subject</th>
              <th className="px-4 py-3 text-sm text-center">Marks</th>
              <th className="px-4 py-3 text-sm text-center">Trend</th>
              <th className="px-4 py-3 text-sm text-center">Grade</th>
              <th className="px-4 py-3 text-sm text-center">Status</th>
              <th className="px-4 py-3 text-sm text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                  No records yet. Adjust filters or add a record.
                </td>
              </tr>
            ) : (
              currentRows.map((row) => {
                const trend = Number(row.marks || 0) - Number(row.prevMarks || 0);
                const isTopper = row.marks === topPerformers[0]?.marks;

                return (
                  <tr
                    key={row.id}
                    className={`border-t hover:bg-blue-50 transition ${
                      isTopper ? "bg-blue-50/40 font-medium" : ""
                    }`}
                  >
                    <td className="px-4 py-3">{row.name}</td>

                    <td className="px-4 py-3 text-center">{row.class}</td>

                    <td className="px-4 py-3 text-center">{row.section}</td>

                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-700">
                        {row.subject}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">{row.marks}</td>

                    <td className="px-4 py-3 text-center">
                      {trend > 0 ? (
                        <span className="text-green-600 font-semibold">▲ {trend}</span>
                      ) : trend < 0 ? (
                        <span className="text-red-600 font-semibold">▼ {Math.abs(trend)}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-md text-white text-sm ${
                          row.grade === "A"
                            ? "bg-green-600"
                            : row.grade === "B"
                            ? "bg-blue-600"
                            : row.grade === "C"
                            ? "bg-yellow-500 text-black"
                            : row.grade === "D"
                            ? "bg-orange-500"
                            : "bg-red-600"
                        }`}
                      >
                        {row.grade}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {Number(row.marks || 0) >= 40 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm">
                          Pass
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm">
                          Fail
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setEditRow(row);
                            setModalOpen(true);
                          }}
                          title="Edit record"
                        >
                          <FiEdit />
                        </button>

                        <button
                          className="p-1 text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(row.id)}
                          title="Delete record"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {Math.min(filteredData.length, currentPage * rowsPerPage)} of {filteredData.length} records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-100 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <SmallModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditRow(null);
        }}
        onSave={handleSave}
        onImport={handleImport}
        title="Academic Record"
        fields={["name", "class", "section", "subject", "marks", "grade", "prevMarks"]}
        editRow={editRow}
      />
    </div>
  );
}
