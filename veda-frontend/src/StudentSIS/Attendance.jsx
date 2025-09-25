import React, { useState, useEffect } from "react";

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const studentId = "64f12abced123"; // dummy ID

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/attendance/student/${studentId}`);
        if (!res.ok) throw new Error("Failed to fetch attendance");
        const data = await res.json();

        // Assume API returns array of records [{date,status,time},...]
        setRecords(Array.isArray(data) ? data : data.records || []);
      } catch (err) {
        console.error("Error loading attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentId]);

  if (loading) {
    return <div className="p-6">Loading attendance...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4"> My Attendance</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
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
  );
}
