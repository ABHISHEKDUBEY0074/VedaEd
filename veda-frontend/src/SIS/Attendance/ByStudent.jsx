import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ByStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  // Fetch all students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/students");
        if (!res.ok) return;
        const payload = await res.json();
        const list = Array.isArray(payload?.students) ? payload.students : [];
        const mapped = list.map((s) => ({
          id: s._id,
          name: s?.personalInfo?.name || "",
          grade: `${s?.personalInfo?.class || ""} - ${
            s?.personalInfo?.section || ""
          }`.trim(),
          status: "Absent",
          time: "--",
        }));
        setStudents(mapped);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, []);

  const markAttendance = async (id, newStatus) => {
    const updated = students.map((s) =>
      s.id === id
        ? {
            ...s,
            status: newStatus,
            time:
              newStatus === "Absent"
                ? "--"
                : new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
          }
        : s
    );
    setStudents(updated);

    try {
      const attendanceDate = date || new Date().toISOString();
      await fetch(`http://localhost:5000/api/attendance/student/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, date: attendanceDate }),
      });
    } catch (err) {
      console.error("Error updating attendance:", err);
    }
  };

  const exportReport = () => {
    const headers = ["ID,Name,Grade,Status,Time"];
    const rows = students.map(
      (s) => `${s.id},${s.name},${s.grade},${s.status},${s.time}`
    );
    const csv = [...headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student-attendance-${date || "report"}.csv`;
    a.click();
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.grade.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <div className="p-6 bg-gray-200 min-h-screen">
  <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">


      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/attendance" className="hover:underline">
          Attendance
        </Link>{" "}
        › <span className="text-gray-700 font-medium">By Student</span>
      </nav>

      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Attendance by Student
      </h2>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or grade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/3 mb-3 md:mb-0"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/4"
        />
        <button
          onClick={exportReport}
          className="ml-auto mt-3 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"

        >
          Export Report
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Grade</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr
                key={student.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.grade}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    student.status === "Present"
                      ? "text-green-600"
                      : student.status === "Absent"
                      ? "text-red-600"
                      : "text-orange-500"
                  }`}
                >
                  {student.status}
                </td>
                <td className="px-4 py-2">{student.time}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => markAttendance(student.id, "Present")}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Present
                  </button>
                  <button
                    onClick={() => markAttendance(student.id, "Absent")}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Absent
                  </button>
                  <button
                    onClick={() => markAttendance(student.id, "Late")}
                    className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                  >
                    Late
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/attendance/by-student/${student.id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No students found
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
