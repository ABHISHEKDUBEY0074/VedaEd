import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Dialog } from "@headlessui/react";
const uid = (prefix = "") => `${prefix}${Date.now()}${Math.floor(Math.random() * 900) + 100}`;
const normalizeKey = (k = "") => String(k).toLowerCase().replace(/\s+/g, "");
const mapRowTo = (row, type) => {
  const kv = Object.keys(row || {}).reduce((acc, k) => {
    acc[normalizeKey(k)] = row[k];
    return acc;
  }, {});
  if (type === "student") {
    return {
      id: uid("s_"),
      roll: kv.roll || kv.rollno || kv.id || kv["roll no"] || kv["admission"] || "",
      name: kv.name || kv.fullname || kv["full name"] || kv.student || "",
      contact: kv.contact || kv.phone || kv.mobile || kv.phone_no || kv["phone number"] || "",
    };
  }
  if (type === "subject") {
    return {
      id: uid("sub_"),
      name: kv.name || kv.subject || kv["subject name"] || "",
      teacher: kv.teacher || kv.instructor || kv["teacher name"] || "",
    };
  }
  if (type === "teacher") {
    return {
      id: uid("t_"),
      name: kv.name || kv.teacher || kv["teacher name"] || "",
      subject: kv.subject || kv.speciality || kv["subject handled"] || "",
    };
  }
  return { id: uid(), ...row };
};

