import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AssignClassTeacher = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [classTeacher, setClassTeacher] = useState(null);

  // fetched data
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Edit functionality states
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editClass, setEditClass] = useState("");
  const [editSection, setEditSection] = useState("");
  const [editTeachers, setEditTeachers] = useState([]);
  const [editClassTeacher, setEditClassTeacher] = useState(null);
  const [editSections, setEditSections] = useState([]);

  // ✅ Fetch classes & teachers only (sections will load dynamically)
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/classes").then((res) => res.json()),
      fetch("http://localhost:5000/api/staff").then((res) => res.json()),
    ])
      .then(([classData, staffData]) => {
        if (classData && classData.success && Array.isArray(classData.data)) {
          setClasses(classData.data);
        }

        // ✅ Staff fetch (same as ClassTimetable)
        if (staffData && staffData.success && Array.isArray(staffData.staff)) {
          setTeachers(staffData.staff);
          return;
        }
        if (staffData && staffData.success && Array.isArray(staffData.data)) {
          setTeachers(staffData.data);
          return;
        }
        if (Array.isArray(staffData)) {
          setTeachers(staffData);
          return;
        }

        console.warn("Unexpected staff API shape:", staffData);
      })
      .catch((err) => console.error("Error fetching dropdowns:", err));
  }, []);

  // ✅ Fetch sections only when class changes
  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      setSelectedSection("");
      return;
    }

    fetch(`http://localhost:5000/api/sections?classId=${selectedClass}`)
      .then((res) => res.json())
      .then((sectionData) => {
        if (
          sectionData &&
          sectionData.success &&
          Array.isArray(sectionData.data)
        ) {
          setSections(sectionData.data);
        }
      })
      .catch((err) => console.error("Error fetching sections:", err));
  }, [selectedClass]);

  // ✅ Fetch all assigned teachers list
  useEffect(() => {
    fetchRecords();
  }, []);

  // react-select teacher options
  const teacherOptions = Array.isArray(teachers)
    ? teachers.map((t) => ({
        value: t._id,
        label: `${t.personalInfo?.name} (${t.personalInfo?.staffId})`,
      }))
    : [];

  const handleSave = () => {
    if (!selectedClass || !selectedSection || selectedTeachers.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    // ✅ API call with correct ObjectIds
    fetch("http://localhost:5000/api/assignTeachers/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classId: selectedClass,
        sectionId: selectedSection,
        teachers: selectedTeachers,
        classTeacher: classTeacher,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data saved successfully:", data);
        if (data.success) {
          // Refresh the records list
          fetchRecords();
          // reset form
          setSelectedClass("");
          setSelectedSection("");
          setSelectedTeachers([]);
          setClassTeacher(null);
        } else {
          alert(data.message || "Error saving data");
        }
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        alert("Error saving data");
      });
  };

  const fetchRecords = () => {
    fetch("http://localhost:5000/api/assignTeachers/")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          console.log("AssignTeacher API response:", data.data);
          const fetchedRecords = data.data.map((item) => ({
            id: String(item._id), // Ensure ID is a string
            className: item.class?.name || "",
            section: item.section?.name || "",
            teachers: Array.isArray(item.teachers)
              ? item.teachers.map(
                  (t) =>
                    `${t.personalInfo?.name} (${t.personalInfo?.staffId})${
                      item.classTeacher &&
                      item.classTeacher?.personalInfo?.staffId ===
                        t.personalInfo?.staffId
                        ? " ⭐"
                        : ""
                    }`
                )
              : [],
            // Store original data for editing
            originalData: item,
          }));
          console.log("Fetched records:", fetchedRecords);
          setRecords(fetchedRecords);
        }
      })
      .catch((err) => console.error("Error fetching records:", err));
  };

  const handleEdit = (record) => {
    const originalData = record.originalData;
    console.log("Editing record:", record);
    console.log("Original data:", originalData);

    setIsEditing(true);
    setEditingRecord(originalData);
    setEditClass(originalData.class._id);
    setEditSection(originalData.section._id);
    setEditTeachers(originalData.teachers.map((t) => t._id));
    setEditClassTeacher(originalData.classTeacher._id);

    // Load sections for the selected class
    fetch(
      `http://localhost:5000/api/sections?classId=${originalData.class._id}`
    )
      .then((res) => res.json())
      .then((sectionData) => {
        if (
          sectionData &&
          sectionData.success &&
          Array.isArray(sectionData.data)
        ) {
          setEditSections(sectionData.data);
        }
      })
      .catch((err) => console.error("Error fetching sections:", err));
  };

  const handleUpdate = () => {
    if (!editClass || !editSection || editTeachers.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    console.log("Updating record with ID:", editingRecord._id);

    fetch(`http://localhost:5000/api/assignTeachers/${editingRecord._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classId: editClass,
        sectionId: editSection,
        teachers: editTeachers,
        classTeacher: editClassTeacher,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data updated successfully:", data);
        if (data.success) {
          // Refresh the records list
          fetchRecords();
          // Close edit mode
          setIsEditing(false);
          setEditingRecord(null);
          setEditClass("");
          setEditSection("");
          setEditTeachers([]);
          setEditClassTeacher(null);
          setEditSections([]);
        } else {
          alert(data.message || "Error updating data");
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        alert("Error updating data");
      });
  };

  const handleDelete = (record) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      console.log("Deleting record:", record);
      console.log("Record ID:", record.id);
      console.log("Record ID type:", typeof record.id);
      console.log(
        "Record ID length:",
        record.id ? record.id.length : "undefined"
      );

      // Also check originalData
      if (record.originalData) {
        console.log("Original data ID:", record.originalData._id);
        console.log("Original data ID type:", typeof record.originalData._id);
      }

      // Use record.id if available, otherwise fallback to originalData._id
      const deleteId = String(
        record.id || (record.originalData && record.originalData._id)
      );
      console.log("Using delete ID:", deleteId);

      fetch(`http://localhost:5000/api/assignTeachers/${deleteId}`, {
        method: "DELETE",
      })
        .then((response) => {
          console.log("Response status:", response.status);
          return response.json();
        })
        .then((data) => {
          console.log("Data deleted successfully:", data);
          if (data.success) {
            // Refresh the records list
            fetchRecords();
          } else {
            alert(data.message || "Error deleting data");
          }
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
          alert("Error deleting data");
        });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingRecord(null);
    setEditClass("");
    setEditSection("");
    setEditTeachers([]);
    setEditClassTeacher(null);
    setEditSections([]);
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      {/* Form */}
      <div className="border p-4 rounded">
        <h2 className="text-lg font-bold mb-4">Assign Class Teacher</h2>

        <label className="block font-medium mb-1">
          Class <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        >
          <option value="">Select</option>
          {Array.isArray(classes) &&
            classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
        </select>

        <label className="block font-medium mb-1">
          Section <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        >
          <option value="">Select</option>
          {Array.isArray(sections) &&
            sections.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.name}
              </option>
            ))}
        </select>

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

        {selectedTeachers.length > 0 && (
          <>
            <label className="block font-medium mb-1">
              Mark Class Teacher <span className="text-red-500">*</span>
            </label>
            <select
              value={classTeacher || ""}
              onChange={(e) => setClassTeacher(e.target.value)}
              className="border w-full p-2 rounded mb-3"
            >
              <option value="">Select Class Teacher</option>
              {selectedTeachers.map((id) => {
                const t = teachers.find((x) => x._id === id);
                return (
                  <option key={id} value={id}>
                    {t?.personalInfo?.name} ({t?.personalInfo?.staffId})
                  </option>
                );
              })}
            </select>
          </>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="border p-4 rounded mt-4 bg-blue-50">
          <h2 className="text-lg font-bold mb-4">
            Edit Class Teacher Assignment
          </h2>

          <label className="block font-medium mb-1">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            value={editClass}
            onChange={(e) => {
              setEditClass(e.target.value);
              setEditSection("");
              setEditSections([]);

              // Fetch sections for the selected class
              if (e.target.value) {
                fetch(
                  `http://localhost:5000/api/sections?classId=${e.target.value}`
                )
                  .then((res) => res.json())
                  .then((sectionData) => {
                    if (
                      sectionData &&
                      sectionData.success &&
                      Array.isArray(sectionData.data)
                    ) {
                      setEditSections(sectionData.data);
                    }
                  })
                  .catch((err) =>
                    console.error("Error fetching sections:", err)
                  );
              }
            }}
            className="border w-full p-2 rounded mb-3"
          >
            <option value="">Select</option>
            {Array.isArray(classes) &&
              classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
          </select>

          <label className="block font-medium mb-1">
            Section <span className="text-red-500">*</span>
          </label>
          <select
            value={editSection}
            onChange={(e) => setEditSection(e.target.value)}
            className="border w-full p-2 rounded mb-3"
          >
            <option value="">Select</option>
            {Array.isArray(editSections) &&
              editSections.map((sec) => (
                <option key={sec._id} value={sec._id}>
                  {sec.name}
                </option>
              ))}
          </select>

          <label className="block font-medium mb-1">
            Teachers <span className="text-red-500">*</span>
          </label>
          <Select
            isMulti
            options={teacherOptions}
            value={teacherOptions.filter((opt) =>
              editTeachers.includes(opt.value)
            )}
            onChange={(selected) =>
              setEditTeachers(selected.map((s) => s.value))
            }
            placeholder="Search & select teachers..."
            className="mb-3"
          />

          {editTeachers.length > 0 && (
            <>
              <label className="block font-medium mb-1">
                Mark Class Teacher <span className="text-red-500">*</span>
              </label>
              <select
                value={editClassTeacher || ""}
                onChange={(e) => setEditClassTeacher(e.target.value)}
                className="border w-full p-2 rounded mb-3"
              >
                <option value="">Select Class Teacher</option>
                {editTeachers.map((id) => {
                  const t = teachers.find((x) => x._id === id);
                  return (
                    <option key={id} value={id}>
                      {t?.personalInfo?.name} ({t?.personalInfo?.staffId})
                    </option>
                  );
                })}
              </select>
            </>
          )}

          {/* Edit Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

     {/* List */}
<div className="border p-4 rounded mt-6 bg-white shadow-sm">
  <h2 className="text-lg font-bold mb-4">Class Teacher List</h2>
  <div className="overflow-x-auto">
    <table className="table-auto w-full border-collapse">
      <thead>
        <tr className="bg-gray-100 text-gray-700 text-sm">
          <th className="border px-4 py-2 text-left">Class</th>
          <th className="border px-4 py-2 text-left">Section</th>
          <th className="border px-4 py-2 text-left">Teachers</th>
          <th className="border px-4 py-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(records) && records.length > 0 ? (
          records.map((r) => (
            <tr
              key={r.id}
              className="border-b hover:bg-gray-50 transition-all"
            >
              <td className="border px-4 py-2 align-middle font-medium text-gray-800">
                {r.className}
              </td>
              <td className="border px-4 py-2 align-middle text-gray-700">
                {r.section}
              </td>

              {/* Teachers inline badges */}
              <td className="border px-4 py-2 align-middle">
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(r.teachers) &&
                    r.teachers.map((t, i) => (
                      <span
                        key={i}
                        className={`${
                          t.includes("⭐")
                            ? "bg-yellow-100 text-yellow-700 font-semibold"
                            : "bg-green-100 text-green-700"
                        } text-xs px-2 py-1 rounded-full flex items-center gap-1`}
                      >
                        {t.includes("⭐") && (
                          <FaStar className="text-yellow-500" />
                        )}
                        {t.replace("⭐", "").trim()}
                      </span>
                    ))}
                </div>
              </td>

              {/* Actions */}
              <td className="border px-4 py-2 text-center align-middle">
                <button
                  onClick={() => handleEdit(r)}
                  className="text-blue-600 hover:text-blue-800 mx-1"
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(r)}
                  className="text-red-600 hover:text-red-800 mx-1"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4 text-gray-500">
              No records found.
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
          onClick={() => navigate("/classes-schedules/timetable")}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default AssignClassTeacher;
