import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import SmallModal from "./SmallModal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0"];

export default function DisciplineReport() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const rowsPerPage = 6;

  // ✅ Fetch from API on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/discipline")
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.records)) {
          setData(res.data.records);
        } else {
          console.error("Unexpected response format", res.data);
        }
      })
      .catch((err) => console.error("Error fetching discipline records:", err));
  }, []);

  // ✅ Add or Update record (API + state update)
  const handleSave = async (record) => {
    try {
      if (editRow) {
        const res = await axios.put(
          `http://localhost:5000/api/discipline/${editRow.id}`,
          record
        );
        if (res.data.success) {
          setData((prev) =>
            prev.map((r) => (r.id === editRow.id ? res.data.record : r))
          );
        }
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/discipline",
          record
        );
        if (res.data.success) {
          setData((prev) => [res.data.record, ...prev]);
        }
      }
    } catch (err) {
      console.error("Error saving record:", err);
    }
  };

  // ✅ Delete record
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/discipline/${id}`);
      if (res.data.success) {
        setData((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  // ✅ Import Excel (bulk add via API)
  const handleImport = async (rows) => {
    try {
      const res = await axios.post("http://localhost:5000/api/discipline/bulk", rows);
      if (res.data.success) {
        setData((prev) => [...res.data.records, ...prev]);
      }
    } catch (err) {
      console.error("Error importing records:", err);
    }
  };

  // ✅ Filtering + Sorting
  const filteredData = useMemo(() => {
    let d = data.filter((item) =>
      (item.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    );
    d = d.sort((a, b) =>
      sortOrder === "asc"
        ? (a.name || "").localeCompare(b.name || "")
        : (b.name || "").localeCompare(a.name || "")
    );
    return d;
  }, [searchTerm, sortOrder, data]);

  // ✅ Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;

  // ✅ Charts
  const typeCounts = data.reduce((acc, cur) => {
    const t = cur.type || "Unknown";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.keys(typeCounts).map((t) => ({ type: t, count: typeCounts[t] }));

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
      head: [["Name", "Incident Type", "Severity", "Date"]],
      body: data.map((r) => [r.name || "", r.type || "", r.severity || "", r.date || ""]),
      startY: 16,
    });
    doc.save("discipline_report.pdf");
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
            Sort by Name ({sortOrder === "asc" ? "↑" : "↓"})
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

          <button onClick={exportExcel} className="bg-blue-600 text-white px-3 py-1 rounded-md">
            Export Excel
          </button>
          <button onClick={exportPDF} className="bg-red-600 text-white px-3 py-1 rounded-md">
            Export PDF
          </button>
        </div>
      </div>

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

      <table className="w-full border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Incident Type</th>
            <th className="border px-2 py-1">Severity</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row) => (
            <tr key={row.id}>
              <td className="border px-2 py-1">{row.name || ""}</td>
              <td className="border px-2 py-1">{row.type || ""}</td>
              <td className="border px-2 py-1">{row.severity || ""}</td>
              <td className="border px-2 py-1">{row.date || ""}</td>
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
                <button className="p-1 text-red-600" onClick={() => handleDelete(row.id)}>
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
        <span>Page {currentPage} of {totalPages}</span>
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
        title={editRow ? "Edit Incident" : "Add Incident"}
        fields={["name", "type", "severity", "date"]}
        initial={editRow}
        onSave={handleSave}
        onImport={handleImport}
        onClose={() => setModalOpen(false)}
        editRow={editRow}
      />
    </div>
  );
}
