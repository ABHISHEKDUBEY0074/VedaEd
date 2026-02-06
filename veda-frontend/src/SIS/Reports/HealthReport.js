import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid
} from "recharts";
import SmallModal from "./SmallModal";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import config from "../../config";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function HealthReport() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const rowsPerPage = 10;

  // Dummy fallback data
  const dummyHealthData = [
    { id: 1, name: "John Smith", checkup: "Annual Physical", status: "Healthy", bmi: 22.5 },
    { id: 2, name: "Sarah Johnson", checkup: "Vision Test", status: "Healthy", bmi: 20.8 },
    { id: 3, name: "Michael Brown", checkup: "Dental Checkup", status: "Needs Follow-up", bmi: 24.2 },
    { id: 4, name: "Emily Davis", checkup: "Annual Physical", status: "Healthy", bmi: 19.5 },
    { id: 5, name: "David Wilson", checkup: "Hearing Test", status: "Healthy", bmi: 23.1 },
    { id: 6, name: "Jessica Martinez", checkup: "Vision Test", status: "Needs Follow-up", bmi: 21.9 }
  ];

  useEffect(() => {
    axios
      .get(`${config.API_BASE_URL}/health`)
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.records) && res.data.records.length > 0) {
          setData(res.data.records);
        } else {
          setData(dummyHealthData);
        }
      })
      .catch(() => setData(dummyHealthData));
  }, []);

  // Save record
  const handleSave = async (record) => {
    try {
      if (editRow) {
        const res = await axios.put(`${config.API_BASE_URL}/health/${editRow.id}`, record);
        if (res.data.success) {
          setData((prev) => prev.map((r) => (r.id === editRow.id ? res.data.record : r)));
        }
      } else {
        const res = await axios.post(`${config.API_BASE_URL}/health`, record);
        if (res.data.success) {
          setData((prev) => [res.data.record, ...prev]);
        }
      }
    } catch { }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${config.API_BASE_URL}/health/${id}`);
      if (res.data.success) {
        setData((prev) => prev.filter((r) => r.id !== id));
      }
    } catch { }
  };

  // Import
  const handleImport = async (records) => {
    try {
      const res = await axios.post(`${config.API_BASE_URL}/health/bulk`, records);
      if (res.data.success) setData((prev) => [...res.data.records, ...prev]);
    } catch { }
  };

  // Search + Sorting
  const filteredData = useMemo(() => {
    let d = data.filter((item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    d = d.sort((a, b) =>
      sortOrder === "asc" ? a.bmi - b.bmi : b.bmi - a.bmi
    );
    return d;
  }, [searchTerm, sortOrder, data]);

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  // Charts
  const checkupDistribution = useMemo(() => {
    const grouped = {};
    data.forEach((d) => {
      const c = d.checkup || "Unknown";
      grouped[c] = (grouped[c] || 0) + 1;
    });
    return Object.entries(grouped).map(([c, count]) => ({ checkup: c, count }));
  }, [data]);

  const statusDistribution = useMemo(() => {
    const group = {};
    data.forEach((d) => {
      group[d.status] = (group[d.status] || 0) + 1;
    });
    return Object.entries(group).map(([status, count]) => ({ status, count }));
  }, [data]);

  // Export Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.map(({ id, ...rest }) => rest));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Health Report");
    XLSX.writeFile(wb, "health_report.xlsx");
  };

  // Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Health Report", 14, 10);
    autoTable(doc, {
      head: [["Name", "Checkup", "Status", "BMI"]],
      body: data.map((row) => [row.name, row.checkup, row.status, row.bmi])
    });
    doc.save("health_report.pdf");
  };

  return (
    <div className="p-0 m-0 min-h-screen">

      {/* ------------------- CONTAINER 1: HEADER + SUMMARY CARDS ------------------- */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Health Report</h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search student..."
              className="border px-3 py-1 rounded-md "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-1 bg-gray-100 rounded-md "
            >
              Sort BMI ({sortOrder === "asc" ? "↑" : "↓"})
            </button>

            <button
              onClick={() => {
                setEditRow(null);
                setModalOpen(true);
              }}
              className="px-3 py-1 bg-green-600 text-white rounded-md flex items-center gap-1"
            >
              <FiPlus /> Add
            </button>

            <button
              onClick={exportToExcel}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
            >
              Excel
            </button>

            <button
              onClick={exportToPDF}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
            >
              PDF
            </button>
          </div>
        </div>

        {/* Summary cards (MATCH DISCIPLINE EXACTLY) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <SummaryCard label="Total Records" value={data.length} color="text-blue-600" />
          <SummaryCard label="Healthy Students" value={data.filter(d => d.status === "Healthy").length} color="text-green-600" />
          <SummaryCard label="Needs Follow-up" value={data.filter(d => d.status === "Needs Follow-up").length} color="text-orange-600" />
          <SummaryCard label="Average BMI" value={
            data.length ? (data.reduce((s, d) => s + (parseFloat(d.bmi) || 0), 0) / data.length).toFixed(1) : "0.0"
          } color="text-purple-600" />

        </div>
      </div>

      {/* ------------------- CONTAINER 2: TWO CHARTS ------------------- */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Checkup Chart */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 mt-0">Checkup Distribution</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={checkupDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="checkup" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Pie */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 mt-0">Status Distribution</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="count"
                    nameKey="status"
                    outerRadius={80}
                    label
                  >
                    {statusDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* ------------------- CONTAINER 3: BMI CHART ------------------- */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">

        <h3 className=" text-lg font-semibold mb-3 mt-0">Average BMI by Checkup Type</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={checkupDistribution.map(item => {
              const rows = data.filter(d => d.checkup === item.checkup);
              const avg = rows.length ? rows.reduce((s, d) => s + parseFloat(d.bmi || 0), 0) / rows.length : 0;
              return { checkup: item.checkup, avgBMI: avg.toFixed(1) };
            })}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="checkup" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgBMI" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ------------------- CONTAINER 4: TABLE + PAGINATION ------------------- */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">

        <h3 className="text-lg font-semibold mb-3">Health Records</h3>

        <div className="overflow-x-auto">
          <table className="w-full ">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Checkup</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">BMI</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((row) => (
                <tr key={row.id} className="border-t hover:bg-blue-50">
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.checkup}</td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3">{row.bmi}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-blue-600 mr-2"
                      onClick={() => {
                        setEditRow(row);
                        setModalOpen(true);
                      }}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDelete(row.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-3 text-sm">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 mr-2"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Modal */}
      <SmallModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onImport={handleImport}
        fields={["name", "checkup", "status", "bmi"]}
        editRow={editRow}
        title="Health Record"
      />

    </div>
  );
}
// Summary card component
function SummaryCard({ label, value, color }) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

