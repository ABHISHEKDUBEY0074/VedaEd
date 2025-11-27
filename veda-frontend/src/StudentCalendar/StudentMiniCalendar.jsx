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
  addMonths,
  subMonths,
} from "date-fns";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function StudentMiniCalendar({
  currentDate,
  setCurrentDate,
  onDateClick,
  holidays = [],
  selectedDate,
  events = [],
}) {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  const days = eachDayOfInterval({
    start: startOfWeek(start),
    end: endOfWeek(end),
  });

  const getEventsForDay = (day) =>
    events.filter((ev) => isSameDay(new Date(ev.date), day));

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <FiChevronLeft size={18} />
        </button>

        <h2 className="font-semibold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <FiChevronRight size={18} />
        </button>
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 text-center text-sm">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="font-medium py-1 text-gray-600">
            {d}
          </div>
        ))}

        {days.map((day, idx) => {
          const isToday = isSameDay(day, new Date());
          const sameMonth = isSameMonth(day, currentDate);
          const isHoliday = holidays.some((h) =>
            isSameDay(new Date(h.date), day)
          );
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          const todaysEvents = getEventsForDay(day);

          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                onClick={() => onDateClick(day)}
                className={`
                  cursor-pointer py-2 rounded-md mx-auto w-8 h-8 flex items-center justify-center transition
                  ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : isToday
                      ? "bg-blue-100 text-blue-700"
                      : isHoliday
                      ? "bg-red-100 text-red-700"
                      : sameMonth
                      ? "text-gray-800 hover:bg-gray-100"
                      : "text-gray-400"
                  }
                `}
              >
                {format(day, "d")}
              </div>

              {/* Event Dot */}
              {todaysEvents.length > 0 && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
