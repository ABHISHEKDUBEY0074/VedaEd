import React, { useMemo, useState } from "react";
import HelpInfo from "../../components/HelpInfo";
import {
  FiSearch,
  FiDownload,
  FiSend,
  FiChevronDown,
  FiX,
  FiEye,
} from "react-icons/fi";

/* ================= DATA ================= */
const INITIAL_DATA = [
  {
    id: 1,
    name: "Aarav Sharma",
    avatar: "https://i.pravatar.cc/40?img=3",
    appliedClass: "Class 5",
   examStatus: "Not Scheduled",
examDate: "",
examTime: "",

    resultStatus: "Result Pending",
   
  },
  {
    id: 2,
    name: "Isha Verma",
    avatar: "https://i.pravatar.cc/40?img=5",
    appliedClass: "Class 7",
   examStatus: "Not Scheduled",
examDate: "",
examTime: "",

    resultStatus: "Result Pending",
    
  },
  {
    id: 3,
    name: "Karan Singh",
    avatar: "https://i.pravatar.cc/40?img=8",
    appliedClass: "Class 5",
    examStatus: "Not Scheduled",
examDate: "",
examTime: "",

    resultStatus: "Result Pending",
   
  },
];

export default function EntranceExamManagement() {
  const [rows, setRows] = useState(INITIAL_DATA);

  /* ================= TOP FILTERS ================= */
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [topResultStatus, setTopResultStatus] = useState("");
  const [topSearch, setTopSearch] = useState("");

  /* ================= TABLE FILTERS ================= */
  const [classFilter, setClassFilter] = useState("");
  const [tableResultStatus, setTableResultStatus] = useState("");
  const [tableSearch, setTableSearch] = useState("");

  /* ================= MODAL ================= */
  const [openRow, setOpenRow] = useState(null);
  const [resultValue, setResultValue] = useState("Qualified");

  const messagePreview =
    resultValue === "Qualified"
      ? "Congratulations! You have qualified for the interview round."
      : "We regret to inform you that you were not qualified this time.";

  /* ================= FILTER LOGIC ================= */
 const filteredRows = useMemo(() => {
  return rows.filter((r) => {
    if (topResultStatus && r.resultStatus !== topResultStatus) return false;
    if (classFilter && r.appliedClass !== classFilter) return false;
    if (tableResultStatus && r.resultStatus !== tableResultStatus)
      return false;

    const keyword = (topSearch || tableSearch).toLowerCase();
    if (
      keyword &&
      !r.name.toLowerCase().includes(keyword) &&
      !r.appliedClass.toLowerCase().includes(keyword)
    )
      return false;

    return true;
  });
}, [
  rows,
  topResultStatus,
  topSearch,
  classFilter,
  tableResultStatus,
  tableSearch,
]);


  const handleSendSchedule = () => {
  if (!examDate || !examTime) {
    alert("Please set exam date & time");
    return;
  }

  setRows(prev =>
    prev.map(r => ({
      ...r,
      examStatus: "Scheduled",
      examDate,
      examTime
    }))
  );
};


  /* ================= DECLARE RESULT ================= */
  const handleConfirmResult = () => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === openRow.id
          ? {
              ...r,
              resultStatus: resultValue,
              examStatus: "Completed",
            }
          : r
      )
    );
    setOpenRow(null);
  };

  return (
     <div className="p-0 m-0 min-h-screen">
          {/* Breadcrumb */}
          <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
            <span>Admission</span>
            <span>&gt;</span>
            <span>Exam List</span>
          </div>
    
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Entrance Exam List</h2>
            <HelpInfo
              title="Interview List Help"
              description={`1.1 Overview
    
    This page helps you manage the list of students scheduled for interviews. You can track interview details and communicate results efficiently.
    
    2.1 Interview Schedule
    
    View the scheduled date, time, and venue for each student's interview. Use the available options to update or send reminders.
    
    3.1 Custom Message Templates
    
    Predefined messages assist in communicating interview outcomes:
    - "Congratulations! You have qualified for the next round."
    - "We regret to inform you that you were not selected this time."
    
    4.1 Interviewee List Table
    
    The table displays details of students attending interviews:
    
    - ID: Unique identifier for each student.
    - Name: Full name of the student.
    - Class: The grade or class of the student.
    - Phone: Contact number for communication.
    - Email: Email address to send interview details or results.
    - Status: Current status of the interview (e.g., Scheduled, Completed).
    - Result: Interview outcome (e.g., Not Declared, Selected, Not Selected).
    
    Use options like 'Export' to download the list and 'Send Email + SMS' to notify students about interview schedules or results.`}
            />
          </div>
     <div className="mb-4 flex flex-wrap gap-2">
              <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
                Overview
              </button>
            </div>

     {/* ================= EXAM CONFIG ================= */}
<div className="bg-white border rounded-lg mb-3">
  <div className="px-3 py-2  font-medium text-lg">
    Exam Configuration
  </div>

  <div className="px-3 py-2 grid grid-cols-12 gap-4 text-sm items-end">
    {/* Exam Date */}
    <div className="col-span-2">
      <label className="block text-xs text-gray-500 mb-1">
        Exam Date
      </label>
      <input
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
    </div>

    {/* Exam Time */}
    <div className="col-span-2">
      <label className="block text-xs text-gray-500 mb-1">
        Exam Time
      </label>
      <input
        type="time"
        value={examTime}
        onChange={(e) => setExamTime(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
    </div>

    {/* Result Status */}
    <div className="col-span-2">
      <label className="block text-xs text-gray-500 mb-1">
        Result Status
      </label>
      <select
        className="border rounded px-3 py-2 w-full"
        value={topResultStatus}
        onChange={(e) => setTopResultStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="Result Pending">Result Pending</option>
        <option value="Qualified">Qualified</option>
        <option value="Not Qualified">Not Qualified</option>
      </select>
    </div>

    {/* Search */}
    <div className="col-span-3">
      <label className="block text-xs text-gray-500 mb-1">
        Search
      </label>
      <div className="flex items-center border rounded px-3 py-2">
        <FiSearch className="mr-2 text-gray-400" />
        <input
          placeholder="Search candidate..."
          value={topSearch}
          onChange={(e) => setTopSearch(e.target.value)}
          className="outline-none w-full"
        />
      </div>
    </div>

    {/* RIGHT SIDE BUTTONS */}
    <div className="col-span-3 flex justify-end gap-2">
      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2">
        <FiDownload /> Export
      </button>

   <button
  onClick={handleSendSchedule}
  className="bg-indigo-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
>
  <FiSend /> Send Notification
</button>

    </div>
  </div>
</div>


      {/* ================= CANDIDATE LIST ================= */}
      <div className="bg-white border rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-3 py-2 ">
          <div className="font-medium text-lg">Candidate List</div>
         
        </div>

        {/* Filters */}
        <div className="px-2 py-1 flex gap-4 text-sm ">
          <select
            className="border rounded px-3 py-2"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Class 5">Class 5</option>
            <option value="Class 7">Class 7</option>
          </select>

          <select
            className="border rounded px-3 py-2"
            value={tableResultStatus}
            onChange={(e) => setTableResultStatus(e.target.value)}
          >
            <option value="">Result Status</option>
            <option value="Result Pending">Result Pending</option>
            <option value="Qualified">Qualified</option>
            <option value="Not Qualified">Not Qualified</option>
          </select>

          <div className="ml-auto flex items-center border rounded px-3 py-2">
            <FiSearch className="mr-2 text-gray-400" />
            <input
              placeholder="Search..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="outline-none"
            />
          </div>
        </div>

        {/* Table */}
         <div className="overflow-x-auto">
        <table className="min-w-full full-border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Applied Class</th>
              <th className="border p-2 text-left">Exam Status</th>
              <th className="border p-2 text-left">Result Status</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => (
              <tr key={r.id} className="">
                <td className="border p-2">{r.id}</td>
                <td className="border p-2 items-center gap-2">
                  
                  {r.name}
                </td>
                <td className="border p-2">{r.appliedClass}</td>
               <td className="border p-2">
  {r.examStatus === "Scheduled" ? (
    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs">
      Scheduled ({r.examDate} {r.examTime})
    </span>
  ) : (
    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs">
      Not Scheduled
    </span>
  )}
</td>

                <td className="border p-2">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs">
                    {r.resultStatus}
                  </span>
                </td>
                <td className="border p-2 flex gap-2">
                  <button className="border px-3 py-1.5 rounded text-xs flex items-center gap-1">
                    <FiEye /> View Profile
                  </button>
                  <button
                    onClick={() => {
                      setOpenRow(r);
                      setResultValue("Qualified");
                    }}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1"
                  >
                    Declare Result <FiChevronDown />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {openRow && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[420px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Declare Result</h3>
              <button onClick={() => setOpenRow(null)}>
                <FiX />
              </button>
            </div>

            <label className="text-sm mb-1 block">Result</label>
            <select
              value={resultValue}
              onChange={(e) => setResultValue(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            >
              <option>Qualified</option>
              <option>Not Qualified</option>
            </select>

            <label className="text-sm mb-1 block">
              Message Preview
            </label>
            <div className="border rounded p-3 text-sm text-gray-600 mb-5">
              {messagePreview}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenRow(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResult}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Send & Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
