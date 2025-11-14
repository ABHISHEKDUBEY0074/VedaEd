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

import TeacherMiniCalendar from "./TeacherMiniCalendar";
import TeacherEventSidebar from "./TeacherEventSidebar";

/* ---------- storage helpers ---------- */
const LS_KEY = "teachercalendar_events_v1";
function loadEvents() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return arr.map((ev) => ({
      ...ev,
      // support older shape where start/end may be saved as date string or date-only 'date'
      start: ev.start ? new Date(ev.start) : new Date(ev.date),
      end: ev.end ? new Date(ev.end) : new Date(ev.date),
    }));
  } catch {
    return [];
  }
}
function saveEvents(events) {
  try {
    const serializable = events.map((e) => ({
      ...e,
      start: e.start instanceof Date ? e.start.toISOString() : e.start,
      end: e.end instanceof Date ? e.end.toISOString() : e.end,
      // also keep legacy 'date' for simple renders (optional)
      date: e.start ? e.start.toString() : e.date,
    }));
    localStorage.setItem(LS_KEY, JSON.stringify(serializable));
  } catch (e) {
    console.warn("save failed", e);
  }
}
function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ---------- type colors ---------- */
const TYPE_COLORS = {
  Meeting: "bg-green-600",
  Holiday: "bg-red-600",
  Task: "bg-yellow-600",
  Reminder: "bg-indigo-600",
  Other: "bg-blue-600",
};

export default function TeacherAnnualCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Month"); // Day | Week | Month | Year
  const [events, setEvents] = useState(() => loadEvents());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [holidays] = useState([
    { date: new Date(2025, 0, 26), title: "Republic Day" },
    { date: new Date(2025, 7, 15), title: "Independence Day" },
  ]);

  useEffect(() => saveEvents(events), [events]);

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

  /* ---------- open create (prefill slot/date) ---------- */
  const openCreateSidebar = (prefillDate = new Date()) => {
    const start = startOfDay(prefillDate);
    const s = prefillDate.getHours() || prefillDate.getMinutes() ? new Date(prefillDate) : setHours(start, 9);
    const e = new Date(s.getTime() + 60 * 60 * 1000);
    setEditingEvent({
      id: null,
      title: "",
      type: "Meeting",
      start: s,
      end: e,
      description: "",
      attendees: "",
      location: "",
      allDay: false,
      visibility: "Default visibility",
      busyStatus: "Busy",
      notification: "30 minutes before",
    });
    setSelectedDate(prefillDate);
    setIsSidebarOpen(true);
  };

  const openEditSidebar = (ev) => {
    setEditingEvent({ ...ev });
    setSelectedDate(ev.start || ev.date);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setEditingEvent(null);
    setSelectedDate(null);
  };

  /* ---------- save & delete ---------- */
  const handleSaveEvent = (payload) => {
    if (!payload.title) {
      alert("Title is required");
      return;
    }
    if (payload.id) {
      setEvents((prev) => prev.map((e) => (e.id === payload.id ? { ...payload } : e)));
    } else {
      setEvents((prev) => [{ ...payload, id: uid() }, ...prev]);
    }
    closeSidebar();
  };

  const handleDeleteEvent = (id) => {
    if (!id) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
    closeSidebar();
  };

  /* ---------- helper map for mini calendar dots & month rendering ---------- */
  const eventsByDay = useMemo(() => {
    const map = {};
    for (const ev of events) {
      const key = format(ev.start || new Date(ev.date), "yyyy-MM-dd");
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  /* ---------- simple inline views (replace missing external view components) ---------- */

  function DayViewInline() {
    const day = selectedDate || currentDate;
    const list = events.filter((ev) => isSameDay(new Date(ev.start), day));
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">Day — {format(day, "PPP")}</h3>
        {list.length === 0 ? (
          <p className="text-gray-500">No events for this day.</p>
        ) : (
          <ul className="space-y-3">
            {list.map((ev) => (
              <li key={ev.id} className="p-3 border rounded-md">
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
            const dayEvents = events.filter((ev) => isSameDay(new Date(ev.start), d));
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
                className={`min-h-[80px] border p-2 rounded cursor-pointer ${
                  isToday ? "bg-blue-50" : ""
                } ${holiday ? "bg-red-50" : ""} ${!sameMonth ? "opacity-60" : ""}`}
                onClick={() => {
                  setSelectedDate(day);
                  setView("Day");
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
                        openEditSidebar(ev);
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
          const monthEvents = events.filter((ev) => format(new Date(ev.start), "yyyy-MM") === monthKey);
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

        <TeacherMiniCalendar
          currentDate={currentDate}
          onDateClick={(d) => {
            setCurrentDate(d);
            setView("Day");
          }}
          holidays={holidays}
          eventsByDay={eventsByDay}
        />

        <button
          onClick={() => openCreateSidebar(currentDate)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md px-4 py-2 mt-4 w-full"
        >
          <FiPlus /> Create Event
        </button>

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

            <button onClick={() => openCreateSidebar(currentDate)} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
              <FiPlus /> Create
            </button>
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

      {/* Sidebar for create/edit */}
      {isSidebarOpen && editingEvent && (
        <TeacherEventSidebar
  initial={editingEvent}
  selectedDate={selectedDate}
  onClose={closeSidebar}
  onSave={handleSaveEvent}
  onDelete={handleDeleteEvent}
  typeColors={TYPE_COLORS}   // <-- YEH ADD KARO
/>

      )}
    </div>
  );
}
