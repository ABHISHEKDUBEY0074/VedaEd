import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  FiDownload,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiTrash2,
} from "react-icons/fi";

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
    {
      id: 2,
      studentName: "Aarav Mehta",
      parentName: "Rohit Mehta",
      email: "rohitmehta@example.com",
      phone: "9876543210",
      class: "8th",
      approvedOn: "2025-10-31",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
const [records, setRecords] = useState([]);
  // 🔹 BULK ACTION STATES
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Export Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(approvedList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Approved Applications"
    );
    XLSX.writeFile(workbook, "ApprovedApplications.xlsx");
  };

  // ✅ Disapprove
  const handleDisapprove = (id) => {
    setApprovedList(approvedList.filter((a) => a.id !== id));
  };

  // 🔹 Filter
  const filteredList = approvedList.filter((a) =>
    a.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );
const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 5;

const totalPages = Math.ceil(records.length / recordsPerPage);

const paginatedRecords = records.slice(
  (currentPage - 1) * recordsPerPage,
  currentPage * recordsPerPage
);
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        Approved Applications
      </h3>

      {/* SEARCH + BULK */}
      <div className="flex items-center gap-3 mb-4 w-full">
        {/* Search (same padding as bulk) */}
        <div className="flex items-center border px-2 py-1.5 rounded-md bg-white w-[220px]">
          <FiSearch className="text-gray-500 mr-2 " />
          <input
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none "
          />
        </div>

        {/* Bulk Actions (CLICK BASED) */}
        <div className="relative" ref={bulkActionRef}>
          <button
            onClick={() => setShowBulkActions((prev) => !prev)}
            className="border px-3 py-2 rounded-md  bg-white flex items-center gap-2 w-[120px] justify-between hover:border-blue-500"
          >
            <span>Bulk Actions</span>
            <FiChevronDown className="" />
          </button>

          {showBulkActions && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-10">
              <button
                onClick={() => setShowBulkActions(false)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <FiUser className="" />
                Select
              </button>

              <button
                onClick={() => {
                  handleExportExcel();
                  setShowBulkActions(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <FiDownload className="" />
                Export Excel
              </button>

              <button
                onClick={() => setShowBulkActions(false)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
              >
                <FiTrash2 className="" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <table className="min-w-full border border-gray-200">
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
          {filteredList.length > 0 ? (
            filteredList.map((a) => (
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
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-4 border">
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
    </div>
  );
}
