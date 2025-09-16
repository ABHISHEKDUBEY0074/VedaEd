import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api"; // apna backend base url

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TeacherTimetable = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [timetable, setTimetable] = useState({});

  // Load teacher dropdown
  useEffect(() => {
    axios
      .get(`${API}/staff`)
      .then((res) => setTeachers(res.data || []))
      .catch((err) => console.error("Error fetching teachers", err));
  }, []);

  //  Search handler
  const handleSearch = async () => {
    if (!selectedTeacher) {
      alert("Please select a teacher");
      return;
    }

    try {
      const res = await axios.get(`${API}/timetables`, {
        params: { teacherId: selectedTeacher },
      });

      const data = res.data?.data || [];

      // group by day
      const grouped = {};
      for (const d of DAYS) grouped[d] = [];
      data.forEach((row) => {
        grouped[row.day]?.push(row);
      });

      setTimetable(grouped);
      setShowTable(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching timetable");
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
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.personalInfo?.name} ({t.teacherCode})
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
      {showTable && (
        <div className="mt-4">
          {DAYS.map((day) => (
            <div key={day} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{day}</h3>
              {timetable[day]?.length > 0 ? (
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
                    {timetable[day].map((row, idx) => (
                      <tr key={idx}>
                        <td className="border p-2">{row.subject?.subjectName}</td>
                        <td className="border p-2">{row.class?.name}</td>
                        <td className="border p-2">{row.section?.name}</td>
                        <td className="border p-2">
                          {row.timeFrom} - {row.timeTo}
                        </td>
                        <td className="border p-2">{row.roomNo}</td>
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