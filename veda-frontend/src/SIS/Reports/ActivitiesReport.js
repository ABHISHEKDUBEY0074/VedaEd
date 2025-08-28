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

  const rowsPerPage = 10;

  //  Fetch data from API
  useEffect(() => {
    fetch(`${BASE_URL}/api/activities`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error fetching activities:", err));
  }, []);

  const filteredData = useMemo(() => {
    let d = data.filter((item) =>
      (item.student || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    );
    d = d.sort((a, b) =>
      sortOrder === "asc"
        ? (a.student || "").localeCompare(b.student || "")
        : (b.student || "").localeCompare(a.student || "")
    );
    return d;
  }, [sortOrder, searchTerm, data]);

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

  //  Save (Add/Update) record
  const handleSave = async (record) => {
    if (editRow) {
      await fetch(`${BASE_URL}/api/activities/${editRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    } else {
      await fetch(`${BASE_URL}/api/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    }

    const res = await fetch(`${BASE_URL}/api/activities`);
    setData(await res.json());
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
            Sort ({sortOrder === "asc" ? "↑" : "↓"})
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
          <h3 className="font-semibold mb-2">Participation</h3>
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
        </div>

        <div className="bg-white shadow rounded-md p-4">
          <h3 className="font-semibold mb-2">Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="performance" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <table className="w-full border mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Student</th>
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

      <SmallModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onImport={handleImport}
        title="Activities Report"
        fields={["student", "activity", "participation", "performance"]}
        editRow={editRow}
      />
    </div>
  );
}
