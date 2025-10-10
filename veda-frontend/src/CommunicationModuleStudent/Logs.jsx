import React, { useEffect, useState, useMemo } from "react";

// Dummy logs for display
const dummyLogs = [
  { title: "Exam Schedule", sender: "Teacher", channels: ["In-app"], sentAt: new Date() },
  { title: "Holiday Notice", sender: "Admin", channels: ["SMS", "Email"], sentAt: new Date() },
];

export default function Logs() {
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
    <div className="p-6 bg-gray-100 min-h-screen">
     
      <div className="mb-4">
        <div className="text-gray-500 text-sm flex items-center gap-1 mb-2">
          <span>Logs</span>
          <span>&gt;</span>
          <span>All Logs</span>
        </div>
        <h2 className="text-2xl font-bold">Logs</h2>
      </div>

      {/* Outer Gray Box */}
      <div className="bg-gray-200 p-6 shadow-sm border border-gray-100 ">
        {/* Logs Table */}
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading logs...</p>
            </div>
          ) : !hasLogs ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No logs available.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channels
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 whitespace-nowrap">{log.title}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        log.sender === "Teacher"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {log.sender === "Teacher" ? "Teacher" : "Admin"}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{log.channels.join(", ")}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{new Date(log.sentAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
