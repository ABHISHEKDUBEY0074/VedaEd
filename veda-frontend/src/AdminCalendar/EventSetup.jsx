import { useState, useEffect } from "react";

const classMap = {
  Primary: ["1", "2", "3", "4", "5"],
  Secondary: ["6", "7", "8", "9", "10"],
  "Higher Secondary": ["11", "12"],
};

const sections = ["A", "B", "C"];
const roles = ["Admin", "Teacher", "Student", "Parent", "Management"];

// 🎨 COLOR FUNCTION
const getColor = (type) => {
  switch (type) {
    case "Assignment": return "bg-blue-500";
    case "Exam": return "bg-red-500";
    case "Meeting": return "bg-purple-500";
    case "Holiday": return "bg-green-500";
    default: return "bg-gray-400";
  }
};

const EventSetup = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    title: "",
    type: "Assignment",
    source: "Manual",
    category: "Primary",
    classes: [], // 🔥 changed
    sections: [],
    venue: "",
    createdBy: "Admin",
    status: "Scheduled",
    priority: "Normal",
    reminder: "1 day before",
    visibility: [],
    from: "",
    to: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  useEffect(() => {
    setEvents(JSON.parse(localStorage.getItem("events")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // 🔥 MULTI CLASS
  const toggleClass = (cls) => {
    setForm({
      ...form,
      classes: form.classes.includes(cls)
        ? form.classes.filter((c) => c !== cls)
        : [...form.classes, cls],
      sections: [],
    });
  };

  const toggleSection = (sec) => {
    setForm({
      ...form,
      sections: form.sections.includes(sec)
        ? form.sections.filter((s) => s !== sec)
        : [...form.sections, sec],
    });
  };

  const toggleVisibility = (role) => {
    setForm({
      ...form,
      visibility: form.visibility.includes(role)
        ? form.visibility.filter((r) => r !== role)
        : [...form.visibility, role],
    });
  };

  const handleSave = () => {
    if (!form.title || !form.from || form.classes.length === 0) {
      alert("Required fields missing");
      return;
    }

    const newEvent = {
      ...form,
      to: form.to || form.from,
      id: Date.now(),
      color: getColor(form.type),
    };

    let updated;
    if (editIndex !== null) {
      updated = [...events];
      updated[editIndex] = newEvent;
      setEditIndex(null);
    } else {
      updated = [...events, newEvent];
    }

    setEvents(updated);

    // 🔥 publish to calendar
    const cal = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    localStorage.setItem("calendarEvents", JSON.stringify([...cal, newEvent]));

    setModalOpen(false);
  };

  return (
    <div className="p-0 min-h-screen">
      <div className="bg-white p-6 rounded-lg">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-lg font-semibold">Event Setup</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create Event
          </button>
        </div>

        {/* TABLE */}
        {events.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No events created
          </div>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Classes</th>
                <th className="p-3">Sections</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {events.map((e, i) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${e.color}`} />
                    {e.title}
                  </td>
                  <td className="p-3">{e.classes.join(", ")}</td>
                  <td className="p-3">{e.sections.join(", ")}</td>
                  <td className="p-3">{e.from} → {e.to}</td>
                  <td className="p-3">{e.status}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setForm(e);
                        setEditIndex(i);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 bg-yellow-400 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setEvents(events.filter((_, idx) => idx !== i))
                      }
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-[1000px] p-6 rounded-lg overflow-y-auto max-h-[90vh]">

              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Add Calendar Event</h2>
                <button onClick={() => setModalOpen(false)}>✕</button>
              </div>

              <div className="grid grid-cols-3 gap-4">

                {/* SAME FIELDS - JUST LABEL ADD */}
                <div>
                  <label>Event Title</label>
                  <input className="border px-3 py-2 rounded w-full"
                    value={form.title}
                    onChange={(e)=>setForm({...form,title:e.target.value})}
                  />
                </div>

                <div>
                  <label>Event Type</label>
                  <select className="border px-3 py-2 rounded w-full"
                    value={form.type}
                    onChange={(e)=>setForm({...form,type:e.target.value})}>
                    <option>Assignment</option>
                    <option>Exam</option>
                    <option>Meeting</option>
                    <option>Holiday</option>
                  </select>
                </div>

                <div>
                  <label>Source</label>
                  <select className="border px-3 py-2 rounded w-full"
                    value={form.source}
                    onChange={(e)=>setForm({...form,source:e.target.value})}>
                    <option>Manual</option>
                    <option>Auto</option>
                  </select>
                </div>

                <div>
                  <label>Category</label>
                  <select className="border px-3 py-2 rounded w-full"
                    value={form.category}
                    onChange={(e)=>setForm({...form,category:e.target.value,classes:[]})}>
                    {Object.keys(classMap).map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* 🔥 MULTI CLASS */}
                <div className="col-span-2">
                  <label>Classes</label>
                  <div className="flex gap-4">
                    {classMap[form.category].map(c=>(
                      <label key={c}>
                        <input type="checkbox"
                          checked={form.classes.includes(c)}
                          onChange={()=>toggleClass(c)}
                        /> {c}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label>Venue</label>
                  <input className="border px-3 py-2 rounded w-full"
                    value={form.venue}
                    onChange={(e)=>setForm({...form,venue:e.target.value})}
                  />
                </div>

                {/* SECTIONS */}
                <div className="col-span-3">
                  <label>Sections</label>
                  <div className="flex gap-4">
                    {sections.map(sec=>(
                      <label key={sec}>
                        <input type="checkbox"
                          disabled={form.classes.length===0}
                          checked={form.sections.includes(sec)}
                          onChange={()=>toggleSection(sec)}
                        /> {sec}
                      </label>
                    ))}
                  </div>
                </div>

               {/* FROM DATE */}
<div>
  <label className="text-xs text-gray-600 mb-1 block">From Date</label>
  <input
    type="date"
    className="border px-3 py-2 rounded w-full"
    value={form.from}
    onChange={(e) => setForm({ ...form, from: e.target.value })}
  />
</div>

{/* TO DATE */}
<div>
  <label className="text-xs text-gray-600 mb-1 block">To Date (Optional)</label>
  <input
    type="date"
    className="border px-3 py-2 rounded w-full"
    value={form.to}
    onChange={(e) => setForm({ ...form, to: e.target.value })}
  />
</div>

{/* START TIME */}
<div>
  <label className="text-xs text-gray-600 mb-1 block">Start Time</label>
  <input
    type="time"
    className="border px-3 py-2 rounded w-full"
    value={form.startTime}
    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
  />
</div>

{/* END TIME */}
<div>
  <label className="text-xs text-gray-600 mb-1 block">End Time</label>
  <input
    type="time"
    className="border px-3 py-2 rounded w-full"
    value={form.endTime}
    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
  />
</div>

{/* STATUS */}
<div>
  <label className="text-xs text-gray-600 mb-1 block">Status</label>
  <select
    className="border px-3 py-2 rounded w-full"
    value={form.status}
    onChange={(e) => setForm({ ...form, status: e.target.value })}
  >
    <option>Scheduled</option>
    <option>Completed</option>
  </select>
</div>

{/* PRIORITY */}
<div>
  <label className="text-xs text-gray-600 mb-1 block">Priority</label>
  <select
    className="border px-3 py-2 rounded w-full"
    value={form.priority}
    onChange={(e) => setForm({ ...form, priority: e.target.value })}
  >
    <option>Low</option>
    <option>Normal</option>
    <option>High</option>
  </select>
</div>

{/* REMINDER */}
<div>
  <label className="text-xs text-gray-600 mb-1 block">Reminder</label>
  <select
    className="border px-3 py-2 rounded w-full"
    value={form.reminder}
    onChange={(e) => setForm({ ...form, reminder: e.target.value })}
  >
    <option>1 day before</option>
    <option>2 days before</option>
  </select>
</div>

{/* VISIBILITY */}
<div className="col-span-3">
  <label className="text-xs text-gray-600 mb-1 block">Visibility</label>
  <div className="flex gap-4 flex-wrap">
    {roles.map((r) => (
      <label key={r} className="text-sm">
        <input
          type="checkbox"
          className="mr-1"
          checked={form.visibility.includes(r)}
          onChange={() => toggleVisibility(r)}
        />
        {r}
      </label>
    ))}
  </div>
</div>

{/* DESCRIPTION */}
<div className="col-span-3">
  <label className="text-xs text-gray-600 mb-1 block">Description</label>
  <textarea
    className="border px-3 py-2 rounded w-full"
    rows={3}
    value={form.description}
    onChange={(e) =>
      setForm({ ...form, description: e.target.value })
    }
  />
</div>
              </div>

              {/* 🔥 ONLY ONE BUTTON */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save & Publish
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSetup;