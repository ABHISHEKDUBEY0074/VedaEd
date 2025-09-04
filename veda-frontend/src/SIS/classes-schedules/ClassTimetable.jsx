import React, { useMemo, useState } from "react";
import { FiTrash2 } from "react-icons/fi";

// static dropdown data
const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const SECTION_OPTIONS = ["A", "B", "C", "D", "E"];
const SUBJECTS = [
  "English (210)",
  "Hindi (230)",
  "Computer (00220)",
  "Mathematics (110)",
  "EVS (140)",
  "GK (150)",
];
const TEACHERS = [
  "Shivam Verma (9002)",
  "Albert Thomas (54545454)",
  "Anjali Sharma (9088)",
  "Mr. Mehta (7712)",
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// 🔹 Dummy Timetable Data
const DUMMY_TIMETABLE = {
  "Class 1-A": [
    { day: "Monday", subject: "English", teacher: "Shivam Verma", from: "09:00", to: "10:00", room: "101" },
    { day: "Monday", subject: "Maths", teacher: "Anjali Sharma", from: "10:15", to: "11:15", room: "101" },
    { day: "Tuesday", subject: "Science", teacher: "Mr. Mehta", from: "09:00", to: "10:00", room: "102" },
  ],
  "Class 2-B": [
    { day: "Monday", subject: "Hindi", teacher: "Albert Thomas", from: "09:00", to: "10:00", room: "201" },
    { day: "Monday", subject: "EVS", teacher: "Shivam Verma", from: "10:15", to: "11:15", room: "201" },
  ],
};

// helper for new row
const emptyRow = () => ({
  id: crypto.randomUUID(),
  subject: "",
  teacher: "",
  from: "",
  to: "",
  room: "",
});

// 🔹 Dummy timetable table component
const TimetableView = ({ cls, section }) => {
  const key = `${cls}-${section}`;
  const rows = DUMMY_TIMETABLE[key] || [];

  if (!cls || !section) return null;

  if (rows.length === 0) {
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
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border px-3 py-2">{r.day}</td>
              <td className="border px-3 py-2">{r.subject}</td>
              <td className="border px-3 py-2">{r.teacher}</td>
              <td className="border px-3 py-2">{r.from}</td>
              <td className="border px-3 py-2">{r.to}</td>
              <td className="border px-3 py-2">{r.room}</td>
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
  // main criteria
  const [criteriaClass, setCriteriaClass] = useState("");
  const [criteriaSection, setCriteriaSection] = useState("");

  // modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalClass, setModalClass] = useState("");
  const [modalSection, setModalSection] = useState("");
  const [modalGroup, setModalGroup] = useState("");

  // editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeDay, setActiveDay] = useState("Monday");
  const initialTT = useMemo(
    () => DAYS.reduce((acc, d) => ({ ...acc, [d]: [] }), {}),
    []
  );
  const [timetable, setTimetable] = useState(initialTT);

  // quick generate state
  const [periodStart, setPeriodStart] = useState("");
  const [duration, setDuration] = useState("");
  const [intervalMin, setIntervalMin] = useState("");
  const [roomNoQuick, setRoomNoQuick] = useState("");

  const [showDummy, setShowDummy] = useState(false);

  // subject group dynamic
  const subjectGroupOptions = useMemo(() => {
    return CLASS_OPTIONS.reduce((acc, cls) => {
      acc[cls] = [`${cls} Subject Group`];
      return acc;
    }, {});
  }, {});

  
  const renderMainCriteria = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Select Criteria</h2>
        <button
          onClick={() => setShowAddModal(true)}
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
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
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
            {SECTION_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={() => {
            if (!criteriaClass || !criteriaSection) {
              alert("Please select Class & Section.");
              return;
            }
            setShowDummy(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </div>
  );

  // --- Add Modal ---
  const renderAddModal = () => (
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
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
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
              {SECTION_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">Subject Group</label>
            <select
              value={modalGroup}
              onChange={(e) => setModalGroup(e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled={!modalClass}
            >
              <option value="">Select</option>
              {modalClass &&
                subjectGroupOptions[modalClass]?.map((g) => (
                  <option key={g} value={g}>{g}</option>
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
              onClick={() => {
                if (!modalClass || !modalSection || !modalGroup) {
                  alert("Please select Class, Section & Subject Group");
                  return;
                }
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
    )
  );

  // --- Timetable Editor ---
  const addRowForDay = (day) => {
    setTimetable((prev) => ({ ...prev, [day]: [...prev[day], emptyRow()] }));
  };

  const updateRow = (day, id, key, value) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: prev[day].map((r) => (r.id === id ? { ...r, [key]: value } : r)),
    }));
  };

  const deleteRow = (day, id) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: prev[day].filter((r) => r.id !== id),
    }));
  };

  const applyQuickGenerate = () => {
    if (!periodStart || !duration || !intervalMin) {
      alert("Please fill Period Start Time, Duration and Interval.");
      return;
    }
    const toMin = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const toHHMM = (m) => {
      const hh = String(Math.floor(m / 60)).padStart(2, "0");
      const mm = String(m % 60).padStart(2, "0");
      return `${hh}:${mm}`;
    };

    setTimetable((prev) => {
      let start = toMin(periodStart);
      const updated = prev[activeDay].map((r) => {
        const from = start;
        const to = start + Number(duration);
        start = to + Number(intervalMin);
        return {
          ...r,
          from: toHHMM(from),
          to: toHHMM(to),
          room: r.room || roomNoQuick,
        };
      });
      return { ...prev, [activeDay]: updated };
    });
  };

  const saveAll = () => {
    console.log("Saving timetable:", { criteriaClass, criteriaSection, timetable });
    alert("Saved! (Check console for payload)");
  };

  const renderEditor = () => (
    <div className="bg-white rounded-lg shadow mt-6">
      {/* quick params */}
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

      {/* day tabs */}
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

      {/* rows for active day */}
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
              value={row.subject}
              onChange={(e)=>updateRow(activeDay, row.id, "subject", e.target.value)}
            >
              <option value="">Select</option>
              {SUBJECTS.map((s)=><option key={s} value={s}>{s}</option>)}
            </select>

            <select
              className="col-span-3 border rounded px-2 py-2"
              value={row.teacher}
              onChange={(e)=>updateRow(activeDay, row.id, "teacher", e.target.value)}
            >
              <option value="">Select</option>
              {TEACHERS.map((t)=><option key={t} value={t}>{t}</option>)}
            </select>

            <input type="time" className="col-span-2 border rounded px-2 py-2"
              value={row.from} onChange={(e)=>updateRow(activeDay, row.id, "from", e.target.value)} />
            <input type="time" className="col-span-2 border rounded px-2 py-2"
              value={row.to} onChange={(e)=>updateRow(activeDay, row.id, "to", e.target.value)} />
            <input className="col-span-1 border rounded px-2 py-2"
              value={row.room} onChange={(e)=>updateRow(activeDay, row.id, "room", e.target.value)} />
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
      {showDummy && <TimetableView cls={criteriaClass} section={criteriaSection} />}
    </div>
  );
}
