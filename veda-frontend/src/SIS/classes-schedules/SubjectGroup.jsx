import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

// Dummy data
const DUMMY_GROUPS = [
  {
    id: 1,
    name: "Class 1st Subject Group",
    classes: ["Class 1(A)", "Class 1(B)", "Class 1(C)", "Class 1(D)"],
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
    classes: ["Class 2(A)", "Class 2(B)", "Class 2(C)", "Class 2(D)"],
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

const CLASS_OPTIONS = [
  "Class 1(A)",
  "Class 1(B)",
  "Class 1(C)",
  "Class 1(D)",
  "Class 2(A)",
  "Class 2(B)",
  "Class 2(C)",
  "Class 2(D)",
  "Class 3(A)",
  "Class 3(B)",
  "Class 3(C)",
  "Class 3(D)",
  "Class 4(A)",
  "Class 4(B)",
  "Class 4(C)",
  "Class 4(D)",
];

const SubjectGroup = () => {
  const [groups, setGroups] = useState(DUMMY_GROUPS);
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [description, setDescription] = useState("");

  // Toggle subject checkbox
  const handleSubjectChange = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Toggle section checkbox
  const handleSectionChange = (section) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter((s) => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
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
      classes: selectedSections,
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

        <label className="block font-medium mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        />

        <label className="block font-medium mb-1">
          Class <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        >
          <option value="">Select</option>
          {CLASS_OPTIONS.map((cls, i) => (
            <option key={i} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <label className="block font-medium mb-1">
          Sections <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {CLASS_OPTIONS.filter((c) =>
            c.includes(selectedClass.split(" ")[1])
          ).map((sec) => (
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

        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

      {/* Right List */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-4">Subject Group List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Class (Section)</th>
              <th className="border px-2 py-1">Subject</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id} className="align-top">
                <td className="border px-2 py-1">{g.name}</td>
                <td className="border px-2 py-1">
                  <ul>
                    {g.classes.map((cls, i) => (
                      <li key={i}>{cls}</li>
                    ))}
                  </ul>
                </td>
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
    </div>
  );
};

export default SubjectGroup;
