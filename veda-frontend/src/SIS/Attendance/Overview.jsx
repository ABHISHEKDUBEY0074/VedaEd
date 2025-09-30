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
   <div className="p-6 bg-gray-200 min-h-screen">
    

      {/* Summary Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryData.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition"
            >
              <div className={`w-4 h-4 rounded-full ${item.color} mb-2`} />
              <p className="text-gray-600">Today</p>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.count} students</p>
              <button className="mt-3 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                View List
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Trends Chart */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Attendance Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
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
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <h2 className="text-lg font-semibold mb-4 p-6">Recent Attendance</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Class</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentAttendance.map((student, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.grade}</td>
                <td
                  className={`px-4 py-2 font-medium ${
                    student.status === "Present"
                      ? "text-green-600"
                      : student.status === "Absent"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {student.status}
                </td>
                <td className="px-4 py-2">{student.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
