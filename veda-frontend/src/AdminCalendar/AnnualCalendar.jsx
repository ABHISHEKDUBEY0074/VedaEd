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

/* ---------- storage helpers ---------- */
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
      start: e.start.toISOString(),
      end: e.end.toISOString(),
    }));
    localStorage.setItem(LS_KEY, JSON.stringify(serializable));
  } catch {}
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

/* ---------- colors ---------- */
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
  const [editingEvent, setEditingEvent] = useState(null);
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

  /* ---------- open create ---------- */
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

  /* ---------- open edit ---------- */
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

  /* ---------- save/delete ---------- */
  const handleSaveEvent = (payload) => {
    if (!payload.title) return alert("Title is required");

    if (payload.id) {
      setEvents((prev) =>
        prev.map((e) => (e.id === payload.id ? payload : e))
      );
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

  /* ---------- event map for dots ---------- */
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
      {/* Left Sidebar */}
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
          <h3 className="font-medium mb-2 text-gray-700 text-sm">
            Gazetted Holidays
          </h3>
          <ul className="space-y-1 text-sm text-gray-600">
            {holidays.map((h, i) => (
              <li key={i}>
                {format(h.date, "MMM d")}: <b>{h.title}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main calendar area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 bg-white shadow">
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              className="p-2 rounded hover:bg-gray-100 text-gray-600"
            >
              <FiChevronRight size={18} />
            </button>

            <button
              onClick={() => setCurrentDate(new Date())}
              className="ml-2 px-3 py-1 bg-gray-100 text-sm rounded hover:bg-gray-200"
            >
              Today
            </button>

            <h2 className="text-xl font-semibold ml-3">
              {view === "Year"
                ? format(currentDate, "yyyy")
                : format(currentDate, "MMMM yyyy")}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option>Day</option>
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
            </select>

            <button
              onClick={() => openCreateSidebar(currentDate)}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
            >
              <FiPlus /> Create
            </button>
          </div>
        </div>

        {/* View renderer */}
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

      {/* Event sidebar */}
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
