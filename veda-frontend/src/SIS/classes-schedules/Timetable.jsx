import React, { useState } from "react";

const Timetable = () => {
  const [activeTab, setActiveTab] = useState("class");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [staffId, setStaffId] = useState("");
  const [searched, setSearched] = useState(false);

  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    day: "",
    subject: "",
    startTime: "",
    endTime: "",
  });

  // Dummy staff data
  const dummyStaff = {
    "101": { name: "Mr. Sharma", subject: "Maths" },
    "102": { name: "Ms. Gupta", subject: "Science" },
  };

  // Dummy search function
  const handleSearch = () => {
    if (activeTab === "class" && selectedClass && selectedSection) {
      setSearched(true);
      setEntries([
        { id: 1, day: "Monday", subject: "Maths", startTime: "09:00", endTime: "09:45" },
        { id: 2, day: "Monday", subject: "English", startTime: "10:00", endTime: "10:45" },
        { id: 3, day: "Tuesday", subject: "Science", startTime: "11:00", endTime: "11:45" },
      ]);
    } else if (activeTab === "teacher" && staffId) {
      setSearched(true);
      setEntries([
        { id: 1, day: "Monday", subject: "Class 5A - Maths", startTime: "09:00", endTime: "09:45" },
        { id: 2, day: "Tuesday", subject: "Class 6B - Maths", startTime: "10:00", endTime: "10:45" },
        { id: 3, day: "Wednesday", subject: "Class 7A - Maths", startTime: "11:00", endTime: "11:45" },
      ]);
    } else {
      alert("Please fill required fields");
    }
  };

  // Add or Update Entry
  const handleSaveEntry = () => {
    if (form.day && form.subject && form.startTime && form.endTime) {
      if (editId) {
        // update entry
        setEntries(
          entries.map((e) =>
            e.id === editId ? { ...form, id: editId } : e
          )
        );
        setEditId(null);
      } else {
        // add new entry
        setEntries([...entries, { ...form, id: Date.now() }]);
      }
      setForm({ day: "", subject: "", startTime: "", endTime: "" });
    }
  };

  const handleEdit = (entry) => {
    setForm({
      day: entry.day,
      subject: entry.subject,
      startTime: entry.startTime,
      endTime: entry.endTime,
    });
    setEditId(entry.id);
  };

  const handleDelete = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  // Group entries by day
  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.day]) acc[entry.day] = [];
    acc[entry.day].push(entry);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="flex space-x-3 border-b mb-6">
        <button
          onClick={() => {
            setActiveTab("class");
            setSearched(false);
            setEntries([]);
          }}
          className={`px-5 py-2 rounded-t-lg font-medium ${
            activeTab === "class"
              ? "bg-blue-500 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Class Timetable
        </button>
        <button
          onClick={() => {
            setActiveTab("teacher");
            setSearched(false);
            setEntries([]);
          }}
          className={`px-5 py-2 rounded-t-lg font-medium ${
            activeTab === "teacher"
              ? "bg-blue-500 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Teacher Timetable
        </button>
      </div>

      {/* Class Timetable */}
      {activeTab === "class" && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Search by Class</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">Select Class</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Class {i + 1}
                </option>
              ))}
            </select>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">Select Section</option>
              {["A", "B", "C", "D", "E"].map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Teacher Timetable */}
      {activeTab === "teacher" && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Search by Teacher</h2>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter Staff ID"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="border p-2 rounded-lg flex-1"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
            >
              Search
            </button>
          </div>
          {staffId && dummyStaff[staffId] && (
            <div className="bg-gray-50 border p-4 rounded-lg mb-4">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {dummyStaff[staffId].name}
              </p>
              <p>
                <span className="font-semibold">Subject:</span>{" "}
                {dummyStaff[staffId].subject}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Timetable Section */}
      {searched && (
        <>
          {/* Form */}
          <div className="bg-white p-6 mt-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              {editId ? "Edit Timetable Entry" : "Add Timetable Entry"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                className="border p-2 rounded-lg"
              >
                <option value="">Day</option>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                  (day) => (
                    <option key={day}>{day}</option>
                  )
                )}
              </select>
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="border p-2 rounded-lg"
              />
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="border p-2 rounded-lg"
              />
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="border p-2 rounded-lg"
              />
            </div>
            <button
              onClick={handleSaveEntry}
              className={`${
                editId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
              } text-white rounded-lg px-6 py-2`}
            >
              {editId ? "Update Entry" : "+ Add Entry"}
            </button>
          </div>

          {/* Grouped Timetable */}
          <div className="bg-white p-6 mt-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Timetable</h2>
            {Object.keys(groupedEntries).map((day) => (
              <div key={day} className="mb-6">
                <h3 className="text-md font-bold mb-2">{day}</h3>
                <table className="w-full border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2 border">Subject</th>
                      <th className="p-2 border">Start Time</th>
                      <th className="p-2 border">End Time</th>
                      <th className="p-2 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedEntries[day].map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{e.subject}</td>
                        <td className="p-2 border">{e.startTime}</td>
                        <td className="p-2 border">{e.endTime}</td>
                        <td className="p-2 border space-x-2">
                          <button
                            onClick={() => handleEdit(e)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            {entries.length === 0 && (
              <p className="text-center text-gray-400 italic">No entries yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Timetable;
