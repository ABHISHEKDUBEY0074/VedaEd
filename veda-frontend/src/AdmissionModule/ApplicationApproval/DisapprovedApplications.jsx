import React, { useState } from "react";
import DisapproveReasonModal from "./DisapproveReasonModal";

export default function DisapprovedApplications({ onMoveToApproved }) {
  const [disapprovedList, setDisapprovedList] = useState([
    {
      id: 1,
      studentName: "Riya Patel",
      parentName: "Nitin Patel",
      email: "nitinpatel@example.com",
      phone: "9823412345",
      class: "6th",
      disapprovedOn: "2025-10-29",
      reason: "Incomplete documents",
    },
  ]);

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Edit Reason
  const handleEditReason = (id) => {
    setEditId(id);
    setShowModal(true);
  };

  const handleReasonSubmit = (newReason) => {
    setDisapprovedList((prev) =>
      prev.map((item) =>
        item.id === editId ? { ...item, reason: newReason } : item
      )
    );
    setShowModal(false);
  };

  // Delete Record
  const handleDelete = (id) => {
    setDisapprovedList((prev) => prev.filter((a) => a.id !== id));
  };

  // Move to Approved
  const handleMoveToApproved = (id) => {
    const record = disapprovedList.find((a) => a.id === id);
    if (record) {
      // Send to Approved tab via callback
      onMoveToApproved?.({
        ...record,
        approvedOn: new Date().toISOString().split("T")[0],
      });

      // Remove from Disapproved list
      setDisapprovedList((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Disapproved Applications</h3>

      {disapprovedList.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No disapproved applications.
        </p>
      ) : (
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">Parent Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Disapproved On</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disapprovedList.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="p-2 border">{a.studentName}</td>
                <td className="p-2 border">{a.parentName}</td>
                <td className="p-2 border">{a.email}</td>
                <td className="p-2 border">{a.phone}</td>
                <td className="p-2 border">{a.class}</td>
                <td className="p-2 border">{a.disapprovedOn}</td>
                <td className="p-2 border">{a.reason}</td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    onClick={() => handleEditReason(a.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleMoveToApproved(a.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Move to Approved
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <DisapproveReasonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleReasonSubmit}
      />
    </div>
  );
}
