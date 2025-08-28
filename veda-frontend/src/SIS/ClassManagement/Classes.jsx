import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { FiEdit2, FiTrash2, FiUpload, FiDownload, FiInfo, FiBook, FiUsers, FiUser } from "react-icons/fi";
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
      name: kv.name || kv.fullname || "",
      roll: kv.roll || kv.rollno || kv["rollno"] || kv["roll no"] || "",
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

  if (type === "class") {
    return {
      id: uid("c_"),
      className: kv.classname || kv.class || "",
      section: kv.section || "",
      homeroomTeacher: kv.homeroomteacher || kv.teacher || "",
      strength: kv.strength || "",
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
const Card = ({ title, icon, action, children }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-indigo-600">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  </div>
);

const TabButton = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

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

    if (importType === "classes") setClasses((prev) => [...prev, ...json.map((r) => mapRowTo(r, "class"))]);
    if (importType === "subjects") setSubjects((prev) => [...prev, ...json.map((r) => mapRowTo(r, "subject"))]);
    if (importType === "teachers") setTeachers((prev) => [...prev, ...json.map((r) => mapRowTo(r, "teacher"))]);
    if (importType === "students") setStudents((prev) => [...prev, ...json.map((r) => mapRowTo(r, "student"))]);

    setImportType(null);
    if (fileRef.current) fileRef.current.value = "";
  };
  const triggerImport = (type) => {
    setImportType(type);
    fileRef.current?.click();
  };
  const ActionsCell = ({ onEdit, onDelete }) => (
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 rounded-lg"
      >
        <FiEdit2 /> Edit
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg"
      >
        <FiTrash2 /> Delete
      </button>
    </div>
  );
  const ClassesTab = () => (
    <div className="space-y-6">
      <Card
        title={editClassId ? "Edit Class" : "Add Class"}
        icon={<FiInfo />}
        action={
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
              onClick={() => triggerImport("classes")}
            >
              <FiUpload /> Import
            </button>
            <button
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
              onClick={() => exportToExcel(classes, "Classes")}
            >
              <FiDownload /> Export
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <input
            placeholder="Class Name"
            value={newClass.className}
            onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Section"
            value={newClass.section}
            onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Homeroom Teacher"
            value={newClass.homeroomTeacher}
            onChange={(e) => setNewClass({ ...newClass, homeroomTeacher: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Strength"
            value={newClass.strength}
            onChange={(e) => setNewClass({ ...newClass, strength: e.target.value })}
            className="border p-2 rounded-lg"
          />
        </div>
        <button
          onClick={addOrUpdateClass}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          {editClassId ? "Update" : "Add"}
        </button>
      </Card>

      <Card title="All Classes" icon={<FiUsers />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border">Class</th>
                <th className="px-4 py-2 border">Section</th>
                <th className="px-4 py-2 border">Homeroom Teacher</th>
                <th className="px-4 py-2 border">Strength</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{row.className}</td>
                  <td className="px-4 py-2">{row.section}</td>
                  <td className="px-4 py-2">{row.homeroomTeacher}</td>
                  <td className="px-4 py-2">{row.strength}</td>
                  <td className="px-4 py-2">
                    <ActionsCell
                      onEdit={() => {
                        setEditClassId(row.id);
                        setNewClass(row);
                      }}
                      onDelete={() => removeClass(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const SubjectsTab = () => (
    <div className="space-y-6">
      <Card
        title={editSubjectId ? "Edit Subject" : "Add Subject"}
        icon={<FiBook />}
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => triggerImport("subjects")}>
              <FiUpload /> Import
            </button>
            <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => exportToExcel(subjects, "Subjects")}>
              <FiDownload /> Export
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input
            placeholder="Name"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            className="border p-2 rounded-lg"
          />
        <input
            placeholder="Code"
            value={newSubject.code}
            onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Teacher"
            value={newSubject.teacher}
            onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
            className="border p-2 rounded-lg"
          />
        </div>
        <button onClick={addOrUpdateSubject} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
          {editSubjectId ? "Update" : "Add"}
        </button>
      </Card>

      <Card title="All Subjects" icon={<FiBook />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Code</th>
                <th className="px-4 py-2 border">Teacher</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{row.name}</td>
                  <td className="px-4 py-2">{row.code}</td>
                  <td className="px-4 py-2">{row.teacher}</td>
                  <td className="px-4 py-2">
                    <ActionsCell
                      onEdit={() => {
                        setEditSubjectId(row.id);
                        setNewSubject(row);
                      }}
                      onDelete={() => removeSubject(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const TeachersTab = () => (
    <div className="space-y-6">
      <Card
        title={editTeacherId ? "Edit Teacher" : "Add Teacher"}
        icon={<FiUser />}
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => triggerImport("teachers")}>
              <FiUpload /> Import
            </button>
            <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => exportToExcel(teachers, "Teachers")}>
              <FiDownload /> Export
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <input
            placeholder="Name"
            value={newTeacher.name}
            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Email"
            value={newTeacher.email}
            onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Subject"
            value={newTeacher.subject}
            onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
            className="border p-2 rounded-lg"
          />
        </div>
        <button onClick={addOrUpdateTeacher} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
          {editTeacherId ? "Update" : "Add"}
        </button>
      </Card>

      <Card title="All Teachers" icon={<FiUsers />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{row.name}</td>
                  <td className="px-4 py-2">{row.email}</td>
                  <td className="px-4 py-2">{row.subject}</td>
                  <td className="px-4 py-2">
                    <ActionsCell
                      onEdit={() => {
                        setEditTeacherId(row.id);
                        setNewTeacher(row);
                      }}
                      onDelete={() => removeTeacher(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const StudentsTab = () => (
    <div className="space-y-6">
      <Card
        title={editStudentId ? "Edit Student" : "Add Student"}
        icon={<FiUser />}
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => triggerImport("students")}>
              <FiUpload /> Import
            </button>
            <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => exportToExcel(students, "Students")}>
              <FiDownload /> Export
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <input
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Roll No"
            value={newStudent.roll}
            onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Class"
            value={newStudent.class}
            onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
            className="border p-2 rounded-lg"
          />
          <input
            placeholder="Section"
            value={newStudent.section}
            onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
            className="border p-2 rounded-lg"
          />
        </div>
        <button onClick={addOrUpdateStudent} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
          {editStudentId ? "Update" : "Add"}
        </button>
      </Card>

      <Card title="All Students" icon={<FiUsers />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Roll</th>
                <th className="px-4 py-2 border">Class</th>
                <th className="px-4 py-2 border">Section</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{row.name}</td>
                  <td className="px-4 py-2">{row.roll}</td>
                  <td className="px-4 py-2">{row.class}</td>
                  <td className="px-4 py-2">{row.section}</td>
                  <td className="px-4 py-2">
                    <ActionsCell
                      onEdit={() => {
                        setEditStudentId(row.id);
                        setNewStudent(row);
                      }}
                      onDelete={() => removeStudent(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Classes Module</h1>
          <p className="text-gray-600 mt-1">Manage classes, subjects, teachers, and students.</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex flex-wrap gap-2">
            <TabButton
              label="Classes"
              isActive={activeTab === "Classes"}
              onClick={() => setActiveTab("Classes")}
              icon={<FiInfo />}
            />
            <TabButton
              label="Subjects"
              isActive={activeTab === "Subjects"}
              onClick={() => setActiveTab("Subjects")}
              icon={<FiBook />}
            />
            <TabButton
              label="Teachers"
              isActive={activeTab === "Teachers"}
              onClick={() => setActiveTab("Teachers")}
              icon={<FiUser />}
            />
            <TabButton
              label="Students"
              isActive={activeTab === "Students"}
              onClick={() => setActiveTab("Students")}
              icon={<FiUsers />}
            />
          </div>
        </div>
        {activeTab === "Classes" && <ClassesTab />}
        {activeTab === "Subjects" && <SubjectsTab />}
        {activeTab === "Teachers" && <TeachersTab />}
        {activeTab === "Students" && <StudentsTab />}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={onFileChange}
      />
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
