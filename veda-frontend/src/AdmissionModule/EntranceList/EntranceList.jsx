import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";
import { getEntranceCandidates, scheduleEntranceExam, updateEntranceResult, declareEntranceResult } from "../../api/admissionExamAPI";

export default function EntranceList() {
  /* ================= MODAL ================= */
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudentForSchedule, setSelectedStudentForSchedule] = useState(null);

  /* ================= FILTER ================= */
  const [classFilter, setClassFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= DATA ================= */
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await getEntranceCandidates();
      setStudents(data);
    } catch (error) {
      console.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState({
    className: "", // Will be auto-filled based on selection if needed, or kept generic
    examType: "Oral",
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
  const pendingCount = students.filter(s => s.status !== "Scheduled" && s.status !== "Completed").length;

  /* ================= OPEN MODAL ================= */
  // We might want to clear form or pre-fill it
  const handleOpenSchedule = (student = null) => {
    if (student) {
        setSelectedStudentForSchedule(student);
        setForm(prev => ({
            ...prev,
            className: student.classApplied || "", // Pre-select class
        }));
    } else {
        setSelectedStudentForSchedule(null);
    }
    setOpenModal(true);
  };

  /* ================= CONFIRM SCHEDULE ================= */
  const handleConfirmSchedule = async () => {
    if (!form.date || !form.time || !form.examiner || !form.venue) {
      alert("Please fill all fields");
      return;
    }

    try {
        // If specific student selected, schedule for them.
        // If generic schedule (bulk based on class), logic differs.
        // The original UI implied bulk scheduling "Select Class".
        // Use logic: if selectedStudentForSchedule is null, assume we schedule for ALL students of 'form.className' who are pending?
        // Or essentially just loop and schedule.
        // For simplicity and matching backend:
        // The Backend 'scheduleEntranceExam' takes 'applicationIdRef'.
        // So we need to iterate over students matching the class if it's a bulk action.
        
        const studentsToSchedule = selectedStudentForSchedule 
            ? [selectedStudentForSchedule] 
            : students.filter(s => s.classApplied === form.className && s.status === 'Pending');

        if (studentsToSchedule.length === 0) {
            alert("No pending candidates found for this class.");
            return;
        }

        // Ideally backend handles bulk, but for now loop requests or update backend to handle array.
        // Let's loop for now (simpler than changing backend significantly right now).
        // Or better, just schedule for one if the UI was meant for one... 
        // NOTE: The original UI had a "Schedule Entrance Exam" button at top (Bulk?) 
        // but no individual schedule button except "Bulk Action".
        // Wait, looking at original code: "Schedule Entrance Exam" button opens modal. 
        // Modal has "Select Class". 
        // Logic: `prev.map(s => s.classApplied === form.className ? ...)` -> It WAS bulk for the class.
        
        const promises = studentsToSchedule.map(student => 
            scheduleEntranceExam({
                applicationIdRef: student.applicationIdRef,
                date: form.date,
                time: form.time,
                duration: form.slot,
                examiner: form.examiner,
                venue: form.venue,
                type: form.examType,
                sms: form.sms,
                whatsapp: form.whatsapp,
                email: form.email
            })
        );

        await Promise.all(promises);
        
        alert("Schedule updated successfully!");
        setOpenModal(false);
        fetchCandidates(); // Refresh

    } catch (error) {
        console.error(error);
        alert("Failed to schedule exam.");
    }
  };

  const handleUpdateResult = async (student, field, value) => {
      try {
          if (student._id) {
             // Exam exists, update it
             await updateEntranceResult(student._id, { [field]: value });
          } else {
             // Exam doesn't exist, create it via declareResult
             await declareEntranceResult({
                 applicationId: student.applicationIdRef,
                 [field]: value
             });
          }
          fetchCandidates();
      } catch (error) {
          alert("Failed to update result.");
      }
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

        {/* TOP CONTROLS */}
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
            onClick={() => handleOpenSchedule()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus /> Schedule Entrance Exam
          </button>
        </div>

        {/* TABLE */}
        <table className="w-full border">
          <thead className="bg-gray-100 font-semibold">
            <tr>
              <th className="p-2 border">Application ID</th>
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
            {loading ? (
                 <tr>
                    <td colSpan="9" className="text-center py-4">Loading...</td>
                 </tr>
            ) : filteredStudents.length === 0 ? (
                <tr>
                    <td colSpan="9" className="text-center py-4">No candidates found</td>
                </tr>
            ) : (
                filteredStudents.map((s) => (
              <tr key={s.applicationId} className="hover:bg-gray-50">
                <td className="p-2 border font-semibold text-gray-700">
                  {s.applicationId}
                </td>

                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.classApplied}</td>
                <td className="p-2 border">{s.entranceDateTime || "-"}</td>
                <td className="p-2 border">{s.examiner || "-"}</td>
                <td className="p-2 border">
                    <select 
                        value={s.attendance} 
                        onChange={(e) => handleUpdateResult(s, 'attendance', e.target.value)}
                        className={`px-2 py-1 rounded text-xs border ${
                            s.attendance === 'Present' ? 'bg-green-100 text-green-700' : 
                            s.attendance === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                        <option>Pending</option>
                        <option>Present</option>
                        <option>Absent</option>
                    </select>
                </td>
                <td className="p-2 border">
                    <span className={`px-2 py-1 rounded text-xs ${
                      s.status === "Scheduled" ? "bg-blue-100 text-blue-700" : 
                      s.status === "Completed" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {s.status}
                    </span>
                </td>
                <td className="p-2 border">
                  <select
                    value={s.result}
                    onChange={(e) => handleUpdateResult(s, 'result', e.target.value)}
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
            )))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
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
                             <label className="block text-sm font-semibold text-gray-600 mb-1">Select Class (Bulk Schedule)</label>
                             <select
                               className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none pr-8 bg-white"
                               value={form.className}
                               onChange={(e) => setForm({ ...form, className: e.target.value })}
                             >
                               <option value="">-- Select Class --</option>
                               <option>Class 5</option>
                               <option>Class 6</option>
                               <option>Class 7</option>
                             </select>
                           </div>
                           <div>
  <label className="block text-sm font-semibold text-gray-600 mb-1">
    Exam Type
  </label>
  <select
    className="w-full border rounded-md px-3 py-2 text-sm bg-white"
    value={form.examType}
    onChange={(e) => setForm({ ...form, examType: e.target.value })}
  >
    <option value="Oral">Oral</option>
    <option value="Theory">Theory</option>
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
                               <select className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white"
                                 value={form.slot}
                                 onChange={(e) => setForm({...form, slot: e.target.value})}
                               >
                                 <option>10 mins</option>
                                 <option>15 mins</option>
                                 <option>30 mins</option>
                                 <option>60 mins</option>
                               </select>
                             </div>
                           </div>
           
                           <div className="grid grid-cols-2 gap-4">
                             <div>
                               <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Examiner</label>
                               <input
                                 type="text"
                                 placeholder="e.g. Mr. Smith"
                                 className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                 onChange={(e) => setForm({ ...form, examiner: e.target.value })}
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
