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
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// helpers
const emptyRow = () => ({
  id: crypto.randomUUID(),
  subject: "",
  teacher: "",
  from: "",
  to: "",
  room: "",
});

function cx(...cls){ return cls.filter(Boolean).join(" "); }

export default function ClassTimetable() {
  // main criteria 
  const [criteriaClass, setCriteriaClass] = useState("");
  const [criteriaSection, setCriteriaSection] = useState("");

  // add-modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalClass, setModalClass] = useState("");
  const [modalSection, setModalSection] = useState("");
  const [modalGroup, setModalGroup] = useState("");

  // editor screen (full page) state
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeDay, setActiveDay] = useState("Monday");

  // quick generate params
  const [periodStart, setPeriodStart] = useState(""); // "HH:MM"
  const [duration, setDuration] = useState("");       // minutes
  const [intervalMin, setIntervalMin] = useState(""); // minutes
  const [roomNoQuick, setRoomNoQuick] = useState("");

  // timetable data per day
  const initialTT = useMemo(
    () => DAYS.reduce((acc, d) => ({ ...acc, [d]: [] }), {}),
    []
  );
  const [timetable, setTimetable] = useState(initialTT);

  // Subject Group is dynamic: “Class X Subject Group”
  const subjectGroupOptions = useMemo(() => {
    return CLASS_OPTIONS.reduce((acc, cls) => {
      acc[cls] = [`${cls} Subject Group`];
      return acc;
    }, {});
  }, []);

  // MAIN PAGE — small Select Criteria 
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
    </div>
  );

  // MODAL — (Class, Section, Subject Group) → Search opens editor
  const renderAddModal = () => (
    showAddModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddModal(false)} />
        <div className="relative bg-white rounded-lg shadow w-[95%] max-w-5xl p-6">
          <h3 className="text-lg font-semibold mb-4">Select Criteria</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                value={modalClass}
                onChange={(e) => {
                  setModalClass(e.target.value);
                  setModalGroup("");
                }}
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

            <div>
              <label className="block text-sm font-semibold mb-1">
                Subject Group <span className="text-red-500">*</span>
              </label>
              <select
                value={modalGroup}
                onChange={(e) => setModalGroup(e.target.value)}
                className="w-full border rounded px-3 py-2"
                disabled={!modalClass}
              >
                <option value="">Select</option>
                {!!modalClass &&
                  subjectGroupOptions[modalClass].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!modalClass || !modalSection || !modalGroup) {
                  alert("Please select Class, Section & Subject Group.");
                  return;
                }
                // set top criteria (optional sync)
                setCriteriaClass(modalClass);
                setCriteriaSection(modalSection);

                // open editor page
                setEditorOpen(true);
                setShowAddModal(false);
              }}
              className="bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    )
  );

  // EDITOR (full page)
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

  // quick apply: fills time slots for ALL rows in activeDay
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
    // here you can replace with API call
    console.log("Saving timetable:", { criteriaClass, criteriaSection, timetable });
    alert("Saved! (Check console for payload)");
  };

  const renderEditor = () => (
    <div className="bg-white rounded-lg shadow mt-6">
      {/* top criteria  */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b">
        <div>
          <label className="block text-sm font-semibold mb-1">Class *</label>
          <input className="w-full border rounded px-3 py-2 bg-gray-100" readOnly value={criteriaClass || modalClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Section *</label>
          <input className="w-full border rounded px-3 py-2 bg-gray-100" readOnly value={criteriaSection || modalSection} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Subject Group *</label>
          <input className="w-full border rounded px-3 py-2 bg-gray-100" readOnly value={modalGroup} />
        </div>
      </div>

      {/* quick params */}
      <div className="p-4 border-b">
        <h4 className="font-semibold mb-3">Select parameter to generate time table quickly</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1">Period Start Time *</label>
            <input type="time" className="w-full border rounded px-3 py-2"
                   value={periodStart} onChange={(e)=>setPeriodStart(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Duration (minute) *</label>
            <input type="number" min="0" className="w-full border rounded px-3 py-2"
                   value={duration} onChange={(e)=>setDuration(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Interval (minute) *</label>
            <input type="number" min="0" className="w-full border rounded px-3 py-2"
                   value={intervalMin} onChange={(e)=>setIntervalMin(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Room No.</label>
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
          <div className="col-span-2">Time From *</div>
          <div className="col-span-2">Time To *</div>
          <div className="col-span-1">Room No.</div>
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

            <input
              type="time"
              className="col-span-2 border rounded px-2 py-2"
              value={row.from}
              onChange={(e)=>updateRow(activeDay, row.id, "from", e.target.value)}
            />
            <input
              type="time"
              className="col-span-2 border rounded px-2 py-2"
              value={row.to}
              onChange={(e)=>updateRow(activeDay, row.id, "to", e.target.value)}
            />
            <input
              className="col-span-1 border rounded px-2 py-2"
              value={row.room}
              onChange={(e)=>updateRow(activeDay, row.id, "room", e.target.value)}
            />
            <div className="col-span-1 text-right">
  <button
    onClick={() => deleteRow(activeDay, row.id)}
    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
    aria-label="Delete row"
  >
    <FiTrash2 size={16} />
  </button>
</div>

          </div>
        ))}

        <div className="text-right mt-6">
          <button
            onClick={saveAll}
            className="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {renderMainCriteria()}
      {renderAddModal()}
      {editorOpen && renderEditor()}
    </div>
  );
}
