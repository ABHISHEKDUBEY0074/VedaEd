import React, { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import SmallModal from "./SmallModal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const COLORS = ["#4CAF50", "#F44336", "#FF9800", "#2196F3"];

export default function AttendanceReport() {
  // ✅ DUMMY STATIC DATA (No API)
  const [data, setData] = useState([
    { id: 1, name: "Aarav Sharma", totalDays: 26, present: 22 },
    { id: 2, name: "Priya Verma", totalDays: 26, present: 24 },
    { id: 3, name: "Rohan Singh", totalDays: 26, present: 18 },
    { id: 4, name: "Neha Gupta", totalDays: 26, present: 25 },
    { id: 5, name: "Aman Yadav", totalDays: 26, present: 20 },
    { id: 6, name: "Simran Kaur", totalDays: 26, present: 23 },
    { id: 7, name: "Kunal Mehta", totalDays: 26, present: 21 },
    { id: 8, name: "Alisha Khan", totalDays: 26, present: 19 },
    { id: 9, name: "Vikram Patil", totalDays: 26, present: 17 },
    { id: 10, name: "Tara Nair", totalDays: 26, present: 26 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const rowsPerPage = 8;

  // 🔍 Filter + Sort
  const filteredData = useMemo(() => {
    let d = data.filter((item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    d = d.sort((a, b) =>
      sortOrder === "asc"
        ? a.present - b.present
        : b.present - a.present
    );

    return d;
  }, [searchTerm, sortOrder, data]);

  // 🚦 Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // 📊 Charts Data
  const barData = data.map((d) => ({
    name: d.name,
    present: d.present,
    absent: d.totalDays - d.present,
  }));

  const totalDays = data.reduce((a, b) => a + b.totalDays, 0);
  const totalPresent = data.reduce((a, b) => a + b.present, 0);

  const pieData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalDays - totalPresent },
  ];

  // 💾 Save / Update Record
  const handleSave = (record) => {
    if (record.id) {
      // Update
      setData((prev) =>
        prev.map((d) => (d.id === record.id ? record : d))
      );
    } else {
      // Add
      setData((prev) => [
        ...prev,
        { id: Date.now(), ...record }
      ]);
    }
  };

  // 📥 Import Records (Excel)
  const handleImport = (records) => {
    const formatted = records.map((r) => ({
      id: Date.now() + Math.random(),
      name: r.name,
      totalDays: Number(r.totalDays) || 0,
      present: Number(r.present) || 0,
    }));
    setData((prev) => [...prev, ...formatted]);
  };

  // ❌ Delete Row
  const handleDelete = (id) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };

  // 📤 Export Excel
  const handleExportExcel = () => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Attendance");
    writeFile(wb, "AttendanceReport.xlsx");
  };

  // 📤 Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Name", "Total Days", "Present", "Absent", "Attendance %"]],
      body: data.map((row) => [
        row.name,
        row.totalDays,
        row.present,
        row.totalDays - row.present,
        ((row.present / row.totalDays) * 100).toFixed(1) + "%",
      ]),
    });
    doc.save("AttendanceReport.pdf");
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      {/* 🔍 Search + Buttons */}
      <div className="flex justify-between mb-3">
        <input
          type="text"
          placeholder="Search student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded-md"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-gray-200 px-3 py-1 rounded-md"
          >
            Sort ({sortOrder === "asc" ? "↑" : "↓"})
          </button>

          <button
            onClick={() => {
              setEditRow(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md"
          >
            <FiPlus /> Add
          </button>

          <button
            onClick={handleExportExcel}
            className="bg-blue-600 text-white px-3 py-1 rounded-md"
          >
            Excel
          </button>

          <button
            onClick={handleExportPDF}
            className="bg-red-600 text-white px-3 py-1 rounded-md"
          >
            PDF
          </button>
        </div>
      </div>

      {/* 📊 Charts */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Bar Chart */}
        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Student Attendance</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" stackId="a" fill="#4CAF50" />
              <Bar dataKey="absent" stackId="a" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Overall Attendance</h3>

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
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📋 Table */}
      <table className="w-full border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Total Days</th>
            <th className="border px-2 py-1">Present</th>
            <th className="border px-2 py-1">Absent</th>
            <th className="border px-2 py-1">Attendance %</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentRows.map((row) => {
            const absent = row.totalDays - row.present;
            const percent = ((row.present / row.totalDays) * 100).toFixed(1);

            return (
              <tr key={row.id}>
                <td className="border px-2 py-1">{row.name}</td>
                <td className="border px-2 py-1">{row.totalDays}</td>
                <td className="border px-2 py-1">{row.present}</td>
                <td className="border px-2 py-1">{absent}</td>
                <td className="border px-2 py-1">{percent}%</td>

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
            );
          })}
        </tbody>
      </table>

      {/* 📄 Pagination */}
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

      {/* 🟢 Modal */}
      <SmallModal
        open={modalOpen}
        title={editRow ? "Edit Attendance" : "Add Attendance"}
        fields={["name", "totalDays", "present"]}
        initial={editRow}
        onSave={handleSave}
        onImport={handleImport}
        onClose={() => setModalOpen(false)}
        editRow={editRow}
      />
    </div>
  );
}
