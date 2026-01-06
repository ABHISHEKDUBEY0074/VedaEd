import React, { useState, useRef, useEffect } from "react";
import DisapproveReasonModal from "./DisapproveReasonModal";
import {
  FiSearch,
  FiChevronDown,
  FiUser,
  FiTrash2,
} from "react-icons/fi";

export default function PendingApplications({ data = [], onApprove, onDisapprove }) {
  // Use data from props as the source
  const applications = data;

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
    if (onApprove) onApprove(id);
  };

  const handleDisapprove = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleReasonSubmit = (reason) => {
    if (onDisapprove) onDisapprove(selectedId, reason);
    setShowModal(false);
  };

  // ✅ FIXED SEARCH (pehle yahi missing tha)
  const filteredApplications = applications.filter((app) =>
    app.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        Pending Applications
      </h3>

      {/* SEARCH + BULK */}
      <div className="flex items-center gap-3 mb-4 w-full">
        {/* Search (bulk jaisa same height/padding) */}
        <div className="flex items-center border px-2 py-1.5 rounded-md bg-white w-[220px]">
          <FiSearch className="text-gray-500 mr-2 " />
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {/* Bulk Actions */}
        <div className="relative" ref={bulkActionRef}>
          <button
            onClick={() => setShowBulkActions((prev) => !prev)}
            className="border px-3 py-2 rounded-md  bg-white flex items-center gap-2 w-[120px] justify-between hover:border-blue-500"
          >
            <span>Bulk Actions</span>
            <FiChevronDown className="" />
          </button>

          {showBulkActions && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-10 text-sm">
              <button
                onClick={() => setShowBulkActions(false)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <FiUser className="" />
                Select
              </button>

              <button
                onClick={() => setShowBulkActions(false)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
              >
                <FiTrash2 className="" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full border ">
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
      <div className="flex justify-between items-center  text-gray-500 mt-2">
  <p>
    Page {currentPage} of {totalPages}
  </p>
  <div className="space-x-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
      className="px-3 py-1 border rounded  disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>
    <button
      disabled={currentPage === totalPages || totalPages === 0}
      onClick={() => setCurrentPage(currentPage + 1)}
      className="px-3 py-1 border rounded  disabled:opacity-50 disabled:cursor-not-allowed"
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
