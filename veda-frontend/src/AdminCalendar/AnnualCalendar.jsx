// src/AdminCalendar/AnnualCalendar.jsx
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
  setMinutes,
} from "date-fns";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";

import MiniCalendar from "./MiniCalendar";
import { DayView, WeekView, MonthView, YearView } from "./CalendarViews";
import EventSidebar from "./EventSidebar";

/* ---------- storage helpers (same approach as before) ---------- */
const LS_KEY = "admincalendar_events_v2";
function loadEvents() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return arr.map((ev) => ({
      ...ev,
      start: new Date(ev.start),
      end: new Date(ev.end),
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
    }));
    localStorage.setItem(LS_KEY, JSON.stringify(serializable));
  } catch (e) {
    console.warn("save failed", e);
  }
}
function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ---------- type colors (same as your large file) ---------- */
const TYPE_COLORS = {
  Meeting: "bg-green-600",
  Holiday: "bg-red-600",
  Task: "bg-yellow-600",
  Reminder: "bg-indigo-600",
  Other: "bg-blue-600",
};

export default function AnnualCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Month");
  const [events, setEvents] = useState(() => loadEvents());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // event object for edit OR new
  const [selectedDate, setSelectedDate] = useState(null);

  const [holidays] = useState([
    { date: new Date(2025, 0, 26), title: "Republic Day" },
    { date: new Date(2025, 7, 15), title: "Independence Day" },
    { date: new Date(2025, 9, 2), title: "Gandhi Jayanti" },
    { date: new Date(2025, 10, 14), title: "Children’s Day" },
    { date: new Date(2026, 0, 2), title: "Amar Bhaiya BDay" },
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
    const s =
      prefillDate.getHours() || prefillDate.getMinutes()
        ? new Date(prefillDate)
        : setHours(start, 9);
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
    setSelectedDate(ev.start);
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
      // small inline alert; you had alert in original code
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
      const key = format(ev.start, "yyyy-MM-dd");
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left: mini sidebar */}
      <div className="w-64 bg-white shadow-md p-4 border-r overflow-auto">
        <h2 className="text-lg font-semibold mb-2">Mini Calendar</h2>

        <MiniCalendar
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
          {view === "Day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              onSlotClick={(slot) => openCreateSidebar(slot)}
              onEventClick={(ev) => openEditSidebar(ev)}
            />
          )}

          {view === "Week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onSlotClick={(slot) => openCreateSidebar(slot)}
              onEventClick={(ev) => openEditSidebar(ev)}
            />
          )}

          {view === "Month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              holidays={holidays}
              eventsByDay={eventsByDay}
              onDayClick={(d) => {
                setCurrentDate(d);
                setView("Day");
              }}
              onEventClick={(ev) => openEditSidebar(ev)}
            />
          )}

          {view === "Year" && (
            <YearView
              currentDate={currentDate}
              holidays={holidays}
              eventsByDay={eventsByDay}
              onMonthClick={(m) => {
                setCurrentDate(m);
                setView("Month");
              }}
              onEventClick={(ev) => openEditSidebar(ev)}
            />
          )}
        </div>
      </div>

      {/* Sidebar for create/edit */}
      {isSidebarOpen && editingEvent && (
        <EventSidebar
          initial={editingEvent}
          selectedDate={selectedDate}
          onClose={closeSidebar}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          typeColors={TYPE_COLORS}
        />
      )}
    </div>
  );
}
<<<<<<< HEAD

