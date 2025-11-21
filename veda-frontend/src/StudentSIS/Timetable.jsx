import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiCalendar, FiClock, FiBookOpen, FiUser } from "react-icons/fi";
import HelpInfo from "../components/HelpInfo";

// Full 7 din
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

// Dummy timetable data for student
const studentTimetable = {
  Monday: [{ time: "9:00 AM", subject: "Math", room: "101", teacher: "Mr. Sharma" }],
  Tuesday: [{ time: "10:00 AM", subject: "Science", room: "Lab 1", teacher: "Ms. Gupta" }],
  Wednesday: [{ time: "11:00 AM", subject: "English", room: "102", teacher: "Mr. Khan" }],
  Thursday: [{ time: "8:00 AM", subject: "History", room: "103", teacher: "Mr. Verma" }],
  Friday: [{ time: "12:00 PM", subject: "Computer", room: "Lab 2", teacher: "Ms. Mehta" }],
  Saturday: [{ time: "9:00 AM", subject: "Sports", room: "Ground", teacher: "Coach Arjun" }],
  Sunday: [], // holiday
};

export default function StudentTimetable() {
  const [view, setView] = useState("Week");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [classInfo, setClassInfo] = useState({ className: "10", section: "A" });

  useEffect(() => {
    // Simulate fetching student class info
    setTimeout(() => {
      setClassInfo({ className: "12", section: "B" });
    }, 1000);
  }, []);

  const jsDayIndex = calendarDate.getDay(); // 0=Sunday, 6=Saturday
  const selectedDay = DAYS[jsDayIndex === 0 ? 6 : jsDayIndex - 1];
  const currentClass = studentTimetable[selectedDay]?.[0] || null;

  return (
     <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumb + Heading */}
      <p className="text-gray-500 text-sm mb-2">Timetable &gt;</p>
                                                                                       <div className="flex items-center justify-between mb-6">

  <h2 className="text-2xl font-bold">My Timetable</h2>



  <HelpInfo

    title="Staff Module Help"

    description="This module allows you to manage all staff records, login access, roles, and other information."

    steps={[

      "Use All Staff tab to view and manage staff details.",

      "Use Manage Login tab to update login credentials.",

      "Use Others tab for additional staff-related tools."

    ]}

  />

</div>

      {/* Gray Wrapper */}
      <div className="bg-gray-200 p-6 rounded-lg shadow-sm border border-gray-100">
       
       
      {/* Left: Timetable */}
      <div className="col-span-3 border rounded-lg p-4 bg-white shadow flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            My Timetable (Class {classInfo.className} - {classInfo.section})
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

        <div className="overflow-x-auto flex-1">
          <table className="w-full border-collapse border h-full">
            <thead>
              <tr>
                <th className="border px-2 py-1">Time</th>
                {view === "Day" ? (
                  <th className="border px-2 py-1">{selectedDay}</th>
                ) : (
                  DAYS.map((day) => (
                    <th key={day} className="border px-2 py-1">{day}</th>
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
                      ) : studentTimetable[selectedDay]?.find((c) => c.time === time) ? (
                        <div className="bg-blue-100 rounded p-1">
                          <div className="font-medium flex items-center gap-1">
                            <FiBookOpen />{" "}
                            {studentTimetable[selectedDay].find((c) => c.time === time).subject}
                          </div>
                          <div className="text-xs">
                            Room {studentTimetable[selectedDay].find((c) => c.time === time).room}
                          </div>
                          <div className="text-xs flex items-center gap-1 text-gray-600">
                            <FiUser /> {studentTimetable[selectedDay].find((c) => c.time === time).teacher}
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  ) : (
                    DAYS.map((day) => {
                      const classData = studentTimetable[day]?.find((c) => c.time === time);
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
        <div className="border rounded-lg p-3 bg-gray-50 shadow">
          <h3 className="font-semibold mb-2 flex items-center gap-1">
            <FiCalendar /> Calendar
          </h3>
          <Calendar
            value={calendarDate}
            onChange={(date) => {
              setCalendarDate(date);
              setView("Day");
            }}
            className="rounded-lg w-full"
          />
        </div>

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
    </div>
    
  );
}
