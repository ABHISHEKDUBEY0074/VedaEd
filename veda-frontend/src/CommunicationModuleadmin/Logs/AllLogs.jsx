import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sent_notices_logs");
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setLogs(parsed);
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    }
  }, []);

  const hasLogs = useMemo(() => logs && logs.length > 0, [logs]);

  return (
    <div className="p-0 bg-gray-100 min-h-screen">
      {/* Outer Gray Wrapper */}
      <div className="bg-gray-200 p-6 shadow-sm border border-gray-100">
        {/* Inner White Box */}
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
        {!hasLogs ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No logs yet.</p>
            <button
              onClick={() => navigate("/communication/notices/post")}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Post a notice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
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
                    <td className="px-4 py-2 whitespace-nowrap">
                      {log.title || "Untitled"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {Array.isArray(log.roles) ? log.roles.join(", ") : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {Array.isArray(log.channels)
                        ? log.channels.join(", ")
                        : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {log.sentAt ? new Date(log.sentAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
