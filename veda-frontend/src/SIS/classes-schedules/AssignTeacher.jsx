import React, { useState } from "react";
import Select from "react-select";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const CLASS_OPTIONS = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
const SECTION_OPTIONS = ["A", "B", "C", "D"];

const TEACHERS = [
  { id: 1, name: "Ravi", code: "9002" },
  { id: 2, name: "Abhishek", code: "90006" },
  { id: 3, name: "Albert Thomas", code: "54545454" },
  { id: 4, name: "Rajesh", code: "88888888" },
];

const teacherOptions = TEACHERS.map((t) => ({
  value: t.id,
  label: `${t.name} (${t.code})`,
}));

const AssignClassTeacher = ({ setActiveTab }) => {
  const [records, setRecords] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [classTeacher, setClassTeacher] = useState(null);

  const handleSave = () => {
    if (!selectedClass || !selectedSection || selectedTeachers.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    const teacherNames = selectedTeachers.map((id) => {
      const teacher = TEACHERS.find((t) => t.id === id);
      if (!teacher) return "";
      return `${teacher.name} (${teacher.code})${id === classTeacher ? " ⭐" : ""}`;
    });

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
    setClassTeacher(null);
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

        {/* Teachers */}
        <label className="block font-medium mb-1">
          Teachers <span className="text-red-500">*</span>
        </label>
        <Select
          isMulti
          options={teacherOptions}
          value={teacherOptions.filter((opt) =>
            selectedTeachers.includes(opt.value)
          )}
          onChange={(selected) =>
            setSelectedTeachers(selected.map((s) => s.value))
          }
          placeholder="Search & select teachers..."
          className="mb-3"
        />

        {/* Pick Class Teacher */}
        {selectedTeachers.length > 0 && (
          <>
            <label className="block font-medium mb-1">
              Mark Class Teacher <span className="text-red-500">*</span>
            </label>
            <select
              value={classTeacher || ""}
              onChange={(e) => setClassTeacher(Number(e.target.value))}
              className="border w-full p-2 rounded mb-3"
            >
              <option value="">Select Class Teacher</option>
              {selectedTeachers.map((id) => {
                const t = TEACHERS.find((x) => x.id === id);
                return (
                  <option key={id} value={id}>
                    {t?.name} ({t?.code})
                  </option>
                );
              })}
            </select>
          </>
        )}
       {/* Buttons */}
      {/* Buttons */}
<div className="flex gap-3">
  <button
    onClick={handleSave}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Save
  </button>
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded"
    onClick={() => setActiveTab("timetable")}
  >
    Next
  </button>
</div>

      </div>

      {/* List */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-4">Class Teacher List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Class</th>
              <th className="border px-2 py-1">Section</th>
              <th className="border px-2 py-1">Teachers</th>
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
                      <li key={i}>
                        {t.includes("⭐") ? (
                          <span className="font-bold text-yellow-600 flex items-center gap-1">
                            <FaStar className="text-yellow-500" /> {t.replace("⭐", "")}
                          </span>
                        ) : (
                          t
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border px-2 py-1 text-center">
                  <button className="text-blue-500 mr-2">
                    <FiEdit />
                  </button>
                  <button
                    onClick={() =>
                      setRecords(records.filter((x) => x.id !== r.id))
                    }
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
