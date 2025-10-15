import React, { useEffect, useState, useMemo } from "react";
import CommunicationAPI from "./communicationAPI";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch published notices for students
      const studentId = "68c27fb96a063075c9a73ee2"; // Real student ID
      const studentModel = "Student";

      const response = await CommunicationAPI.getPublishedNotices(
        studentId,
        studentModel
      );

      if (response.success) {
        // Transform notices data to match logs format
        const transformedLogs = response.data.map((notice) => ({
          id: notice._id,
          title: notice.title,
          sender: notice.authorModel === "Staff" ? "Admin" : notice.authorModel,
          channels: ["In-app"], // Default channel since we're using in-app notices
          sentAt: notice.createdAt || notice.publishDate,
        }));

        setLogs(transformedLogs);
      } else {
        setError("Failed to fetch logs");
      }
    } catch (err) {
      setError("Failed to fetch logs");
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const hasLogs = useMemo(() => logs && logs.length > 0, [logs]);

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button onClick={() => setActiveTab("all")} className="hover:underline">
          Logs
        </button>
        <span>&gt;</span>
        <span>{activeTab === "all" && "All Logs"}</span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold mb-6">Logs</h2>

      {/* Tabs (same style as Messages) */}
      <div className="flex gap-4 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("all")}
          className={`capitalize pb-2 ${
            activeTab === "all"
              ? "text-blue-600 font-semibold border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          All Logs
        </button>
      </div>

      {/* Outer Gray Box */}
      <div className="bg-gray-200 p-6 mt-4 border border-gray-100 shadow-sm ">
        {/* Inner White Box */}
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto border border-gray-100">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading logs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchLogs}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : !hasLogs ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No logs available.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100">
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
                        {log.sender}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {log.channels.join(", ")}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(log.sentAt).toLocaleString()}
                    </td>
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
