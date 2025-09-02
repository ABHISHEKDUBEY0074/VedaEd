import React, { useState } from "react";

const TeacherTimetable = () => {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showTable, setShowTable] = useState(false);

  // Dummy teachers
  const teachers = [
    { name: "Shivam Verma", code: "9002" },
    { name: "Shivam Verma ", code: "54545454" },
    { name: "Riya Sharma", code: "1234" },
  ];

  // Dummy timetable (Normally yeh Class Timetable se aayega)
  const dummyData = {
    "Shivam Verma (9002)": {
      Monday: [
        { subject: "Math", class: "Class 6", section: "A", time: "09:00 - 10:00", room: "101" },
        { subject: "Science", class: "Class 7", section: "B", time: "11:00 - 12:00", room: "102" },
      ],
      Tuesday: [
        { subject: "Math", class: "Class 8", section: "C", time: "10:00 - 11:00", room: "201" },
      ],
      Wednesday: [],
      Thursday: [
        { subject: "Physics", class: "Class 9", section: "A", time: "12:00 - 01:00", room: "202" },
      ],
      Friday: [],
      Saturday: [
        { subject: "Math", class: "Class 10", section: "B", time: "09:00 - 10:00", room: "301" },
      ],
      Sunday: [],
    },
    "Shivam Verma  (54545454)": {
      Monday: [
        { subject: "English", class: "Class 5", section: "A", time: "09:00 - 10:00", room: "104" },
      ],
      Tuesday: [
        { subject: "English", class: "Class 6", section: "B", time: "11:00 - 12:00", room: "204" },
      ],
      Wednesday: [],
      Thursday: [],
      Friday: [
        { subject: "History", class: "Class 7", section: "C", time: "10:00 - 11:00", room: "205" },
      ],
      Saturday: [],
      Sunday: [],
    },
    "Riya Sharma (1234)": {
      Monday: [],
      Tuesday: [
        { subject: "Chemistry", class: "Class 11", section: "A", time: "09:00 - 10:00", room: "401" },
      ],
      Wednesday: [
        { subject: "Chemistry", class: "Class 12", section: "B", time: "10:00 - 11:00", room: "402" },
      ],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  };

  const handleSearch = () => {
    if (selectedTeacher) {
      setShowTable(true);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Teacher Time Table</h2>

      {/* Teacher Dropdown */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="border p-2 rounded w-64"
        >
          <option value="">Select Teacher</option>
          {teachers.map((t, idx) => (
            <option key={idx} value={`${t.name} (${t.code})`}>
              {t.name} ({t.code})
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Timetable View */}
      {showTable && selectedTeacher && (
        <div className="mt-4">
          {Object.keys(dummyData[selectedTeacher]).map((day) => (
            <div key={day} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{day}</h3>
              {dummyData[selectedTeacher][day].length > 0 ? (
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Subject</th>
                      <th className="border p-2">Class</th>
                      <th className="border p-2">Section</th>
                      <th className="border p-2">Time</th>
                      <th className="border p-2">Room No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyData[selectedTeacher][day].map((row, idx) => (
                      <tr key={idx}>
                        <td className="border p-2">{row.subject}</td>
                        <td className="border p-2">{row.class}</td>
                        <td className="border p-2">{row.section}</td>
                        <td className="border p-2">{row.time}</td>
                        <td className="border p-2">{row.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No classes assigned</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherTimetable;
