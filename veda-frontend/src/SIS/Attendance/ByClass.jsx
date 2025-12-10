import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
        if (!response.ok) return;
        const payload = await response.json();
        const list = Array.isArray(payload?.data) ? payload.data : [];
        // Expand each class into entries per section like "Class 1 - A"
        const mapped = list.flatMap((c) => {
          const className = c?.name || "";
          const sections = Array.isArray(c?.sections) ? c.sections : [];
          if (sections.length === 0) {
            return [
              {
                id: c._id,
                name: className,
                homeroom: c?.homeroom || "",
                className,
                sectionName: "",
              },
            ];
          }
          return sections.map((sec) => ({
            id: c._id,
            name: `${className} - ${sec?.name || ""}`.trim(),
            homeroom: c?.homeroom || "",
            className,
            sectionName: sec?.name || "",
          }));
        });
        setBackendClasses(mapped);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  // Use only backend classes
  const allClasses = backendClasses;

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
    <div className="p-0 m-0 min-h-screen">
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        <h2 className="text-sm font-semibold mb-4">Attendance by Class</h2>

        {/* Filters */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

  {/* Class filter */}
  <div className="flex flex-col">
    <label className="text-xs font-medium mb-1">Class</label>
    <input
      type="text"
      placeholder="Enter Class (e.g. 9, 10)"
      value={classFilter}
      onChange={(e) => setClassFilter(e.target.value)}
      className="w-full border px-3 py-2 rounded-md text-sm"
    />
  </div>

  {/* Section filter */}
  <div className="flex flex-col">
    <label className="text-xs font-medium mb-1">Section</label>
    <input
      type="text"
      placeholder="Enter Section (e.g. A, B, C)"
      value={sectionFilter}
      onChange={(e) => setSectionFilter(e.target.value)}
      className="w-full border px-3 py-2 rounded-md text-sm"
    />
  </div>

  {/* Date picker */}
  <div className="flex flex-col">
    <label className="text-xs font-medium mb-1">Date</label>
    <input
      type="date"
      className="w-full border px-3 py-2 rounded-md text-sm"
    />
  </div>

</div>
</div>


      {/* Filtered List */}
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <div className="space-y-4">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls) => (
              <div
                key={cls.id}
                onClick={() => {
                  const params = new URLSearchParams({
                    section: cls.sectionName || "",
                    class: cls.className || "",
                  });
                  navigate(`${cls.id}?${params.toString()}`);
                }}
                className="flex items-center p-4 bg-white rounded-lg border hover:bg-gray-50 cursor-pointer transition-all"
              >
                <div className="w-10 h-10 bg-orange-400 rounded-md mr-4"></div>
                <div>
                  <h3 className="text-sm font-semibold">{cls.name}</h3>
                  <p className="text-xs text-gray-500">
                    Homeroom: {cls.homeroom}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No classes found</p>
          )}
        </div>
      </div>
    </div>
    
  );
}
