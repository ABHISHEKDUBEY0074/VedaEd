import React, { useEffect, useMemo, useState } from "react";
import HelpInfo from "../components/HelpInfo";
import { FiSearch, FiPaperclip } from "react-icons/fi";

/* ===================== ID GENERATORS ===================== */
const genComplaintId = () =>
  `CMP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
const genReplyId = () =>
  `RPL-${Math.floor(100000 + Math.random() * 900000)}`;

/* ===================== MASTER DATA ===================== */
const classes = ["5", "6"];
const sections = ["A", "B"];

const studentsData = [
  {
    id: "STD-101",
    name: "Aarav Sharma",
    class: "5",
    section: "A",
    parentId: "PAR-9001",
    parentName: "Mr. Rajesh Sharma",
    parentPhone: "98XXXXXX12",
    classTeacher: "Neha Gupta",
  },
  {
    id: "STD-102",
    name: "Ananya Verma",
    class: "5",
    section: "B",
    parentId: "PAR-9002",
    parentName: "Mrs. Neha Verma",
    parentPhone: "97XXXXXX45",
    classTeacher: "Ramesh Kumar",
  },
];

const staffList = [
  { id: "TCH-201", name: "Neha Gupta", role: "Teacher" },
  { id: "TCH-202", name: "Ramesh Kumar", role: "Teacher" },
  { id: "STF-301", name: "Amit Singh", role: "Accountant" },
];

/* 🔥 PANEL MEMBERS – AS YOU SAID */
const concernPanel = [
  "Principal",
  "Vice Principal",
  "Coordinator",
];

export default function AdminComplaints() {
  const [activeTab, setActiveTab] = useState("raise");

  /* ===================== FORM ===================== */
  const [form, setForm] = useState({
    category: "",
    type: "",
    subject: "",
    message: "",
    attachment: null,

    /* NEW ADMIN LOGIC */
    complaintAgainst: "", // student | staff

    /* STUDENT FLOW */
    class: "",
    section: "",
    studentId: "",
    notifyParents: true,
    notifyTeacher: false,

    /* STAFF FLOW */
    staffId: "",
    panel: [],
  });

  /* ===================== DATA ===================== */
  const [myComplaints, setMyComplaints] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");

  /* ===================== INIT SAMPLE DATA ===================== */
  useEffect(() => {
  setMyComplaints([
  {
    complaintId: genComplaintId(),
    subject: "Late syllabus completion",
    status: "Pending",
    createdAt: "25 Apr 2026, 11:10 AM",

    complaintAgainst: "student",

    sendTo: ["Parent", "Class Teacher"],

    student: studentsData[0],

    panel: [],

    messages: [
      {
        replyId: genReplyId(),
        by: "You",
        text: "Syllabus pace needs improvement.",
        time: "25 Apr 2026, 11:10 AM",
      },
    ],
  },
]);


   setLogs([
  {
    complaintId: genComplaintId(),
    raisedBy: "Parent",

    complaintAgainst: "student",

    sendTo: ["Class Teacher"],

    student: studentsData[0],

    subject: "Teacher behaviour issue",
    status: "Pending",
    createdAt: "26 Apr 2026, 09:40 AM",

    panel: [],

    messages: [
      {
        replyId: genReplyId(),
        by: "Parent",
        text: "Teacher is rude in class.",
        time: "26 Apr 2026, 09:40 AM",
      },
    ],
  },
]);

  }, []);
  const filteredMyComplaints = useMemo(() => {
  if (!search) return myComplaints;
  return myComplaints.filter((c) =>
    c.subject.toLowerCase().includes(search.toLowerCase())
  );
}, [search, myComplaints]);
const summary = useMemo(() => {
  return {
    total: logs.length,
    pending: logs.filter((c) => c.status === "Pending").length,
    resolved: logs.filter((c) => c.status === "Resolved").length,
    rejected: logs.filter((c) => c.status === "Rejected").length,
  };
}, [logs]);
const sendReplyMyComplaints = () => {
  if (!reply.trim() || !selected) return;

  setMyComplaints((prev) =>
    prev.map((c) =>
      c.complaintId === selected.complaintId
        ? {
            ...c,
            messages: [
              ...c.messages,
              {
                replyId: genReplyId(),
                by: "You",
                text: reply,
                time: new Date().toLocaleString(),
              },
            ],
          }
        : c
    )
  );

  setReply("");
};
const sendReplyLogs = () => {
  if (!reply.trim() || !selected) return;

  setLogs((prev) =>
    prev.map((c) =>
      c.complaintId === selected.complaintId
        ? {
            ...c,
            messages: [
              ...c.messages,
              {
                replyId: genReplyId(),
                by: "Admin",
                text: reply,
                time: new Date().toLocaleString(),
              },
            ],
          }
        : c
    )
  );

  setReply("");
};
const updateStatus = (status) => {
  if (!selected) return;

  setLogs((prev) =>
    prev.map((c) =>
      c.complaintId === selected.complaintId
        ? { ...c, status }
        : c
    )
  );

  setSelected((p) => ({ ...p, status }));
};


  /* ===================== DERIVED ===================== */
  const filteredStudents = studentsData.filter(
    (s) => s.class === form.class && s.section === form.section
  );

  const selectedStudent = studentsData.find(
    (s) => s.id === form.studentId
  );

  const selectedStaff = staffList.find(
    (s) => s.id === form.staffId
  );

 const togglePanel = (role) => {
  setForm((p) => {
    const panelArr = Array.isArray(p.panel) ? p.panel : [];

    return {
      ...p,
      panel: panelArr.includes(role)
        ? panelArr.filter((r) => r !== role)
        : [...panelArr, role],
    };
  });
};


  /* ===================== SUBMIT ===================== */
  const submitComplaint = () => {
    if (!form.category || !form.type || !form.subject || !form.message) {
      alert("Please fill all required fields");
      return;
    }

    if (!form.complaintAgainst) {
      alert("Select Complaint Against");
      return;
    }

    if (
      form.complaintAgainst === "student" &&
      (!form.class || !form.section || !form.studentId)
    ) {
      alert("Select student details");
      return;
    }

    if (
      form.complaintAgainst === "staff" &&
      (!form.staffId || form.panel.length === 0)
    ) {
      alert("Select staff & concern panel");
      return;
    }

   const sendTo = [];

if (form.complaintAgainst === "student") {
  if (form.notifyParents) sendTo.push("Parent");
  if (form.notifyTeacher) sendTo.push("Class Teacher");
}

const newComplaint = {
  complaintId: genComplaintId(),
  subject: form.subject,
  status: "Pending",
  createdAt: new Date().toLocaleString(),

  complaintAgainst: form.complaintAgainst, // ⭐ IMPORTANT

  sendTo, // ⭐ Parent / Class Teacher

  messages: [
    {
      replyId: genReplyId(),
      by: "You",
      text: form.message,
      time: new Date().toLocaleString(),
    },
  ],

  student: form.complaintAgainst === "student" ? selectedStudent : null,
  staff: form.complaintAgainst === "staff" ? selectedStaff : null,

  panel: form.complaintAgainst === "staff" ? form.panel : [],
};


    setMyComplaints((p) => [newComplaint, ...p]);
    alert("Complaint raised successfully");

    setForm({
      category: "",
      type: "",
      subject: "",
      message: "",
      attachment: null,
      complaintAgainst: "",
      class: "",
      section: "",
      studentId: "",
      notifyParents: true,
      notifyTeacher: false,
      staffId: "",
      panel: [],
    });
  };

  /* ===================== UI ===================== */
  return (
    <div className="p-0 m-0 min-h-screen">
         <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Communication</span>
        <span>&gt;</span>
        <span>Complaints</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Complaints</h2>
        <HelpInfo
          title="Admin Complaints Help"
          description="Raise complaints against students or staff and manage all complaints."
        />
      </div>

      {/* ================= TABS (SAME AS TEACHER) ================= */}
      <div className="flex gap-6 text-sm mb-3 border-b text-gray-600">
        {["raise", "my", "logs"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setActiveTab(t);
              setSelected(null);
              setReply("");
              setSearch("");
            }}
            className={`pb-2 ${
              activeTab === t
                ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                : ""
            }`}
          >
            {t === "raise"
              ? "Raise Complaint"
              : t === "my"
              ? "My Complaints"
              : "Complaint Logs"}
          </button>
        ))}
      </div>

      {/* ================= RAISE COMPLAINT ================= */}
      {activeTab === "raise" && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
           {/* CATEGORY */}
          <div className="mb-5">
            <label className="block  font-semibold text-gray-500 uppercase mb-1">
              Complaint Category *
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value, type: "" })
              }
            >
              <option value="">Select Category</option>
              <option>Academic</option>
              <option>Behaviour & Discipline</option>
              <option>Attendance</option>
              <option>Facility / Infrastructure</option>
              <option>Safety & Security</option>
              <option>Other</option>
            </select>
          </div>

          {/* TYPE */}
          {form.category && (
            <div className="mb-5">
              <label className="block font-semibold text-gray-500 uppercase mb-1">
                Complaint Type *
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2.5 text-sm"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="">Select Type</option>

                {form.category === "Behaviour & Discipline" && (
                  <>
                    <option>Student Misbehaviour</option>
                    <option>Bullying / Harassment</option>
                    <option>Disrespect to Teacher</option>
                    <option>Physical Fight</option>
                  </>
                )}

                {form.category === "Academic" && (
                  <>
                    <option>Poor Performance</option>
                    <option>Homework Not Submitted</option>
                    <option>Cheating</option>
                  </>
                )}

                {form.category === "Attendance" && (
                  <>
                    <option>Late Coming</option>
                    <option>Irregular Attendance</option>
                  </>
                )}

                {form.category === "Other" && <option>Other Issue</option>}

                {form.category === "Facility / Infrastructure" && (
                  <>
                    <option>Classroom Issue</option>
                    <option>Equipment Fault</option>
                  </>
                )}

                {form.category === "Safety & Security" && (
                  <>
                    <option>Safety Concern</option>
                    <option>Security Breach</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* CATEGORY + TYPE (UNCHANGED) */}
          {/* … SAME AS YOUR CODE (kept intentionally) */}

          {/* ================= COMPLAINT AGAINST ================= */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-500 uppercase mb-2">
              Complaint Against *
            </label>

            <div className="flex gap-6 text-sm">
              {["student", "staff"].map((v) => (
                <label key={v} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.complaintAgainst === v}
                    onChange={() =>
                      setForm({
                        ...form,
                        complaintAgainst: v,
                        class: "",
                        section: "",
                        studentId: "",
                        staffId: "",
                        panel: [],
                      })
                    }
                  />
                  {v === "student" ? "Student" : "Staff"}
                </label>
              ))}
            </div>
          </div>

          {/* ================= STUDENT FLOW ================= */}
          {form.complaintAgainst === "student" && (
            <>
             {/* CLASS */}
              <div className="mb-5">
                <label className="block  font-semibold text-gray-500 uppercase mb-1">
                 Student Class *
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2.5 text-sm"
                  value={form.class}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      class: e.target.value,
                      section: "",
                      studentId: "",
                    })
                  }
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* SECTION */}
              {form.class && (
                <div className="mb-5">
                  <label className="block  font-semibold text-gray-500 uppercase mb-1">
Student Section *
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2.5 text-sm"
                    value={form.section}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        section: e.target.value,
                        studentId: "",
                      })
                    }
                  >
                    <option value="">Select Section</option>
                    {sections.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* STUDENT */}
              {form.section && (
                <div className="mb-5">
                  <label className="block  font-semibold text-gray-500 uppercase mb-1">
                    Student Name *
                  </label>
                  <select
                    className="w-full border rounded-lg px-3 py-2.5 text-sm"
                    value={form.studentId}
                    onChange={(e) =>
                      setForm({ ...form, studentId: e.target.value })
                    }
                  >
                    <option value="">Select Student</option>
                    {filteredStudents.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* PARENT DETAILS */}
              {selectedStudent && (
                <div className="mb-6 bg-gray-50 border rounded-lg p-4 text-sm text-gray-700">
                  <p className="font-semibold mb-2 uppercase text-sm text-gray-500">
                    Parent Details (Auto-filled)
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-500">Parent Name:</span>
                      <p className="font-medium">{selectedStudent.parentName}</p>
                    </div>

                    <div>
                      <span className="text-gray-500">Parent ID:</span>
                      <p className="font-medium">{selectedStudent.parentId}</p>
                    </div>

                    <div>
                      <span className="text-gray-500">Student:</span>
                      <p className="font-medium">
                        {selectedStudent.name} (Class {selectedStudent.class} -{" "}
                        {selectedStudent.section})
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">Contact:</span>
                      <p className="font-medium">{selectedStudent.parentPhone}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {/* ================= SEND COMPLAINT TO ================= */}
{selectedStudent && (
  <div className="mb-5">
    
    <p className="font-semibold text-gray-500 uppercase mb-3 ">
      Send Concern To *
    </p>

    <div className="flex gap-8 text-sm">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.notifyParents}
          onChange={() =>
            setForm((p) => ({
              ...p,
              notifyParents: !p.notifyParents,
            }))
          }
        />
        Parent
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.notifyTeacher}
          onChange={() =>
            setForm((p) => ({
              ...p,
              notifyTeacher: !p.notifyTeacher,
            }))
          }
        />
        Class Teacher
      </label>
    </div>

  
  </div>
)}


          {/* ================= STAFF FLOW ================= */}
          {form.complaintAgainst === "staff" && (
            <>
              <div className="mb-5">
                <label className="block font-semibold text-gray-500 uppercase mb-1">
                  Select Staff *
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2.5 text-sm"
                  value={form.staffId}
                  onChange={(e) =>
                    setForm({ ...form, staffId: e.target.value })
                  }
                >
                  <option value="">Select Staff</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              {selectedStaff && (
                <div className="mb-6 bg-gray-50 border rounded-lg p-4">
                  <p className="font-semibold mb-2 uppercase text-gray-500">
                    Panel For Concern *
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {concernPanel.map((p) => (
                      <label key={p} className="flex gap-2">
                        <input
                          type="checkbox"
                          checked={form.panel.includes(p)}
                          onChange={() => togglePanel(p)}
                        />
                        {p}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* SUBJECT + DESCRIPTION + ATTACHMENT (UNCHANGED) */}
           {/* SUBJECT */}
                    <div className="mb-5">
                      <label className="block  font-semibold text-gray-500 uppercase mb-1">
                         Complaint Detail*
                      </label>
                      <input
                        className="w-full border rounded-lg px-3 py-2.5 text-sm"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      />
                    </div>
          
                    {/* DESCRIPTION */}
                    <div className="mb-6">
                      <label className="block  font-semibold text-gray-500 uppercase mb-1">
                        Explain the  Concern in Description *
                      </label>
                      <textarea
                        rows={4}
                        className="w-full border rounded-lg px-3 py-2.5 text-sm"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>
          
                    {/* ATTACHMENT */}
                    <div className="mb-6">
                      <label
                        className="flex items-center gap-2 text-blue-600 cursor-pointer select-none"
                        title={form.attachment ? form.attachment.name : "Attach File"}
                      >
                        <FiPaperclip />
                        {form.attachment ? form.attachment.name : "Attach File"}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            setForm({ ...form, attachment: e.target.files[0] })
                          }
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
              Supported formats: PNG, JPG, JPEG, PDF, Excel (XLS, XLSX)
            </p>
                    </div>

          <div className="text-right">
            <button
              onClick={submitComplaint}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Submit Complaint
            </button>
          </div>
        </div>
      )}

      {/* ================= MY COMPLAINTS + LOGS ================= */}
      {/* 🔒 100% SAME AS TEACHER POV – NO CHANGE */}
        {/* ================= MY COMPLAINTS ================= */}
           {activeTab === "my" && (
  <div className="grid grid-cols-3 gap-3">
    {/* ================= LEFT: COMPLAINT LIST ================= */}
    <div className="bg-white border rounded shadow-sm max-h-[600px] overflow-y-auto">
      <div className="p-3 border-b flex gap-2 items-center">
        <FiSearch />
        <input
          type="search"
          className="w-full outline-none"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredMyComplaints.length === 0 && (
        <p className="text-center p-6 text-gray-400">
          No complaints found.
        </p>
      )}

      {filteredMyComplaints.map((c) => (
        <div
          key={c.complaintId}
          className={`cursor-pointer p-3 border-b last:border-none ${
            selected?.complaintId === c.complaintId
              ? "bg-blue-50 border-blue-400"
              : "hover:bg-gray-50"
          }`}
          onClick={() => {
            setSelected(c);
            setReply("");
          }}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{c.subject}</h3>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full ${
                c.status === "Pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : c.status === "Replied"
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {c.status}
            </span>
          </div>

          {/* Send To */}
          {Array.isArray(c.sendTo) && c.sendTo.length > 0 && (
            <p className="text-gray-600 mt-1">
              To: {c.sendTo.join(", ")}
            </p>
          )}

          {/* Student Complaint */}
          {c.student && (
            <p className="text-gray-600 mt-1">
              Against Student: {c.student.name} (Class {c.student.class}-
              {c.student.section})
            </p>
          )}

          {/* Staff / Teacher Complaint */}
          {c.staff && (
            <p className="text-gray-600 mt-1">
              Against Staff: {c.staff.name}
            </p>
          )}

          {/* Panel Members */}
          {Array.isArray(c.panel) && c.panel.length > 0 && (
            <p className="text-gray-600 mt-1">
              Panel Members: {c.panel.join(", ")}
            </p>
          )}

          <p className="text-gray-500 mt-1">
            Created at: {c.createdAt}
          </p>
        </div>
      ))}
    </div>

    {/* ================= RIGHT: SELECTED COMPLAINT ================= */}
    <div className="col-span-2 bg-white border rounded shadow-sm p-3 max-h-[600px] overflow-y-auto">
      {!selected && (
        <p className="text-center text-gray-400">
          Select a complaint to see details
        </p>
      )}

      {selected && (
        <>
          <h3 className="font-bold text-lg mb-3">
            {selected.subject}
          </h3>

          <p className="text-gray-600 mb-2">
            Status:{" "}
            <span
              className={`font-semibold px-2 py-0.5 rounded-full ${
                selected.status === "Pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : selected.status === "Replied"
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {selected.status}
            </span>
          </p>

          {/* Student */}
          {selected.student && (
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Against Student:</span>{" "}
              {selected.student.name} (Class {selected.student.class}-
              {selected.student.section})
            </p>
          )}

          {/* Staff */}
          {selected.staff && (
            <p className="mb-2 text-gray-700">
              <span className="font-semibold">Against Staff:</span>{" "}
              {selected.staff.name}
            </p>
          )}

          {/* Panel Members */}
          {Array.isArray(selected.panel) &&
            selected.panel.length > 0 && (
              <p className="mb-3 text-gray-700">
                <span className="font-semibold">Panel Members:</span>{" "}
                {selected.panel.join(", ")}
              </p>
            )}

          {/* Messages */}
          <div className="space-y-3 mb-5">
            {Array.isArray(selected?.messages) &&
              selected.messages.map((m) => (
                <div
                  key={m.replyId}
                  className={`p-3 rounded-lg ${
                    m.by === "You"
                      ? "bg-blue-100 text-blue-900 self-end"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p>{m.text}</p>
                  <p className="text-gray-500 mt-1">{m.time}</p>
                  <p className="text-gray-600 font-semibold">
                    {m.by}
                  </p>
                </div>
              ))}
          </div>

          {/* Reply */}
          <textarea
            rows={3}
            className="w-full border rounded-lg px-3 py-2.5 mb-3"
            placeholder="Type your reply here..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />

          <div className="flex gap-3 justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={sendReplyMyComplaints}
            >
              Send Reply
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

      
            {/* ================= COMPLAINT LOGS ================= */}
          {activeTab === "logs" && (
        <div className="space-y-3">
          {/* ================= Complaint Logs Summary (full width box) ================= */}
          <div className="bg-white border rounded-xl shadow-lg p-4">
            <h3 className="font-semibold text-lg text-gray-800">Complaint Logs Summary</h3>
            <p className="text-gray-600 mt-2">
              Total: <span className="font-semibold">{summary.total}</span> | Pending:{" "}
              <span className="font-semibold text-yellow-600">{summary.pending}</span> | Reviewed:{" "}
              <span className="font-semibold text-green-600">{summary.reviewed}</span> | Resolved:{" "}
              <span className="font-semibold text-gray-600">{summary.resolved}</span>
            </p>
          </div>
      
          {/* ================= Logs List + Selected Log Details side by side ================= */}
          <div className="grid grid-cols-3 gap-3">
            {/* Logs List */}
            <div className="bg-white border rounded-xl shadow-md max-h-[600px] overflow-y-auto p-3">
              {logs.length === 0 ? (
                <p className="text-center text-gray-400">No complaint logs found.</p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.complaintId}
                    className={`cursor-pointer p-4 mb-4 rounded-lg border last:mb-0 ${
                      selected?.complaintId === log.complaintId
                        ? "bg-blue-50 border-blue-400"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => {
                      setSelected(log);
                      setReply("");
                    }}
                  >
                    <h4 className="font-semibold text-lg">{log.subject}</h4>
                    <p className=" text-gray-600 mt-1">
                      Raised By: <span className="font-medium">{log.raisedBy}</span> | Status:{" "}
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-semibold ${
                          log.status === "Pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : log.status === "Reviewed"
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </p>
                    {log.student && (
                      <p className="text-xs text-gray-600 mt-1">
                        Student: {log.student.name} (Class {log.student.class}-{log.student.section})
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{log.createdAt}</p>
                  </div>
                ))
              )}
            </div>
      
            {/* Selected Log Details */}
            <div className="col-span-2 bg-white border rounded-xl shadow-md p-3 max-h-[600px] overflow-y-auto flex flex-col">
              {!selected ? (
                <p className="text-center text-gray-400 mt-40">Select a complaint log to see details</p>
              ) : (
                <>
                  <h3 className="font-bold text-2xl mb-3">{selected.subject}</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Status:{" "}
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold ${
                        selected.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : selected.status === "Reviewed"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {selected.status}
                    </span>
                  </p>
      
                  {selected.student && (
                    <p className="text-base mb-5 text-gray-800">
                      Student: <span className="font-medium">{selected.student.name}</span> (Class{" "}
                      {selected.student.class}-{selected.student.section})
                    </p>
                  )}
      
                  <div className="space-y-4 mb-6 flex-grow overflow-y-auto">
                   {Array.isArray(selected?.messages) &&
  selected.messages.map((m) => (
                      <div
                        key={m.replyId}
                        className={`p-4 rounded-lg ${
                          m.by === "You" ? "bg-blue-100 text-blue-900 self-end" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="mb-1">{m.text}</p>
                        <p className="text-xs text-gray-500">{m.time}</p>
                        <p className="text-xs text-gray-600 font-semibold">{m.by}</p>
                      </div>
                    ))}
                  </div>
      
                  <textarea
                    rows={4}
                    className="w-full border rounded-lg px-4 py-3 text-sm mb-4 resize-none"
                    placeholder="Type your reply here..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
      
                  <div className="flex gap-4 justify-between items-center">
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateStatus("Pending")}
                        className="px-4 py-2 text-sm rounded bg-yellow-300 text-yellow-900 hover:bg-yellow-400 transition"
                      >
                        Mark Pending
                      </button>
                      <button
                        onClick={() => updateStatus("Reviewed")}
                        className="px-4 py-2 text-sm rounded bg-green-300 text-green-900 hover:bg-green-400 transition"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() => updateStatus("Resolved")}
                        className="px-4 py-2 text-sm rounded bg-gray-300 text-gray-900 hover:bg-gray-400 transition"
                      >
                        Mark Resolved
                      </button>
                    </div>
      
                    <button
                      onClick={sendReplyLogs}
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Send Reply
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
