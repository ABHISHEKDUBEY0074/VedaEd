import React, { useState } from "react";
import DisapproveReasonModal from "./DisapproveReasonModal";
import * as XLSX from "xlsx";
import { FiSearch, FiDownload } from "react-icons/fi";

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
    {
      id: 2,
      studentName: "Aarav Sharma",
      parentName: "Sunil Sharma",
      email: "sunilsharma@example.com",
      phone: "9898765432",
      class: "7th",
      disapprovedOn: "2025-10-30",
      reason: "Missing payment proof",
    },
  ]);

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Edit Reason
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

  // ✅ Delete Record
  const handleDelete = (id) => {
    setDisapprovedList((prev) => prev.filter((a) => a.id !== id));
  };

  // ✅ Move to Approved
  const handleMoveToApproved = (id) => {
    const record = disapprovedList.find((a) => a.id === id);
    if (record) {
      onMoveToApproved?.({
        ...record,
        approvedOn: new Date().toISOString().split("T")[0],
      });
      setDisapprovedList((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // ✅ Export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(disapprovedList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Disapproved Applications");
    XLSX.writeFile(workbook, "DisapprovedApplications.xlsx");
  };

  // ✅ Filtered list based on search
  const filteredList = disapprovedList.filter((a) =>
    a.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-lg font-semibold mb-3 md:mb-0">
          Disapproved Applications
        </h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring focus:ring-blue-200"
            />
          </div>

          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
          >
            <FiDownload className="mr-2" /> Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredList.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No disapproved applications found.
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
            {filteredList.map((a) => (
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
                    className="px-3 py-0 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Move to Approved
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for edit reason */}
      <DisapproveReasonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleReasonSubmit}
      />
    </div>
  );
}
