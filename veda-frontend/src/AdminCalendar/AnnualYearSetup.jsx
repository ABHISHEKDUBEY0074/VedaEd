import { useState, useEffect } from "react";

const AnnualYearSetup = () => {
  const [academicYear, setAcademicYear] = useState({
    start: "",
    end: "",
  });

  const [yearSet, setYearSet] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [holidays, setHolidays] = useState([]);

  const [form, setForm] = useState({
    name: "",
    type: "National Holiday",
    from: "",
    to: "",
  });

  const [editIndex, setEditIndex] = useState(null);

  // LOAD
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("holidayList")) || [];
    setHolidays(stored);
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem("holidayList", JSON.stringify(holidays));
  }, [holidays]);

  const handleSetYear = () => {
    if (!academicYear.start || !academicYear.end) {
      alert("Select academic year");
      return;
    }
    setYearSet(true);
  };

  const handleAddHoliday = () => {
    const from = new Date(form.from);
    const to = new Date(form.to);
    const start = new Date(academicYear.start);
    const end = new Date(academicYear.end);

    if (!form.name || !form.from || !form.to) {
      alert("Fill all fields");
      return;
    }

    if (from < start || to > end || from > to) {
      alert("Invalid range (within academic year only)");
      return;
    }

    const newHoliday = { ...form, id: Date.now() };

    if (editIndex !== null) {
      const updated = [...holidays];
      updated[editIndex] = newHoliday;
      setHolidays(updated);
      setEditIndex(null);
    } else {
      setHolidays([...holidays, newHoliday]);
    }

    setForm({
      name: "",
      type: "National Holiday",
      from: "",
      to: "",
    });
  };

  const handleSync = () => {
    localStorage.setItem("calendarEvents", JSON.stringify(holidays));
    alert("Synced to Annual Calendar");
  };

  return (
    <div className="p-0 min-h-screen">
      <div className="bg-white rounded-lg p-6">

        {/* HEADER */}
        <h2 className="text-lg font-semibold mb-6">
          Academic Year Setup
        </h2>

        {/* YEAR INPUT */}
<div className="mb-6 p-4 border rounded-lg bg-gray-50">

  <div className="flex items-end gap-4 flex-wrap">

    {/* START DATE */}
    <div className="flex flex-col">
      <label className="text-xs text-gray-600 mb-1">Academic Start</label>
      <input
        type="date"
        className="border px-3 py-2 rounded w-[180px]"
        value={academicYear.start}
        onChange={(e) =>
          setAcademicYear({ ...academicYear, start: e.target.value })
        }
      />
    </div>

    {/* END DATE */}
    <div className="flex flex-col">
      <label className="text-xs text-gray-600 mb-1">Academic End</label>
      <input
        type="date"
        className="border px-3 py-2 rounded w-[180px]"
        value={academicYear.end}
        onChange={(e) =>
          setAcademicYear({ ...academicYear, end: e.target.value })
        }
      />
    </div>

    {/* SET BUTTON */}
    <button
      onClick={handleSetYear}
      className="px-4 py-2 bg-blue-600 text-white rounded h-[38px]"
    >
      Set Year
    </button>

    {/* HOLIDAY BUTTON */}
    <button
      onClick={() => setModalOpen(true)}
      className="px-4 py-2 border rounded h-[38px] hover:bg-gray-100"
    >
      Holiday List
    </button>

  </div>

 


        {/* 🔥 YEAR DISPLAY */}
        {yearSet && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
            <p className="text-sm font-medium text-blue-700">
              Current Academic Year:
            </p>
            <p className="text-sm">
              {academicYear.start} → {academicYear.end}
            </p>
          </div>
        )}
</div>
        {/* TABLE */}
        <table className="w-full border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {holidays.map((h, index) => (
              <tr key={h.id} className="border-t">
                <td className="p-3">{h.from}</td>
                <td className="p-3">{h.to}</td>
                <td className="p-3">{h.name}</td>
                <td className="p-3">{h.type}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setForm(h);
                      setEditIndex(index);
                      setModalOpen(true);
                    }}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setHolidays(holidays.filter((_, i) => i !== index))
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

        {/* SYNC */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSync}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Sync to Calendar
          </button>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white w-[800px] rounded-lg p-6">

              <h2 className="text-lg font-semibold mb-4">
                Holiday Setup
              </h2>

             {/* FORM */}
<div className="grid grid-cols-4 gap-4 mb-4">

  {/* NAME */}
  <div className="flex flex-col">
    <label className="text-xs text-gray-600 mb-1">Holiday Name</label>
    <input
      placeholder="Enter name"
      className="border px-3 py-2 rounded"
      value={form.name}
      onChange={(e) =>
        setForm({ ...form, name: e.target.value })
      }
    />
  </div>

  {/* FROM DATE */}
  <div className="flex flex-col">
    <label className="text-xs text-gray-600 mb-1">From Date</label>
    <input
      type="date"
      className="border px-3 py-2 rounded"
      value={form.from}
      onChange={(e) =>
        setForm({ ...form, from: e.target.value })
      }
    />
  </div>

  {/* TO DATE */}
  <div className="flex flex-col">
    <label className="text-xs text-gray-600 mb-1">
      To Date (Optional)
    </label>
    <input
      type="date"
      className="border px-3 py-2 rounded"
      value={form.to}
      onChange={(e) =>
        setForm({ ...form, to: e.target.value })
      }
    />
  </div>

  {/* TYPE */}
  <div className="flex flex-col">
    <label className="text-xs text-gray-600 mb-1">Holiday Type</label>
    <select
      className="border px-3 py-2 rounded"
      value={form.type}
      onChange={(e) =>
        setForm({ ...form, type: e.target.value })
      }
    >
      <option>National Holiday</option>
      <option>Festival</option>
      <option>School Holiday</option>
      <option>Vacation</option>
      <option>Local Holiday</option>
    </select>
  </div>

</div>

              <button
                onClick={handleAddHoliday}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
              >
                Add Holiday
              </button>

              {/* 🔥 LIVE LIST INSIDE MODAL */}
<div className="mt-4">
  
  {/* HEADER */}
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-sm font-medium text-gray-700">
      Added Holidays
    </h3>
    <span className="text-xs text-gray-400">
      {holidays.length} items
    </span>
  </div>

  {/* LIST */}
  <div className="max-h-44 overflow-y-auto border rounded-lg bg-gray-50">

    {holidays.length === 0 ? (
      <div className="text-center text-gray-400 py-6 text-sm">
        No holidays added yet
      </div>
    ) : (
      holidays.map((h) => (
        <div
          key={h.id}
          className="flex justify-between items-center px-3 py-2 border-b last:border-b-0 hover:bg-gray-100"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {h.name}
            </span>
            <span className="text-xs text-gray-500">
              {h.from} → {h.to}
            </span>
          </div>

          {/* OPTIONAL: status / tag */}
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            Holiday
          </span>
        </div>
      ))
    )}

  </div>

  {/* ACTION */}
  <div className="flex justify-end mt-4">
    <button
      onClick={() => setModalOpen(false)}
      className="px-4 py-2 border rounded hover:bg-gray-100"
    >
      Close
    </button>
  </div>

</div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnualYearSetup;