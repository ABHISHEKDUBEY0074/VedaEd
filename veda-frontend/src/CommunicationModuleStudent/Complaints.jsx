import React, { useEffect, useState, useMemo } from "react";
import HelpInfo from "../components/HelpInfo";
import { FiSearch, FiPaperclip } from "react-icons/fi";

export default function Complaints() {
  const [activeTab, setActiveTab] = useState("raise");

  /* ---------- Raise Form ---------- */
  const [form, setForm] = useState({
    subject: "",
    category: "",
    sendTo: "",
    teacherId: "",
    message: "",
    attachment: null,
  });

  /* ---------- Complaints ---------- */
  const [complaints, setComplaints] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [reply, setReply] = useState("");
  const [search, setSearch] = useState("");

  const teachers = [
    { id: "t1", name: "Mr. Sharma (Maths)" },
    { id: "t2", name: "Ms. Neha (Science)" },
    { id: "t3", name: "Class Teacher" },
  ];

  useEffect(() => {
    setComplaints([
      {
        id: 1,
        subject: "Late Bus Issue",
        sendTo: "Teacher",
        receiver: "Mr. Sharma",
        status: "Replied",
        createdAt: "25 Apr 2024, 10:15 AM",
        messages: [
          {
            by: "You",
            text: "The school bus is consistently late by 20–30 minutes.",
            time: "25 Apr 2024, 10:15 AM",
          },
          {
            by: "Mr. Sharma",
            text: "We will address this with the transport department.",
            time: "25 Apr 2024, 11:30 AM",
          },
        ],
      },
      {
        id: 2,
        subject: "Fee Issue",
        sendTo: "Principal",
        receiver: "Principal",
        status: "Pending",
        createdAt: "24 Apr 2024, 09:20 AM",
        messages: [
          {
            by: "You",
            text: "My fee receipt is not updated.",
            time: "24 Apr 2024, 09:20 AM",
          },
        ],
      },
    ]);

    /* ---------- LOGS (Teacher / Admin -> Student) ---------- */
    setLogs([
      {
        complaintId: "CMP-9001",
        subject: "Irregular Attendance",
        raisedBy: "Teacher",
        status: "Pending",
        createdAt: "26 Apr 2024, 09:40 AM",
        messages: [
          {
            by: "Teacher",
            text: "Student has been absent frequently without notice.",
            time: "26 Apr 2024, 09:40 AM",
          },
        ],
      },
      {
        complaintId: "CMP-9002",
        subject: "Misbehaviour in Class",
        raisedBy: "Admin",
        status: "Reviewed",
        createdAt: "27 Apr 2024, 11:15 AM",
        messages: [
          {
            by: "Admin",
            text: "Misbehaviour reported during assembly.",
            time: "27 Apr 2024, 11:15 AM",
          },
        ],
      },
    ]);
  }, []);

  const filteredComplaints = useMemo(
    () =>
      complaints.filter((c) =>
        c.subject.toLowerCase().includes(search.toLowerCase())
      ),
    [search, complaints]
  );

  const handleSubmit = () => {
    if (!form.subject || !form.sendTo || !form.message) {
      alert("Please fill all required fields");
      return;
    }
    alert("Complaint submitted");
    setForm({
      subject: "",
      category: "",
      sendTo: "",
      teacherId: "",
      message: "",
      attachment: null,
    });
  };

  const handleReply = () => {
    if (!reply.trim() || !selectedComplaint) return;

    const updater = activeTab === "logs" ? setLogs : setComplaints;

    updater((prev) =>
      prev.map((c) =>
        (c.id || c.complaintId) ===
        (selectedComplaint.id || selectedComplaint.complaintId)
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
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
          title="Complaints Help"
          description="Raise complaints, track replies, and view complaints raised against you."
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
        {["raise", "my", "logs"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setActiveTab(t);
              setSelectedComplaint(null);
              setReply("");
            }}
            className={`pb-2 ${
              activeTab === t
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "hover:text-gray-700"
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

      {activeTab === "raise" && (
  <div className="bg-white p-4 rounded-lg border shadow-sm">

    {/* Category + Complaint To */}
    <div className="grid grid-cols-2 gap-4 mb-3">
      <div>
        <label className="font-medium text-gray-600 mb-1 block">
          Concern Related to
        </label>
        <select
          className="w-full border px-4 py-2 rounded"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="">Select concern options </option>
          <option>Academic</option>
          <option>Facility</option>
          <option>Behaviour</option>
        </select>
      </div>

      <div>
        <label className="font-medium text-gray-600 mb-1 block">
          Concern To *
        </label>
        <select
          className="w-full border px-4 py-2 rounded"
          value={form.sendTo}
          onChange={(e) =>
            setForm({ ...form, sendTo: e.target.value })
          }
        >
          <option value="">Select recipient</option>
          <option value="Teacher">Teacher</option>
          <option value="Principal">Principal</option>
          <option value="Admin">Admin</option>
          <option value="Librarian">Librarian</option>
        </select>
      </div>
    </div>

    {/* Select Teacher (Complaint To ke neeche) */}
    {form.sendTo === "Teacher" && (
      <div className="mb-3">
        <label className="font-medium text-gray-600 mb-1 block">
          Select Staff
        </label>
        <select
          className="w-full border px-4 py-2 rounded"
          value={form.teacherId}
          onChange={(e) =>
            setForm({ ...form, teacherId: e.target.value })
          }
        >
          <option value="">Choose Staff</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
    )}

    {/* Subject (Complaint Description ke upar, full row) */}
    <div className="mb-3">
      <label className="font-medium text-gray-600 mb-1 block">
        Complaint Detail*
      </label>
      <input
        className="w-full border px-4 py-2 rounded"
        placeholder="Enter Complain Detail "
        value={form.subject}
        onChange={(e) =>
          setForm({ ...form, subject: e.target.value })
        }
      />
    </div>

    {/* Complaint Description */}
    <div className="mb-4">
      <label className="font-medium text-gray-600 mb-1 block">
       Explain the  Concern in Description *
      </label>
      <textarea
        rows={5}
        className="w-full border px-4 py-2 rounded"
        placeholder="Write complaint in detail"
        value={form.message}
        onChange={(e) =>
          setForm({ ...form, message: e.target.value })
        }
      />
    </div>

         <div className="mb-6">
  <label className="flex items-center gap-2 text-blue-600 cursor-pointer">
    <FiPaperclip />
    Attach File
    <input type="file" className="hidden" />
  </label>

  <p className="text-xs text-gray-500 mt-1">
    Supported formats: PNG, JPG, JPEG, PDF, Excel (XLS, XLSX)
  </p>
</div>

          <div className="text-right">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit Complaint
            </button>
          </div>
        </div>
      )}

      {/* ================= MY COMPLAINTS ================= */}
      {activeTab === "my" && (
        <div className="grid grid-cols-3 gap-3">
          {/* Left List */}
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-3 border-b flex items-center gap-2">
              <FiSearch className="text-gray-400" />
              <input
                className="w-full text-sm outline-none"
                placeholder="Search complaint..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filteredComplaints.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedComplaint(c)}
                className={`p-3 border-b cursor-pointer ${
                  selectedComplaint?.id === c.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <p className="font-medium text-sm">{c.subject}</p>
                <p className="text-xs text-gray-500">
                  {c.sendTo} • {c.status}
                </p>
                <p className="text-xs text-gray-400">{c.createdAt}</p>
              </div>
            ))}
          </div>

          {/* Right Detail */}
          <div className="col-span-2 bg-white border rounded-lg shadow-sm p-4">
            {!selectedComplaint ? (
              <p className="text-gray-500 text-sm">
                Select a complaint to view details
              </p>
            ) : (
              <>
                <h3 className="font-semibold text-lg mb-1">
                  {selectedComplaint.subject}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Sent to {selectedComplaint.receiver} •{" "}
                  {selectedComplaint.status}
                </p>

                <div className="space-y-3 mb-4">
                  {selectedComplaint.messages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded text-sm ${
                        m.by === "You"
                          ? "bg-blue-50"
                          : "bg-gray-100"
                      }`}
                    >
                      <p className="font-medium">{m.by}</p>
                      <p>{m.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {m.time}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <textarea
                    rows={3}
                    className="w-full border px-3 py-2 rounded text-sm mb-2"
                    placeholder="Write your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleReply}
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= LOGS TAB ================= */}
      {activeTab === "logs" && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border rounded-lg shadow-sm">
            {logs.map((log) => (
              <div
                key={log.complaintId}
                onClick={() => setSelectedComplaint(log)}
                className={`p-3 border-b cursor-pointer ${
                  selectedComplaint?.complaintId === log.complaintId
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <p className="font-medium text-sm">{log.subject}</p>
                <p className="text-xs text-gray-500">
                  Raised By: {log.raisedBy} • {log.status}
                </p>
                <p className="text-xs text-gray-400">{log.createdAt}</p>
              </div>
            ))}
          </div>

          <div className="col-span-2 bg-white border rounded-lg shadow-sm p-4">
            {!selectedComplaint ? (
              <p className="text-gray-500 text-sm">
                Select a complaint to view details
              </p>
            ) : (
              <>
                <h3 className="font-semibold text-lg mb-2">
                  {selectedComplaint.subject}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Raised By {selectedComplaint.raisedBy} •{" "}
                  {selectedComplaint.status}
                </p>

                <div className="space-y-3 mb-4">
                  {selectedComplaint.messages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded text-sm ${
                        m.by === "You" ? "bg-blue-50" : "bg-gray-100"
                      }`}
                    >
                      <p className="font-medium">{m.by}</p>
                      <p>{m.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{m.time}</p>
                    </div>
                  ))}
                </div>

                <textarea
                  rows={3}
                  className="w-full border px-3 py-2 rounded text-sm mb-2"
                  placeholder="Write your reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleReply}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
                  >
                    Send Reply
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
