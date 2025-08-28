import React, { useMemo, useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Dialog } from "@headlessui/react";
import axios from "axios";

const API = "http://localhost:5000/api"; //  backend base URL for shivam 

const uid = (prefix = "") => `${prefix}${Date.now()}${Math.floor(Math.random() * 900) + 100}`;
const normalizeKey = (k = "") => String(k).toLowerCase().replace(/\s+/g, "");

const mapRowTo = (row, type) => {
  const kv = Object.keys(row || {}).reduce((acc, k) => {
    acc[normalizeKey(k)] = row[k];
    return acc;
  }, {});
  if (type === "student") {
    return {
      roll: kv.roll || kv.rollno || kv.id || kv["roll no"] || "",
      name: kv.name || kv.fullname || kv["full name"] || kv.student || "",
      contact: kv.contact || kv.phone || kv.mobile || kv["phone number"] || "",
    };
  }
  if (type === "subject") {
    return { name: kv.name || kv.subject || "", teacher: kv.teacher || kv.instructor || "" };
  }
  if (type === "teacher") {
    return { name: kv.name || kv.teacher || "", subject: kv.subject || kv.speciality || "" };
  }
  return row;
};

const readExcelFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        resolve(XLSX.utils.sheet_to_json(ws, { defval: "" }));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

