import React, { useState } from "react";
import DisapproveReasonModal from "./DisapproveReasonModal";

export default function PendingApplications() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      studentName: "Aarav Mehta",
      parentName: "Rohit Mehta",
      email: "rohitmehta@example.com",
      phone: "9876543210",
      class: "8th",
      date: "2025-10-28",
    },
    {
      id: 2,
      studentName: "Siya Kapoor",
      parentName: "Neha Kapoor",
      email: "nehakapoor@example.com",
      phone: "9812345678",
      class: "7th",
      date: "2025-10-29",
    },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleApprove = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  const handleDisapprove = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleReasonSubmit = (reason) => {
    console.log("Disapproved ID:", selectedId, "Reason:", reason);
    setApplications(applications.filter((app) => app.id !== selectedId));
    setShowModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Pending Applications</h3>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Student Name</th>
            <th className="p-2 border">Parent Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Class</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="p-2 border">{app.studentName}</td>
              <td className="p-2 border">{app.parentName}</td>
              <td className="p-2 border">{app.email}</td>
              <td className="p-2 border">{app.phone}</td>
              <td className="p-2 border">{app.class}</td>
              <td className="p-2 border">{app.date}</td>
              <td className="p-2 border text-center space-x-2">
                <button
                  onClick={() => handleApprove(app.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDisapprove(app.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Disapprove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DisapproveReasonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleReasonSubmit}
      />
    </div>
  );
}
