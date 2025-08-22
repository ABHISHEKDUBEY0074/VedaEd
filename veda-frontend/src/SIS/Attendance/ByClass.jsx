import { useNavigate } from "react-router-dom";

const CLASSES = [
  { id: 1, name: "Grade 10 - A", homeroom: "Ms. Sudha" },
  { id: 2, name: "Grade 9 - B", homeroom: "Mr. Singh" },
  { id: 3, name: "Grade 8 - C", homeroom: "Ms. Lee" },
];

export default function ByClass() {
  const navigate = useNavigate();

  return (
    <div>
     
      <div className="text-sm text-gray-500 mb-4">
        Attendance <span className="mx-1">›</span> <span className="font-medium text-gray-700">By Class</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-700 mb-6">Attendance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search class name or code"
          className="p-3 border rounded-lg w-full"
        />
        <input
          type="date"
          className="p-3 border rounded-lg w-full"
        />
      </div>
      <div className="space-y-4">
        {CLASSES.map((cls) => (
          <div
            key={cls.id}
         onClick={() => navigate(`${cls.id}`)}


            className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
          >
            <div className="w-10 h-10 bg-orange-400 rounded-md mr-4"></div>
            <div>
              <h3 className="text-lg font-semibold">{cls.name}</h3>
              <p className="text-sm text-gray-500">Homeroom: {cls.homeroom}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
