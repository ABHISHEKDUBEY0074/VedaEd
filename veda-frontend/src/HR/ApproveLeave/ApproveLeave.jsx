import React, { useMemo, useState, useEffect } from "react";
import { FiX, FiDownload, FiFileText } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import HelpInfo from "../../components/HelpInfo";
import api from "../../services/apiClient";


//we will change when we create setup of leave 
const INITIAL_CASUAL = 15;
const INITIAL_SICK = 12;

function toDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(value) {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateRange(fromDate, toDateValue) {
  const from = formatDate(fromDate);
  const to = formatDate(toDateValue);
  return from === to ? from : `${from} to ${to}`;
}

function getStaffName(leave) {
  return leave?.staff?.personalInfo?.name || leave?.staffName || "Teacher User";
}

function getStaffId(leave, idx = 0) {
  return leave?.staff?.personalInfo?.staffId || leave?.staffId || `STF-${1000 + idx}`;
}

function getStatusTone(status) {
  if (status === "Approved") return "bg-emerald-100 text-emerald-700";
  if (status === "Disapproved" || status === "Rejected") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

function getConflictLabel(leave) {
  return leave?.conflict || (Number(leave?.days) > 1 ? "Scheduled class conflict" : "No conflict");
}

function getDurationLabel(leave) {
  if (leave?.duration) return leave.duration;
  return Number(leave?.days) > 1 ? "Multiple Days" : "Full Day";
}

function leaveBucket(leaveType) {
  return String(leaveType || "").toLowerCase().includes("sick") ? "sick" : "casual";
}

function getLeaveUnits(leave) {
  const units = Number(leave?.days);
  return Number.isFinite(units) && units > 0 ? units : 0;
}

export default function ApproveLeave() {
  const [leaveData, setLeaveData] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get("/staff/leave/requests");
      if (res.data.success) {
        setLeaveData(res.data.leaves || []);
      }
    } catch (err) {
      console.error("Error fetching leaves:", err);
      alert(err?.response?.data?.message || "Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leaveData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Requests");
    XLSX.writeFile(workbook, "ApproveLeaveList.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Approve Leave Request", 14, 15);
    doc.autoTable({
      startY: 25,
      head: [["Staff", "Leave Type", "Date", "Days", "Apply Date", "Status", "Note"]],
      body: leaveData.map((d) => [
        getStaffName(d),
        d.leaveType || "-",
        formatDateRange(d.fromDate, d.toDate),
        d.days || "-",
        formatDate(d.applyDate),
        d.status || "Pending",
        d.note || "-",
      ]),
    });
    doc.save("ApproveLeaveList.pdf");
  };

  const filteredData = useMemo(
    () => leaveData.filter((item) => getStaffName(item).toLowerCase().includes(searchQuery.toLowerCase())),
    [leaveData, searchQuery]
  );

  const summary = useMemo(() => {
    const usedByBucket = leaveData.reduce(
      (acc, leave) => {
        if (leave?.status !== "Approved") return acc;
        const bucket = leaveBucket(leave?.leaveType);
        acc[bucket] += getLeaveUnits(leave);
        return acc;
      },
      { casual: 0, sick: 0 }
    );

    const approvedThisMonth = leaveData.filter((d) => {
      if (d.status !== "Approved") return false;
      const date = toDate(d.fromDate);
      const now = new Date();
      return date && date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }).length;

    return {
      casualBalance: Math.max(0, INITIAL_CASUAL - usedByBucket.casual),
      sickBalance: Math.max(0, INITIAL_SICK - usedByBucket.sick),
      pendingCount: leaveData.filter((d) => d.status === "Pending").length,
      approvedThisMonth,
    };
  }, [leaveData]);

  const updateStatus = async (statusValue) => {
    if (!selectedLeave) return;
    try {
      const res = await api.put(`/staff/leave/${selectedLeave._id}`, {
        status: statusValue,
        note: noteInput,
      });
      if (res.data.success) {
        setLeaveData((prev) =>
          prev.map((d) =>
            d._id === selectedLeave._id
              ? { ...d, status: statusValue, note: noteInput }
              : d
          )
        );
        setSelectedLeave(null);
        setNoteInput("");
      }
    } catch (err) {
      console.error("Error updating leave status:", err);
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="p-0 m-0 min-h-screen space-y-4 w-full max-w-full min-w-0">
      <div className="text-gray-500 text-sm mb-1 flex items-center gap-1">
        <span>HR</span>
        <span>&gt;</span>
        <span>Leave Management</span>
      </div>

      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Staff Leave Request</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Casual Leave Balance", value: summary.casualBalance.toFixed(1).replace(/\.0$/, "") },
          { label: "Sick Leave Balance", value: summary.sickBalance.toFixed(1).replace(/\.0$/, "") },
          { label: "Pending Requests", value: String(summary.pendingCount) },
          { label: "Approved This Month", value: String(summary.approvedThisMonth) },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4 min-w-0">
            <p className="text-[11px] sm:text-xs text-gray-500 mb-1 leading-snug">{card.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-none tabular-nums">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search name..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
            >
              <FiDownload /> Excel
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
            >
              <FiFileText /> PDF
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading leave requests...</p>
        ) : (
          <>
            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full text-left border-collapse min-w-[860px] text-sm">
                <thead className="bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="p-2 lg:p-3 font-semibold">Staff ID</th>
                    <th className="p-2 lg:p-3 font-semibold">Teacher</th>
                    <th className="p-2 lg:p-3 font-semibold">Leave Type</th>
                    <th className="p-2 lg:p-3 font-semibold">Duration</th>
                    <th className="p-2 lg:p-3 font-semibold">Date</th>
                    <th className="p-2 lg:p-3 font-semibold">Conflict</th>
                    <th className="p-2 lg:p-3 font-semibold">Status</th>
                    <th className="p-2 lg:p-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((d, idx) => (
                    <tr
                      key={d._id}
                      className={`border-b border-gray-200 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      } hover:bg-blue-50/40`}
                    >
                      <td className="p-2 lg:p-3 font-semibold text-gray-800">{getStaffId(d, idx)}</td>
                      <td className="p-2 lg:p-3">{getStaffName(d)}</td>
                      <td className="p-2 lg:p-3">{d.leaveType || "—"}</td>
                      <td className="p-2 lg:p-3">{getDurationLabel(d)}</td>
                      <td className="p-2 lg:p-3 whitespace-nowrap">{formatDateRange(d.fromDate, d.toDate)}</td>
                      <td className="p-2 lg:p-3">{getConflictLabel(d)}</td>
                      <td className="p-2 lg:p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusTone(d.status)}`}>
                          {d.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-2 lg:p-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedLeave(d);
                            setNoteInput(d.note || "");
                          }}
                          className={`inline-flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                            d.status === "Pending"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {d.status === "Pending" ? "Review" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && (
              <p className="text-center text-gray-500 py-4">No records found</p>
            )}
          </>
        )}
      </div>

      {selectedLeave && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white shadow-xl w-full sm:max-w-3xl sm:rounded-lg rounded-t-xl border border-gray-200 relative max-h-[min(92dvh,100vh-2rem)] sm:max-h-[90vh] overflow-hidden flex flex-col">
            <button
              onClick={() => setSelectedLeave(null)}
              className="absolute top-3 right-3 p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>

            <div className="p-4 sm:p-5 overflow-y-auto">
              <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900">Leave Request Review</h3>
              <p className="text-sm text-gray-500 mb-4">
                {getStaffId(selectedLeave)} - {getStaffName(selectedLeave)}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Teacher</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{getStaffName(selectedLeave)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{selectedLeave.status || "Pending"}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Leave Type</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{selectedLeave.leaveType || "—"}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                    {formatDateRange(selectedLeave.fromDate, selectedLeave.toDate)}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{getDurationLabel(selectedLeave)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Conflict</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{getConflictLabel(selectedLeave)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Reason</p>
                  <p className="text-base font-semibold text-gray-900 leading-tight">{selectedLeave.reason || "—"}</p>
                </div>
              </div>

              <label className="block text-base font-semibold text-gray-800 mb-2">
                Admin Comment / Rejection Reason
              </label>
              <textarea
                placeholder="Enter approval note or rejection reason"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4"
                rows="4"
              />

            </div>

            <div className="border-t border-gray-200 p-3 sm:p-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                onClick={() => updateStatus("Disapproved")}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 min-w-[108px] text-sm font-semibold"
              >
                Reject
              </button>
              <button
                onClick={() => updateStatus("Approved")}
                className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 min-w-[108px] text-sm font-semibold"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
