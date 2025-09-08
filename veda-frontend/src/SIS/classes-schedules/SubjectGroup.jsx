import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CLASS_OPTIONS = [];  
const SECTION_OPTIONS = [];
const SUBJECT_OPTIONS = []; 

const SubjectGroup = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
    fetchDropdownData();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subGroups/");
      if (res.data.success) {
        setGroups(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [classRes, sectionRes, subjectRes] = await Promise.all([
        axios.get("http://localhost:5000/api/classes"),
        axios.get("http://localhost:5000/api/sections"),
        axios.get("http://localhost:5000/api/subjects"),
      ]);
      setClasses(classRes.data.data);
      setSections(sectionRes.data.data);
      setSubjects(subjectRes.data.data);
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    }
  };

  const handleSectionChange = (id) => {
    if (selectedSections.includes(id)) {
      setSelectedSections(selectedSections.filter((s) => s !== id));
    } else {
      setSelectedSections([...selectedSections, id]);
    }
  };

  const handleSubjectChange = (id) => {
    if (selectedSubjects.includes(id)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== id));
    } else {
      setSelectedSubjects([...selectedSubjects, id]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !selectedClass || selectedSections.length === 0 || selectedSubjects.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      name,
      classes: selectedClass,
      sections: selectedSections,
      subjects: selectedSubjects,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/subGroups/", payload);
      if (res.data.success) {
        alert(res.data.message);
        fetchGroups();
        setName("");
        setSelectedClass("");
        setSelectedSections([]);
        setSelectedSubjects([]);
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
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        {selectedClass && (
          <>
            <label className="block font-medium mb-1">
              Sections <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {sections.map((sec) => (
                <label key={sec._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(sec._id)}
                    onChange={() => handleSectionChange(sec._id)}
                  />
                  {sec.name}
                </label>
              ))}
            </div>
          </>
        )}

        <label className="block font-medium mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {subjects.map((sub) => (
            <label key={sub._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSubjects.includes(sub._id)}
                onChange={() => handleSubjectChange(sub._id)}
              />
              {sub.subjectName}
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
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
                <td className="border px-2 py-1">{g.classes?.name}</td>
                <td className="border px-2 py-1">{g.sections.map((s) => s.name).join(", ")}</td>
                <td className="border px-2 py-1">
                  <ul>
                    {g.subjects.map((sub, i) => (
                      <li key={i}>{sub.subjectName}</li>
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
