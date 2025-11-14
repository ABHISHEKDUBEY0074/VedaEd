import React, { useEffect, useMemo, useState } from "react";
import {
  format,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfDay,
  setHours,
} from "date-fns";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";

import StudentMiniCalendar from "./StudentMiniCalendar";
import StudentEventSidebar from "./StudentEventSidebar";

/* ---------- storage helper (READ-ONLY loading from same key) ---------- */
const LS_KEY = "teachercalendar_events_v1";
function loadEvents() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return arr.map((ev) => ({
      ...ev,
      start: ev.start ? new Date(ev.start) : ev.date ? new Date(ev.date) : null,
      end: ev.end ? new Date(ev.end) : ev.date ? new Date(ev.date) : null,
    }));
  } catch {
    return [];
  }
}

/* ---------- type colors (same map for UI consistency) ---------- */
const TYPE_COLORS = {
  Meeting: "bg-green-600",
  Holiday: "bg-red-600",
  Task: "bg-yellow-600",
  Reminder: "bg-indigo-600",
  Other: "bg-blue-600",
};

export default function StudentAnnualCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Month"); // Day | Week | Month | Year
  const [events, setEvents] = useState(() => loadEvents());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [holidays] = useState([
    { date: new Date(2025, 0, 26), title: "Republic Day" },
    { date: new Date(2025, 7, 15), title: "Independence Day" },
  ]);

  // No saving for students — read-only

  /* ---------- navigation ---------- */
  const goPrev = () => {
    if (view === "Month") setCurrentDate((d) => subMonths(d, 1));
    else if (view === "Year") setCurrentDate((d) => subYears(d, 1));
    else setCurrentDate((d) => subDays(d, 7));
  };
  const goNext = () => {
    if (view === "Month") setCurrentDate((d) => addMonths(d, 1));
    else if (view === "Year") setCurrentDate((d) => addYears(d, 1));
    else setCurrentDate((d) => addDays(d, 7));
  };

  /* ---------- open read-only sidebar (no editing) ---------- */
  const openEventSidebar = (ev) => {
    setSelectedEvent({ ...ev });
    setSelectedDate(ev.start || ev.date);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  /* ---------- helper map for mini calendar dots & month rendering ---------- */
  const eventsByDay = useMemo(() => {
    const map = {};
    for (const ev of events) {
      const key = ev.start ? format(new Date(ev.start), "yyyy-MM-dd") : ev.date ? format(new Date(ev.date), "yyyy-MM-dd") : null;
      if (!key) continue;
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  /* ---------- simple inline views (read-only displays) ---------- */
  function DayViewInline() {
    const day = selectedDate || currentDate;
    const list = events.filter((ev) => ev.start && isSameDay(new Date(ev.start), day));
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">Day — {format(day, "PPP")}</h3>
        {list.length === 0 ? (
          <p className="text-gray-500">No events for this day.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((ev) => (
              <li key={ev.id || ev.title} className="p-3 border rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{ev.title}</div>
                    <div className="text-sm text-gray-600">{ev.location}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {ev.start ? format(new Date(ev.start), "HH:mm") : ""}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-700">{ev.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  function WeekViewInline() {
    const start = startOfWeek(currentDate);
    const days = eachDayOfInterval({ start, end: addDays(start, 6) });
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">Week of {format(start, "PPP")}</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const dayEvents = events.filter((ev) => ev.start && isSameDay(new Date(ev.start), d));
            return (
              <div key={d} className="p-2 border rounded">
                <div className="font-medium">{format(d, "EEE d")}</div>
                <div className="text-xs text-green-600 mt-1">{dayEvents.length} event(s)</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function MonthViewInline() {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });
    return (
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 text-sm">
          {days.map((day, idx) => {
            const isToday = isSameDay(day, new Date());
            const sameMonth = isSameMonth(day, currentDate);
            const holiday = holidays.find((h) => isSameDay(h.date, day));
            const dayEvents = eventsByDay[format(day, "yyyy-MM-dd")] || [];
            return (
              <div
                key={idx}
                className={`min-h-[80px] border p-2 rounded cursor-pointer ${isToday ? "bg-blue-50" : ""} ${holiday ? "bg-red-50" : ""} ${!sameMonth ? "opacity-60" : ""}`}
                onClick={() => {
                  // on date click: if events exist, open Day view & select date, else nothing
                  if ((eventsByDay[format(day, "yyyy-MM-dd")] || []).length > 0) {
                    setSelectedDate(day);
                    setView("Day");
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="text-xs font-semibold">{format(day, "d")}</div>
                  {holiday && <div className="text-xs text-red-600">{holiday.title}</div>}
                </div>

                <div className="mt-2 space-y-1 text-xs">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className="truncate"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEventSidebar(ev);
                      }}
                    >
                      ● {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function YearViewInline() {
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1));
    return (
      <div className="p-4 grid grid-cols-3 gap-4">
        {months.map((m) => {
          const monthKey = format(m, "yyyy-MM");
          const monthEvents = events.filter((ev) => ev.start && format(new Date(ev.start), "yyyy-MM") === monthKey);
          return (
            <div
              key={monthKey}
              className="border rounded p-3 bg-white cursor-pointer"
              onClick={() => {
                setCurrentDate(m);
                setView("Month");
              }}
            >
              <div className="font-semibold text-center">{format(m, "MMMM yyyy")}</div>
              <div className="text-sm text-green-600 mt-2">{monthEvents.length} event(s)</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: mini sidebar */}
      <div className="w-64 bg-white shadow-md p-4 border-r overflow-auto">
        <h2 className="text-lg font-semibold mb-2">Mini Calendar</h2>

        <StudentMiniCalendar
          currentDate={currentDate}
          onDateClick={(d) => {
            setCurrentDate(d);
            setView("Day");
          }}
          holidays={holidays}
          eventsByDay={eventsByDay}
        />

        {/* Create visible but disabled for students */}
       
        <div className="mt-6">
          <h3 className="font-medium mb-2 text-gray-700 text-sm">Gazetted Holidays</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            {holidays.map((h, i) => (
              <li key={i}>
                {format(h.date, "MMM d")}: <b>{h.title}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 bg-white shadow">
          <div className="flex items-center gap-2">
            <button onClick={goPrev} className="p-2 rounded hover:bg-gray-100 text-gray-600">
              <FiChevronLeft size={18} />
            </button>
            <button onClick={goNext} className="p-2 rounded hover:bg-gray-100 text-gray-600">
              <FiChevronRight size={18} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="ml-2 px-3 py-1 bg-gray-100 text-sm rounded hover:bg-gray-200"
            >
              Today
            </button>

            <h2 className="text-xl font-semibold ml-3">
              {view === "Year" ? format(currentDate, "yyyy") : format(currentDate, "MMMM yyyy")}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <select value={view} onChange={(e) => setView(e.target.value)} className="border rounded-md px-3 py-1 text-sm">
              <option>Day</option>
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
            </select>

            
          </div>
        </div>

        {/* Views */}
        <div className="flex-1 overflow-auto bg-white">
          {view === "Day" && <DayViewInline />}
          {view === "Week" && <WeekViewInline />}
          {view === "Month" && <MonthViewInline />}
          {view === "Year" && <YearViewInline />}
        </div>
      </div>

      {/* Sidebar for read-only view */}
      {isSidebarOpen && selectedEvent && (
        <StudentEventSidebar
          initial={selectedEvent}
          selectedDate={selectedDate}
          onClose={closeSidebar}
          typeColors={TYPE_COLORS}
        />
      )}
    </div>
  );
}
