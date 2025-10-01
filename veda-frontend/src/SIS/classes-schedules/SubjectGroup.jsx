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
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
    fetchDropdownData();
  }, []);

  // Fetch sections when class changes
  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      setSelectedSections([]);
      return;
    }

    axios
      .get(`http://localhost:5000/api/sections?classId=${selectedClass}`)
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setSections(res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });
  }, [selectedClass]);

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
      const [classRes, subjectRes] = await Promise.all([
        axios.get("http://localhost:5000/api/classes"),
        axios.get("http://localhost:5000/api/subjects"),
      ]);
      setClasses(classRes.data.data);
      setSubjects(subjectRes.data.data);
      // Don't fetch sections here - they will be fetched when class is selected
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
      name,
      classes: selectedClass,
      sections: selectedSections,
      subjects: selectedSubjects,
    };

    try {
      let res;
      if (editId) {
        // Update existing group
        res = await axios.put(
          `http://localhost:5000/api/subGroups/${editId}`,
          payload
        );
      } else {
        // Create new group
        res = await axios.post("http://localhost:5000/api/subGroups/", payload);
      }

      if (res.data.success) {
        alert(res.data.message);
        fetchGroups();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving group:", error);
      alert(error.response?.data?.message || "Failed to save group");
    }
  };

  const resetForm = () => {
    setName("");
    setSelectedClass("");
    setSelectedSections([]);
    setSelectedSubjects([]);
    setEditId(null);
  };

  const handleEdit = (group) => {
    setName(group.name);
    setSelectedClass(group.classes._id);
    setSelectedSections(group.sections.map((s) => s._id));
    setSelectedSubjects(group.subjects.map((s) => s._id));
    setEditId(group._id);

    // Fetch sections for the selected class
    axios
      .get(`http://localhost:5000/api/sections?classId=${group.classes._id}`)
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setSections(res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject group?")) {
      try {
        const res = await axios.delete(
          `http://localhost:5000/api/subGroups/${id}`
        );
        if (res.data.success) {
          alert(res.data.message);
          fetchGroups();
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        alert(error.response?.data?.message || "Failed to delete group");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      {/* Left Form */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-4">
          {editId ? "Edit Subject Group" : "Add Subject Group"}
        </h2>
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
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setSelectedSections([]); // Clear selected sections when class changes
          }}
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
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Save"}
          </button>
          {editId && (
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Right List */}
<div className="border p-4 rounded mt-6 bg-white shadow-sm">
  <h2 className="text-lg font-bold mb-4">Subject Group List</h2>
  <div className="overflow-x-auto">
    <table className="table-auto w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 text-gray-700 text-sm">
          <th className="border px-4 py-2 text-left">Name</th>
          <th className="border px-4 py-2 text-left">Class</th>
          <th className="border px-4 py-2 text-left">Sections</th>
          <th className="border px-4 py-2 text-left">Subjects</th>
          <th className="border px-4 py-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {groups.length > 0 ? (
          groups.map((g) => {
            const groupId = g._id || g.id;
            return (
              <tr
                key={groupId}
                className="border-b hover:bg-gray-50 transition-all"
              >
                <td className="border px-4 py-2 align-middle font-medium text-gray-800">
                  {g.name}
                </td>
                <td className="border px-4 py-2 align-middle text-gray-700">
                  {g.classes?.name}
                </td>

                {/* Sections inline badges */}
                <td className="border px-4 py-2 align-middle">
                  <div className="flex flex-wrap gap-1">
                    {g.sections.map((s) => (
                      <span
                        key={s._id}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Subjects inline badges */}
                <td className="border px-4 py-2 align-middle">
                  <div className="flex flex-wrap gap-1">
                    {g.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                      >
                        {sub.subjectName}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Action buttons */}
                <td className="border px-4 py-2 text-center align-middle">
                  <button
                    onClick={() => handleEdit(g)}
                    className="text-blue-600 hover:text-blue-800 mx-1"
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(groupId)}
                    className="text-red-600 hover:text-red-800 mx-1"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4 text-gray-500">
              No subject groups found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
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
