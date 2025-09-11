import React, { useMemo, useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const emptyRow = () => ({
  id: crypto.randomUUID(),
  subjectId: "",
  teacherId: "",
  from: "",
  to: "",
  roomNo: "",
});

const TimetableView = ({ cls, section, rows }) => {
  if (!cls || !section) return null;
  const data = rows || [];

  if (data.length === 0) {
    return (
      <div className="mt-6 bg-white p-4 rounded shadow">
        <p className="text-gray-500 italic">
          No timetable found for {cls} {section}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">
        Timetable – {cls} {section}
      </h3>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Day</th>
            <th className="border px-3 py-2 text-left">Subject</th>
            <th className="border px-3 py-2 text-left">Teacher</th>
            <th className="border px-3 py-2 text-left">From</th>
            <th className="border px-3 py-2 text-left">To</th>
            <th className="border px-3 py-2 text-left">Room</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={r._id || i} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{r.day}</td>
              <td className="border px-3 py-2">{r.subject?.subjectName || "--"}</td>
              <td className="border px-3 py-2">
                {r.teacher?.personalInfo?.name || "--"}
              </td>
              <td className="border px-3 py-2">{r.timeFrom}</td>
              <td className="border px-3 py-2">{r.timeTo}</td>
              <td className="border px-3 py-2">{r.roomNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function cx(...cls) {
  return cls.filter(Boolean).join(" ");
}

export default function ClassTimetable() {
  // -------- Dropdowns --------
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // -------- Criteria --------
  const [criteriaClass, setCriteriaClass] = useState("");
  const [criteriaSection, setCriteriaSection] = useState("");

  const clsName = classes.find(c => c._id === criteriaClass)?.name || "";
  const secName = sections.find(s => s._id === criteriaSection)?.name || "";

  // -------- Modal --------
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalClass, setModalClass] = useState("");
  const [modalSection, setModalSection] = useState("");
  const [modalGroup, setModalGroup] = useState("");

  // -------- Editor --------
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeDay, setActiveDay] = useState("Monday");
  const initialTT = useMemo(() => DAYS.reduce((acc, d) => ({ ...acc, [d]: [] }), {}), []);
  const [timetable, setTimetable] = useState(initialTT);

  const [periodStart, setPeriodStart] = useState("");
  const [duration, setDuration] = useState("");
  const [intervalMin, setIntervalMin] = useState("");
  const [roomNoQuick, setRoomNoQuick] = useState("");

  const [tableData, setTableData] = useState([]);
  const [showDummy, setShowDummy] = useState(false);

  // ---------- helper: fetch teachers ----------
  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_BASE}/staff`);
      const data = await res.json();

      // staff.js returns { success: true, staff: [...] }
      if (data && data.success && Array.isArray(data.staff)) {
        setTeachers(data.staff);
        return;
      }

      // fallback: { success: true, data: [...] }
      if (data && data.success && Array.isArray(data.data)) {
        setTeachers(data.data);
        return;
      }

      // very defensive fallback: data itself is array
      if (Array.isArray(data)) {
        setTeachers(data);
        return;
      }

      console.warn("Unexpected staff API shape:", data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  // ---------- Fetch base dropdowns ----------
  useEffect(() => {
    // fetch classes
    fetch(`${API_BASE}/classes`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setClasses(data.data);
        else if (data.success && Array.isArray(data.classes)) setClasses(data.classes);
      })
      .catch(err => console.error("Error fetching classes:", err));

    // fetch teachers initially (so dropdown has values on first open)
    fetchTeachers();
  }, []);

  // If the Add Modal or Editor opens, re-fetch teachers so newly added staff appear
  useEffect(() => {
    if (showAddModal || editorOpen) {
      fetchTeachers();
    }
  }, [showAddModal, editorOpen]);

  // Criteria: fetch sections for criteriaClass
  useEffect(() => {
    if (!criteriaClass) {
      setSections([]);
      setCriteriaSection("");
      return;
    }
    fetch(`${API_BASE}/sections?classId=${criteriaClass}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setSections(data.data);
        else if (data.success && Array.isArray(data.sections)) setSections(data.sections);
      })
      .catch(err => console.error("Error fetching sections:", err));
  }, [criteriaClass]);

  // Modal: fetch sections for modalClass
  useEffect(() => {
    if (!modalClass) return;
    fetch(`${API_BASE}/sections?classId=${modalClass}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setSections(data.data);
        else if (data.success && Array.isArray(data.sections)) setSections(data.sections);
      })
      .catch(err => console.error("Error fetching modal sections:", err));
  }, [modalClass]);

  // Modal: fetch groups
  useEffect(() => {
    if (!modalClass || !modalSection) {
      setGroups([]);
      setModalGroup("");
      return;
    }
    fetch(`${API_BASE}/subGroups?classId=${modalClass}&sectionId=${modalSection}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setGroups(data.data);
        else if (data.success && Array.isArray(data.groups)) setGroups(data.groups);
      })
      .catch(err => console.error("Error fetching groups:", err));
  }, [modalClass, modalSection]);

  // Modal: fetch subjects
  useEffect(() => {
    if (!modalGroup) {
      setSubjects([]);
      return;
    }
    fetch(`${API_BASE}/subjects?groupId=${modalGroup}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setSubjects(data.data);
        else if (data.success && Array.isArray(data.subjects)) setSubjects(data.subjects);
      })
      .catch(err => console.error("Error fetching subjects:", err));
  }, [modalGroup]);

  // ---------- Table + Save ----------
  const addRowForDay = (day) => {
    setTimetable(prev => ({ ...prev, [day]: [...prev[day], emptyRow()] }));
  };

  const updateRow = (day, id, key, value) => {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].map(r => (r.id === id ? { ...r, [key]: value } : r))
    }));
  };

  const deleteRow = (day, id) => {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].filter(r => r.id !== id)
    }));
  };

  const searchTimetable = async () => {
    if (!criteriaClass || !criteriaSection) {
      alert("Please select Class & Section.");
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/timetables`, {
        params: { classId: criteriaClass, sectionId: criteriaSection }
      });
      setTableData(res.data?.data || []);
      setShowDummy(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching timetable");
    }
  };

  const saveAll = async () => {
    if (!modalClass || !modalSection || !modalGroup) {
      alert("Please select Class, Section & Subject Group in the modal.");
      return;
    }
    try {
      const requests = [];
      const metas = [];

      for (const day of DAYS) {
        for (const row of timetable[day]) {
          if (!row.subjectId || !row.teacherId || !row.from || !row.to) continue;
          const payload = {
            classId: modalClass,
            sectionId: modalSection,
            subjectGroupId: modalGroup,
            day,
            subjectId: row.subjectId,
            teacherId: row.teacherId, // <-- this is staff._id from dropdown
            timeFrom: row.from,
            timeTo: row.to,
            roomNo: row.roomNo,
          };
          // push promise + meta so we can know which row failed
          requests.push(axios.post(`${API_BASE}/timetables`, payload));
          metas.push({ day, subjectId: row.subjectId, teacherId: row.teacherId, from: row.from, to: row.to });
        }
      }

      const results = await Promise.allSettled(requests);

      const failed = results
        .map((r, i) => {
          if (r.status === 'rejected') {
            const msg = r.reason?.response?.data?.message || r.reason?.message || 'Unknown error';
            return { meta: metas[i], error: msg, raw: r.reason };
          }
          return null;
        })
        .filter(Boolean);

      if (failed.length > 0) {
        console.error('Some rows failed to save:', failed);
        alert(`Saved completed with ${failed.length} failure(s). Check console for details.`);
      } else {
        alert('Saved!');
      }

      setEditorOpen(false);
      if (criteriaClass === modalClass && criteriaSection === modalSection) {
        await searchTimetable();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save timetable");
    }
  };

  // ✅ Quick Generate Timetable
  const applyQuickGenerate = () => {
    if (!periodStart || !duration) {
      alert("Please enter start time and duration");
      return;
    }

    const newRows = [];
    let current = periodStart;

    for (let i = 0; i < 8; i++) { // 8 periods max (customize as needed)
      const [h, m] = current.split(":").map(Number);
      const start = new Date(0, 0, 0, h, m);
      const durMin = parseInt(duration, 10) || 0;
      const intMin = parseInt(intervalMin, 10) || 0;
      const end = new Date(start.getTime() + durMin * 60000);

      const from = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
      const to = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;

      newRows.push({ ...emptyRow(), from, to, roomNo: roomNoQuick });

      // compute next period start properly (handle minute overflow)
      const next = new Date(end.getTime() + intMin * 60000);
      current = `${String(next.getHours()).padStart(2, "0")}:${String(next.getMinutes()).padStart(2, "0")}`;
    }

    setTimetable(prev => ({ ...prev, [activeDay]: newRows }));
  };

  // -------- UI --------
  const renderMainCriteria = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Select Criteria</h2>
        <button
          onClick={async () => {
            // fetch teachers first so dropdown will have data when modal opens
            await fetchTeachers();
            setShowAddModal(true);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-800"
        >
          + Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            value={criteriaClass}
            onChange={(e) => setCriteriaClass(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Section <span className="text-red-500">*</span>
          </label>
          <select
            value={criteriaSection}
            onChange={(e) => setCriteriaSection(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            {sections.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={searchTimetable}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </div>
  );

  const renderAddModal = () =>
    showAddModal && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow p-6 w-96">
          <h3 className="text-lg font-semibold mb-4">Add Class Criteria</h3>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">Class</label>
            <select
              value={modalClass}
              onChange={(e) => setModalClass(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">Section</label>
            <select
              value={modalSection}
              onChange={(e) => setModalSection(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">Subject Group</label>
            <select
              value={modalGroup}
              onChange={(e) => setModalGroup(e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled={!modalClass || !modalSection}
            >
              <option value="">Select</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!modalClass || !modalSection || !modalGroup) {
                  alert("Please select Class, Section & Subject Group");
                  return;
                }
                // ensure teachers are fresh before opening editor
                await fetchTeachers();
                setShowAddModal(false);
                setEditorOpen(true);
              }}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );

  const renderEditor = () => (
    <div className="bg-white rounded-lg shadow mt-6">
      
      <div className="p-4 border-b">
        <h4 className="font-semibold mb-3">Generate Time Table Quickly</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1">Period Start *</label>
            <input type="time" className="w-full border rounded px-3 py-2"
              value={periodStart} onChange={(e)=>setPeriodStart(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Duration *</label>
            <input type="number" min="0" className="w-full border rounded px-3 py-2"
              value={duration} onChange={(e)=>setDuration(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Interval *</label>
            <input type="number" min="0" className="w-full border rounded px-3 py-2"
              value={intervalMin} onChange={(e)=>setIntervalMin(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Room</label>
            <input className="w-full border rounded px-3 py-2"
              value={roomNoQuick} onChange={(e)=>setRoomNoQuick(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button onClick={applyQuickGenerate}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
              Apply
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 pt-4">
        <div className="flex gap-4 border-b">
          {DAYS.map((d)=>(
            <button key={d}
              className={cx(
                "px-3 py-2 -mb-px",
                activeDay===d ? "border-b-2 border-orange-500 font-semibold" : "text-gray-600"
              )}
              onClick={()=>setActiveDay(d)}
            >
              {d}
            </button>
          ))}
          <div className="ml-auto pb-2">
            <button
              onClick={()=>addRowForDay(activeDay)}
              className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800"
            >
              + Add New
            </button>
          </div>
        </div>
      </div>

      
      <div className="p-4">
        <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-700 mb-2">
          <div className="col-span-3">Subject</div>
          <div className="col-span-3">Teacher</div>
          <div className="col-span-2">From</div>
          <div className="col-span-2">To</div>
          <div className="col-span-1">Room</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {timetable[activeDay].length === 0 && (
          <div className="text-gray-400 italic">No rows. Click “+ Add New”.</div>
        )}

        {timetable[activeDay].map((row) => (
          <div key={row.id} className="grid grid-cols-12 gap-2 items-center mb-2">
            <select
              className="col-span-3 border rounded px-2 py-2"
              value={row.subjectId}
              onChange={(e)=>updateRow(activeDay, row.id, "subjectId", e.target.value)}
            >
              <option value="">Select</option>
              {subjects.map((s)=><option key={s._id} value={s._id}>{s.subjectName}</option>)}
            </select>

            <select
              className="col-span-3 border rounded px-2 py-2"
              value={row.teacherId}
              onChange={(e)=>updateRow(activeDay, row.id, "teacherId", e.target.value)}
            >
              <option value="">Select</option>
              {teachers.map((t)=><option key={t._id} value={t._id}>{t.personalInfo?.name}</option>)}
            </select>

            <input type="time" className="col-span-2 border rounded px-2 py-2"
              value={row.from} onChange={(e)=>updateRow(activeDay, row.id, "from", e.target.value)} />
            <input type="time" className="col-span-2 border rounded px-2 py-2"
              value={row.to} onChange={(e)=>updateRow(activeDay, row.id, "to", e.target.value)} />
            <input className="col-span-1 border rounded px-2 py-2"
              value={row.roomNo} onChange={(e)=>updateRow(activeDay, row.id, "roomNo", e.target.value)} />
            <div className="col-span-1 text-right">
              <button
                onClick={() => deleteRow(activeDay, row.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex justify-end">
        <button onClick={saveAll} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {renderMainCriteria()}
      {renderAddModal()}
      {editorOpen && renderEditor()}
      {showDummy && <TimetableView cls={clsName} section={secName} rows={tableData} />}
    </div>
  );
}