const exportExcel = (data, filename = "export.xlsx") => {
  const ws = XLSX.utils.json_to_sheet(data || []);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
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
function InfoRow({ label, value }) {
  return (
    <div className="border rounded p-3 bg-white">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-6 text-gray-500">
      <div className="text-4xl mb-2">📭</div>
      <div>{text}</div>
    </div>
  );
}
export default function Classes() {
  const [classes, setClasses] = useState([
    {
      id: uid("c_"),
      name: "Grade 10",
      section: "A",
      teacher: "Mr. Sharma",
      subjects: [
        { id: uid("sub_"), name: "Math", teacher: "Mr. Verma" },
        { id: uid("sub_"), name: "Science", teacher: "Ms. Gupta" },
      ],
      teachers: [
        { id: uid("t_"), name: "Mr. Verma", subject: "Math" },
        { id: uid("t_"), name: "Ms. Gupta", subject: "Science" },
      ],
      students: [
        { id: uid("s_"), roll: "101", name: "Amit Kumar", contact: "9876543210" },
        { id: uid("s_"), roll: "102", name: "Riya Sharma", contact: "9876543211" },
      ],
    },
  ]);

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState("info"); 
  const [open, setOpen] = useState(false);
  const [editType, setEditType] = useState(""); 
  const [current, setCurrent] = useState(null);
  const fileRefs = {
    subjects: useRef(null),
    teachers: useRef(null),
    students: useRef(null),
  };
  const currentClass = useMemo(() => classes.find((c) => c.id === selectedClassId) || null, [classes, selectedClassId]);
  const openModal = (type, record = null) => {
    setEditType(type);
    setCurrent(record);
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setEditType("");
    setCurrent(null);
  };

  const updateClass = (updater) => {
    setClasses((prev) => prev.map((c) => (c.id === selectedClassId ? updater(c) : c)));
  };
  const addClass = (payload) => {
    setClasses((prev) => [...prev, { id: uid("c_"), ...payload, subjects: [], teachers: [], students: [] }]);
    setSelectedClassId((_) => {
      return (classes[classes.length - 1]?.id) || null;
    });
  };
  const saveChanges = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    if (editType === "class") {
      const payload = {
        name: (form.get("name") || "").trim(),
        section: (form.get("section") || "").trim(),
        teacher: (form.get("teacher") || "").trim(),
      };
      if (current && current.id) {
        setClasses((prev) => prev.map((c) => (c.id === current.id ? { ...c, ...payload } : c)));
      } else {
        setClasses((prev) => {
          const newC = { id: uid("c_"), ...payload, subjects: [], teachers: [], students: [] };
          return [...prev, newC];
        });
      }
    }
 if (["subject", "teacher", "student"].includes(editType) && currentClass) {
      updateClass((cls) => {
        const copy = { ...cls };
        if (editType === "subject") {
          const item = { id: current?.id || uid("sub_"), name: (form.get("name") || "").trim(), teacher: (form.get("teacher") || "").trim() };
          if (current && current.id) copy.subjects = copy.subjects.map((s) => (s.id === current.id ? item : s));
          else copy.subjects = [...copy.subjects, item];
        }
        if (editType === "teacher") {
          const item = { id: current?.id || uid("t_"), name: (form.get("name") || "").trim(), subject: (form.get("subject") || "").trim() };
          if (current && current.id) copy.teachers = copy.teachers.map((t) => (t.id === current.id ? item : t));
          else copy.teachers = [...copy.teachers, item];
        }
        if (editType === "student") {
          const item = { id: current?.id || uid("s_"), roll: (form.get("roll") || "").trim(), name: (form.get("name") || "").trim(), contact: (form.get("contact") || "").trim() };
          if (current && current.id) copy.students = copy.students.map((s) => (s.id === current.id ? item : s));
          else copy.students = [...copy.students, item];
        }
        return copy;
      });
    }

    closeModal();
  };
  const deleteRecord = (type, id) => {
    if (!currentClass) return;
    updateClass((cls) => {
      const copy = { ...cls };
      if (type === "subjects") copy.subjects = copy.subjects.filter((s) => s.id !== id);
      if (type === "teachers") copy.teachers = copy.teachers.filter((t) => t.id !== id);
      if (type === "students") copy.students = copy.students.filter((s) => s.id !== id);
      return copy;
    });
  };
  const handleImportFile = async (file, type) => {
    if (!file || !currentClass) return;
    try {
      const json = await readExcelFile(file);
      const mapped = json.map((r) => mapRowTo(r, type.slice(0, -1)));
      updateClass((cls) => {
        const copy = { ...cls };
        const filtered = mapped.filter((m) => Object.values(m).some((v) => String(v).trim() !== ""));
        if (type === "subjects") copy.subjects = [...copy.subjects, ...filtered];
        if (type === "teachers") copy.teachers = [...copy.teachers, ...filtered];
        if (type === "students") copy.students = [...copy.students, ...filtered];
        return copy;
      });
    } catch (err) {
      console.error("Import failed", err);
      alert("Failed to import file. Make sure it's a valid Excel file.");
    }
  };
  const triggerImport = (type) => {
    if (fileRefs[type] && fileRefs[type].current) fileRefs[type].current.click();
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Classes</h1>
              <button
                onClick={() => openModal("class", null)}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700"
              >
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {classes.length === 0 ? (
                <div className="p-4 rounded-lg bg-white shadow text-center text-gray-500">No classes yet. Add one!</div>
              ) : (
                classes.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedClassId(c.id);
                      setActiveTab("info");
                    }}
                    className={`p-4 rounded-xl shadow-sm cursor-pointer transition border ${
                      selectedClassId === c.id ? "border-blue-300 bg-blue-50" : "bg-white hover:scale-[1.01]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.section}</div>
                      </div>
                      <div className="text-right text-xs text-gray-500">{c.students.length} students</div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">Teacher: {c.teacher || "—"}</div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal("class", c);
                        }}
                        className="text-xs px-2 py-1 rounded bg-yellow-400 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setClasses((prev) => prev.filter((cc) => cc.id !== c.id));
                          if (selectedClassId === c.id) setSelectedClassId(null);
                        }}
                        className="text-xs px-2 py-1 rounded bg-red-500 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
        <main className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-2xl shadow p-6 min-h-[60vh]">
            {!currentClass ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <div className="text-6xl mb-4">🧾</div>
                <div className="text-xl font-semibold mb-2">No class selected</div>
                <div className="max-w-md">
                  Select a class from the left or add a new one to get started. The right panel will show class details and tabs.
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-2xl font-bold">{currentClass.name} <span className="text-sm text-gray-500">({currentClass.section})</span></div>
                    <div className="text-sm text-gray-500">Class Teacher: {currentClass.teacher || "—"}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => openModal("class", currentClass)} className="px-3 py-1 rounded bg-yellow-400 text-white">Edit Class</button>
                    
                  </div>
                </div>
                <div className="mb-5">
                  <div className="flex gap-2">
                    {["info", "subjects", "teachers", "students"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-4 py-2 rounded-full text-sm ${activeTab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  {activeTab === "info" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InfoRow label="Class Name" value={currentClass.name} />
                      <InfoRow label="Section" value={currentClass.section} />
                      <InfoRow label="Class Teacher" value={currentClass.teacher || "—"} />
                      <InfoRow label="Total Students" value={String(currentClass.students.length)} />
                      <InfoRow label="Total Subjects" value={String(currentClass.subjects.length)} />
                      <InfoRow label="Total Teachers" value={String(currentClass.teachers.length)} />
                    </div>
                  )}

                  {activeTab === "subjects" && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">Subjects</h3>
                        <div className="flex gap-2 items-center">
                          <button onClick={() => openModal("subject")} className="px-3 py-1 bg-blue-600 text-white rounded">+ Add Subject</button>
                          <button onClick={() => triggerImport("subjects")} className="px-3 py-1 bg-purple-600 text-white rounded">Import</button>
                          <input ref={fileRefs.subjects} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handleImportFile(e.target.files[0], "subjects")} />
                          <button onClick={() => exportExcel(currentClass.subjects, `${currentClass.name}_subjects.xlsx`)} className="px-3 py-1 bg-green-600 text-white rounded">Export</button>
                        </div>
                      </div>

                      {currentClass.subjects.length === 0 ? (
                        <EmptyState text="No subjects added yet. Import or add a subject." />
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full table-auto border">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="p-2 border text-left">Subject</th>
                                <th className="p-2 border text-left">Teacher</th>
                                <th className="p-2 border text-left">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentClass.subjects.map((s) => (
                                <tr key={s.id} className="odd:bg-white even:bg-gray-50">
                                  <td className="p-2 border">{s.name}</td>
                                  <td className="p-2 border">{s.teacher || "—"}</td>
                                  <td className="p-2 border">
                                    <button className="px-2 py-1 bg-yellow-400 text-white rounded mr-2" onClick={() => openModal("subject", s)}>Edit</button>
                                    <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => deleteRecord("subjects", s.id)}>Delete</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "teachers" && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">Teachers</h3>
                        <div className="flex gap-2 items-center">
                          <button onClick={() => openModal("teacher")} className="px-3 py-1 bg-blue-600 text-white rounded">+ Add Teacher</button>
                          <button onClick={() => triggerImport("teachers")} className="px-3 py-1 bg-purple-600 text-white rounded">Import</button>
                          <input ref={fileRefs.teachers} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handleImportFile(e.target.files[0], "teachers")} />
                          <button onClick={() => exportExcel(currentClass.teachers, `${currentClass.name}_teachers.xlsx`)} className="px-3 py-1 bg-green-600 text-white rounded">Export</button>
                        </div>
                      </div>

                      {currentClass.teachers.length === 0 ? (
                        <EmptyState text="No teachers added yet. Import or add teachers." />
                      ) : (
                        <ul className="space-y-2">
                          {currentClass.teachers.map((t) => (
                            <li key={t.id} className="p-3 bg-white rounded shadow-sm flex justify-between items-center">
                              <div>
                                <div className="font-medium">{t.name}</div>
                                <div className="text-sm text-gray-500">{t.subject || "—"}</div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => openModal("teacher", t)} className="px-2 py-1 bg-yellow-400 text-white rounded">Edit</button>
                                <button onClick={() => deleteRecord("teachers", t.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {activeTab === "students" && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">Students</h3>
                        <div className="flex gap-2 items-center">
                          <button onClick={() => openModal("student")} className="px-3 py-1 bg-blue-600 text-white rounded">+ Add Student</button>
                          <button onClick={() => triggerImport("students")} className="px-3 py-1 bg-purple-600 text-white rounded">Import</button>
                          <input ref={fileRefs.students} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handleImportFile(e.target.files[0], "students")} />
                          <button onClick={() => exportExcel(currentClass.students, `${currentClass.name}_students.xlsx`)} className="px-3 py-1 bg-green-600 text-white rounded">Export</button>
                        </div>
                      </div>

                      {currentClass.students.length === 0 ? (
                        <EmptyState text="No students yet. Import or add students." />
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full table-auto border">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="p-2 border text-left">Roll</th>
                                <th className="p-2 border text-left">Name</th>
                                <th className="p-2 border text-left">Contact</th>
                                <th className="p-2 border text-left">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentClass.students.map((s) => (
                                <tr key={s.id} className="odd:bg-white even:bg-gray-50">
                                  <td className="p-2 border">{s.roll}</td>
                                  <td className="p-2 border">{s.name}</td>
                                  <td className="p-2 border">{s.contact}</td>
                                  <td className="p-2 border">
                                    <button className="px-2 py-1 bg-yellow-400 text-white rounded mr-2" onClick={() => openModal("student", s)}>Edit</button>
                                    <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => deleteRecord("students", s.id)}>Delete</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <Dialog open={open} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold mb-3">{current ? "Edit" : "Add"} {editType}</Dialog.Title>

            <form onSubmit={saveChanges} className="space-y-3">
              {editType === "class" && (
                <>
                  <input name="name" defaultValue={current?.name || ""} placeholder="Class name" className="w-full border rounded p-2" required />
                  <input name="section" defaultValue={current?.section || ""} placeholder="Section" className="w-full border rounded p-2" required />
                  <input name="teacher" defaultValue={current?.teacher || ""} placeholder="Class teacher" className="w-full border rounded p-2" />
                </>
              )}

              {editType === "subject" && (
                <>
                  <input name="name" defaultValue={current?.name || ""} placeholder="Subject name" className="w-full border rounded p-2" required />
                  <input name="teacher" defaultValue={current?.teacher || ""} placeholder="Teacher" className="w-full border rounded p-2" />
                </>
              )}

              {editType === "teacher" && (
                <>
                  <input name="name" defaultValue={current?.name || ""} placeholder="Teacher name" className="w-full border rounded p-2" required />
                  <input name="subject" defaultValue={current?.subject || ""} placeholder="Subject (optional)" className="w-full border rounded p-2" />
                </>
              )}

              {editType === "student" && (
                <>
                  <input name="roll" defaultValue={current?.roll || ""} placeholder="Roll no" className="w-full border rounded p-2" />
                  <input name="name" defaultValue={current?.name || ""} placeholder="Student name" className="w-full border rounded p-2" required />
                  <input name="contact" defaultValue={current?.contact || ""} placeholder="Contact" className="w-full border rounded p-2" />
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-3 py-1 rounded bg-gray-200">Cancel</button>
                <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
