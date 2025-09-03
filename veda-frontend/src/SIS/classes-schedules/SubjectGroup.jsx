import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // ✅ add this

// Dummy data
const DUMMY_GROUPS = [
  {
    id: 1,
    name: "Class 1st Subject Group",
    className: "Class 1",
    sections: ["A", "B"],
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Drawing",
      "Computer",
      "Elective 1",
    ],
    description: "",
  },
  {
    id: 2,
    name: "Class 2nd Subject Group",
    className: "Class 2",
    sections: ["A", "C"],
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Drawing",
      "Computer",
      "Elective 1",
    ],
    description: "",
  },
];

const SUBJECT_OPTIONS = [
  "English",
  "Hindi",
  "Mathematics",
  "Science",
  "Social Studies",
  "French",
  "Drawing",
  "Computer",
  "Elective 1",
  "Elective 2",
  "Elective 3",
];

// Classes 1–12
const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

// Sections A–D
const SECTION_OPTIONS = ["A", "B", "C", "D"];

const SubjectGroup = () => {
  const [groups, setGroups] = useState(DUMMY_GROUPS);
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [description, setDescription] = useState("");

  const navigate = useNavigate(); // ✅ for redirect

  // Toggle section checkbox
  const handleSectionChange = (section) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter((s) => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  // Toggle subject checkbox
  const handleSubjectChange = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = () => {
    if (
      !name ||
      !selectedClass ||
      selectedSections.length === 0 ||
      selectedSubjects.length === 0
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newGroup = {
      id: Date.now(),
      name,
      className: selectedClass,
      sections: selectedSections,
      subjects: selectedSubjects,
      description,
    };

    setGroups([...groups, newGroup]);

    // reset
    setName("");
    setSelectedClass("");
    setSelectedSections([]);
    setSelectedSubjects([]);
    setDescription("");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Left Form */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-4">Add Subject Group</h2>

        {/* Group Name */}
        <label className="block font-medium mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 rounded mb-3"
          placeholder="Enter subject group name"
          title="Enter the name of the subject group (e.g., Class 1st Subject Group)"
        />

        {/* Class */}
        <label className="block font-medium mb-1">
          Class <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        >
          <option value="">Select Class</option>
          {CLASS_OPTIONS.map((cls, i) => (
            <option key={i} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        {/* Sections */}
        {selectedClass && (
          <>
            <label className="block font-medium mb-1">
              Sections <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {SECTION_OPTIONS.map((sec) => (
                <label key={sec} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(sec)}
                    onChange={() => handleSectionChange(sec)}
                  />
                  {sec}
                </label>
              ))}
            </div>
          </>
        )}

        {/* Subjects */}
        <label className="block font-medium mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {SUBJECT_OPTIONS.map((subj) => (
            <label key={subj} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSubjects.includes(subj)}
                onChange={() => handleSubjectChange(subj)}
              />
              {subj}
            </label>
          ))}
        </div>

        {/* Description */}
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>

        </div>
      </div>

      {/* Right List */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-4">Subject Group List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Class</th>
              <th className="border px-2 py-1">Sections</th>
              <th className="border px-2 py-1">Subjects</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id} className="align-top">
                <td className="border px-2 py-1">{g.name}</td>
                <td className="border px-2 py-1">{g.className}</td>
                <td className="border px-2 py-1">{g.sections.join(", ")}</td>
                <td className="border px-2 py-1">
                  <ul>
                    {g.subjects.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-2 py-1 text-center">
                  <button className="text-blue-500 mr-2">
                    <FiEdit />
                  </button>
                  <button
                    onClick={() =>
                      setGroups(groups.filter((x) => x.id !== g.id))
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
      <div className="absolute bottom-4 right-4">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700"
          onClick={() => navigate("/classes-schedules/assign-teacher")}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default SubjectGroup;
