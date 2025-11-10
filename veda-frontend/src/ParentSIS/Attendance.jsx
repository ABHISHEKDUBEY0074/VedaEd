import React, { useState, useEffect } from "react";

export default function ParentAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parent is viewing child's attendance
  const childId = "64f12abced123"; // Replace with dynamic child ID later

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/attendance/student/${childId}`);
        if (!res.ok) throw new Error("Failed to fetch child's attendance");
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : data.records || []);
      } catch (err) {
        console.error("Error loading attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [childId]);

  if (loading) {
    return <div className="p-6">Loading child’s attendance...</div>;
  }

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <p className="text-gray-500 text-sm mb-2">Attendance &gt;</p>

      {/* Heading */}
      <h2 className="text-2xl font-bold mb-6">Child Attendance</h2>

      {/* Gray Wrapper */}
      <div className="bg-gray-200 rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <table className="w-full text-left border">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => (
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
              {records.length === 0 && (
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
