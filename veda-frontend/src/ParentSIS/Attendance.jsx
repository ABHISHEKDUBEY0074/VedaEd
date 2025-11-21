import React, { useState, useEffect } from "react";
import HelpInfo from "../components/HelpInfo";

export default function ParentAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Parent is viewing child's attendance
  const childId = "64f12abced123"; // Replace with dynamic child ID later

  const dummyAttendanceData = [
    { date: "2025-01-15", status: "Present", time: "08:30 AM" },
    { date: "2025-01-16", status: "Present", time: "08:25 AM" },
    { date: "2025-01-17", status: "Absent", time: "--" },
    { date: "2025-01-18", status: "Present", time: "08:35 AM" },
    { date: "2025-01-19", status: "Present", time: "08:28 AM" },
    { date: "2025-01-20", status: "Late", time: "09:15 AM" },
    { date: "2025-01-21", status: "Present", time: "08:30 AM" },
    { date: "2025-01-22", status: "Present", time: "08:32 AM" },
    { date: "2025-01-23", status: "Absent", time: "--" },
    { date: "2025-01-24", status: "Present", time: "08:28 AM" },
    { date: "2025-01-25", status: "Present", time: "08:30 AM" },
    { date: "2025-01-26", status: "Present", time: "08:27 AM" },
    { date: "2025-01-27", status: "Late", time: "09:05 AM" },
    { date: "2025-01-28", status: "Present", time: "08:30 AM" },
    { date: "2025-01-29", status: "Present", time: "08:33 AM" },
    { date: "2025-01-30", status: "Absent", time: "--" },
    { date: "2025-01-31", status: "Present", time: "08:30 AM" },
    { date: "2025-02-01", status: "Present", time: "08:29 AM" },
    { date: "2025-02-02", status: "Present", time: "08:31 AM" },
    { date: "2025-02-03", status: "Late", time: "09:10 AM" },
    { date: "2025-02-04", status: "Present", time: "08:30 AM" },
    { date: "2025-02-05", status: "Present", time: "08:28 AM" },
    { date: "2025-02-06", status: "Absent", time: "--" },
    { date: "2025-02-07", status: "Present", time: "08:30 AM" },
    { date: "2025-02-08", status: "Present", time: "08:32 AM" },
    { date: "2025-02-09", status: "Present", time: "08:30 AM" },
    { date: "2025-02-10", status: "Present", time: "08:29 AM" },
    { date: "2025-02-11", status: "Late", time: "09:20 AM" },
    { date: "2025-02-12", status: "Present", time: "08:30 AM" },
    { date: "2025-02-13", status: "Present", time: "08:31 AM" },
  ];

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/attendance/student/${childId}`);
        if (!res.ok) throw new Error("Failed to fetch child's attendance");
        const data = await res.json();
        const apiRecords = Array.isArray(data) ? data : data.records || data.data || [];
        setRecords(apiRecords.length > 0 ? apiRecords : dummyAttendanceData);
      } catch (err) {
        console.error("Error loading attendance:", err);
        setRecords(dummyAttendanceData);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [childId]);

  if (loading) {
    return <div className="p-6">Loading child’s attendance...</div>;
  }

  const filteredRecords = records.filter((rec) => {
    const matchesDate = filterDate ? rec.date?.slice(0, 10) === filterDate : true;
    const matchesStatus = filterStatus === "all" ? true : rec.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <p className="text-gray-500 text-sm mb-2">Attendance &gt;</p>

                                                                                      <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Child Attendance</h2>

  <HelpInfo
    title="Staff Module Help"
    description="This module allows you to manage all staff records, login access, roles, and other information."
    steps={[
      "Use All Staff tab to view and manage staff details.",
      "Use Manage Login tab to update login credentials.",
      "Use Others tab for additional staff-related tools."
    ]}
  />
</div>

      {/* Gray Wrapper */}
      <div className="bg-gray-200 rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </div>
            {(filterDate || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setFilterDate("");
                  setFilterStatus("all");
                }}
                className="md:self-center bg-gray-100 text-gray-700 px-4 py-2 rounded border text-sm"
              >
                Reset Filters
              </button>
            )}
          </div>

          <table className="w-full text-left border">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{rec.date?.slice(0, 10)}</td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      rec.status === "Present"
                        ? "text-green-600"
                        : rec.status === "Absent"
                        ? "text-red-600"
                        : "text-orange-500"
                    }`}
                  >
                    {rec.status}
                  </td>
                  <td className="px-4 py-2">{rec.time || "--"}</td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
