import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiEdit, FiSearch } from "react-icons/fi";

const API = "http://localhost:5000/api"; // apna backend base url

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TeacherTimetable = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [timetable, setTimetable] = useState({});

  // Load teacher dropdown
  useEffect(() => {
    axios
      .get(`${API}/staff`)
      .then((res) => {
        const payload = res.data;
        const list = Array.isArray(payload)
          ? payload
          : payload?.staff || payload?.data || [];
        setTeachers(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Error fetching teachers", err);
        setTeachers([]);
      });
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
    <div className="p-0 m-0 min-h-screen">
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        <h2 className="text-lg font-semibold mb-4">Teacher Time Table</h2>

        {/* Teacher Dropdown */}
        <div className="flex items-center gap-4 mb-4">
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="border px-3 py-2 rounded-md text-base w-64"
            disabled={teachers.length === 0}
          >
            <option value="">
              {teachers.length === 0
                ? "No teachers available"
                : "Select Teacher"}
            </option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.personalInfo?.name || "Unnamed"}{" "}
                {t.teacherCode ? `(${t.teacherCode})` : ""}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
           className="bg-blue-600 text-white px-6 py-2 rounded-md text-base hover:bg-blue-700"
           >
             <span className="inline-flex items-center gap-1">
               <FiSearch className="text-base" />
               Search
             </span>
           </button>
        </div>
      </div>

      {/* Timetable View */}
      {showTable && (
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          {DAYS.map((day) => (
            <div key={day} className="mb-6">
              <h3 className="text-sm font-semibold mb-2">{day}</h3>
              {timetable[day]?.length > 0 ? (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="p-2 border text-left">Subject</th>
                        <th className="p-2 border text-left">Class</th>
                        <th className="p-2 border text-left">Section</th>
                        <th className="p-2 border text-left">Time</th>
                        <th className="p-2 border text-left">Room No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable[day].map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-2 border text-left">
                            {row.subject?.subjectName}
                          </td>
                          <td className="p-2 border text-left">
                            {row.class?.name}
                          </td>
                          <td className="p-2 border text-left">
                            {row.section?.name}
                          </td>
                          <td className="p-2 border text-left">
                            {row.timeFrom} - {row.timeTo}
                          </td>
                          <td className="p-2 border text-left">{row.roomNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">No classes assigned</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherTimetable;
