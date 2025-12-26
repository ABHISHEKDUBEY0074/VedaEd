import React, { useEffect, useState, useMemo } from "react";

const dummySendedLogs = [
  { title: "Parent Meeting Notice", sendedTo: "Parents", className: "6A", studentId: "-", channels: ["In-app"], sentAt: new Date() },
  { title: "Student Progress Update", sendedTo: "Students", className: "6B", studentId: "ST1234", channels: ["Email"], sentAt: new Date() },
];

export default function SendedLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLogs(dummySendedLogs);
      setLoading(false);
    }, 500);
  }, []);

  const hasLogs = useMemo(() => logs && logs.length > 0, [logs]);

  return (
    <div className="bg-gray-200 p-6 mt-4 border border-gray-100 shadow-sm">
      <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto border border-gray-100">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading sended logs...</div>
        ) : !hasLogs ? (
          <div className="text-center py-10 text-gray-500">No sended logs available.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left  font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-2 text-left  font-medium text-gray-500 uppercase tracking-wider">Sended To</th>
                <th className="px-4 py-2 text-left  font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-4 py-2 text-left  font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-4 py-2 text-left  font-medium text-gray-500 uppercase tracking-wider">Channels</th>
                <th className="px-4 py-2 text-left  font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {logs.map((log, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 whitespace-nowrap">{log.title}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="inline-block px-2 py-1  font-semibold rounded-full bg-purple-100 text-purple-800">
                      {log.sendedTo}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{log.className || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{log.studentId || "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{log.channels.join(", ")}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(log.sentAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
