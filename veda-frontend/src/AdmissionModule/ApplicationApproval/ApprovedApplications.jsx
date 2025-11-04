import React, { useState } from "react";

export default function ApprovedApplications() {
  const [approvedList, setApprovedList] = useState([
    {
      id: 1,
      studentName: "Priya Sharma",
      parentName: "Amit Sharma",
      email: "amitsharma@example.com",
      phone: "9876501234",
      class: "10th",
      approvedOn: "2025-10-30",
    },
  ]);

  const handleDisapprove = (id) => {
    setApprovedList(approvedList.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Approved Applications</h3>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Student Name</th>
            <th className="p-2 border">Parent Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Class</th>
            <th className="p-2 border">Approved On</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {approvedList.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="p-2 border">{a.studentName}</td>
              <td className="p-2 border">{a.parentName}</td>
              <td className="p-2 border">{a.email}</td>
              <td className="p-2 border">{a.phone}</td>
              <td className="p-2 border">{a.class}</td>
              <td className="p-2 border">{a.approvedOn}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleDisapprove(a.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Disapprove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
