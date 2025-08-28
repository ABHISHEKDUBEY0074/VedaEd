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
    ClassName: "",
    Section: "",
   Teacher: "",
    Strength: "",
  });
  const [editClassId, setEditClassId] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    Name: "",
    Code: "",
    Teacher: "",
  });
  const [editSubjectId, setEditSubjectId] = useState(null);

  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    Name: "",
    Email: "",
    Subject: "",
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
    setNewClass({ ClassName: "", Section: "", Teacher: "", Strength: "" });
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
    setNewStudent({ Name: "", Roll: "", Class: "", Section: "" });
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
    <table className="w-full border mt-4">
      <thead className="bg-gray-200">
        <tr>
          {cols.map((c) => (
            <th key={c} className="p-2 border">{c}</th>
          ))}
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-b">
            {cols.map((c) => (
              <td key={c} className="p-2 border">{row[c]}</td>
            ))}
            <td className="p-2 border space-x-2">
              <button className="px-2 py-1 bg-yellow-400" onClick={() => onEdit(row)}>Edit</button>
              <button className="px-2 py-1 bg-red-500 text-white" onClick={() => onDelete(row.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Classes Module</h1>
      <div className="flex space-x-2 mb-6">
        {["Classes", "Subjects", "Teachers", "Students"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Classes" && (
        <div>
          <h2 className="text-xl mb-2">Add Class</h2>
          <input
            placeholder="Class Name"
            value={newClass.className}
            onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            placeholder="Section"
            value={newClass.section}
            onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            placeholder="Homeroom Teacher"
            value={newClass.homeroomTeacher}
            onChange={(e) => setNewClass({ ...newClass, homeroomTeacher: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            placeholder="Strength"
            value={newClass.strength}
            onChange={(e) => setNewClass({ ...newClass, strength: e.target.value })}
            className="border p-2 mr-2"
          />
          <button className="bg-green-500 text-white px-4 py-2" onClick={addOrUpdateClass}>
            {editClassId ? "Update" : "Add"}
          </button>
          {renderTable(classes, ["className", "section", "homeroomTeacher", "strength"], (row) => {
            setEditClassId(row.id);
            setNewClass(row);
          }, removeClass)}
          <div className="mt-4 space-x-2">
            <button className="bg-gray-300 px-3 py-1" onClick={() => triggerImport("classes")}>Import Excel</button>
            <button className="bg-gray-300 px-3 py-1" onClick={() => exportToExcel(classes, "Classes")}>Export Excel</button>
          </div>
        </div>
      )}

      {activeTab === "Subjects" && (
        <div>
          <h2 className="text-xl mb-2">Add Subject</h2>
          <input placeholder="Name" value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} className="border p-2 mr-2" />
          <input placeholder="Code" value={newSubject.code} onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })} className="border p-2 mr-2" />
          <input placeholder="Teacher" value={newSubject.teacher} onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })} className="border p-2 mr-2" />
          <button className="bg-green-500 text-white px-4 py-2" onClick={addOrUpdateSubject}>
            {editSubjectId ? "Update" : "Add"}
          </button>
          {renderTable(subjects, ["name", "code", "teacher"], (row) => { setEditSubjectId(row.id); setNewSubject(row); }, removeSubject)}
          <div className="mt-4 space-x-2">
            <button className="bg-gray-300 px-3 py-1" onClick={() => triggerImport("subjects")}>Import Excel</button>
            <button className="bg-gray-300 px-3 py-1" onClick={() => exportToExcel(subjects, "Subjects")}>Export Excel</button>
          </div>
        </div>
      )}

      {activeTab === "Teachers" && (
        <div>
          <h2 className="text-xl mb-2">Add Teacher</h2>
          <input placeholder="Name" value={newTeacher.name} onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })} className="border p-2 mr-2" />
          <input placeholder="Email" value={newTeacher.email} onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })} className="border p-2 mr-2" />
          <input placeholder="Subject" value={newTeacher.subject} onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })} className="border p-2 mr-2" />
          <button className="bg-green-500 text-white px-4 py-2" onClick={addOrUpdateTeacher}>
            {editTeacherId ? "Update" : "Add"}
          </button>
          {renderTable(teachers, ["name", "email", "subject"], (row) => { setEditTeacherId(row.id); setNewTeacher(row); }, removeTeacher)}
          <div className="mt-4 space-x-2">
            <button className="bg-gray-300 px-3 py-1" onClick={() => triggerImport("teachers")}>Import Excel</button>
            <button className="bg-gray-300 px-3 py-1" onClick={() => exportToExcel(teachers, "Teachers")}>Export Excel</button>
          </div>
        </div>
      )}

      {activeTab === "Students" && (
        <div>
          <h2 className="text-xl mb-2">Add Student</h2>
          <input placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="border p-2 mr-2" />
          <input placeholder="Roll No" value={newStudent.roll} onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })} className="border p-2 mr-2" />
          <input placeholder="Class" value={newStudent.class} onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })} className="border p-2 mr-2" />
          <input placeholder="Section" value={newStudent.section} onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })} className="border p-2 mr-2" />
          <button className="bg-green-500 text-white px-4 py-2" onClick={addOrUpdateStudent}>
            {editStudentId ? "Update" : "Add"}
          </button>
          {renderTable(students, ["name", "roll", "class", "section"], (row) => { setEditStudentId(row.id); setNewStudent(row); }, removeStudent)}
          <div className="mt-4 space-x-2">
            <button className="bg-gray-300 px-3 py-1" onClick={() => triggerImport("students")}>Import Excel</button>
            <button className="bg-gray-300 px-3 py-1" onClick={() => exportToExcel(students, "Students")}>Export Excel</button>
          </div>
        </div>
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
