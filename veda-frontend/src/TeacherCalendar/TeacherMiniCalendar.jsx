import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  subMonths,
  addMonths
} from "date-fns";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function TeacherMiniCalendar({
  currentDate,
  selectedDate,
  onDateClick,
  holidays = [],
  eventsByDay = {},
  setCurrentDate
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

  // ---- Safe holiday check function ----
  const isHoliday = (day) => {
    if (!Array.isArray(holidays)) return false;

    return holidays.some((h) => {
      if (!h || !h.date) return false;
      return isSameDay(new Date(h.date), day);
    });
  };

  return (
    <div className="select-none">

      {/* ---------- Month Header ---------- */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-1 rounded hover:bg-gray-100 text-gray-600"
        >
          <FiChevronLeft size={16} />
        </button>

        <h2 className="font-semibold text-md">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-1 rounded hover:bg-gray-100 text-gray-600"
        >
          <FiChevronRight size={16} />
        </button>
      </div>

      {/* ---------- Week Days ---------- */}
      <div className="grid grid-cols-7 text-center text-sm mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="font-medium py-1 text-gray-600">
            {d}
          </div>
        ))}
      </div>

      {/* ---------- Calendar Grid ---------- */}
      <div className="grid grid-cols-7 text-center text-sm">
        {days.map((day, idx) => {
          const today = new Date();
          const sameDay = isSameDay(day, today);
          const selected = selectedDate && isSameDay(day, selectedDate);
          const sameMonth = isSameMonth(day, currentDate);
          const holiday = isHoliday(day);

          const key = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay[key] || [];

          return (
            <div
              key={idx}
              onClick={() => onDateClick(day)}
              className={`cursor-pointer py-2 rounded-md mx-auto w-9 h-12 flex flex-col justify-between items-center transition 
                
                ${selected ? "bg-blue-600 text-white" : ""}
                ${!selected && sameDay ? "bg-blue-100 text-blue-700" : ""}
                ${!selected && !sameDay && holiday ? "bg-red-100 text-red-700" : ""}
                ${
                  !selected && !holiday && !sameDay && sameMonth
                    ? "text-gray-800 hover:bg-gray-100"
                    : ""
                }
                ${!sameMonth ? "text-gray-400" : ""}
              `}
            >
              {/* Date Number */}
              <div className="text-sm font-medium">{format(day, "d")}</div>

              {/* Event dots */}
              <div className="flex gap-[2px] justify-center h-2">
                {dayEvents.slice(0, 3).map((ev) => (
                  <span
                    key={ev.id}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: ev.color || "#2563eb" }}
                  ></span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