const InfoRow = ({ label, value }) => (
  <div className="border rounded p-3 bg-white shadow-sm">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="font-medium">{value}</div>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="text-center py-6 text-gray-500">
    <div className="text-4xl mb-2">📭</div>
    <div>{text}</div>
  </div>
);

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [open, setOpen] = useState(false);
  const [editType, setEditType] = useState("");
  const [current, setCurrent] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = 5;

  const fileRefs = { subjects: useRef(), teachers: useRef(), students: useRef() };

  // Fetch classes from backend
  useEffect(() => {
    axios.get(`${API}/classes`)
      .then(res => {
        setClasses(res.data || []);
        if (res.data.length > 0) setSelectedClassId(res.data[0].id);
      })
      .catch(err => console.error("Error fetching:", err));
  }, []);

  const currentClass = useMemo(() => classes.find(c => c.id === selectedClassId) || null, [classes, selectedClassId]);

  const openModal = (type, record = null) => { setEditType(type); setCurrent(record); setOpen(true); };
  const closeModal = () => { setOpen(false); setEditType(""); setCurrent(null); };

  // Save
  const saveChanges = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    try {
      if (editType === "class") {
        const payload = { name: form.get("name"), section: form.get("section"), teacher: form.get("teacher") };
        if (current?.id) {
          const res = await axios.put(`${API}/classes/${current.id}`, payload);
          setClasses(prev => prev.map(c => c.id === current.id ? res.data : c));
        } else {
          const res = await axios.post(`${API}/classes`, payload);
          setClasses(prev => [...prev, res.data]);
          setSelectedClassId(res.data.id);
        }
      }

      if (["subject", "teacher", "student"].includes(editType) && currentClass) {
        let payload = {};
        let url = `${API}/classes/${currentClass.id}/${editType}s`;

        if (editType === "subject") payload = { name: form.get("name"), teacher: form.get("teacher") };
        if (editType === "teacher") payload = { name: form.get("name"), subject: form.get("subject") };
        if (editType === "student") payload = { roll: form.get("roll"), name: form.get("name"), contact: form.get("contact") };

        if (current?.id) {
          const res = await axios.put(`${url}/${current.id}`, payload);
          setClasses(prev =>
            prev.map(c =>
              c.id === currentClass.id
                ? { ...c, [`${editType}s`]: c[`${editType}s`].map(x => x.id === current.id ? res.data : x) }
                : c
            )
          );
        } else {
          const res = await axios.post(url, payload);
          setClasses(prev =>
            prev.map(c =>
              c.id === currentClass.id
                ? { ...c, [`${editType}s`]: [...c[`${editType}s`], res.data] }
                : c
            )
          );
        }
      }
    } catch (err) {
      console.error("Save failed:", err);
    }

    closeModal();
  };

  // Delete
  const deleteRecord = async (type, id) => {
    if (!currentClass) return;
    try {
      await axios.delete(`${API}/classes/${currentClass.id}/${type}/${id}`);
      setClasses(prev =>
        prev.map(c =>
          c.id === currentClass.id
            ? { ...c, [type]: c[type].filter(x => x.id !== id) }
            : c
        )
      );
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Import
  const handleImportFile = async (file, type) => {
    if (!file || !currentClass) return;
    try {
      const json = await readExcelFile(file);
      const mapped = json.map(r => mapRowTo(r, type.slice(0, -1)));
      await axios.post(`${API}/classes/${currentClass.id}/import/${type}`, mapped);
      setClasses(prev =>
        prev.map(c =>
          c.id === currentClass.id
            ? { ...c, [type]: [...c[type], ...mapped] }
            : c
        )
      );
    } catch (err) {
      console.error("Import failed:", err);
    }
  };
  const triggerImport = (type) => fileRefs[type]?.current?.click();

  const paginated = (arr = []) => arr.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Class Management</h1>
        <button onClick={() => openModal("class")} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">+ Add Class</button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {classes.map(c => (
          <button key={c.id}
            onClick={() => { setSelectedClassId(c.id); setActiveTab("info"); setPage(1); }}
            className={`px-3 py-2 rounded-lg border ${selectedClassId === c.id ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}>
            {c.name}-{c.section}
          </button>
        ))}
      </div>

      {!currentClass ? <EmptyState text="No class selected" /> : (
        <div>
  
          <div className="flex gap-2 mb-4">
            {["info","subjects","teachers","students"].map(tab=>(
              <button key={tab} onClick={()=>{setActiveTab(tab);setPage(1);}}
                className={`px-4 py-2 rounded-lg ${activeTab===tab?"bg-blue-600 text-white":"bg-gray-200"}`}>
                {tab.charAt(0).toUpperCase()+tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "info" && (
            <div className="grid md:grid-cols-3 gap-4">
              <InfoRow label="Class Name" value={currentClass.name}/>
              <InfoRow label="Section" value={currentClass.section}/>
              <InfoRow label="Class Teacher" value={currentClass.teacher}/>
            </div>
          )}

          {["subjects","teachers","students"].includes(activeTab) && (
            <div>
              <div className="flex justify-between mb-3">
                <div className="space-x-2">
                  <button onClick={() => openModal(activeTab.slice(0,-1))} className="px-3 py-2 bg-green-600 text-white rounded-lg shadow">+ Add</button>
                  <button onClick={() => triggerImport(activeTab)} className="px-3 py-2 bg-purple-600 text-white rounded-lg shadow">Import</button>
                  <input type="file" hidden ref={fileRefs[activeTab]} onChange={(e)=>handleImportFile(e.target.files[0],activeTab)}/>
                </div>
              </div>

              <div className="overflow-x-auto border rounded-lg shadow bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {activeTab==="students" && <th className="px-4 py-2 text-left text-sm">Roll</th>}
                      <th className="px-4 py-2 text-left text-sm">Name</th>
                      <th className="px-4 py-2 text-left text-sm">{activeTab==="subjects"?"Teacher":"Subject"}</th>
                      {activeTab==="students" && <th className="px-4 py-2 text-left text-sm">Contact</th>}
                      <th className="px-4 py-2 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(paginated(currentClass[activeTab])||[]).map(r=>(
                      <tr key={r.id||uid("row-")}>
                        {activeTab==="students" && <td className="px-4 py-2">{r.roll}</td>}
                        <td className="px-4 py-2">{r.name}</td>
                        <td className="px-4 py-2">{activeTab==="subjects"?r.teacher:r.subject}</td>
                        {activeTab==="students" && <td className="px-4 py-2">{r.contact}</td>}
                        <td className="px-4 py-2 space-x-2">
                          <button onClick={()=>openModal(activeTab.slice(0,-1),r)} className="text-blue-600">Edit</button>
                          <button onClick={()=>deleteRecord(activeTab,r.id)} className="text-red-600">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-3">
                <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                <span>Page {page}</span>
                <button disabled={page*perPage >= (currentClass[activeTab]?.length||0)} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onClose={closeModal} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/40"/>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative z-10 p-6">
          <Dialog.Title className="text-lg font-bold mb-4">Add / Edit {editType}</Dialog.Title>
          <form onSubmit={saveChanges} className="space-y-3">
            {editType==="class" && (
              <>
                <input name="name" placeholder="Class Name" defaultValue={current?.name} className="w-full border rounded px-3 py-2"/>
                <input name="section" placeholder="Section" defaultValue={current?.section} className="w-full border rounded px-3 py-2"/>
                <input name="teacher" placeholder="Class Teacher" defaultValue={current?.teacher} className="w-full border rounded px-3 py-2"/>
              </>
            )}
            {editType==="subject" && (
              <>
                <input name="name" placeholder="Subject Name" defaultValue={current?.name} className="w-full border rounded px-3 py-2"/>
                <input name="teacher" placeholder="Teacher" defaultValue={current?.teacher} className="w-full border rounded px-3 py-2"/>
              </>
            )}
            {editType==="teacher" && (
              <>
                <input name="name" placeholder="Teacher Name" defaultValue={current?.name} className="w-full border rounded px-3 py-2"/>
                <input name="subject" placeholder="Subject" defaultValue={current?.subject} className="w-full border rounded px-3 py-2"/>
              </>
            )}
            {editType==="student" && (
              <>
                <input name="roll" placeholder="Roll No" defaultValue={current?.roll} className="w-full border rounded px-3 py-2"/>
                <input name="name" placeholder="Name" defaultValue={current?.name} className="w-full border rounded px-3 py-2"/>
                <input name="contact" placeholder="Contact" defaultValue={current?.contact} className="w-full border rounded px-3 py-2"/>
              </>
            )}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  );
}
