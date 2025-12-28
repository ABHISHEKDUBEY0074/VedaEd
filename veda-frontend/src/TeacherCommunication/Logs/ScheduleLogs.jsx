import React, { useState, useEffect } from "react";
import { FiCheck, FiTrash2, FiMoreVertical } from "react-icons/fi";

export default function ScheduleLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyLogs = [
    {
      id: 1,
      title: "Math Homework",
      message: "Complete exercise 5",
      sendedTo: "Students",
      className: "6A",
      studentId: "ST1234",
      channels: ["In-app", "Email"],
      sentAt: new Date(),
      publishOn: new Date(new Date().getTime() + 3600 * 1000),
      roles: ["Teacher"],
    },
    {
      id: 2,
      title: "PTM Notice",
      message: "Parent Teacher Meeting scheduled",
      sendedTo: "Parents",
      className: "6A",
      studentId: "-",
      channels: ["Email"],
      sentAt: new Date(),
      publishOn: new Date(new Date().getTime() + 7200 * 1000),
      roles: ["Teacher"],
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLogs(dummyLogs);
      setLoading(false);
    }, 500);
  }, []);

  const deleteLog = (id) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  return (
    <div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading scheduled logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No scheduled logs available.
        </div>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-left">Title</th>
              <th className="p-2 border text-left">Message</th>
              <th className="p-2 border text-left">Sended To</th>
              <th className="p-2 border text-left">Class</th>
              <th className="p-2 border text-left">Student ID</th>
              <th className="p-2 border text-center">In-App</th>
              <th className="p-2 border text-center">Email</th>
              <th className="p-2 border text-center">Roles</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border text-left font-semibold">
                  {log.title}
                </td>
                <td className="p-2 border text-left text-gray-700">
                  {log.message}
                </td>
                <td className="p-2 border">{log.sendedTo}</td>
                <td className="p-2 border">{log.className}</td>
                <td className="p-2 border">{log.studentId}</td>
                <td className="p-2 border">
                  {log.channels.includes("In-app") ? (
                    <FiCheck className="text-blue-600 inline" />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2 border">
                  {log.channels.includes("Email") ? (
                    <FiCheck className="text-green-600 inline" />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2 border">{log.roles.join(", ")}</td>
                <td className="p-2 border">
                  <div className="flex gap-1 justify-center">
                    <button className="p-1 rounded hover:bg-gray-100">
                      <FiMoreVertical />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                      onClick={() => deleteLog(log.id)}
                      title="Delete notice"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {logs.length > 0 && (
        <p className=" text-gray-500 mt-3">
          Records: {logs.length} of {logs.length}
        </p>
      )}
    </div>
  );
}
