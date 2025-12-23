import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiCalendar, FiClock, FiBookOpen, FiUser } from "react-icons/fi";
 import HelpInfo from "../components/HelpInfo";

// Full 7 days
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

// Dummy timetable data for parent's child
const childTimetable = {
  Monday: [{ time: "9:00 AM", subject: "Math", room: "101", teacher: "Mr. Sharma" }],
  Tuesday: [{ time: "10:00 AM", subject: "Science", room: "Lab 1", teacher: "Ms. Gupta" }],
  Wednesday: [{ time: "11:00 AM", subject: "English", room: "102", teacher: "Mr. Khan" }],
  Thursday: [{ time: "8:00 AM", subject: "History", room: "103", teacher: "Mr. Verma" }],
  Friday: [{ time: "12:00 PM", subject: "Computer", room: "Lab 2", teacher: "Ms. Mehta" }],
  Saturday: [{ time: "9:00 AM", subject: "Sports", room: "Ground", teacher: "Coach Arjun" }],
  Sunday: [],
};

export default function ParentTimetable() {
  const [view, setView] = useState("Week");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [studentInfo, setStudentInfo] = useState({ name: "Aarav Sharma", className: "10", section: "A" });

  useEffect(() => {
    // Simulate fetching child info for parent
    setTimeout(() => {
      setStudentInfo({ name: "Aarav Sharma", className: "12", section: "B" });
    }, 1000);
  }, []);

  const jsDayIndex = calendarDate.getDay(); // 0=Sunday, 6=Saturday
  const selectedDay = DAYS[jsDayIndex === 0 ? 6 : jsDayIndex - 1];
  const currentClass = childTimetable[selectedDay]?.[0] || null;

  return (
    <div className="p-0 m-0 min-h-screen">
        <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">Timetable &gt;</p>
<div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Timetable</h2>

 <HelpInfo
  title="Child's Timetable"
  description={`4.3 Child's Timetable (Weekly Schedule)

View your child's complete weekly timetable with subjects, teachers, class timings, and room details.

Sections:
- Weekly Timetable Grid: Displays day-wise and period-wise schedule
- Subject Cards: Each class period shows subject, teacher, and room information
- Calendar Widget: Navigate through different dates and weeks
- Current Class Detail: Shows details of the currently selected time slot
- Holiday Indicators: Highlight weekends or school-declared holidays
- Time Slots: Clear breakdown of hourly class periods
`}
  steps={[
    "Browse your child's weekly timetable by day and time",
    "Click on any class period to view teacher and room information",
    "Use the calendar to navigate to different dates or weeks",
    "Check the current class details for quick insights",
    "Identify holidays and non-class days easily"
  ]}
/>

</div>

      {/* Gray Wrapper */}
       <div className="p-0 grid grid-cols-4 gap-3">
        {/* Left: Timetable */}
       <div className="col-span-3 border rounded-lg p-4 bg-white shadow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              Class {studentInfo.className} - {studentInfo.section}
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
                        ) : childTimetable[selectedDay]?.find((c) => c.time === time) ? (
                          <div className="bg-blue-100 rounded p-1">
                            <div className="font-medium flex items-center gap-1">
                              <FiBookOpen />{" "}
                              {childTimetable[selectedDay].find((c) => c.time === time).subject}
                            </div>
                            <div className="text-xs">
                              Room {childTimetable[selectedDay].find((c) => c.time === time).room}
                            </div>
                            <div className="text-xs flex items-center gap-1 text-gray-600">
                              <FiUser /> {childTimetable[selectedDay].find((c) => c.time === time).teacher}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    ) : (
                      DAYS.map((day) => {
                        const classData = childTimetable[day]?.find((c) => c.time === time);
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
        <div className="flex flex-col gap-3">
          <div className="border rounded-lg p-3 bg-gray-50 shadow">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
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
            <h3 className="text-lg font-semibold mb-2">Current Class Detail</h3>
            {selectedDay === "Sunday" ? (
              <p className="text-red-600">Holiday</p>
            ) : currentClass ? (
              <>
                <p className="">Subject: {currentClass.subject}</p>
                <p className="">Room: {currentClass.room}</p>
                <p className="">Teacher: {currentClass.teacher}</p>
              </>
            ) : (
              <p className="text-gray-500">No class scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
