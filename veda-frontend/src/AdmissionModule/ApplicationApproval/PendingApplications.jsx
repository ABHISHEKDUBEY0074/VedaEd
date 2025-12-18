import React, { useState, useRef, useEffect } from "react";
import DisapproveReasonModal from "./DisapproveReasonModal";
import {
  FiSearch,
  FiChevronDown,
  FiUser,
  FiTrash2,
} from "react-icons/fi";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  
  const totalPages = Math.ceil(records.length / recordsPerPage);
  
  const paginatedRecords = records.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // 🔹 BULK ACTION STATE
  const [showBulkActions, setShowBulkActions] = useState(false);
  const bulkActionRef = useRef(null);

  // 🔹 Close bulk dropdown on outside click
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

  const handleApprove = (id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const handleDisapprove = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleReasonSubmit = (reason) => {
    console.log("Disapproved ID:", selectedId, "Reason:", reason);
    setApplications((prev) => prev.filter((app) => app.id !== selectedId));
    setShowModal(false);
  };

  // ✅ FIXED SEARCH (pehle yahi missing tha)
  const filteredApplications = applications.filter((app) =>
    app.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-semibold mb-4">
        Pending Applications
      </h3>

      {/* SEARCH + BULK */}
      <div className="flex items-center gap-3 mb-4 w-full">
        {/* Search (bulk jaisa same height/padding) */}
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
      <table className="w-full border text-sm">
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
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
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
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center text-gray-500 py-4 border"
              >
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
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
