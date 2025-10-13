import React, { useEffect, useState, useMemo } from "react";

const dummyLogs = [
  { title: "Exam Schedule", sender: "Teacher", className: "6A", channels: ["In-app"], sentAt: new Date() },
  { title: "Holiday Notice", sender: "Admin", channels: ["SMS", "Email"], sentAt: new Date() },
];

export default function AllLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLogs(dummyLogs);
      setLoading(false);
    }, 500);
  }, []);

  const hasLogs = useMemo(() => logs && logs.length > 0, [logs]);

  return (
    <div className="bg-gray-200 p-6 mt-4 border border-gray-100 shadow-sm">
      <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto border border-gray-100">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading logs...</div>
        ) : !hasLogs ? (
          <div className="text-center py-10 text-gray-500">No logs available.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sended By</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channels</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {logs.map((log, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 whitespace-nowrap">{log.title}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        log.sender === "Teacher"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {log.sender === "Teacher" ? "Class Teacher" : log.sender}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{log.className || "-"}</td>
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
