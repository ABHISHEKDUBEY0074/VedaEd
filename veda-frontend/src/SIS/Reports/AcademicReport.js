import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import SmallModal from "./SmallModal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE = "http://localhost:5000"; //  Backend ka base URL

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d32f2f"];

export default function AcademicReport() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const rowsPerPage = 10;

  // ✅ Fetch Data from API
  useEffect(() => {
    fetch(`${API_BASE}/api/academic`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const filteredData = useMemo(() => {
    let d = data.filter((item) =>
      (item.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    );
    d = d.sort((a, b) =>
      sortOrder === "asc"
        ? (a.marks || 0) - (b.marks || 0)
        : (b.marks || 0) - (a.marks || 0)
    );
    return d;
  }, [sortOrder, searchTerm, data]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const subjectAvg = useMemo(() => {
    const grouped = {};
    data.forEach((d) => {
      const subj = d.subject || "Unknown";
      if (!grouped[subj]) grouped[subj] = [];
      grouped[subj].push(Number(d.marks) || 0);
    });
    return Object.entries(grouped).map(([subject, marks]) => ({
      subject,
      avg: (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1),
    }));
  }, [data]);

  const gradeDistribution = useMemo(() => {
    const grouped = {};
    data.forEach((d) => {
      const g = d.grade || "NA";
      grouped[g] = (grouped[g] || 0) + 1;
    });
    return Object.entries(grouped).map(([grade, count]) => ({
      grade,
      count,
    }));
  }, [data]);

  // ✅ Save (Add / Update) Record
  const handleSave = async (record) => {
    if (editRow) {
      // Update API
      await fetch(`${API_BASE}/api/academic/${editRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    } else {
      // Add API
      await fetch(`${API_BASE}/api/academic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    }

    // Refresh data
    const res = await fetch(`${API_BASE}/api/academic`);
    setData(await res.json());
  };

  // ✅ Import multiple records
  const handleImport = async (records) => {
    for (let r of records) {
      await fetch(`${API_BASE}/api/academic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(r),
      });
    }
    const res = await fetch(`${API_BASE}/api/academic`);
    setData(await res.json());
  };

  // ✅ Delete record
  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/api/academic/${id}`, { method: "DELETE" });
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Academic Report");
    XLSX.writeFile(wb, "academic_report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Academic Report", 14, 10);
    autoTable(doc, {
      head: [["Name", "Subject", "Marks", "Grade"]],
      body: data.map((row) => [row.name, row.subject, row.marks, row.grade]),
    });
    doc.save("academic_report.pdf");
  };

  return (
     <div className="p-6 bg-gray-200 min-h-screen">
      <div className="flex justify-between mb-3">
        <input
          type="text"
          placeholder="Search by student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded-md"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-gray-200 px-3 py-1 rounded-md"
          >
            Sort by Marks ({sortOrder === "asc" ? "↑" : "↓"})
          </button>
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

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Subject Wise Average</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectAvg}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
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
                {gradeDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <table className="w-full border mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Subject</th>
            <th className="border px-2 py-1">Marks</th>
            <th className="border px-2 py-1">Grade</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id}>
              <td className="border px-2 py-1">{row.name || ""}</td>
              <td className="border px-2 py-1">{row.subject || ""}</td>
              <td className="border px-2 py-1">{row.marks || 0}</td>
              <td className="border px-2 py-1">{row.grade || ""}</td>
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

      <SmallModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onImport={handleImport}
        title="Academic Report"
        fields={["name", "subject", "marks", "grade"]}
        editRow={editRow}
      />
    </div>
  );
}
