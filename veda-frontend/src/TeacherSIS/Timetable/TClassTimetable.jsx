import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiCalendar, FiClock, FiBookOpen, FiUser } from "react-icons/fi";
import axios from "axios";

// Full 7 din
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

// Dummy timetable data
const timetableData = {
  Monday: [{ time: "9:00 AM", subject: "Math", room: "101", teacher: "Mr. Sharma" }],
  Tuesday: [{ time: "10:00 AM", subject: "Science", room: "Lab 1", teacher: "Ms. Gupta" }],
  Wednesday: [{ time: "11:00 AM", subject: "English", room: "102", teacher: "Mr. Khan" }],
  Thursday: [{ time: "8:00 AM", subject: "History", room: "103", teacher: "Mr. Verma" }],
  Friday: [{ time: "12:00 PM", subject: "Computer", room: "Lab 2", teacher: "Ms. Mehta" }],
  Saturday: [{ time: "9:00 AM", subject: "Sports", room: "Ground", teacher: "Coach Arjun" }],
  Sunday: [], // holiday
};

export default function TClassTimetable() {
  const [view, setView] = useState("Week");
  const [calendarDate, setCalendarDate] = useState(new Date());

  // State for Class & Section info (from backend)
  const [classInfo, setClassInfo] = useState({ className: "10", section: "A" });

  // Example: fetch from backend (dummy simulation)
  useEffect(() => {
    // Replace with actual API
    // axios.get("/api/class-info/10A").then((res) => setClassInfo(res.data));

    setTimeout(() => {
      setClassInfo({ className: "12", section: "B" }); // 🔄 Dummy update
    }, 2000);
  }, []);

  // Convert JS date → custom weekday
  const jsDayIndex = calendarDate.getDay(); // 0=Sunday, 6=Saturday
  const selectedDay = DAYS[jsDayIndex === 0 ? 6 : jsDayIndex - 1];

  // Current class detail (first class of selected day)
  const currentClass = timetableData[selectedDay]?.[0] || null;

  return (
    <div className="p-4 grid grid-cols-4 gap-4">
      {/* Left: Timetable */}
      <div className="col-span-3 border rounded-lg p-4 bg-white shadow flex flex-col">
        {/* Title with dynamic class info */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            Class Timetable (Class {classInfo.className} - {classInfo.section})
          </h2>
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="Day">Day</option>
            <option value="Week">Week</option>
          </select>
        </div>

        {/* Timetable Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full border-collapse border h-full">
            <thead>
              <tr>
                <th className="border px-2 py-1">Time</th>
                {view === "Day" ? (
                  <th className="border px-2 py-1">{selectedDay}</th>
                ) : (
                  DAYS.map((day) => (
                    <th key={day} className="border px-2 py-1">
                      {day}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {TIMES.map((time) => (
                <tr key={time} className="h-[80px]">
                  <td className="border px-2 py-1 flex items-center gap-1">
                    <FiClock /> {time}
                  </td>
                  {view === "Day" ? (
                    <td className="border px-2 py-1 text-center">
                      {selectedDay === "Sunday" ? (
                        <div className="bg-red-200 text-red-800 font-medium rounded p-1">
                          Holiday
                        </div>
                      ) : timetableData[selectedDay]?.find((c) => c.time === time) ? (
                        <div className="bg-blue-100 rounded p-1">
                          <div className="font-medium flex items-center gap-1">
                            <FiBookOpen />{" "}
                            {timetableData[selectedDay].find((c) => c.time === time).subject}
                          </div>
                          <div className="text-xs">
                            Room {timetableData[selectedDay].find((c) => c.time === time).room}
                          </div>
                          <div className="text-xs flex items-center gap-1 text-gray-600">
                            <FiUser />
                            {timetableData[selectedDay].find((c) => c.time === time).teacher}
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  ) : (
                    DAYS.map((day) => {
                      const classData = timetableData[day]?.find((c) => c.time === time);
                      return (
                        <td key={day} className="border px-2 py-1 text-center">
                          {day === "Sunday" ? (
                            <div className="bg-red-200 text-red-800 font-medium rounded p-1">
                              Holiday
                            </div>
                          ) : classData ? (
                            <div className="bg-blue-100 rounded p-1">
                              <div className="font-medium flex items-center gap-1">
                                <FiBookOpen /> {classData.subject}
                              </div>
                              <div className="text-xs">Room {classData.room}</div>
                              <div className="text-xs flex items-center gap-1 text-gray-600">
                                <FiUser /> {classData.teacher}
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Calendar + Current Class Detail */}
      <div className="flex flex-col gap-4">
        {/* Calendar */}
        <div className="border rounded-lg p-3 bg-gray-50 shadow">
          <h3 className="font-semibold mb-2 flex items-center gap-1">
            <FiCalendar /> Calendar
          </h3>
          <Calendar
            value={calendarDate}
            onChange={(date) => {
              setCalendarDate(date);
              setView("Day"); // ✅ calendar click hone par Day view dikhe
            }}
            className="rounded-lg w-full"
          />
        </div>

        {/* Current Class Detail */}
        <div className="border rounded-lg p-3 bg-gray-50 shadow flex-1">
          <h3 className="font-semibold mb-2">Current Class Detail</h3>
          {selectedDay === "Sunday" ? (
            <p className="text-sm text-red-600">Holiday</p>
          ) : currentClass ? (
            <>
              <p className="text-sm">Subject: {currentClass.subject}</p>
              <p className="text-sm">Room: {currentClass.room}</p>
              <p className="text-sm">Teacher: {currentClass.teacher}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">No class scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
}
