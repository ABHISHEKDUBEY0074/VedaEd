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
    name: "John Doe",
    grade: "Grade 10 - A",
    status: "Present",
    time: "08:01 AM",
  },
  { name: "Jane Smith", grade: "Grade 9 - B", status: "Absent", time: "—" },
  { name: "Alex Lee", grade: "Grade 8 - C", status: "Late", time: "08:15 AM" },
];

export default function Overview() {
  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryData.map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center"
            >
              <div className={`w-4 h-4 rounded-full ${item.color} mb-2`} />
              <p className="text-gray-600">Today</p>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.count} students</p>
              <button className="mt-3 px-4 py-2 bg-orange-400 text-white rounded-lg text-sm hover:bg-orange-500">
                View List
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Attendance Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Attendance</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                <tr key={idx} className="border-t">
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
    </div>
  );
}
