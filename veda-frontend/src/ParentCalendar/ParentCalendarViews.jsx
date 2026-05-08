import React from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
} from "date-fns";

/* ---------- helpers ---------- */
const typeColor = (type) => {
  switch (type) {
    case "Holiday":
      return "bg-red-500";
    case "Exam":
      return "bg-pink-500";
    case "Assignment":
      return "bg-blue-500";
    case "Activity":
      return "bg-green-500";
    case "Timetable":
      return "bg-gray-500";
    default:
      return "bg-indigo-500";
  }
};

/* ================= MONTH VIEW ================= */
export function ParentMonthView({
  currentDate,
  eventsByDay = {},
  holidays = [],
  onDayClick = () => {},
  onEventClick = () => {},
}) {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  const days = eachDayOfInterval({
    start: startOfWeek(start),
    end: endOfWeek(end),
  });

  return (
    <div className="grid grid-cols-7 border-t border-l bg-white rounded-lg overflow-hidden">
      {days.map((day, i) => {
        const key = format(day, "yyyy-MM-dd");
        const dayEvents = eventsByDay[key] || [];
        const sameMonth = isSameMonth(day, currentDate);
        const isHoliday = holidays.some((h) =>
          isSameDay(h.date, day)
        );

        return (
          <div
            key={i}
            onClick={() => onDayClick(day)}
            className={`
              min-h-[140px]
              border-b border-r
              p-2.5 cursor-pointer
              transition-colors
              ${!sameMonth
                ? "bg-gray-50"
                : "bg-white hover:bg-gray-50"}
              ${isHoliday ? "bg-red-50" : ""}
            `}
          >
            <div className="flex justify-between items-center">
              <span
                className={`
                  text-sm font-semibold
                  ${sameMonth ? "" : "text-gray-400"}
                `}
              >
                {format(day, "d")}
              </span>

              {dayEvents.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200">
                  {dayEvents.length}
                </span>
              )}
            </div>

            <div className="mt-3 space-y-1.5">
              {dayEvents.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(ev);
                  }}
                  className={`
                    ${typeColor(ev.type)}
                    text-white text-xs
                    px-2 py-1
                    rounded-md truncate
                  `}
                >
                  {ev.title}
                </div>
              ))}

              {dayEvents.length > 3 && (
                <div className="text-[10px] text-gray-500 pl-1">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= WEEK VIEW ================= */
export function ParentWeekView({
  currentDate,
  events = [],
  onEventClick = () => {},
}) {
  const start = startOfWeek(currentDate);
  const end = endOfWeek(currentDate);

  const days = eachDayOfInterval({ start, end });

  const byDay = {};

  events.forEach((ev) => {
    const key = format(ev.start, "yyyy-MM-dd");

    byDay[key] = byDay[key] || [];
    byDay[key].push(ev);
  });

  return (
    <div className="grid grid-cols-7 border-t border-l bg-white rounded-lg overflow-hidden">
      {days.map((day) => {
        const key = format(day, "yyyy-MM-dd");
        const list = byDay[key] || [];

        return (
          <div
            key={key}
            className="border-b border-r p-3 h-80 overflow-auto"
          >
            <div className="font-semibold text-sm mb-3">
              {format(day, "EEE d")}
            </div>

            {list.length === 0 ? (
              <div className="text-xs text-gray-400">
                No events
              </div>
            ) : (
              <div className="space-y-2">
                {list.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => onEventClick(ev)}
                    className={`
                      ${typeColor(ev.type)}
                      text-white rounded-lg
                      p-2.5 cursor-pointer
                    `}
                  >
                    <div className="text-xs font-semibold">
                      {format(ev.start, "p")} –{" "}
                      {format(ev.end, "p")}
                    </div>

                    <div className="text-xs truncate mt-1">
                      {ev.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ================= DAY VIEW ================= */
export function ParentDayView({
  currentDate,
  events = [],
  onEventClick = () => {},
}) {
  const startHour = 6;
  const endHour = 22;

  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => i + startHour
  );

  const dayEvents = events.filter((ev) =>
    isSameDay(ev.start, currentDate)
  );

  const minutesFromStart = (d) =>
    d.getHours() * 60 +
    d.getMinutes() -
    startHour * 60;

  const totalMinutes =
    (endHour - startHour + 1) * 60;

  return (
    <div className="flex border rounded-lg overflow-hidden bg-white">
      <div className="w-20 border-r bg-gray-50">
        {hours.map((h) => (
          <div
            key={h}
            className="h-16 text-xs text-right pr-3 text-gray-500 pt-1"
          >
            {h % 12 || 12} {h < 12 ? "AM" : "PM"}
          </div>
        ))}
      </div>

      <div className="flex-1 relative">
        {hours.map((h) => (
          <div key={h} className="h-16 border-b" />
        ))}

        {dayEvents.map((ev) => {
          const top =
            (minutesFromStart(ev.start) / totalMinutes) * 100;

          const height =
            ((minutesFromStart(ev.end) -
              minutesFromStart(ev.start)) /
              totalMinutes) *
            100;

          return (
            <div
              key={ev.id}
              onClick={() => onEventClick(ev)}
              className={`
                ${typeColor(ev.type)}
                absolute left-2 right-2
                text-white rounded-lg
                p-2 text-xs cursor-pointer
              `}
              style={{
                top: `${top}%`,
                height: `${height}%`,
              }}
            >
              <div className="font-semibold truncate">
                {ev.title}
              </div>

              <div className="opacity-90 mt-1">
                {format(ev.start, "p")} –{" "}
                {format(ev.end, "p")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= YEAR VIEW ================= */
export function ParentYearView({
  currentDate,
  eventsByDay = {},
  onMonthClick = () => {},
}) {
  const months = Array.from(
    { length: 12 },
    (_, i) =>
      startOfMonth(
        new Date(currentDate.getFullYear(), i)
      )
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-1">
      {months.map((month) => {
        const days = eachDayOfInterval({
          start: month,
          end: endOfMonth(month),
        });

        return (
          <div
            key={month}
            onClick={() => onMonthClick(month)}
            className="
              border rounded-xl
              hover:shadow-md
              cursor-pointer
              bg-white
              transition-shadow
              overflow-hidden
            "
          >
            <div className="p-3 text-center font-semibold bg-gray-50 border-b">
              {format(month, "MMMM")}
            </div>

            <div className="grid grid-cols-7 gap-1 p-3 text-xs">
              {days.map((d) => {
                const key = format(d, "yyyy-MM-dd");

                return (
                  <div
                    key={key}
                    className="text-center py-1"
                  >
                    {format(d, "d")}

                    {eventsByDay[key] && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}