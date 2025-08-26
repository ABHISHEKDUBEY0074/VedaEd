import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Dialog } from "@headlessui/react";
export default function Classes() {
  const [activeTab, setActiveTab] = useState("info");

  const [classInfo, setClassInfo] = useState({
    name: "Grade 10",
    section: "A",
    teacher: "Mr. Sharma",
  });

  const [subjects, setSubjects] = useState([
    { id: 1, name: "Math", teacher: "Mr. Verma" },
    { id: 2, name: "Science", teacher: "Ms. Gupta" },
  ]);

  const [teachers, setTeachers] = useState([
    { id: 1, name: "Mr. Verma", subject: "Math" },
    { id: 2, name: "Ms. Gupta", subject: "Science" },
  ]);

  const [students, setStudents] = useState([
    { id: 1, roll: "101", name: "Amit Kumar", contact: "9876543210" },
    { id: 2, roll: "102", name: "Riya Sharma", contact: "9876543211" },
  ]);
  const exportExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename);
  };const [open, setOpen] = useState(false);
  const [editType, setEditType] = useState(""); 
  const [current, setCurrent] = useState(null);

  const openModal = (type, record = null) => {
    setEditType(type);
    setCurrent(record);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setCurrent(null);
    setEditType("");
  };
  const saveChanges = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    if (editType === "class") {
      setClassInfo({
        name: form.get("name"),
        section: form.get("section"),
        teacher: form.get("teacher"),
      });
    }

    if (editType === "subject") {
      if (current) {
        setSubjects(
          subjects.map((s) =>
            s.id === current.id
              ? { ...s, name: form.get("name"), teacher: form.get("teacher") }
              : s
          )
        );
      } else {
        const newSub = {
          id: Date.now(),
          name: form.get("name"),
          teacher: form.get("teacher"),
        };
        setSubjects([...subjects, newSub]);
        setTeachers([...teachers, { id: Date.now(), name: newSub.teacher, subject: newSub.name }]);
      }
    }

    if (editType === "student") {
      if (current) {
        setStudents(
          students.map((s) =>
            s.id === current.id
              ? { ...s, roll: form.get("roll"), name: form.get("name"), contact: form.get("contact") }
              : s
          )
        );
      } else {
        setStudents([
          ...students,
          {
            id: Date.now(),
            roll: form.get("roll"),
            name: form.get("name"),
            contact: form.get("contact"),
          },
        ]);
      }
    }

    closeModal();
  };

  const deleteRecord = (type, id) => {
    if (type === "subject") setSubjects(subjects.filter((s) => s.id !== id));
    if (type === "student") setStudents(students.filter((s) => s.id !== id));
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4"> Classes </h1>
      <div className="flex gap-4 border-b mb-6">
        {["info", "subjects", "teachers", "students"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "info" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Class Info</h2>
          <p><b>Class Name:</b> {classInfo.name}</p>
          <p><b>Section:</b> {classInfo.section}</p>
          <p><b>Class Teacher:</b> {classInfo.teacher}</p>
          <p><b>Total Students:</b> {students.length}</p>

          <div className="mt-4 flex gap-2">
            <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => openModal("class", classInfo)}>Edit</button>
            <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => exportExcel(students, "students.xlsx")}>Export Students</button>
          </div>
        </div>
      )}
      {activeTab === "subjects" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Subjects</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Subject</th>
                <th className="border p-2">Teacher</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id}>
                  <td className="border p-2">{s.name}</td>
                  <td className="border p-2">{s.teacher}</td>
                  <td className="border p-2">
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => openModal("subject", s)}>Edit</button>
                    <button className="ml-2 px-2 py-1 bg-red-500 text-white rounded" onClick={() => deleteRecord("subject", s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex gap-3">
            <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => openModal("subject")}>Add Subject</button>
            <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => exportExcel(subjects, "subjects.xlsx")}>Export Subjects</button>
          </div>
        </div>
      )}
      {activeTab === "teachers" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Teachers</h2>
          <ul className="list-disc pl-6">
            {teachers.map((t) => (
              <li key={t.id}>{t.name} — <i>{t.subject}</i></li>
            ))}
          </ul>
          <button className="mt-3 px-3 py-1 bg-green-500 text-white rounded" onClick={() => exportExcel(teachers, "teachers.xlsx")}>Export Teachers</button>
        </div>
      )}

      {activeTab === "students" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Students</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Roll No</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Contact</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st.id}>
                  <td className="border p-2">{st.roll}</td>
                  <td className="border p-2">{st.name}</td>
                  <td className="border p-2">{st.contact}</td>
                  <td className="border p-2">
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => openModal("student", st)}>Edit</button>
                    <button className="ml-2 px-2 py-1 bg-red-500 text-white rounded" onClick={() => deleteRecord("student", st.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex gap-3">
            <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => openModal("student")}>Add Student</button>
            <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => exportExcel(students, "students.xlsx")}>Export Excel</button>
          </div>
        </div>
      )}
      <Dialog open={open} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-4">
              {current ? "Edit" : "Add"} {editType}
            </Dialog.Title>
            <form onSubmit={saveChanges} className="space-y-3">
              {editType === "class" && (
                <>
                  <input name="name" defaultValue={current?.name} placeholder="Class Name" className="w-full border p-2 rounded" />
                  <input name="section" defaultValue={current?.section} placeholder="Section" className="w-full border p-2 rounded" />
                  <input name="teacher" defaultValue={current?.teacher} placeholder="Class Teacher" className="w-full border p-2 rounded" />
                </>
              )}
              {editType === "subject" && (
                <>
                  <input name="name" defaultValue={current?.name} placeholder="Subject Name" className="w-full border p-2 rounded" />
                  <input name="teacher" defaultValue={current?.teacher} placeholder="Teacher" className="w-full border p-2 rounded" />
                </>
              )}
              {editType === "student" && (
                <>
                  <input name="roll" defaultValue={current?.roll} placeholder="Roll No" className="w-full border p-2 rounded" />
                  <input name="name" defaultValue={current?.name} placeholder="Student Name" className="w-full border p-2 rounded" />
                  <input name="contact" defaultValue={current?.contact} placeholder="Contact" className="w-full border p-2 rounded" />
                </>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
