import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Dialog } from "@headlessui/react";

const uid = (prefix = "") =>
  `${prefix}${Date.now()}${Math.floor(Math.random() * 900) + 100}`;

const normalizeKey = (k = "") => String(k).toLowerCase().replace(/\s+/g, "");

const mapRowTo = (row = {}, type = "") => {
  const kv = Object.keys(row || {}).reduce((acc, k) => {
    acc[normalizeKey(k)] = row[k];
    return acc;
  }, {});

  if (type === "student") {
    return {
      id: uid("s_"),
      roll: kv.roll || kv.rollno || kv["roll no"] || "",
      name: kv.name || kv.fullname || "",
      contact: kv.contact || kv.phone || "",
      class: kv.class || "",
      section: kv.section || "",
    };
  }

  if (type === "subject") {
    return {
      id: uid("sub_"),
      name: kv.name || kv.subject || "",
      code: kv.code || "",
      teacher: kv.teacher || "",
    };
  }

  if (type === "teacher") {
    return {
      id: uid("t_"),
      name: kv.name || kv.teacher || "",
      email: kv.email || "",
      subject: kv.subject || "",
    };
  }

  return { id: uid(), ...row };
};

const readExcelFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });

const exportToExcel = (data = [], fileName = "export") => {
  const ws = XLSX.utils.json_to_sheet(data || []);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

/* API endpoints */
const API = {
  classes: "http://localhost:5000/api/classes",
  classById: (id) => `http://localhost:5000/api/classes/${id}`,
  subjects: "http://localhost:5000/api/subjects",
  subjectById: (id) => `http://localhost:5000/api/subjects/${id}`,
  teachers: "http://localhost:5000/api/teachers",
  teacherById: (id) => `http://localhost:5000/api/teachers/${id}`,
  students: "http://localhost:5000/api/students",
  studentById: (id) => `http://localhost:5000/api/students/${id}`,
};

export default function Classes() {
  const [activeTab, setActiveTab] = useState("Classes");

  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    className: "",
    section: "",
    homeroomTeacher: "",
    strength: "",
  });
  const [editClassId, setEditClassId] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    teacher: "",
  });
  const [editSubjectId, setEditSubjectId] = useState(null);

  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    subject: "",
  });
  const [editTeacherId, setEditTeacherId] = useState(null);

  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    roll: "",
    class: "",
    section: "",
  });
  const [editStudentId, setEditStudentId] = useState(null);

  const fileRef = useRef(null);
  const [importType, setImportType] = useState(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchTeachers();
    fetchStudents();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(API.classes);
      setClasses(res.data.classes || res.data || []);
    } catch {}
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(API.subjects);
      setSubjects(res.data.subjects || res.data || []);
    } catch {}
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(API.teachers);
      setTeachers(res.data.teachers || res.data || []);
    } catch {}
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API.students);
      setStudents(res.data.students || res.data || []);
    } catch {}
  };

  const addOrUpdateClass = async () => {
    if (!newClass.className) return alert("Class Name required");
    if (editClassId) {
      await axios.put(API.classById(editClassId), newClass);
    } else {
      await axios.post(API.classes, newClass);
    }
    fetchClasses();
    setNewClass({ className: "", section: "", homeroomTeacher: "", strength: "" });
    setEditClassId(null);
  };
  const removeClass = async (id) => {
    await axios.delete(API.classById(id));
    fetchClasses();
  };

  const addOrUpdateSubject = async () => {
    if (!newSubject.name) return alert("Subject Name required");
    if (editSubjectId) {
      await axios.put(API.subjectById(editSubjectId), newSubject);
    } else {
      await axios.post(API.subjects, newSubject);
    }
    fetchSubjects();
    setNewSubject({ name: "", code: "", teacher: "" });
    setEditSubjectId(null);
  };
  const removeSubject = async (id) => {
    await axios.delete(API.subjectById(id));
    fetchSubjects();
  };

  const addOrUpdateTeacher = async () => {
    if (!newTeacher.name) return alert("Teacher Name required");
    if (editTeacherId) {
      await axios.put(API.teacherById(editTeacherId), newTeacher);
    } else {
      await axios.post(API.teachers, newTeacher);
    }
    fetchTeachers();
    setNewTeacher({ name: "", email: "", subject: "" });
    setEditTeacherId(null);
  };
  const removeTeacher = async (id) => {
    await axios.delete(API.teacherById(id));
    fetchTeachers();
  };

  const addOrUpdateStudent = async () => {
    if (!newStudent.name) return alert("Student Name required");
    if (editStudentId) {
      await axios.put(API.studentById(editStudentId), newStudent);
    } else {
      await axios.post(API.students, newStudent);
    }
    fetchStudents();
    setNewStudent({ name: "", roll: "", class: "", section: "" });
    setEditStudentId(null);
  };
  const removeStudent = async (id) => {
    await axios.delete(API.studentById(id));
    fetchStudents();
  };

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !importType) return;
    const json = await readExcelFile(file);
    if (importType === "classes") setClasses([...classes, ...json.map((r) => mapRowTo(r))]);
    if (importType === "subjects") setSubjects([...subjects, ...json.map((r) => mapRowTo(r, "subject"))]);
    if (importType === "teachers") setTeachers([...teachers, ...json.map((r) => mapRowTo(r, "teacher"))]);
    if (importType === "students") setStudents([...students, ...json.map((r) => mapRowTo(r, "student"))]);
    setImportType(null);
  };
  const triggerImport = (type) => {
    setImportType(type);
    fileRef.current.click();
  };

  const renderTable = (data, cols, onEdit, onDelete) => (
    <div className="mt-4 overflow-x-auto rounded-lg shadow border">
      <table className="w-full text-sm text-left">
        <thead className="bg-blue-100">
          <tr>
            {cols.map((c) => (
              <th key={c} className="p-3 font-semibold text-gray-700">{c}</th>
            ))}
            <th className="p-3 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="even:bg-gray-50 hover:bg-gray-100">
              {cols.map((c) => (
                <td key={c} className="p-3 border-t">{row[c]}</td>
              ))}
              <td className="p-3 border-t space-x-2">
                <button className="px-3 py-1 text-sm rounded bg-yellow-400 hover:bg-yellow-500" onClick={() => onEdit(row)}>Edit</button>
                <button className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600" onClick={() => onDelete(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderForm = (fields, values, setValues, onSave, isEdit) => (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {fields.map((f) => (
          <input
            key={f.name}
            placeholder={f.label}
            value={values[f.name]}
            onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow" onClick={onSave}>
        {isEdit ? "Update" : "Add"}
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-light blue-700">Classes </h1>

      <div className="flex space-x-2 mb-6">
        {["Classes", "Subjects", "Teachers", "Students"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-medium transition ${
              activeTab === tab ? "bg-blue-600 text-white shadow" : "bg-white text-gray-700 border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Classes" && (
        <>
          {renderForm(
            [
              { name: "ClassName", label: "Class Name" },
              { name: "Section", label: "Section" },
              { name: "HomeroomTeacher", label: "Homeroom Teacher" },
              { name: "Strength", label: "Strength" },
            ],
            newClass,
            setNewClass,
            addOrUpdateClass,
            editClassId
          )}
          {renderTable(classes, ["ClassName", "Section", "HomeroomTeacher", "Strength"], (row) => { setEditClassId(row.id); setNewClass(row); }, removeClass)}
          <div className="mt-4 space-x-2">
            <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg" onClick={() => triggerImport("classes")}>
              Import Excel
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg" onClick={() => exportToExcel(classes, "Classes")}>
              Export Excel
            </button>
          </div>
        </>
      )}

      {activeTab === "Subjects" && (
        <>
          {renderForm(
            [
              { name: "Name", label: "Subject Name" },
              { name: "Code", label: "Code" },
              { name: "Teacher", label: "Teacher" },
            ],
            newSubject,
            setNewSubject,
            addOrUpdateSubject,
            editSubjectId
          )}
          {renderTable(subjects, ["Name", "Code", "Teacher"], (row) => { setEditSubjectId(row.id); setNewSubject(row); }, removeSubject)}
          <div className="mt-4 space-x-2">
            <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg" onClick={() => triggerImport("subjects")}>
              Import Excel
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg" onClick={() => exportToExcel(subjects, "Subjects")}>
              Export Excel
            </button>
          </div>
        </>
      )}

      {activeTab === "Teachers" && (
        <>
          {renderForm(
            [
              { name: "Name", label: "Name" },
              { name: "Email", label: "Email" },
              { name: "Subject", label: "Subject" },
            ],
            newTeacher,
            setNewTeacher,
            addOrUpdateTeacher,
            editTeacherId
          )}
          {renderTable(teachers, ["Name", "Email", "Subject"], (row) => { setEditTeacherId(row.id); setNewTeacher(row); }, removeTeacher)}
          <div className="mt-4 space-x-2">
            <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg" onClick={() => triggerImport("teachers")}>
              Import Excel
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg" onClick={() => exportToExcel(teachers, "Teachers")}>
              Export Excel
            </button>
          </div>
        </>
      )}

      {activeTab === "Students" && (
        <>
          {renderForm(
            [
              { name: "Name", label: "Name" },
              { name: "Roll", label: "Roll No" },
              { name: "Class", label: "Class" },
              { name: "Section", label: "Section" },
            ],
            newStudent,
            setNewStudent,
            addOrUpdateStudent,
            editStudentId
          )}
          {renderTable(students, ["Name", "Roll", "Class", "Section"], (row) => { setEditStudentId(row.id); setNewStudent(row); }, removeStudent)}
          <div className="mt-4 space-x-2">
            <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg" onClick={() => triggerImport("students")}>
              Import Excel
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg" onClick={() => exportToExcel(students, "Students")}>
              Export Excel
            </button>
          </div>
        </>
      )}

      <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onFileChange} />

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold mb-3">Modal</Dialog.Title>
            <div className="mb-4">
              This modal is available if you want to use it for extra details. Close to continue.
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-200"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
