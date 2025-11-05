import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FiDownload, FiSearch } from "react-icons/fi";

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

  // ✅ Disapprove handler
  const handleDisapprove = (id) => {
    setApprovedList(approvedList.filter((a) => a.id !== id));
  };

  // ✅ Export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(approvedList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Applications");
    XLSX.writeFile(workbook, "ApprovedApplications.xlsx");
  };

  // ✅ Filter by search
  const filteredList = approvedList.filter((a) =>
    a.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-lg font-semibold mb-3 md:mb-0">
          Approved Applications
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
    </div>
  );
}
