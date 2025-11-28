import React, { useState } from "react";
import {
  FiHeart,
  FiUser,
  FiEdit,
  FiClipboard,
  FiAlertCircle,
  FiActivity,
  FiShield,
  FiDownload,
} from "react-icons/fi";
import HelpInfo from "../components/HelpInfo";
import jsPDF from "jspdf";

const HELP_TEXT = `
Page Description:
Teacher can view, track & update health details of students of her class.

Sections Included:
• Student Health Summary
• Search Student
• Class Health Master Table
• Health Flags (Allergy, Chronic Illness, Medication)
• Vaccination Record
• Health History
• Edit Health Information
• Doctor Health Camp Report (Structured + PDF Export)
`;

const initialStudents = [
  {
    id: 1,
    name: "Rohan Sharma",
    roll: 12,
    blood: "A+",
    height: 142,
    weight: 37,
    allergies: "Peanuts",
    chronic: "Asthma",
    medication: "Inhaler",
    vaccination: "Hep-B Pending",
    notes: "Carry inhaler in sports period",
    campReport: { bp: "", hb: "", eye: "", dental: "", notes: "" },
    history: [
      { date: "2025-01-10", issue: "Asthma Attack", action: "Inhaler Given" },
      { date: "2024-12-02", issue: "High Fever", action: "Sent Home" },
    ],
  },
  {
    id: 2,
    name: "Sanya Kapoor",
    roll: 5,
    blood: "B+",
    height: 138,
    weight: 34,
    allergies: "None",
    chronic: "None",
    medication: "None",
    vaccination: "Up to Date",
    notes: "N/A",
    campReport: { bp: "", hb: "", eye: "", dental: "", notes: "" },
    history: [{ date: "2025-02-05", issue: "Headache", action: "Rest Provided" }],
  },
  {
    id: 3,
    name: "Arjun Verma",
    roll: 9,
    blood: "O+",
    height: 145,
    weight: 41,
    allergies: "Dust",
    chronic: "None",
    medication: "None",
    vaccination: "Up to Date",
    notes: "Mild dust allergy reported",
    campReport: { bp: "", hb: "", eye: "", dental: "", notes: "" },
    history: [],
  },
];

