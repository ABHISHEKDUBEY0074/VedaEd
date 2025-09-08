import React, { useState, useEffect } from "react"; // ✅ added useEffect
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ added axios

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

const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const SECTION_OPTIONS = ["A", "B", "C", "D"];

const SubjectGroup = () => {
  const [groups, setGroups] = useState([]); // ✅ initially empty
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  // ✅ fetch groups from backend on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subGroups/");
      if (res.data.success) {
        setGroups(res.data.data); // ✅ set groups from API
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleSectionChange = (section) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter((s) => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  const handleSubjectChange = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !selectedClass ||
      selectedSections.length === 0 ||
      selectedSubjects.length === 0
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      name: name,
      classes: selectedClass,
      sections: selectedSections,
      subjects: selectedSubjects,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/subGroups/",
        payload
      );
      if (res.data.success) {
        alert(res.data.message);
        fetchGroups(); // ✅ refresh the list after saving
        setName("");
        setSelectedClass("");
        setSelectedSections([]);
        setSelectedSubjects([]);
        setDescription("");
      }
    } catch (error) {
      console.error("Error saving group:", error);
    }
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
          placeholder="Enter subject group name"
          title="Enter the name of the subject group (e.g., Class 1st Subject Group)"
        />
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
              <tr key={g._id || g.id} className="align-top">
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
                      setGroups(groups.filter((x) => (x._id || x.id) !== (g._id || g.id)))
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
