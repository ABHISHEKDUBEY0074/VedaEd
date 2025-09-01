import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const CLASS_OPTIONS = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
const SECTION_OPTIONS = ["A", "B", "C", "D"];

const TEACHERS = [
  { id: 1, name: "Ravi", code: "9002" },
  { id: 2, name: "Abhishek", code: "90006" },
  { id: 3, name: "Albert Thomas", code: "54545454" },
  { id: 4, name: "Rajesh", code: "88888888" },
];

const AssignClassTeacher = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      className: "Class 1",
      section: "A",
      teachers: ["Ravi (9002)", "Albert Thomas (54545454)"],
    },
    {
      id: 2,
      className: "Class 1",
      section: "B",
      teachers: ["Ravi (9002)", "Abhishek (90006)"],
    },
  ]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  // toggle teacher
  const handleTeacherChange = (id) => {
    if (selectedTeachers.includes(id)) {
      setSelectedTeachers(selectedTeachers.filter((t) => t !== id));
    } else {
      setSelectedTeachers([...selectedTeachers, id]);
    }
  };

  // save new record
  const handleSave = () => {
    if (!selectedClass || !selectedSection || selectedTeachers.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    const teacherNames = TEACHERS.filter((t) =>
      selectedTeachers.includes(t.id)
    ).map((t) => `${t.name} (${t.code})`);

    const newRecord = {
      id: Date.now(),
      className: selectedClass,
      section: selectedSection,
      teachers: teacherNames,
    };

    setRecords([...records, newRecord]);

    // reset
    setSelectedClass("");
    setSelectedSection("");
    setSelectedTeachers([]);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Form */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-4">Assign Class Teacher</h2>

        {/* Class */}
        <label className="block font-medium mb-1">
          Class <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        >
          <option value="">Select</option>
          {CLASS_OPTIONS.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        {/* Section */}
        <label className="block font-medium mb-1">
          Section <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        >
          <option value="">Select</option>
          {SECTION_OPTIONS.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        {/* Teacher */}
        <label className="block font-medium mb-1">
          Class Teacher <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-2 mb-3">
          {TEACHERS.map((t) => (
            <label key={t.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTeachers.includes(t.id)}
                onChange={() => handleTeacherChange(t.id)}
              />
              {t.name} ({t.code})
            </label>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

      {/* List */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-4">Class Teacher List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Class</th>
              <th className="border px-2 py-1">Section</th>
              <th className="border px-2 py-1">Class Teacher</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="border px-2 py-1">{r.className}</td>
                <td className="border px-2 py-1">{r.section}</td>
                <td className="border px-2 py-1">
                  <ul>
                    {r.teachers.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-2 py-1 text-center">
                  <button className="text-blue-500 mr-2">
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => setRecords(records.filter((x) => x.id !== r.id))}
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignClassTeacher;
