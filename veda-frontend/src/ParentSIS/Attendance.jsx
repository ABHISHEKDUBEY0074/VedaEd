import React, { useState, useEffect } from "react";
import config from "../config";
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
        const res = await fetch(`${config.API_BASE_URL}/attendance/student/${childId}`);
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
      <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumbs - bahar */}
      <p className="text-gray-500 text-sm mb-2 flex items-center gap-1"> Attendance &gt;</p>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold"> Attendance</h2>

  <HelpInfo
  title="Child Attendance"
  description={`4.4 Child Attendance (Daily Attendance Overview)

Track your child's attendance records with detailed day-by-day status and check-in times.

Sections:
- Filter by Date: Select a specific date to view attendance records
- Filter by Status: Filter entries by Present, Absent, or Late
- Attendance Table: Displays date-wise attendance with status and time
- Status Highlights: Color-coded indicators for Present, Absent, and Late
- Check-in Time: Shows the exact time your child marked attendance
`}
  steps={[
    "Filter attendance records by date or status",
    "View daily attendance status including Present, Absent, or Late",
    "Check the exact check-in time for each day",
    "Scroll through history to monitor long-term attendance patterns",
    "Use filters to quickly find specific attendance entries"
  ]}
/>

</div>

      {/* Gray Wrapper */}
         <div className="bg-white p-3 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Attendance List</h3>
          <div className="flex flex-col md:flex-row md:items-end gap-3 mb-4">
            <div className="flex-1">
              
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full border rounded px-3 py-2 "
              />
            </div>
            <div className="flex-1">
             
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border rounded px-3 py-2  "
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1"
              >
                Reset Filters
              </button>
            )}
          </div>

         <table className="w-full border ">
            <thead className="bg-gray-100 ">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec, i) => (
                <tr key={i} className="text-center border-b hover:bg-gray-50">
                  <td className="p-2 border">{rec.date?.slice(0, 10)}</td>
                  <td
                    className={`p-2 border font-semibold ${
                      rec.status === "Present"
                        ? "text-green-600"
                        : rec.status === "Absent"
                        ? "text-red-600"
                        : "text-orange-500"
                    }`}
                  >
                    {rec.status}
                  </td>
                  <td className="p-2 border">{rec.time || "--"}</td>
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
   
  );
}
