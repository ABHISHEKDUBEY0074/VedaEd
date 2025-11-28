import React, { useState, useMemo } from "react";
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
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const COLORS = ["#4CAF50", "#F44336", "#FF9800", "#2196F3"];

export default function AttendanceReport() {
  const [data, setData] = useState([
    { id: 1, name: "Aarav Sharma", class: "5", section: "A", totalDays: 26, present: 22 },
    { id: 2, name: "Priya Verma", class: "5", section: "B", totalDays: 26, present: 24 },
    { id: 3, name: "Rohan Singh", class: "6", section: "A", totalDays: 26, present: 18 },
    { id: 4, name: "Neha Gupta", class: "6", section: "B", totalDays: 26, present: 25 },
    { id: 5, name: "Aman Yadav", class: "7", section: "A", totalDays: 26, present: 20 },
    { id: 6, name: "Simran Kaur", class: "7", section: "B", totalDays: 26, present: 23 },
    { id: 7, name: "Kunal Mehta", class: "8", section: "A", totalDays: 26, present: 21 },
    { id: 8, name: "Alisha Khan", class: "8", section: "B", totalDays: 26, present: 19 },
    { id: 9, name: "Vikram Patil", class: "9", section: "A", totalDays: 26, present: 17 },
    { id: 10, name: "Tara Nair", class: "9", section: "B", totalDays: 26, present: 26 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const rowsPerPage = 8;

  const classes = useMemo(() => {
    const cls = Array.from(new Set(data.map((d) => d.class))).sort();
    return ["All", ...cls];
  }, [data]);

  const sections = useMemo(() => {
    const sec = Array.from(new Set(data.map((d) => d.section))).sort();
    return ["All", ...sec];
  }, [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    let filtered = data.filter((item) => {
      const matchesSearch =
        (item.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = classFilter === "All" || item.class === classFilter;
      const matchesSection = sectionFilter === "All" || item.section === sectionFilter;
      return matchesSearch && matchesClass && matchesSection;
    });

    filtered = filtered.sort((a, b) =>
      sortOrder === "asc" ? a.present - b.present : b.present - a.present
    );

    return filtered;
  }, [searchTerm, classFilter, sectionFilter, sortOrder, data]);

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Graph data from filtered data now
  const barData = filteredData.map((d) => ({
    name: d.name,
    present: d.present,
    absent: d.totalDays - d.present,
  }));

  const totalDays = filteredData.reduce((a, b) => a + b.totalDays, 0);
  const totalPresent = filteredData.reduce((a, b) => a + b.present, 0);

  const pieData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalDays - totalPresent },
  ];

  // Save / Update Record
  const handleSave = (record) => {
    if (record.id) {
      setData((prev) => prev.map((d) => (d.id === record.id ? record : d)));
    } else {
      setData((prev) => [...prev, { id: Date.now(), ...record }]);
    }
  };

  // Import Records (Excel)
  const handleImport = (records) => {
    const formatted = records.map((r) => ({
      id: Date.now() + Math.random(),
      name: r.name,
      class: r.class || "",
      section: r.section || "",
      totalDays: Number(r.totalDays) || 0,
      present: Number(r.present) || 0,
    }));
    setData((prev) => [...prev, ...formatted]);
  };

  // Delete Row
  const handleDelete = (id) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };

  // Export Excel
  const handleExportExcel = () => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Attendance");
    writeFile(wb, "AttendanceReport.xlsx");
  };

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Name", "Class", "Section", "Total Days", "Present", "Absent", "Attendance %"]],
      body: data.map((row) => [
        row.name,
        row.class,
        row.section,
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
       {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
      Attendance Report
    </h2>

    <div className="flex items-center gap-3">
      <div className="text-sm text-gray-600">
        Showing {filteredData.length} records
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleExportExcel}
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm"
        >
          Export Excel
        </button>
        <button
          onClick={handleExportPDF}
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
        value={classFilter}
        onChange={(e) => setClassFilter(e.target.value)}
      >
        <option value="All">All Classes</option>
        {classes.map((cls) => (
          <option key={cls} value={cls}>
            Class {cls}
          </option>
        ))}
      </select>

      <select
        className="border px-3 py-1 rounded-md"
        value={sectionFilter}
        onChange={(e) => setSectionFilter(e.target.value)}
      >
        <option value="All">All Sections</option>
        {sections.map((sec) => (
          <option key={sec} value={sec}>
            Section {sec}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search by name..."
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
        Sort by Attendance ({sortOrder === "asc" ? "↑" : "↓"})
      </button>
    </div>
  </div>
      {/* Charts */}
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

      {/* Table with Gradebook-style look */}
      <table className="w-full mt-4 bg-white shadow rounded-md overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            <th className="px-4 py-2 text-left font-semibold border-r border-gray-300">Name</th>
            <th className="px-4 py-2 text-center font-semibold border-r border-gray-300">Class</th>
            <th className="px-4 py-2 text-center font-semibold border-r border-gray-300">Section</th>
            <th className="px-4 py-2 text-center font-semibold border-r border-gray-300">Total Days</th>
            <th className="px-4 py-2 text-center font-semibold border-r border-gray-300">Present</th>
            <th className="px-4 py-2 text-center font-semibold border-r border-gray-300">Absent</th>
            <th className="px-4 py-2 text-center font-semibold border-r border-gray-300">Attendance %</th>
            <th className="px-4 py-2 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, idx) => {
            const absent = row.totalDays - row.present;
            const percent = ((row.present / row.totalDays) * 100).toFixed(1);

            return (
              <tr
                key={row.id}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                style={{ transition: "background-color 0.15s" }}
              >
                <td className="px-4 py-2 border-r border-gray-300">{row.name}</td>
                <td className="px-4 py-2 text-center border-r border-gray-300">{row.class}</td>
                <td className="px-4 py-2 text-center border-r border-gray-300">{row.section}</td>
                <td className="px-4 py-2 text-center border-r border-gray-300">{row.totalDays}</td>
                <td className="px-4 py-2 text-center border-r border-gray-300">{row.present}</td>
                <td className="px-4 py-2 text-center border-r border-gray-300">{absent}</td>
                <td className="px-4 py-2 text-center border-r border-gray-300">{percent}%</td>

                <td className="px-4 py-2 text-center">
                  <button
                    className="p-1 text-blue-600 hover:text-blue-800 transition"
                    onClick={() => {
                      setEditRow(row);
                      setModalOpen(true);
                    }}
                    aria-label={`Edit ${row.name}`}
                  >
                    <FiEdit />
                  </button>

                  <button
                    className="p-1 ml-2 text-red-600 hover:text-red-800 transition"
                    onClick={() => handleDelete(row.id)}
                    aria-label={`Delete ${row.name}`}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            );
          })}
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

      <SmallModal
        open={modalOpen}
        title={editRow ? "Edit Attendance" : "Add Attendance"}
        fields={["name", "class", "section", "totalDays", "present"]}
        initial={editRow}
        onSave={handleSave}
        onImport={handleImport}
        onClose={() => setModalOpen(false)}
        editRow={editRow}
      />
    </div>
  );
}
