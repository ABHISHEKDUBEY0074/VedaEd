import React, { useState } from "react";
import { FiMoreHorizontal, FiX, FiDownload, FiFileText } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import HelpInfo from "../../components/HelpInfo";   
export default function ApproveLeave() {
  const [leaveData, setLeaveData] = useState([
    {
      id: 1,
      staff: "James Deckar (9004)",
      leaveType: "Maternity Leave",
      leaveDate: "10/16/2025 - 10/22/2025",
      days: 5,
      applyDate: "10/16/2025",
      status: "Approved",
      note: "Approved due to maternity policy.",
    },
    {
      id: 2,
      staff: "Joe Black (9000)",
      leaveType: "Medical Leave",
      leaveDate: "09/22/2025 - 09/23/2025",
      days: 3,
      applyDate: "09/22/2025",
      status: "Pending",
      note: "",
    },
    {
      id: 3,
      staff: "William Abbot (9003)",
      leaveType: "Medical Leave",
      leaveDate: "08/05/2025 - 08/09/2025",
      days: 4,
      applyDate: "08/05/2025",
      status: "Disapproved",
      note: "Insufficient leave balance.",
    },
  ]);

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leaveData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");
    XLSX.writeFile(workbook, "ApproveLeaveList.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Approve Leave Request", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [
        [
          "Staff",
          "Leave Type",
          "Leave Date",
          "Days",
          "Apply Date",
          "Status",
          "Note",
        ],
      ],
      body: leaveData.map((d) => [
        d.staff,
        d.leaveType,
        d.leaveDate,
        d.days,
        d.applyDate,
        d.status,
        d.note || "-",
      ]),
    });
    doc.save("ApproveLeaveList.pdf");
  };

  const filteredData = leaveData.filter((item) =>
    item.staff.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStatus = (status) => {
    setLeaveData((prev) =>
      prev.map((d) =>
        d.id === selectedLeave.id
          ? { ...d, status: status, note: noteInput }
          : d
      )
    );
    setSelectedLeave(null);
    setNoteInput("");
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>HR</span>
        <span>&gt;</span>
        <span>Leave Management</span>
</div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Staff Leave Request</h2>
          <HelpInfo
  title="Staff Leave Request Help"
  description={`1.1 Staff Leave Request Table Overview:

- Staff: Name of the employee along with their Staff ID.
- Leave Type: Category of leave applied for (e.g., Medical Leave, Maternity Leave).
- Leave Date: Duration for which the leave is requested.
- Days: Total number of leave days requested.
- Apply Date: Date when the leave request was submitted.
- Status: Current status of the leave request (Approved, Pending, Disapproved).
- Note: Additional comments or reasons related to the leave request.
- Action: Options to approve, reject, or manage the leave request.`}
/>
        </div>

      {/* Tabs */}
      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
        {["overview"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 ${
              activeTab === tab
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab === "overview" ? "Overview" : tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          {/* Top Controls */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search name..."
              className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <FiDownload /> Excel
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <FiFileText /> PDF
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full  text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 font-semibold">Staff</th>
                <th className="p-3 font-semibold">Leave Type</th>
                <th className="p-3 font-semibold">Leave Date</th>
                <th className="p-3 font-semibold">Days</th>
                <th className="p-3 font-semibold">Apply Date</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Note</th>
                <th className="p-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{d.staff}</td>
                  <td className="p-3">{d.leaveType}</td>
                  <td className="p-3">{d.leaveDate}</td>
                  <td className="p-3">{d.days}</td>
                  <td className="p-3">{d.applyDate}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        d.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : d.status === "Disapproved"
                          ? "bg-pink-100 text-pink-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600 italic">{d.note || "—"}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedLeave(d);
                        setNoteInput(d.note || "");
                      }}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <FiMoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <p className="text-center text-gray-500 py-4">No records found</p>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative animate-fadeIn">
            <button
              onClick={() => setSelectedLeave(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Update Leave Status
            </h3>

            <p className="text-gray-700 mb-2">
              <strong>Staff:</strong> {selectedLeave.staff}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Leave Type:</strong> {selectedLeave.leaveType}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Leave Date:</strong> {selectedLeave.leaveDate}
            </p>

            <textarea
              placeholder="Add a note..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4"
              rows="3"
            ></textarea>

            <div className="flex justify-between gap-3">
              <button
                onClick={() => updateStatus("Approved")}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex-1"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus("Disapproved")}
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 flex-1"
              >
                Disapprove
              </button>
              <button
                onClick={() => updateStatus("Pending")}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 flex-1"
              >
                Pending
              </button>
            </div>

            <button
              onClick={() => updateStatus(selectedLeave.status)}
              className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
