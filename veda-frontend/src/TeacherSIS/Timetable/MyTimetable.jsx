

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiBookOpen, FiBell, FiCalendar, FiClock } from "react-icons/fi";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

// Dummy timetable data
const timetableData = {
  Monday: [{ time: "9:00 AM", subject: "Math", room: "101" }],
  Tuesday: [{ time: "10:00 AM", subject: "Science", room: "Lab 1" }],
  Wednesday: [{ time: "11:00 AM", subject: "English", room: "102" }],
  Thursday: [{ time: "8:00 AM", subject: "History", room: "103" }],
  Friday: [{ time: "12:00 PM", subject: "Computer", room: "Lab 2" }],
  Saturday: [{ time: "9:00 AM", subject: "Sports", room: "Ground" }],
  Sunday: [], // Holiday
};

export default function MyTimetable() {
  const [view, setView] = useState("Week"); 
  const [calendarDate, setCalendarDate] = useState(new Date());

  
  let selectedDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    calendarDate.getDay()
  ];

  return (
    <div className="p-0 grid grid-cols-4 gap-4">
      {/* Left: Timetable */}
      <div className="col-span-3 border rounded-lg p-4 bg-white shadow flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
           
            {view === "Day" ? `Timetable (${selectedDay})` : "Weekly Timetable"}
          </h2>
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="border  px-2 py-1 rounded"
          >
            <option value="Day">Day</option>
            <option value="Week">Week</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full  border-collapse border h-full">
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
            <tbody className="h-full">
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
                        <div className="bg-blue-200 rounded p-1">
                          <div className="font-medium flex items-center gap-1">
                            <FiBookOpen />{" "}
                            {timetableData[selectedDay].find((c) => c.time === time).subject}
                          </div>
                          <div className="text-xs">
                            Room {timetableData[selectedDay].find((c) => c.time === time).room}
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
                            <div className="bg-blue-200 rounded p-1">
                              <div className="font-medium flex items-center gap-1">
                                <FiBookOpen /> {classData.subject}
                              </div>
                              <div className="text-xs">Room {classData.room}</div>
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

      {/* Right: Calendar + Upcoming + Notifications */}
      <div className="flex flex-col gap-4">
        {/* Calendar */}
        <div className="border rounded-lg p-3 bg-gray-50 shadow w-full overflow-visible">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
            Calendar
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

        <div className="border rounded-lg p-3 bg-gray-50 shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
            <FiBookOpen /> Upcoming Class
          </h3>
          <p className="">Math - Room 101 at 9:00 AM</p>
        </div>

        <div className="border rounded-lg p-3 bg-gray-50 shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-1">
            <FiBell /> Notifications
          </h3>
          <ul className=" list-disc ml-4">
            <li>Substitution period in class 7 A at 12:00 PM</li>
            
          </ul>
        </div>
      </div>
    </div>
  );
}
