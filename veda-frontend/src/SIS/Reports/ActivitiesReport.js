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

  //  Fetch data from API
  useEffect(() => {
    fetch(`${BASE_URL}/api/activities`)
      .then((res) => res.json())
      .then((json) => {
        if (json && json.length > 0) {
          setData(json);
        } else {
          // Use dummy data if API returns empty
          setData(dummyActivitiesData);
        }
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        // Use dummy data on error
        setData(dummyActivitiesData);
      });
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
