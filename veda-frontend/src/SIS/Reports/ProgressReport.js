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
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const initialData = [
  { id: 1, name: "Aarav Sharma", activity: "Sports", progress: 75, status: "Good" },
  { id: 2, name: "Ishita Verma", activity: "Music", progress: 90, status: "Excellent" },
  { id: 3, name: "Rohan Gupta", activity: "Dance", progress: 65, status: "Average" },
  { id: 4, name: "Simran Kaur", activity: "Art", progress: 50, status: "Needs Improvement" },
  { id: 5, name: "Ananya Joshi", activity: "Sports", progress: 85, status: "Good" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d32f2f"];

export default function ProgressReport() {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    let d = data.filter((item) =>
      (item.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    );
    d = d.sort((a, b) =>
      sortOrder === "asc"
        ? (a.progress || 0) - (b.progress || 0)
        : (b.progress || 0) - (a.progress || 0)
    );
    return d;
  }, [sortOrder, searchTerm, data]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const activityAvg = useMemo(() => {
    const grouped = {};
    data.forEach((d) => {
      const act = d.activity || "Unknown";
      if (!grouped[act]) grouped[act] = [];
      grouped[act].push(Number(d.progress) || 0);
    });
    return Object.entries(grouped).map(([activity, progress]) => ({
      activity,
      avg: (progress.reduce((a, b) => a + b, 0) / progress.length).toFixed(1),
    }));
  }, [data]);

  const statusDistribution = useMemo(() => {
    const grouped = {};
    data.forEach((d) => {
      const s = d.status || "NA";
      grouped[s] = (grouped[s] || 0) + 1;
    });
    return Object.entries(grouped).map(([status, count]) => ({
      status,
      count,
    }));
  }, [data]);

  const handleSave = (record) => {
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
        name: r.name || "",
        activity: r.activity || "",
        progress: r.progress || 0,
        status: r.status || "",
      })),
    ]);
  };

  const handleDelete = (id) => {
    setData((prev) => prev.filter((r) => r.id !== id));
  };


  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Progress Report");
    XLSX.writeFile(wb, "progress_report.xlsx");
  };

 
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Progress Report", 14, 10);
    autoTable(doc, {
      head: [["Name", "Activity", "Progress", "Status"]],
      body: data.map((row) => [row.name, row.activity, row.progress, row.status]),
    });
    doc.save("progress_report.pdf");
  };

  return (
    <div>
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
            Sort by Progress ({sortOrder === "asc" ? "↑" : "↓"})
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
          <h3 className="font-semibold mb-2">Activity Wise Average</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activityAvg}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="activity" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusDistribution}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusDistribution.map((_, index) => (
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
            <th className="border px-2 py-1">Activity</th>
            <th className="border px-2 py-1">Progress</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id}>
              <td className="border px-2 py-1">{row.name || ""}</td>
              <td className="border px-2 py-1">{row.activity || ""}</td>
              <td className="border px-2 py-1">{row.progress || 0}</td>
              <td className="border px-2 py-1">{row.status || ""}</td>
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
        title="Progress Report"
        fields={["name", "activity", "progress", "status"]}
        editRow={editRow}
      />
    </div>
  );
}
