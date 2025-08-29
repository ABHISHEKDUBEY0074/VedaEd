import React, { useState } from "react";
import { utils, writeFile } from "xlsx";
const dummyStaff = [
  { id: "T1", name: "Mr. Sharma" },
  { id: "T2", name: "Mrs. Gupta" },
  { id: "T3", name: "Mr. Khan" },
];

const dummyStudents = [
  { id: "S1", name: "Amit" },
  { id: "S2", name: "Priya" },
  { id: "S3", name: "Ravi" },
  { id: "S4", name: "Neha" },
  { id: "S5", name: "Vikas" },
];
const uid = (prefix = "") =>
  `${prefix}${Date.now()}${Math.floor(Math.random() * 900) + 100}`;

export default function Classes() {
  const [activeTab, setActiveTab] = useState("classes");
  const [classRows, setClassRows] = useState([]);
  const [subjectRows, setSubjectRows] = useState([]);

  const [klass, setKlass] = useState({
    id: "",
    className: "",
    section: "",
    teacherId: "",
    studentIds: [],
  });

  const [subject, setSubject] = useState({
    id: "",
    subjectName: "",
    classId: "",
    section: "",
    teacherId: "",
  });

  const [editingClassId, setEditingClassId] = useState(null);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const saveClass = () => {
    if (!klass.className) return alert("Class Name required");
    if (!klass.section) return alert("Section required");

    if (editingClassId) {
      setClassRows((prev) =>
        prev.map((c) => (c.id === editingClassId ? klass : c))
      );
    } else {
      setClassRows((prev) => [...prev, { ...klass, id: uid("c_") }]);
    }
    resetClassForm();
  };

  const editClass = (row) => {
    setKlass(row);
    setEditingClassId(row.id);
  };

  const deleteClass = (id) => {
    if (!window.confirm("Delete this class?")) return;
    setClassRows((prev) => prev.filter((c) => c.id !== id));
  };

  const resetClassForm = () => {
    setKlass({ id: "", className: "", section: "", teacherId: "", studentIds: [] });
    setEditingClassId(null);
  };
  const saveSubject = () => {
    if (!subject.subjectName) return alert("Subject Name required");

    if (editingSubjectId) {
      setSubjectRows((prev) =>
        prev.map((s) => (s.id === editingSubjectId ? subject : s))
      );
    } else {
      setSubjectRows((prev) => [...prev, { ...subject, id: uid("s_") }]);
    }
    resetSubjectForm();
  };

  const editSubject = (row) => {
    setSubject(row);
    setEditingSubjectId(row.id);
  };

  const deleteSubject = (id) => {
    if (!window.confirm("Delete this subject?")) return;
    setSubjectRows((prev) => prev.filter((s) => s.id !== id));
  };

  const resetSubjectForm = () => {
    setSubject({ id: "", subjectName: "", classId: "", section: "", teacherId: "" });
    setEditingSubjectId(null);
  };
  const exportClasses = () => {
    const ws = utils.json_to_sheet(classRows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Classes");
    writeFile(wb, "classes.xlsx");
  };

  const exportSubjects = () => {
    const ws = utils.json_to_sheet(subjectRows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Subjects");
    writeFile(wb, "subjects.xlsx");
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === "classes" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("classes")}
        >
          Classes
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "subjects" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("subjects")}
        >
          Subjects
        </button>
      </div>
      {activeTab === "classes" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Classes</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <input
              className="border p-2 rounded"
              placeholder="Class Name"
              value={klass.className}
              onChange={(e) => setKlass({ ...klass, className: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Section"
              value={klass.section}
              onChange={(e) => setKlass({ ...klass, section: e.target.value })}
            />
            <select
              className="border p-2 rounded"
              value={klass.teacherId}
              onChange={(e) => setKlass({ ...klass, teacherId: e.target.value })}
            >
              <option value="">Select Teacher</option>
              {dummyStaff.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              multiple
              className="border p-2 rounded"
              value={klass.studentIds}
              onChange={(e) =>
                setKlass({
                  ...klass,
                  studentIds: Array.from(e.target.selectedOptions, (o) => o.value),
                })
              }
            >
              {dummyStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mb-6">
            <button onClick={saveClass} className="bg-green-500 text-white px-4 py-2 rounded">
              {editingClassId ? "Update Class" : "Add Class"}
            </button>
            <button onClick={resetClassForm} className="bg-gray-400 text-white px-4 py-2 rounded">
              Reset
            </button>
            <button onClick={exportClasses} className="bg-indigo-500 text-white px-4 py-2 rounded">
              Export XLSX
            </button>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Class</th>
                <th className="border px-2 py-1">Section</th>
                <th className="border px-2 py-1">Teacher</th>
                <th className="border px-2 py-1">Students</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classRows.map((row) => (
                <tr key={row.id}>
                  <td className="border px-2 py-1">{row.className}</td>
                  <td className="border px-2 py-1">{row.section}</td>
                  <td className="border px-2 py-1">
                    {dummyStaff.find((t) => t.id === row.teacherId)?.name || "-"}
                  </td>
                  <td className="border px-2 py-1">
                    {row.studentIds.map((sid) => (
                      <span key={sid} className="inline-block bg-gray-200 rounded px-2 m-1">
                        {dummyStudents.find((s) => s.id === sid)?.name || sid}
                      </span>
                    ))}
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => editClass(row)}
                      className="bg-yellow-500 text-white px-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteClass(row.id)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!classRows.length && (
                <tr>
                  <td colSpan="5" className="text-center py-2">
                    No Classes Added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "subjects" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Subjects</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <input
              className="border p-2 rounded"
              placeholder="Subject Name"
              value={subject.subjectName}
              onChange={(e) => setSubject({ ...subject, subjectName: e.target.value })}
            />
            <select
              className="border p-2 rounded"
              value={subject.classId}
              onChange={(e) => setSubject({ ...subject, classId: e.target.value })}
            >
              <option value="">Select Class</option>
              {classRows.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.className} - {c.section}
                </option>
              ))}
            </select>
            <input
              className="border p-2 rounded"
              placeholder="Section"
              value={subject.section}
              onChange={(e) => setSubject({ ...subject, section: e.target.value })}
            />
            <select
              className="border p-2 rounded"
              value={subject.teacherId}
              onChange={(e) => setSubject({ ...subject, teacherId: e.target.value })}
            >
              <option value="">Assign Teacher</option>
              {dummyStaff.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mb-6">
            <button onClick={saveSubject} className="bg-green-500 text-white px-4 py-2 rounded">
              {editingSubjectId ? "Update Subject" : "Add Subject"}
            </button>
            <button onClick={resetSubjectForm} className="bg-gray-400 text-white px-4 py-2 rounded">
              Reset
            </button>
            <button onClick={exportSubjects} className="bg-indigo-500 text-white px-4 py-2 rounded">
              Export XLSX
            </button>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Subject</th>
                <th className="border px-2 py-1">Class</th>
                <th className="border px-2 py-1">Section</th>
                <th className="border px-2 py-1">Teacher</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjectRows.map((row) => (
                <tr key={row.id}>
                  <td className="border px-2 py-1">{row.subjectName}</td>
                  <td className="border px-2 py-1">
                    {classRows.find((c) => c.id === row.classId)?.className || "-"}
                  </td>
                  <td className="border px-2 py-1">{row.section}</td>
                  <td className="border px-2 py-1">
                    {dummyStaff.find((t) => t.id === row.teacherId)?.name || "-"}
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => editSubject(row)}
                      className="bg-yellow-500 text-white px-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSubject(row.id)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!subjectRows.length && (
                <tr>
                  <td colSpan="5" className="text-center py-2">
                    No Subjects Added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
