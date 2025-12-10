import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const summaryData = [
  { title: "Present", count: 482, color: "bg-green-500" },
  { title: "Absent", count: 18, color: "bg-red-500" },
  { title: "Late", count: 7, color: "bg-yellow-500" },
];

const attendanceTrends = [
  { day: "Mon", students: 470 },
  { day: "Tue", students: 465 },
  { day: "Wed", students: 480 },
  { day: "Thu", students: 455 },
  { day: "Fri", students: 460 },
  { day: "Sat", students: 440 },
];

const recentAttendance = [
  {
    name: "Jonny",
    grade: "Grade 10 - A",
    status: "Present",
    time: "08:01 AM",
  },
  { name: "Oggy", grade: "Grade 9 - B", status: "Absent", time: "—" },
  { name: "Jerry", grade: "Grade 8 - C", status: "Late", time: "08:15 AM" },
];

export default function Overview() {
  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Summary Cards */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        <h2 className="text-sm font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {summaryData.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border p-4 flex flex-col items-center hover:shadow-md transition"
            >
              <div className={`w-4 h-4 rounded-full ${item.color} mb-2`} />
              <p className="text-gray-600 text-xs">Today</p>
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.count} students</p>
              <button className="mt-3 px-3 py-2 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">
                View List
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Trends Chart */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        <h2 className="text-sm font-semibold mb-4">Attendance Trends</h2>
        <ResponsiveContainer width="96%" height={300}>
          <BarChart data={attendanceTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#169ef9ff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Attendance Table */}
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <h2 className="text-sm font-semibold mb-4">Recent Attendance</h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border text-left">Name</th>
                <th className="p-2 border text-left">Class</th>
                <th className="p-2 border text-left">Status</th>
                <th className="p-2 border text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.map((student, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="p-2 border text-left">{student.name}</td>
                  <td className="p-2 border text-left">{student.grade}</td>
                  <td
                    className={`p-2 border text-left font-semibold ${
                      student.status === "Present"
                        ? "text-green-600"
                        : student.status === "Absent"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {student.status}
                  </td>
                  <td className="p-2 border text-left">{student.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
