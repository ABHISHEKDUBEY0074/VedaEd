import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CLASSES = [
  { id: 1, name: "Grade 10 - A", homeroom: "Ms. Sudha" },
  { id: 2, name: "Grade 9 - B", homeroom: "Mr. Singh" },
  { id: 3, name: "Grade 8 - C", homeroom: "Ms. Lee" },
];

export default function ByClass() {
  const navigate = useNavigate();
  const [backendClasses, setBackendClasses] = useState([]);
  const [classFilter, setClassFilter] = useState("");   
  const [sectionFilter, setSectionFilter] = useState(""); 

  // Fetch classes from backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/classes");
        const data = await response.json();
        setBackendClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  // Combine hard-coded + backend classes
  const allClasses = [...CLASSES, ...backendClasses];

  // 🔍 Filter classes based on Class + Section
  const filteredClasses = allClasses.filter((cls) => {
    const lowerName = cls.name.toLowerCase();

    const matchesClass = classFilter
      ? lowerName.includes(classFilter.toLowerCase())
      : true;

    const matchesSection = sectionFilter
      ? lowerName.includes(sectionFilter.toLowerCase())
      : true;

    return matchesClass && matchesSection;
  });

  return (
    <div>
      <div className="text-sm text-gray-500 mb-4">
        Attendance <span className="mx-1">›</span>{" "}
        <span className="font-medium text-gray-700">By Class</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-700 mb-6">Attendance</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Class filter */}
        <input
          type="text"
          placeholder="Enter Class (e.g. 9, 10)"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="p-3 border rounded-lg w-full"
        />

        {/* Section filter */}
        <input
          type="text"
          placeholder="Enter Section (e.g. A, B, C)"
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="p-3 border rounded-lg w-full"
        />

        {/* Date picker */}
        <input type="date" className="p-3 border rounded-lg w-full" />
      </div>

      {/* Filtered List */}
      <div className="space-y-4">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <div
              key={cls.id}
              onClick={() => navigate(`${cls.id}`)}
              className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
            >
              <div className="w-10 h-10 bg-orange-400 rounded-md mr-4"></div>
              <div>
                <h3 className="text-lg font-semibold">{cls.name}</h3>
                <p className="text-sm text-gray-500">
                  Homeroom: {cls.homeroom}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No classes found</p>
        )}
      </div>
    </div>
  );
}
