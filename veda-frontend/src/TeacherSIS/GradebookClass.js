// src/TeacherSIS/GradebookClass.js
import React, { useState, useMemo } from "react";
import { FiUpload, FiEdit, FiTrash2, FiDownload, FiFileText, FiArrowLeft } from "react-icons/fi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0"];

// Component receives classObj and onBack from Gradebook.js
export default function GradebookClass({ classObj, onBack }) {
  // classObj: { id, className, section, subjects: [...] }
  const defaultTotal = 100;

  // records for this class — seeded with dummy values for demonstration
  const [records, setRecords] = useState([
    {
      id: 1,
      student: "Aarav Sharma",
      roll: "101",
      classId: classObj.className,
      section: classObj.section,
      subject: classObj.subjects[0] || "Mathematics",
      examType: "Mid Term",
      marks: 88,
      total: defaultTotal,
      notes: "Good",
    },
    {
      id: 2,
      student: "Riya Verma",
      roll: "102",
      classId: classObj.className,
      section: classObj.section,
      subject: classObj.subjects[0] || "Mathematics",
      examType: "Mid Term",
      marks: 74,
      total: defaultTotal,
      notes: "",
    },
  ]);

  // UI filters inside class
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("");
  const [search, setSearch] = useState("");

  // form for add/edit
  const [form, setForm] = useState({ student: "", roll: "", marks: "", total: String(defaultTotal), notes: "" });
  const [editingId, setEditingId] = useState(null);

  // profile modal
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileStudent, setProfileStudent] = useState(null);

  const examOptions = ["Unit Test", "Mid Term", "Final Exam"];

  // helpers
  const pct = (marks, total) => {
    const m = Number(marks) || 0;
    const t = Number(total) || 1;
    const p = Math.round((m * 10000) / t) / 100;
    return p.toFixed(2);
  };
  const calcGrade = (p) => {
    const n = Number(p);
    if (n >= 90) return "A+";
    if (n >= 80) return "A";
    if (n >= 70) return "B";
    if (n >= 60) return "C";
    if (n >= 50) return "D";
    return "F";
  };

  // add/update record
  const handleSave = () => {
    if (!form.student || !form.roll || form.marks === "") {
      alert("Please enter student name, roll and marks.");
      return;
    }
    if (!subject) {
      alert("Select subject for this entry.");
      return;
    }
    if (!examType) {
      alert("Select exam type for this entry.");
      return;
    }

    const rec = {
      id: editingId || Date.now(),
      student: form.student,
      roll: form.roll,
      classId: classObj.className,
      section: classObj.section,
      subject,
      examType,
      marks: Number(form.marks),
      total: Number(form.total) || defaultTotal,
      notes: form.notes || "",
    };

    if (editingId) {
      setRecords((r) => r.map((x) => (x.id === editingId ? rec : x)));
      setEditingId(null);
    } else {
      setRecords((r) => [rec, ...r]);
    }
    setForm({ student: "", roll: "", marks: "", total: String(defaultTotal), notes: "" });
  };

  const handleEdit = (r) => {
    setEditingId(r.id);
    setForm({ student: r.student, roll: r.roll, marks: String(r.marks), total: String(r.total), notes: r.notes || "" });
    setSubject(r.subject);
    setExamType(r.examType);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this record?")) return;
    setRecords((r) => r.filter((x) => x.id !== id));
  };

  // filtered records for table/chart
  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (subject && r.subject !== subject) return false;
      if (examType && r.examType !== examType) return false;
      if (search && !r.student.toLowerCase().includes(search.toLowerCase()) && !String(r.roll).includes(search)) return false;
      return true;
    });
  }, [records, subject, examType, search]);

  // import excel for this class (columns should be: Student,Roll,Subject,Exam,Marks,Total,Notes)
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
      const imported = rows.map((row) => ({
        id: Date.now() + Math.random(),
        student: row.Student || row.student || "",
        roll: row.Roll || row.roll || "",
        classId: classObj.className,
        section: classObj.section,
        subject: row.Subject || row.subject || subject || (classObj.subjects[0] || ""),
        examType: row.Exam || row.exam || examType || examOptions[0],
        marks: Number(row.Marks || row.marks || 0),
        total: Number(row.Total || row.total || defaultTotal),
        notes: row.Notes || row.notes || "",
      }));
      setRecords((r) => [...imported, ...r]);
    };
    reader.readAsBinaryString(file);
    e.target.value = null;
  };

  // export CSV (filtered)
  const exportCSV = () => {
    if (!filtered.length) return alert("No records to export.");
    const header = "Student,Roll,Class,Section,Subject,Exam,Marks,Total,Percentage,Grade,Notes\n";
    const rows = filtered.map((r) => {
      const p = pct(r.marks, r.total);
      return `${escapeCsv(r.student)},${escapeCsv(r.roll)},${escapeCsv(r.classId)},${escapeCsv(r.section)},${escapeCsv(r.subject)},${escapeCsv(r.examType)},${r.marks},${r.total},${p},${calcGrade(p)},${escapeCsv(r.notes)}`;
    }).join("\n");
    downloadBlob(header + rows, "gradebook_class_export.csv", "text/csv");
  };

  // export PDF all filtered
  const exportPDF = () => {
    if (!filtered.length) return alert("No records to export.");
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text(`${classObj.className} - Section ${classObj.section} — Gradebook`, 14, 16);
    const body = filtered.map((r) => {
      const p = pct(r.marks, r.total);
      return [r.student, r.roll, r.subject, r.examType, String(r.marks), String(r.total), `${p}%`, calcGrade(p), r.notes || ""];
    });
    doc .autoTable({
      head: [["Student","Roll","Subject","Exam","Marks","Total","%","Grade","Notes"]],
      body,
      startY: 22,
      styles: { fontSize: 9 },
    });
    doc.save(`gradebook_${classObj.className.replace(/\s+/g,"")}_${classObj.section}.pdf`);
  };

  // analytics for charts (based on filtered list)
  const analytics = useMemo(() => {
    const bySubject = {};
    const byExam = {};
    filtered.forEach((r) => {
      // subject
      if (!bySubject[r.subject]) bySubject[r.subject] = { marks: 0, total: 0, count: 0 };
      bySubject[r.subject].marks += Number(r.marks || 0);
      bySubject[r.subject].total += Number(r.total || defaultTotal);
      bySubject[r.subject].count += 1;
      // exam
      if (!byExam[r.examType]) byExam[r.examType] = { marks: 0, total: 0, count: 0 };
      byExam[r.examType].marks += Number(r.marks || 0);
      byExam[r.examType].total += Number(r.total || defaultTotal);
      byExam[r.examType].count += 1;
    });
    const subjectData = Object.keys(bySubject).map(k => ({ subject: k, avg: bySubject[k].total ? Math.round((bySubject[k].marks * 10000) / bySubject[k].total) / 100 : 0 }));
    const examData = Object.keys(byExam).map(k => ({ exam: k, avg: byExam[k].total ? Math.round((byExam[k].marks * 10000) / byExam[k].total) / 100 : 0 }));
    return { subjectData, examData };
  }, [filtered]);

  // helpers: download blob / escape CSV
  function downloadBlob(content, filename, type="text/plain") {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  function escapeCsv(s) {
    if (s === null || s === undefined) return "";
    const str = String(s);
    return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str.replace(/"/g,'""')}"` : str;
  }

  // student profile modal open
  const openProfile = (student) => {
    setProfileStudent(student);
    setProfileOpen(true);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center gap-4 mb-3">
        <button onClick={onBack} className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded">
          <FiArrowLeft /> Back
        </button>
        <p className="text-gray-500 text-sm">Teacher Gradebook &gt;</p>
      </div>

      <h2 className="text-2xl font-bold mb-6">{classObj.className} — Section {classObj.section} Gradebook</h2>

      <div className="bg-gray-200 p-6 rounded-lg shadow-sm border border-gray-300">
        <div className="bg-white p-4 rounded-lg shadow-sm">

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select className="border p-2 rounded" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Filter Subject</option>
              {classObj.subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select className="border p-2 rounded" value={examType} onChange={(e) => setExamType(e.target.value)}>
              <option value="">Filter Exam</option>
              {examOptions.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>

            <input className="border p-2 rounded" placeholder="Search student or roll" value={search} onChange={(e) => setSearch(e.target.value)} />

            <div className="flex gap-2">
              
              <button onClick={exportPDF} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded shadow">
                <FiFileText /> Export PDF
              </button>
              <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow cursor-pointer">
                <FiUpload /> Import Excel
                <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
              </label>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
            <h3 className="font-semibold text-lg mb-3">{editingId ? "Edit Marks" : "Add Marks"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input placeholder="Student name" className="border p-2 rounded col-span-2" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} />
              <input placeholder="Roll no." className="border p-2 rounded" value={form.roll} onChange={(e) => setForm({ ...form, roll: e.target.value })} />
              <input placeholder="Marks" type="number" className="border p-2 rounded" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} />
              <input placeholder="Total" type="number" className="border p-2 rounded" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded shadow">{editingId ? "Update" : "Add Record"}</button>
              <button onClick={() => { setForm({ student: "", roll: "", marks: "", total: String(defaultTotal), notes: "" }); setEditingId(null); }} className="bg-gray-200 px-4 py-2 rounded">Clear</button>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded border shadow-sm">
              <h4 className="font-semibold mb-2">Subject-wise Avg (%)</h4>
              {analytics.subjectData.length ? (
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer>
                    <BarChart data={analytics.subjectData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avg" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : <p className="text-gray-500">No data</p>}
            </div>

            <div className="bg-white p-4 rounded border shadow-sm">
              <h4 className="font-semibold mb-2">Exam-wise Avg (%)</h4>
              {analytics.examData.length ? (
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={analytics.examData} dataKey="avg" nameKey="exam" cx="50%" cy="50%" outerRadius={60} label>
                        {analytics.examData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : <p className="text-gray-500">No data</p>}
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-auto bg-white p-3 rounded border shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Student</th>
                  <th className="p-2 border">Roll</th>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border">Exam</th>
                  <th className="p-2 border">Marks</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">%</th>
                  <th className="p-2 border">Grade</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td className="p-3 text-center text-gray-500" colSpan={9}>No records found.</td></tr>
                ) : filtered.map((r) => {
                  const p = pct(r.marks, r.total);
                  return (
                    <tr key={r.id}>
                      <td className="p-2 border"><button className="text-blue-600 underline" onClick={() => openProfile(r.student)}>{r.student}</button></td>
                      <td className="p-2 border">{r.roll}</td>
                      <td className="p-2 border">{r.subject}</td>
                      <td className="p-2 border">{r.examType}</td>
                      <td className="p-2 border">{r.marks}</td>
                      <td className="p-2 border">{r.total}</td>
                      <td className="p-2 border">{p}%</td>
                      <td className="p-2 border font-semibold">{calcGrade(p)}</td>
                      <td className="p-2 border flex gap-2">
                        <FiEdit className="cursor-pointer text-blue-600" onClick={() => handleEdit(r)} />
                        <FiTrash2 className="cursor-pointer text-red-600" onClick={() => handleDelete(r.id)} />
                        <button className="bg-gray-100 px-2 rounded text-sm" onClick={() => { exportSingleStudentPDF(r.student); }}>Report</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* student profile modal */}
      {profileOpen && profileStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-4 rounded shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Profile — {profileStudent}</h3>
              <button className="text-gray-600" onClick={() => setProfileOpen(false)}>Close</button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">All records for this student in this class:</p>
            </div>

            <div className="overflow-auto max-h-64">
              <table className="w-full border-collapse">
                <thead><tr className="bg-gray-100"><th className="p-2 border">Subject</th><th className="p-2 border">Exam</th><th className="p-2 border">Marks</th><th className="p-2 border">Total</th><th className="p-2 border">%</th><th className="p-2 border">Grade</th></tr></thead>
                <tbody>
                  {records.filter(r => r.student === profileStudent).map(r => {
                    const p = pct(r.marks, r.total);
                    return <tr key={r.id}><td className="p-2 border">{r.subject}</td><td className="p-2 border">{r.examType}</td><td className="p-2 border">{r.marks}</td><td className="p-2 border">{r.total}</td><td className="p-2 border">{p}%</td><td className="p-2 border">{calcGrade(p)}</td></tr>;
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { exportSingleStudentPDF(profileStudent); }}>
                <FiFileText /> Download PDF
              </button>
              <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setProfileOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // helper to export single student PDF (inside component to capture records)
  function exportSingleStudentPDF(studentName) {
    const studentRecords = records.filter(r => r.student === studentName);
    if (!studentRecords.length) return alert("No records for this student.");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Report Card — ${studentName}`, 14, 18);
    const body = studentRecords.map(r => {
      const p = pct(r.marks, r.total);
      return [r.subject, r.examType, String(r.marks), String(r.total), `${p}%`, calcGrade(p), r.notes || ""];
    });
    doc .autoTable({
      head: [["Subject","Exam","Marks","Total","%","Grade","Notes"]],
      body,
      startY: 26,
      styles: { fontSize: 11 },
    });
    doc.save(`${studentName.replace(/\s+/g,"_").toLowerCase()}_report_card.pdf`);
  }
}
