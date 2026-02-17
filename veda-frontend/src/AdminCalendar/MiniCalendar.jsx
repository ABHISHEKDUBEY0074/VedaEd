import React from "react";
import {
  format, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval,
  isSameDay, isSameMonth
} from "date-fns";

export default function MiniCalendar({ currentDate, onDateClick, holidays }) {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: startOfWeek(start),
    end: endOfWeek(end),
  });

  return (
    <div className="grid grid-cols-7 text-center text-sm">
      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
        <div key={i} className="font-medium py-1 text-gray-600">
          {d}
        </div>
      ))}
      {days.map((day, idx) => {
        const isToday = isSameDay(day, new Date());
        const sameMonth = isSameMonth(day, currentDate);
        const isHoliday = holidays.some((h) => isSameDay(h.date, day));
        return (
          <div
            key={idx}
            onClick={() => onDateClick(day)}
            className={`cursor-pointer py-2 rounded-md mx-auto w-8 transition ${
              isToday
                ? "bg-blue-600 text-white"
                : isHoliday
                ? "bg-red-100 text-red-700"
                : sameMonth
                ? "text-gray-800 hover:bg-gray-100"
                : "text-gray-400"
            }`}
          >
            {format(day, "d")}
          </div>
        );
      })}
    </div>
  );
}
