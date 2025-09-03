import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dummy Data
const dummyClasses = [
  {
    id: 1,
    name: "Class 1",
    sections: [
      { id: "A", capacity: 60, teacher: "Mr. Sharma", room: "101" },
      { id: "B", capacity: 60, teacher: "Ms. Gupta", room: "102" },
      { id: "C", capacity: 60, teacher: "Mr. Verma", room: "103" },
      { id: "D", capacity: 60, teacher: "Ms. Mehta", room: "104" },
    ],
  },
  {
    id: 2,
    name: "Class 2",
    sections: [
      { id: "A", capacity: 60, teacher: "Mr. Singh", room: "201" },
      { id: "B", capacity: 60, teacher: "Ms. Rani", room: "202" },
      { id: "C", capacity: 60, teacher: "Mr. Khan", room: "203" },
    ],
  },
];

const Classes   = () => {
  const [classInput, setClassInput] = useState("");
  const [sectionInput, setSectionInput] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const navigate = useNavigate();

  // Apply filter button
  const handleApplyFilter = () => {
    setSearchClass(classInput);
    setSearchSection(sectionInput);
  };

  // Filtered Classes
  const filteredClasses = dummyClasses
    .map((cls) => {
      // Class filter
      const classMatch =
        searchClass === "" ||
        cls.name.toLowerCase().includes(searchClass.toLowerCase());

      if (!classMatch) return null;

      // Section filter
      let filteredSections = cls.sections;
      if (searchSection !== "") {
        filteredSections = cls.sections.filter((sec) =>
          sec.id.toLowerCase().includes(searchSection.toLowerCase())
        );
      }

      if (filteredSections.length === 0) return null;

      return { ...cls, sections: filteredSections };
    })
    .filter(Boolean);

  return (
    <div className="p-4">
      

      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search class"
          value={classInput}
          onChange={(e) => setClassInput(e.target.value)}
          className="border p-2 rounded w-48"
        />
        <input
          type="text"
          placeholder="Search section"
          value={sectionInput}
          onChange={(e) => setSectionInput(e.target.value)}
          className="border p-2 rounded w-48"
        />

        <button
          onClick={handleApplyFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
       

        <button
          onClick={() => navigate("/classes-schedules/add-class")}
          className="ml-auto border border-blue-500 text-blue-500 px-4 py-2 rounded"
        >
          + Add Class
        </button>
        <button
          onClick={() => navigate("/classes-schedules/add-subject")}
          className="border border-blue-500 text-blue-500 px-4 py-2 rounded"
        >
          + Add Subject
        </button>
      </div>

      {/* Class Cards */}
      {filteredClasses.map((cls) => (
        <div key={cls.id} className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">{cls.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cls.sections.map((sec) => (
              <div
                key={sec.id}
                className="border rounded p-4 flex flex-col justify-between"
              >
                <div>
                  <p className="text-blue-600 font-medium">Section {sec.id}</p>
                  <p className="font-semibold">Capacity: {sec.capacity}</p>
                  <p>Class Teacher: {sec.teacher || "N/A"}</p>
                  <p>Room: {sec.room || "N/A"}</p>
                </div>
                <button
                  onClick={() => navigate(`/classes-schedules/class-detail/${cls.id}/${sec.id}`)}
                  className="mt-4 bg-blue-500 text-white px-3 py-2 rounded"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredClasses.length === 0 && (
        <p className="text-gray-500">No classes found.</p>
      )}
     <div className="absolute bottom-4 right-4">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700"
          onClick={() => navigate("/classes-schedules/add-class")}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Classes;
