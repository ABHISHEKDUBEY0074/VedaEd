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
        if (sectionData && sectionData.success && Array.isArray(sectionData.data)) {
          setSections(sectionData.data);
        }
      })
      .catch((err) => console.error("Error fetching sections:", err));
  }, [selectedClass]);

  // ✅ Fetch all assigned teachers list
  useEffect(() => {
    fetch("http://localhost:5000/api/assignTeachers/")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          console.log("AssignTeacher API response:", data.data);
          // const fetchedRecords = data.data.map((item) => ({
          //   id: item._id,
          //   className: item.class?.name || "",
          //   section: item.section?.name || "",
          //   teachers: (item.teachers || []).map(
          //     (t) =>
          //       `${t.personalInfo?.name} (${t.personalInfo?.staffId})${
          //         item.classTeacher &&
          //         item.classTeacher?.personalInfo?.staffId ===
          //           t.personalInfo?.staffId
          //           ? " ⭐"
          //           : ""
          //       }`
          //   ),
          // }));
          const fetchedRecords = data.data.map((item) => ({
            id: item._id,
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
          }));
          setRecords(fetchedRecords);
        }
      })
      .catch((err) => console.error("Error fetching records:", err));
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

    // ✅ Prepare names for table UI
    const teacherNames = selectedTeachers.map((id) => {
      const teacher = teachers.find((t) => t._id === id);
      if (!teacher) return "";
      return `${teacher.personalInfo?.name} (${teacher.personalInfo?.staffId})${
        id === classTeacher ? " ⭐" : ""
      }`;
    });

    const newRecord = {
      id: Date.now(),
      className:
        classes.find((c) => c._id === selectedClass)?.name || selectedClass,
      section:
        sections.find((s) => s._id === selectedSection)?.name ||
        selectedSection,
      teachers: teacherNames,
    };

    setRecords([...records, newRecord]);

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
      })
      .catch((error) => {
        console.error("Error saving data:", error);
      });

    // reset form
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
            {Array.isArray(records) &&
              records.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="border px-2 py-1">{r.className}</td>
                  <td className="border px-2 py-1">{r.section}</td>
                  <td className="border px-2 py-1">
                    <ul>
                      {Array.isArray(r.teachers) &&
                        r.teachers.map((t, i) => (
                          <li key={i}>
                            {t.includes("⭐") ? (
                              <span className="font-bold text-yellow-600 flex items-center gap-1">
                                <FaStar className="text-yellow-500" />{" "}
                                {t.replace("⭐", "")}
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
