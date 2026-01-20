// src/AdmissionModule/EntranceList/EntranceList.jsx
import React, { useState } from "react";
import { FiDownload, FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";

export default function EntranceList() {
  /* ================= MODAL ================= */
  const [openModal, setOpenModal] = useState(false);

  /* ================= FILTER ================= */
  const [classFilter, setClassFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= DATA ================= */
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Jai Sharma",
      guardianName: "Rohit Sharma",
      mobile: "9876543210",
      whatsapp: "9876543210",
      email: "aarav@gmail.com",
      classApplied: "Class 5",
      entranceDateTime: "2026-01-20 10:00 AM",
      examiner: "Mr.Abhishek ",
      attendance: "Present",
      status: "Scheduled",
      result: "Qualified", 
    },
    {
      id: 2,
      name: "Ishika Verma",
      guardianName: "daya Verma",
      mobile: "9123456789",
      whatsapp: "9123456789",
      email: "isha@gmail.com",
      classApplied: "Class 7",
      entranceDateTime: "",
      examiner: "",
      attendance: "Pending",
      status: "Pending",
      result: "Not Declared",
    },
    {
      id: 3,
      name: "Kim jon",
      guardianName: "Fin jon",
      mobile: "8877665544",
      whatsapp: "8877665544",
      email: "karan@gmail.com",
      classApplied: "Class 5",
      entranceDateTime: "",
      examiner: "",
      attendance: "Pending",
      status: "Pending",
      result: "Not Declared",
    },
  ]);

  const [form, setForm] = useState({
    className: "Class 5",
    examType: "Student + Parent",
    date: "",
    time: "",
    slot: "10 mins",
    examiner: "",
    venue: "",
    sms: true,
    whatsapp: false,
    email: true,
  });

  const totalCandidates = students.length;
  const scheduledCount = students.filter(s => s.status === "Scheduled").length;
  const pendingCount = students.filter(s => s.status === "Pending").length;

  /* ================= CONFIRM SCHEDULE ================= */
  const handleConfirmSchedule = () => {
    if (!form.date || !form.time || !form.examiner || !form.venue) {
      alert("Please fill all fields");
      return;
    }

    setStudents(prev =>
      prev.map(s =>
        s.classApplied === form.className
          ? {
              ...s,
              entranceDateTime: `${form.date} ${form.time}`,
              examiner: form.examiner,
              status: "Scheduled",
            }
          : s
      )
    );

    setOpenModal(false);
  };

  /* ================= FILTERED LIST ================= */
  const filteredStudents = students.filter((s) => {
    const matchesClass = classFilter === "All" || s.classApplied === classFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission &gt;</span>
        <span>Entrance List</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Entrance Exam</h2>
        <HelpInfo
          title="Entrance List Help"
          description="Manage entrance exam schedules and qualifying results."
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
        <button className="pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      {/* SUMMARY BOXES */}
      <div className="grid grid-cols-3 gap-4 mb-6 mt-4">
        <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <p className="text-sm text-gray-500">Total Candidates</p>
            <p className="text-xl font-bold">{totalCandidates}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <p className="text-sm text-gray-500">Scheduled</p>
            <p className="text-xl font-bold">{scheduledCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <p className="text-sm text-gray-500">Pending Schedule</p>
            <p className="text-xl font-bold">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Entrance Candidates List</h3>

        {/* TOP CONTROLS — SAME AS INTERVIEW */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search student name..."
              className="border rounded-md px-2 py-1.5 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="border px-3 py-2 rounded-md ml-3 text-sm"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            >
              <option value="All">All Classes</option>
              <option>Class 5</option>
              <option>Class 6</option>
              <option>Class 7</option>
            </select>

            <select className="border px-3 py-2 rounded-md ml-3 text-sm">
              <option>Status</option>
              <option>Scheduled</option>
              <option>Completed</option>
            </select>

            <select className="border px-3 py-2 rounded-md ml-3 text-sm">
              <option>Bulk Action</option>
              <option>Export Excel</option>
            </select>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            <FiPlus /> Schedule Entrance Exam
          </button>
        </div>

        {/* TABLE — SAME */}
        <table className="w-full border">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Date & Time</th>
              <th className="p-2 border">Examiner(s)</th>
              <th className="p-2 border">Attendance</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Result</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.classApplied}</td>
                <td className="p-2 border">{s.entranceDateTime || "-"}</td>
                <td className="p-2 border">{s.examiner || "-"}</td>
                <td className="p-2 border">{s.attendance}</td>
                <td className="p-2 border">{s.status}</td>
                <td className="p-2 border">
                  <select
                    value={s.result}
                    onChange={(e) =>
                      setStudents(prev =>
                        prev.map(st =>
                          st.id === s.id ? { ...st, result: e.target.value } : st
                        )
                      )
                    }
                    className="border rounded-md px-1 py-0.5 text-xs w-full"
                  >
                    <option>Not Declared</option>
                    <option>Qualified</option>
                    <option>Disqualified</option>
                  </select>
                </td>
                <td className="p-2 border text-center flex justify-center gap-3">
                  <FiEdit2 className="cursor-pointer text-blue-600" />
                  <FiTrash2 className="cursor-pointer text-red-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL — EXACT SAME AS INTERVIEW */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[700px] relative overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
                         <h2 className="text-lg font-bold text-gray-800">Schedule Entrance</h2>
                         <button onClick={() => setOpenModal(false)} className="text-gray-400 hover:text-red-500">
                           <FiX size={20} />
                         </button>
                       </div>
           
                       <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                         {/* Select Scope */}
                         <div className="grid grid-cols-2 gap-6">
                           <div>
                             <label className="block text-sm font-semibold text-gray-600 mb-1">Select Class</label>
                             <select
                               className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none pr-8 bg-white"
                               value={form.className}
                               onChange={(e) => setForm({ ...form, className: e.target.value })}
                             >
                               <option>Class 5</option>
                               <option>Class 6</option>
                               <option>Class 7</option>
                             </select>
                           </div>
                           <div>
                             <label className="block text-sm font-semibold text-gray-600 mb-1">Entrance Type</label>
                             <select
                               className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white"
                               value={form.interviewType}
                               onChange={(e) => setForm({ ...form, interviewType: e.target.value })}
                             >
                               <option>Student + Parent</option>
                               <option>Student Only</option>
                               <option>Parent Only</option>
                             </select>
                           </div>
                         </div>
           
                   
                         <div className="space-y-4">
                           <h4 className="text-sm font-bold border-b pb-1 text-gray-700">Entrance Details</h4>
                           <div className="grid grid-cols-3 gap-4">
                             <div>
                               <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Date</label>
                               <input
                                 type="date"
                                 className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                 onChange={(e) => setForm({ ...form, date: e.target.value })}
                               />
                             </div>
                             <div>
                               <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Time</label>
                               <input
                                 type="time"
                                 className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                 onChange={(e) => setForm({ ...form, time: e.target.value })}
                               />
                             </div>
                             <div>
                               <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Slot Duration</label>
                               <select className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white">
                                 <option>10 mins</option>
                                 <option>15 mins</option>
                                 <option>30 mins</option>
                               </select>
                             </div>
                           </div>
           
                           <div className="grid grid-cols-2 gap-4">
                             <div>
                               <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Teachers</label>
                               <input
                                 type="text"
                                 placeholder="e.g. Mr. Kartike"
                                 className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                 onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                               />
                             </div>
                             <div>
                               <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Venue</label>
                               <input
                                 type="text"
                                 placeholder="Main Block, School Campus"
                                 className="w-full border border-blue-200 rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none bg-blue-50/10"
                                 onChange={(e) => setForm({ ...form, venue: e.target.value })}
                               />
                             </div>
                           </div>
                         </div>
           
                         {/* Notification Settings */}
                         <div className="space-y-4">
                           <h4 className="text-sm font-bold border-b pb-1 text-gray-700">Notification Settings</h4>
                           <div className="flex gap-8 text-sm">
                             <label className="flex items-center gap-2 cursor-pointer font-semibold">
                               <input type="checkbox" checked={form.sms} onChange={e => setForm({...form, sms: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                               Send SMS
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer font-semibold">
                               <input type="checkbox" checked={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                               WhatsApp
                             </label>
                             <label className="flex items-center gap-2 cursor-pointer font-semibold">
                               <input type="checkbox" checked={form.email} onChange={e => setForm({...form, email: e.target.checked})} className="w-4 h-4 text-blue-600 rounded" />
                               Email Notification
                             </label>
                           </div>
           
                           <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                              <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Message Template (Preview)</p>
                              <p className="text-sm text-blue-800 font-bold">
                               Hello! Your Entrance Exam for {form.className} is scheduled on {form.date || "____"} at {form.time || "____"}. Venue: {form.venue || "____"}.
                              </p>
                           </div>
                         </div>
                       </div>
           
                       <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                         <button 
                           onClick={() => setOpenModal(false)}
                           className="px-6 py-2 border rounded-md text-gray-600 font-bold bg-white shadow-sm hover:bg-gray-50"
                         >
                           Cancel
                         </button>
                         <button 
                           onClick={handleConfirmSchedule}
                           className="px-6 py-2 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm"
                         >
                           Confirm & Schedule
                         </button>
                       </div>
          </div>
        </div>
      )}
    </div>
  );
}