/* ---------------- Mini Calendar ---------------- */
function MiniCalendar({ currentDate, onDateClick, holidays }) {
  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: startOfWeek(start),
    end: endOfWeek(end),
  });

  return (
    <div className="grid grid-cols-7 text-center text-sm">
      {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
        <div key={d} className="font-medium py-1 text-gray-600">
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
            title={
              isHoliday
                ? holidays.find((h) => isSameDay(h.date, day)).title
                : ""
            }
            className={`cursor-pointer py-2 rounded-md mx-auto w-8 transition ${
              isToday
                ? "bg-blue-600 text-white"
                : isHoliday
                ? "bg-red-100 text-red-700 font-medium"
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

/* ---------------- Month View ---------------- */
function MonthView({ currentDate, events, holidays, onDayClick }) {
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
        return (
          <div
            key={i}
            onClick={() => onDayClick(day)}
            className={`h-32 border-b border-r p-2 cursor-pointer transition-colors ${
              today
                ? "bg-blue-50 border-blue-300"
                : isHoliday
                ? "bg-red-50"
                : sameMonth
                ? "bg-white hover:bg-gray-50"
                : "bg-gray-100"
            }`}
          >
            <div
              className={`text-sm ${
                sameMonth ? "text-gray-800" : "text-gray-400"
              } font-medium`}
            >
              {format(day, "d")}
            </div>
            {isHoliday && (
              <div className="text-xs text-red-600 mt-1 font-medium truncate">
                Holiday
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Week View ---------------- */
function WeekView({ currentDate, events, onDayClick }) {
  const start = startOfWeek(currentDate);
  const end = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="grid grid-cols-7 border-t border-l">
      {days.map((day, i) => (
        <div
          key={i}
          onClick={() => onDayClick(day)}
          className={`h-40 border-b border-r p-3 cursor-pointer hover:bg-gray-50 ${
            isSameDay(day, new Date()) ? "bg-blue-50 border-blue-300" : ""
          }`}
        >
          <div className="font-semibold text-sm">{format(day, "EEE d")}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Day View ---------------- */
function DayView({ currentDate, events, onSlotClick }) {
  const startHour = 5;
  const endHour = 23;
  const hours = [];
  for (let h = startHour; h <= endHour; h++) hours.push(h);

  const minutesFromStart = (date) =>
    date.getHours() * 60 + date.getMinutes() - startHour * 60;

  const dayEvents = events.filter((ev) => isSameDay(ev.start, currentDate));

  return (
    <div className="flex-1 h-full overflow-auto bg-white">
      <div className="p-4 border-b bg-white">
        <h2 className="text-2xl font-semibold">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </h2>
      </div>

      <div className="flex" style={{ minHeight: "calc(100vh - 120px)" }}>
        <div className="w-20 border-r bg-gray-50">
          <div className="h-12"></div>
          {hours.map((h) => (
            <div key={h} className="h-16 text-xs text-right pr-2 text-gray-500">
              {`${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? "AM" : "PM"}`}
            </div>
          ))}
        </div>

        <div className="flex-1 relative">
          <div className="h-12"></div>
          {hours.map((h) => (
            <div
              key={h}
              onClick={() => {
                const slot = setMinutes(
                  setHours(startOfDay(currentDate), h),
                  0
                );
                onSlotClick && onSlotClick(slot);
              }}
              className="h-16 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            />
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

            return (
              <div
                key={ev.id}
                className="absolute left-4 right-4 bg-blue-600 text-white rounded p-2 text-sm shadow"
                style={{
                  top: `calc(${topPct}% + 0px)`,
                  height: `calc(${heightPct}% - 4px)`,
                  overflow: "hidden",
                }}
              >
                <div className="font-semibold truncate">{ev.title}</div>
                <div className="text-xs opacity-90">
                  {format(ev.start, "p")} — {format(ev.end, "p")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Year View ---------------- */
function YearView({ currentDate, holidays, onMonthClick }) {
  const months = Array.from({ length: 12 }, (_, i) =>
    startOfMonth(new Date(currentDate.getFullYear(), i))
  );

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {months.map((month, i) => (
        <div
          key={i}
          className="border rounded-lg shadow-sm hover:shadow-md transition bg-white cursor-pointer"
          onClick={() => onMonthClick(month)}
        >
          <div className="p-2 border-b font-semibold text-center bg-gray-50">
            {format(month, "MMMM")}
          </div>
          <MiniCalendar
            currentDate={month}
            onDateClick={() => {}}
            holidays={holidays}
          />
        </div>
      ))}
    </div>
  );
}
=======
>>>>>>> 036b6f0a94490529805f07c47b2ff5530bee7a4e
