import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// API Endpoints for future backend integration
const API_ENDPOINTS = {
  GET_ALL_NOTICES: "/api/notices",
  DELETE_NOTICE: "/api/notices/:id",
};

export default function AllLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Future API integration function
  const fetchAllNotices = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(API_ENDPOINTS.GET_ALL_NOTICES);
      // const data = await response.json();
      // setLogs(data);

      // Clear localStorage for fresh start
      localStorage.removeItem("sent_notices_logs");

      // For now, return empty array (will be replaced with API call)
      setLogs([]);
    } catch (err) {
      setError("Failed to fetch notices");
      console.error("Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotices();
  }, []);

  const hasLogs = useMemo(() => logs && logs.length > 0, [logs]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">All Logs</h3>
      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Loading notices...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchAllNotices}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : !hasLogs ? (
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
  );
}
