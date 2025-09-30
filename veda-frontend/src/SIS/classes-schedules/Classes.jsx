import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Classes = () => {
  const [classInput, setClassInput] = useState("");
  const [sectionInput, setSectionInput] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [searchSection, setSearchSection] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch classes from backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/classes");
        const data = await response.json();
        if (data.success) {
          setClasses(data.data);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Apply filter button
  const handleApplyFilter = () => {
    setSearchClass(classInput);
    setSearchSection(sectionInput);
  };

  // Filtered Classes
  const filteredClasses = classes
    .map((cls) => {
      // Class filter
      const classMatch =
        searchClass === "" ||
        cls.name.toLowerCase().includes(searchClass.toLowerCase());

      if (!classMatch) return null;

      // Section filter
      let filteredSections = cls.sections || [];
      if (searchSection !== "") {
        filteredSections = (cls.sections || []).filter((sec) =>
          sec.name.toLowerCase().includes(searchSection.toLowerCase())
        );
      }

      if (filteredSections.length === 0) return null;

      return { ...cls, sections: filteredSections };
    })
    .filter(Boolean);

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
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
      {loading ? (
        <p className="text-gray-500">Loading classes...</p>
      ) : (
        <>
          {filteredClasses.map((cls) => (
            <div key={cls._id} className="mb-6 bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">{cls.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {cls.sections.map((sec) => (
                  <div
                    key={sec._id}
                    className="border rounded p-4 flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-blue-600 font-medium">
                        Section {sec.name}
                      </p>
                      <p className="font-semibold">
                        Capacity: {cls.capacity || "N/A"}
                      </p>
                      <p>Class Teacher: N/A</p>
                      <p>Room: N/A</p>
                    </div>
                    <button
                      onClick={() =>
                        navigate(
                          `/classes-schedules/class-detail/${cls._id}/${sec._id}`
                        )
                      }
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
        </>
      )}
    </div>
  );
};

export default Classes;
