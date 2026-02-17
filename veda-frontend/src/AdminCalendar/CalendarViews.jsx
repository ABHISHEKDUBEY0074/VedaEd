// src/AdminCalendar/CalendarViews.jsx
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
  startOfDay,
  setHours,
  setMinutes,
} from "date-fns";

/* ---------------- MonthView ---------------- */
export function MonthView({ currentDate, events = [], holidays = [], eventsByDay = {}, onDayClick = () => {}, onEventClick = () => {} }) {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: startOfWeek(start),
    end: endOfWeek(end),
  });

  return (
    <div className="grid grid-cols-7 border-t border-l">
      {days.map((day, i) => {
        const sameMonth = isSameMonth(day, currentDate);
        const today = isSameDay(day, new Date());
        const isHoliday = holidays.some((h) => isSameDay(h.date, day));
        const key = format(day, "yyyy-MM-dd");
        const dayEvents = eventsByDay[key] || [];

        return (
          <div key={i} onClick={() => onDayClick(day)} className={`h-32 border-b border-r p-2 cursor-pointer transition-colors ${today ? "bg-blue-50 border-blue-300" : isHoliday ? "bg-red-50" : sameMonth ? "bg-white hover:bg-gray-50" : "bg-gray-100"}`}>
            <div className={`text-sm ${sameMonth ? "text-gray-800" : "text-gray-400"} font-medium`}>{format(day, "d")}</div>

            <div className="mt-2 space-y-1 overflow-hidden max-h-20">
              {dayEvents.slice(0, 3).map((ev) => (
                <div key={ev.id} onClick={(e) => { e.stopPropagation(); onEventClick(ev); }} className={`text-xs ${ev.type ? (ev.type === "Holiday" ? "bg-red-600" : "bg-blue-600") : "bg-blue-600"} text-white rounded px-1 py-0.5 truncate`}>
                  {format(ev.start, "p")} {ev.title}
                </div>
              ))}
              {dayEvents.length > 3 && <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- WeekView ---------------- */
export function WeekView({ currentDate, events = [], onSlotClick = () => {}, onEventClick = () => {} }) {
  const start = startOfWeek(currentDate);
  const end = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start, end });

  // group events by day
  const byDay = {};
  for (const ev of events) {
    const key = format(ev.start, "yyyy-MM-dd");
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(ev);
  }

  return (
    <div className="grid grid-cols-7 border-t border-l">
      {days.map((day, i) => {
        const key = format(day, "yyyy-MM-dd");
        const dayEvents = byDay[key] || [];
        return (
          <div key={i} className={`h-80 border-b border-r p-2 relative`}>
            <div className="font-semibold text-sm mb-2">{format(day, "EEE d")}</div>

            <div className="space-y-2 overflow-auto h-[calc(100%-40px)]">
              {dayEvents.length === 0 ? (
                <div className="text-xs text-gray-400">No events</div>
              ) : (
                dayEvents.map((ev) => (
                  <div key={ev.id} onClick={() => onEventClick(ev)} className={`text-sm ${ev.type ? (ev.type === "Holiday" ? "bg-red-600" : "bg-blue-600") : "bg-blue-600"} text-white rounded px-2 py-1 truncate cursor-pointer`}>
                    <div className="font-medium text-xs">{format(ev.start, "p")} - {format(ev.end, "p")}</div>
                    <div className="text-xs">{ev.title}</div>
                  </div>
                ))
              )}
            </div>

            <button onClick={() => onSlotClick(day)} className="absolute bottom-2 right-2 text-xs px-2 py-1 border rounded bg-white">+ Add</button>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- DayView (timeline) ---------------- */
export function DayView({ currentDate, events = [], onSlotClick = () => {}, onEventClick = () => {} }) {
  const startHour = 5;
  const endHour = 23;
  const hours = [];
  for (let h = startHour; h <= endHour; h++) hours.push(h);

  const minutesFromStart = (date) => (date.getHours() * 60 + date.getMinutes()) - startHour * 60;
  const dayEvents = events.filter((ev) => isSameDay(ev.start, currentDate));

  return (
    <div className="flex-1 h-full overflow-auto bg-white">
      <div className="p-4 border-b bg-white">
        <h2 className="text-2xl font-semibold">{format(currentDate, "EEEE, MMMM d, yyyy")}</h2>
      </div>

      <div className="flex" style={{ minHeight: "calc(100vh - 120px)" }}>
        <div className="w-20 border-r bg-gray-50">
          <div className="h-12"></div>
          {hours.map((h) => <div key={h} className="h-16 text-xs text-right pr-2 text-gray-500">{`${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? "AM" : "PM"}`}</div>)}
        </div>

        <div className="flex-1 relative">
          <div className="h-12"></div>

          {hours.map((h) => (
            <div key={h} onClick={() => onSlotClick(setMinutes(setHours(startOfDay(currentDate), h), 0))} className="h-16 border-b border-gray-100 hover:bg-gray-50 cursor-pointer" />
          ))}

          {dayEvents.map((ev) => {
            const totalMinutes = (endHour - startHour + 1) * 60;
            let topMin = minutesFromStart(ev.start);
            let bottomMin = minutesFromStart(ev.end);
            if (bottomMin <= 0 || topMin >= totalMinutes) return null;
            topMin = Math.max(0, topMin);
            bottomMin = Math.min(totalMinutes, bottomMin);
            const topPct = (topMin / totalMinutes) * 100;
            const heightPct = ((bottomMin - topMin) / totalMinutes) * 100;
            const colorClass = ev.type ? (ev.type === "Holiday" ? "bg-red-600" : "bg-blue-600") : "bg-blue-600";

            return (
              <div key={ev.id} onClick={() => onEventClick(ev)} className={`${colorClass} absolute left-4 right-4 text-white rounded p-2 text-sm shadow cursor-pointer`} style={{ top: `calc(${topPct}% + 0px)`, height: `calc(${heightPct}% - 4px)`, overflow: "hidden" }}>
                <div className="font-semibold truncate">{ev.title}</div>
                <div className="text-xs opacity-90">{format(ev.start, "p")} — {format(ev.end, "p")}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- YearView ---------------- */
export function YearView({ currentDate, holidays = [], onMonthClick = () => {}, eventsByDay = {}, onEventClick = () => {} }) {
  const months = Array.from({ length: 12 }, (_, i) => startOfMonth(new Date(currentDate.getFullYear(), i)));

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {months.map((month, i) => (
        <div key={i} className="border rounded-lg shadow-sm hover:shadow-md transition bg-white cursor-pointer" onClick={() => onMonthClick(month)}>
          <div className="p-2 border-b font-semibold text-center bg-gray-50">{format(month, "MMMM")}</div>
          <div className="p-3">
            <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
              {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-center font-medium">{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {eachDayOfInterval({ start: month, end: endOfMonth(month) }).map((day, idx) => {
                const key = format(day,"yyyy-MM-dd");
                const cnt = eventsByDay[key] ? eventsByDay[key].length : 0;
                const isHoliday = holidays.some(h => isSameDay(h.date, day));
                return (
                  <div key={idx} className={`py-1 rounded ${isHoliday ? "text-red-600 font-medium" : ""}`}>
                    <div>{format(day,"d")}</div>
                    {cnt > 0 && <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full mx-auto" />}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 text-xs text-gray-500">Click to open month</div>
          </div>
        </div>
      ))}
    </div>
  );
}