import React, { useState } from "react";
import { FiMoreVertical, FiCheck } from "react-icons/fi";

export default function ScheduleLogs() {
  const [logs] = useState([
    {
      id: 1,
      title: "Online Classes",
      message:
        "Be very punctual in log in time, screen off time, activity timetable etc. Be ready with necessary text books, pen, pencil and other accessories before class begins. Make sure the device is sufficiently charged before the beginning of the class.",
      date: "02/04/2025 06:02 pm",
      scheduleDate: "02/12/2025 05:02 pm",
      email: true,
      sms: true,
      group: false,
      individual: false,
      className: "Class 10",
    },
    {
      id: 2,
      title: "New Academic admission start (2025-26)",
      message:
        "NEW ADMISSIONS FOR THE NEXT SESSION 2025-26 ARE OPEN FROM CLASSES NURSERY TO CLASS VIII FROM 1ST APRIL 2025.",
      date: "04/04/2025 01:27 pm",
      scheduleDate: "04/05/2025 11:27 am",
      email: true,
      sms: true,
      group: true,
      individual: false,
      className: "", 
    },
    {
      id: 3,
      title: "International Yoga Day",
      message:
        "International Yoga Day, celebrated annually on June 21st, offers schools a valuable opportunity to promote physical and mental well-being. Schools often organize yoga sessions, demonstrations of asanas, and awareness campaigns to introduce students to the benefits of yoga.",
      date: "06/03/2025 03:33 pm",
      scheduleDate: "06/21/2025 07:00 am",
      email: false,
      sms: true,
      group: false,
      individual: true,
      className: "Class 8",
    },
  ]);

  return (
    <div className="p-0 bg-gray-100 min-h-screen">
      {/* Outer Gray Wrapper */}
      <div className="bg-gray-200 p-6 shadow-sm border border-gray-100">
        {/* Inner White Box */}
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-left">Title</th>
                <th className="p-2 border text-left">Message</th>
                <th className="p-2 border text-left">Date</th>
                <th className="p-2 border text-left">Schedule Date</th>
                <th className="p-2 border text-center">Email</th>
                <th className="p-2 border text-center">SMS</th>
                <th className="p-2 border text-center">Group</th>
                <th className="p-2 border text-center">Individual</th>
                <th className="p-2 border text-left">Class</th>
                <th className="p-2 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="text-center hover:bg-gray-50">
                  <td className="p-2 border text-left font-semibold">{log.title}</td>
                  <td className="p-2 border text-left text-gray-700">{log.message}</td>
                  <td className="p-2 border">{log.date}</td>
                  <td className="p-2 border">{log.scheduleDate}</td>

                  <td className="p-2 border">
                    {log.email ? <FiCheck className="text-blue-600 inline" /> : "-"}
                  </td>
                  <td className="p-2 border">
                    {log.sms ? <FiCheck className="text-green-600 inline" /> : "-"}
                  </td>
                  <td className="p-2 border">
                    {log.group ? <FiCheck className="text-blue-600 inline" /> : "-"}
                  </td>
                  <td className="p-2 border">
                    {log.individual ? <FiCheck className="text-green-600 inline" /> : "-"}
                  </td>
                  <td className="p-2 border">{log.className || "-"}</td>
                  <td className="p-2 border">
                    <button className="p-1 rounded hover:bg-gray-100">
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-sm text-gray-500 mt-3">
            Records: {logs.length} of {logs.length}
          </p>
        </div>
      </div>
    </div>
  );
}