export default function StudentHealth() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCamp, setOpenCamp] = useState(false);
  const [showHistoryId, setShowHistoryId] = useState(null); // ← new state

  const [editForm, setEditForm] = useState({
    blood: "",
    height: 0,
    weight: 0,
    allergies: "",
    chronic: "",
    medication: "",
    vaccination: "",
    notes: "",
  });

  const [campForm, setCampForm] = useState({
    bp: "",
    hb: "",
    eye: "",
    dental: "",
    notes: "",
  });

  /* ------------ EDIT FUNCTIONS ------------ */
  const handleEdit = (stu) => {
    setSelectedStudent(stu);
    setEditForm({
      blood: stu.blood,
      height: stu.height,
      weight: stu.weight,
      allergies: stu.allergies,
      chronic: stu.chronic,
      medication: stu.medication,
      vaccination: stu.vaccination,
      notes: stu.notes,
    });
    setOpenEdit(true);
  };

  const updateField = (key, val) => {
    setEditForm({ ...editForm, [key]: val });
  };

  const saveChanges = () => {
    const updated = students.map((s) =>
      s.id === selectedStudent.id ? { ...s, ...editForm } : s
    );
    setStudents(updated);
    setOpenEdit(false);
  };

  /* ------------ CAMP FUNCTIONS ------------ */
  const handleCamp = (stu) => {
    setSelectedStudent(stu);
    setCampForm({ ...stu.campReport });
    setOpenCamp(true);
  };

  const updateCampField = (key, val) => {
    setCampForm({ ...campForm, [key]: val });
  };

  const saveCamp = () => {
    const updated = students.map((s) =>
      s.id === selectedStudent.id ? { ...s, campReport: campForm } : s
    );
    setStudents(updated);
    setOpenCamp(false);
  };

  const exportCampPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Doctor Health Camp Report - ${selectedStudent.name}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`BP: ${campForm.bp}`, 14, 40);
    doc.text(`HB: ${campForm.hb}`, 14, 50);
    doc.text(`Eye Test: ${campForm.eye}`, 14, 60);
    doc.text(`Dental: ${campForm.dental}`, 14, 70);
    doc.text(`Notes: ${campForm.notes}`, 14, 80);
    doc.save(`${selectedStudent.name}_HealthCampReport.pdf`);
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const calcBMI = (h, w) => {
    if (!h || !w) return "";
    const meters = h / 100;
    return (w / (meters * meters)).toFixed(1);
  };

  const summaryData = [
    { label: "Total Students", value: students.length, bg: "bg-blue-50", icon: <FiUser className="text-blue-600" /> },
    { label: "Allergies Reported", value: students.filter((s) => s.allergies !== "None").length, bg: "bg-red-50", icon: <FiAlertCircle className="text-red-600" /> },
    { label: "Chronic Conditions", value: students.filter((s) => s.chronic !== "None").length, bg: "bg-orange-50", icon: <FiActivity className="text-orange-600" /> },
    { label: "Pending Vaccinations", value: students.filter((s) => s.vaccination.includes("Pending")).length, bg: "bg-yellow-50", icon: <FiShield className="text-yellow-600" /> },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <p className="text-gray-500 text-sm mb-2">Student Health &gt;</p>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Student Health</h2>
        <HelpInfo text={HELP_TEXT} />
      </div>

      <div className="bg-gray-200 p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {summaryData.map((item, i) => (
              <div key={i} className={`p-6 rounded-xl border ${item.bg} flex items-center gap-4`}>
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <p className="text-gray-700 text-sm">{item.label}</p>
                  <p className="text-xl font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border rounded-xl p-6">
          <input
            className="border p-3 rounded w-full"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Class Health Records</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-2">Student</th>
                <th className="p-2">Blood</th>
                <th className="p-2">Height</th>
                <th className="p-2">Weight</th>
                <th className="p-2">BMI</th>
                <th className="p-2">Allergies</th>
                <th className="p-2">Chronic</th>
                <th className="p-2">Medication</th>
                <th className="p-2">Vaccination</th>
                <th className="p-2">Notes</th>
                <th className="p-2">Actions</th>
                <th className="p-2">Doctor Camp</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stu) => (
                <React.Fragment key={stu.id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">{stu.name}</td>
                    <td className="p-3">{stu.blood}</td>
                    <td className="p-3">{stu.height} cm</td>
                    <td className="p-3">{stu.weight} kg</td>
                    <td className="p-3">{calcBMI(stu.height, stu.weight)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${stu.allergies !== "None" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{stu.allergies}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${stu.chronic !== "None" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>{stu.chronic}</span>
                    </td>
                    <td className="p-3">{stu.medication}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${stu.vaccination.includes("Pending") ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{stu.vaccination}</span>
                    </td>
                    <td className="p-3">{stu.notes}</td>
                    <td className="p-3 flex flex-col gap-2">
                      <button onClick={() => handleEdit(stu)} className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white text-xs"><FiEdit /> Edit</button>
                      <button
                        onClick={() =>
                          setShowHistoryId(showHistoryId === stu.id ? null : stu.id)
                        }
                        className="flex items-center gap-1 px-3 py-1 rounded bg-gray-700 text-white text-xs"
                      >
                        <FiClipboard /> History
                      </button>
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleCamp(stu)} className="px-3 py-1 bg-purple-600 text-white rounded text-xs">Add / Edit</button>
                    </td>
                  </tr>

                  {/* History Row */}
                  {showHistoryId === stu.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={12} className="p-4">
                        <h4 className="font-semibold mb-2">Health History</h4>
                        {stu.history.length === 0 ? (
                          <p>No history available.</p>
                        ) : (
                          <ul className="list-disc pl-5 space-y-1">
                            {stu.history.map((h, i) => (
                              <li key={i}>
                                <span className="font-semibold">{h.date}:</span> {h.issue} — {h.action}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {openEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><FiEdit /> Update Health — {selectedStudent.name}</h3>
              <div className="grid grid-cols-2 gap-5">
                <input className="border p-3 rounded" value={editForm.blood} onChange={(e)=>updateField("blood", e.target.value)} placeholder="Blood Group"/>
                <input className="border p-3 rounded" value={editForm.height} onChange={(e)=>updateField("height", e.target.value)} placeholder="Height (cm)" type="number"/>
                <input className="border p-3 rounded" value={editForm.weight} onChange={(e)=>updateField("weight", e.target.value)} placeholder="Weight (kg)" type="number"/>
                <input className="border p-3 rounded" value={editForm.allergies} onChange={(e)=>updateField("allergies", e.target.value)} placeholder="Allergies"/>
                <input className="border p-3 rounded" value={editForm.chronic} onChange={(e)=>updateField("chronic", e.target.value)} placeholder="Chronic Issue"/>
                <input className="border p-3 rounded" value={editForm.medication} onChange={(e)=>updateField("medication", e.target.value)} placeholder="Medication"/>
                <input className="border p-3 rounded" value={editForm.vaccination} onChange={(e)=>updateField("vaccination", e.target.value)} placeholder="Vaccination"/>
              </div>
              <textarea className="border p-3 rounded w-full" rows="3" value={editForm.notes} onChange={(e)=>updateField("notes", e.target.value)} placeholder="Medical Notes"></textarea>
              <div className="flex justify-end gap-3">
                <button onClick={()=>setOpenEdit(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                <button onClick={saveChanges} className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Camp Modal */}
        {openCamp && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
            <div className="bg-white w-full max-w-xl rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold">Doctor Health Camp Report — {selectedStudent.name}</h3>
              <div className="grid grid-cols-2 gap-5">
                <input className="border p-3 rounded" placeholder="BP" value={campForm.bp} onChange={(e)=>updateCampField("bp", e.target.value)} />
                <input className="border p-3 rounded" placeholder="HeartBeat" value={campForm.hb} onChange={(e)=>updateCampField("hb", e.target.value)} />
                <input className="border p-3 rounded" placeholder="Eye Test" value={campForm.eye} onChange={(e)=>updateCampField("eye", e.target.value)} />
                <input className="border p-3 rounded" placeholder="Dental" value={campForm.dental} onChange={(e)=>updateCampField("dental", e.target.value)} />
              </div>
              <textarea className="border p-3 rounded w-full" rows="4" placeholder="Other Notes" value={campForm.notes} onChange={(e)=>updateCampField("notes", e.target.value)} />
              <div className="flex justify-end gap-3">
                <button onClick={()=>setOpenCamp(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                <button onClick={saveCamp} className="px-4 py-2 bg-purple-600 text-white rounded">Save</button>
                <button onClick={exportCampPDF} className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-1"><FiDownload/> Export PDF</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
