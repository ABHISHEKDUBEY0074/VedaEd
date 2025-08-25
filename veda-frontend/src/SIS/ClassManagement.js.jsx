import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";

export default function ClassManagement() {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [currentClass, setCurrentClass] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  // Dummy data for 3 classes
  const classesData = [
    {
      id: 1,
      name: "Grade 10",
      section: "A",
      teacher: "Mr. Sharma",
      strength: 35,
      academicYear: "2024-25",
      students: [
        { id: 1, name: "Aman Gupta", roll: 1, stdId: "STD001" },
        { id: 2, name: "Priya Sharma", roll: 2, stdId: "STD002" },
        { id: 3, name: "Ravi Kumar", roll: 3, stdId: "STD003" },
      ],
    },
    {
      id: 2,
      name: "Grade 9",
      section: "B",
      teacher: "Ms. Singh",
      strength: 30,
      academicYear: "2024-25",
      students: [
        { id: 1, name: "Simran Kaur", roll: 1, stdId: "STD101" },
        { id: 2, name: "Arjun Verma", roll: 2, stdId: "STD102" },
        { id: 3, name: "Rohit Yadav", roll: 3, stdId: "STD103" },
      ],
    },
    {
      id: 3,
      name: "Grade 8",
      section: "C",
      teacher: "Mrs. Mehta",
      strength: 28,
      academicYear: "2024-25",
      students: [
        { id: 1, name: "Kajal Singh", roll: 1, stdId: "STD201" },
        { id: 2, name: "Vivek Tiwari", roll: 2, stdId: "STD202" },
        { id: 3, name: "Rina Das", roll: 3, stdId: "STD203" },
      ],
    },
  ];

  const handleFilter = () => {
    const found = classesData.find(
      (cls) => cls.name === selectedClass && cls.section === selectedSection
    );
    setCurrentClass(found || null);
    setActiveTab("profile");
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const form = e.target;
    setCurrentClass({
      ...currentClass,
      name: form.name.value,
      section: form.section.value,
      teacher: form.teacher.value,
      strength: form.strength.value,
      academicYear: form.year.value,
    });
    setShowEdit(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Class Management</h2>
      <div className="flex items-center gap-4 bg-white shadow p-4 rounded mb-6">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Class</option>
          {[...new Set(classesData.map((c) => c.name))].map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Section</option>
          {[...new Set(classesData.map((c) => c.section))].map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply Filter
        </button>
      </div>
      {currentClass && (
        <>
          <div className="flex space-x-6 text-sm mb-6 border-b">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-2 ${
                activeTab === "profile"
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              Class Profile
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`pb-2 ${
                activeTab === "schedule"
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              Schedule
            </button>
          </div>
 {activeTab === "profile" && (
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Class Information</h3>
                <div className="flex gap-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
            Import
            </button>
                  <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm">
                    Export
                  </button>
                  <button
                    onClick={() => setShowEdit(true)}
                    className="flex items-center gap-1 text-sm bg-yellow-500 text-white px-3 py-1 rounded"
                  > <FiEdit2 /> Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="font-medium">Class: </span>
                  {currentClass.name}
                </p>
                <p>
                  <span className="font-medium">Section: </span>
                  {currentClass.section}
                </p>
                <p>
                  <span className="font-medium">Class Teacher: </span>
                  {currentClass.teacher}
                </p>
                <p>
                  <span className="font-medium">Strength: </span>
                  {currentClass.strength}
                </p>
                <p>
                  <span className="font-medium">Academic Year: </span>
                  {currentClass.academicYear}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Student List</h3>
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">S. No.</th>
                      <th className="p-2 border">Student ID</th>
                      <th className="p-2 border">Student Name</th>
                      <th className="p-2 border">Roll No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentClass.students.map((s, idx) => (
                      <tr key={s.id} className="text-center hover:bg-gray-50">
                        <td className="p-2 border">{idx + 1}</td>
                        <td className="p-2 border">{s.stdId}</td>
                        <td className="p-2 border">{s.name}</td>
                        <td className="p-2 border">{s.roll}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold">Class Schedule</h3>
              <p className="text-gray-500 text-sm mt-2">
                📌 Schedule management will be added here.
              </p>
            </div>
          )}
        </>
      )}
      {showEdit && currentClass && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Edit Class Info</h3>
            <form onSubmit={handleEdit} className="space-y-3">
              <input
                name="name"
                defaultValue={currentClass.name}
                placeholder="Class Name"
                className="border px-3 py-2 w-full rounded"
              />
              <input
                name="section"
                defaultValue={currentClass.section}
                placeholder="Section"
                className="border px-3 py-2 w-full rounded"
              />
              <input
                name="teacher"
                defaultValue={currentClass.teacher}
                placeholder="Class Teacher"
                className="border px-3 py-2 w-full rounded"
              />
              <input
                type="number"
                name="strength"
                defaultValue={currentClass.strength}
                placeholder="Strength"
                className="border px-3 py-2 w-full rounded"
              />
              <input
                name="year"
                defaultValue={currentClass.academicYear}
                placeholder="Academic Year"
                className="border px-3 py-2 w-full rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
