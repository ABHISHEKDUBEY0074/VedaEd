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

const initialData = [
  { id: 1, name: "Aarav Sharma", totalDays: 100, present: 92 },
  { id: 2, name: "Ishita Verma", totalDays: 100, present: 87 },
  { id: 3, name: "Rohan Gupta", totalDays: 100, present: 76 },
  { id: 4, name: "Simran Kaur", totalDays: 100, present: 64 },
];

const COLORS = ["#4CAF50", "#F44336", "#FF9800", "#2196F3"];

export default function AttendanceReport() {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const rowsPerPage = 8;

  const filteredData = useMemo(() => {
    let d = data.filter((item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    d = d.sort((a, b) =>
      sortOrder === "asc"
        ? (a.present || 0) - (b.present || 0)
        : (b.present || 0) - (a.present || 0)
    );
    return d;
  }, [searchTerm, sortOrder, data]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const barData = data.map((d) => ({
    name: d.name || "",
    present: Number(d.present) || 0,
    absent: (Number(d.totalDays) || 0) - (Number(d.present) || 0),
  }));

  const totalDays = data.reduce((a, b) => a + (Number(b.totalDays) || 0), 0);
  const totalPresent = data.reduce((a, b) => a + (Number(b.present) || 0), 0);

  const pieData = [
    { name: "Present", value: totalPresent || 0 },
    { name: "Absent", value: (totalDays - totalPresent) || 0 },
  ];

  const handleSave = (record) => {
    record.totalDays = Number(record.totalDays) || 0;
    record.present = Number(record.present) || 0;
    if (editRow) {
      setData((prev) =>
        prev.map((r) => (r.id === editRow.id ? { ...record, id: r.id } : r))
      );
    } else {
      setData((prev) => [...prev, { ...record, id: Date.now() }]);
    }
  };

  const handleImport = (records) => {
    setData((prev) => [
      ...prev,
      ...records.map((r) => ({
        id: Date.now() + Math.random(),
        name: r.name || "Unknown",
        totalDays: Number(r.totalDays) || 0,
        present: Number(r.present) || 0,
      })),
    ]);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  const handleExportExcel = () => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Attendance");
    writeFile(wb, "AttendanceReport.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Name", "Total Days", "Present", "Absent", "Attendance %"]],
      body: data.map((row) => [
        row.name || "",
        row.totalDays || 0,
        row.present || 0,
        (row.totalDays || 0) - (row.present || 0),
        ((row.present / (row.totalDays || 1)) * 100).toFixed(1) + "%",
      ]),
    });
    doc.save("AttendanceReport.pdf");
  };

  return (
    <div>
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
            Sort by Attendance ({sortOrder === "asc" ? "↑" : "↓"})
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
            onClick={handleExportExcel}
            className="bg-blue-600 text-white px-3 py-1 rounded-md"
          >
            Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-red-600 text-white px-3 py-1 rounded-md"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Student Attendance</h3>
          {barData.length > 0 ? (
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
          ) : (
            <p className="text-center text-gray-500">No data to display</p>
          )}
        </div>

        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Overall Attendance</h3>
          {totalDays > 0 ? (
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
            const absent = (row.totalDays || 0) - (row.present || 0);
            const percent = ((row.present / (row.totalDays || 1)) * 100).toFixed(1);
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
