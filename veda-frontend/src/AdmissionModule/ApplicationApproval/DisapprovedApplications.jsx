import React, { useState, useRef, useEffect } from "react";
import DisapproveReasonModal from "./DisapproveReasonModal";
import * as XLSX from "xlsx";
import {
  FiSearch,
  FiDownload,
  FiChevronDown,
  FiUser,
  FiTrash2,
} from "react-icons/fi";

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

  // 🔹 BULK ACTION STATES
  const [showBulkActions, setShowBulkActions] = useState(false);
  const bulkActionRef = useRef(null);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        bulkActionRef.current &&
        !bulkActionRef.current.contains(e.target)
      ) {
        setShowBulkActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // ✅ Delete
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

  // ✅ Export Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(disapprovedList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Disapproved Applications"
    );
    XLSX.writeFile(workbook, "DisapprovedApplications.xlsx");
  };

  // 🔹 Filter
  const filteredList = disapprovedList.filter((a) =>
    a.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
  const totalPages = Math.ceil(records.length / recordsPerPage);
  
  const paginatedRecords = records.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-semibold mb-4">
        Disapproved Applications
      </h3>

      {/* SEARCH + BULK */}
      <div className="flex items-center gap-3 mb-4 w-full">
        {/* Search (same as bulk height) */}
        <div className="flex items-center border px-2 py-1.5 rounded-md bg-white w-[220px]">
          <FiSearch className="text-gray-500 mr-2 text-sm" />
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        {/* Bulk Actions */}
        <div className="relative" ref={bulkActionRef}>
          <button
            onClick={() => setShowBulkActions((prev) => !prev)}
            className="border px-3 py-2 rounded-md text-xs bg-white flex items-center gap-2 w-[120px] justify-between hover:border-blue-500"
          >
            <span>Bulk Actions</span>
            <FiChevronDown className="text-xs" />
          </button>

          {showBulkActions && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-10 text-sm">
              <button
                onClick={() => setShowBulkActions(false)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <FiUser className="text-sm" />
                Select
              </button>

              <button
                onClick={() => {
                  handleExportExcel();
                  setShowBulkActions(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <FiDownload className="text-sm" />
                Export Excel
              </button>

              <button
                onClick={() => setShowBulkActions(false)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
              >
                <FiTrash2 className="text-sm" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
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
      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
  <p>
    Page {currentPage} of {totalPages}
  </p>
  <div className="space-x-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <button
      disabled={currentPage === totalPages || totalPages === 0}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</div>

      {/* MODAL */}
      <DisapproveReasonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleReasonSubmit}
      />
    </div>
  );
}
