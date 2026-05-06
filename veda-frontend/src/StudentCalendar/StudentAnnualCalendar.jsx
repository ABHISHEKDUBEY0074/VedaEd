import React, { useMemo, useState } from "react";
import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  format,
  startOfDay,
} from "date-fns";

import {
  StudentMonthView,
  StudentWeekView,
  StudentDayView,
  StudentYearView,
} from "./StudentCalendarViews";

import StudentUpcomingEvents from "./StudentUpcomingEvents";

/* ================= MOCK EVENTS ================= */
const EVENTS = [
  
  {
    id: 2,
    title: "Math Unit Test",
    type: "Exam",
    start: new Date("2026-05-06T09:00"),
    end: new Date("2026-05-06T10:00"),
    class: "7A",
    venue: "Room 12",
  },
  {
    id: 3,
    title: "English Period",
    type: "Timetable",
    start: new Date("2026-05-06T10:30"),
    end: new Date("2026-05-06T11:10"),
    class: "7A",
    venue: "Room 12",
  },
  {
    id: 4,
    title: "Science Assignment Due",
    type: "Assignment",
    start: new Date("2026-05-08T00:00"),
    end: new Date("2026-05-08T23:59"),
    class: "7A",
    venue: "Online",
  },
  {
    id: 5,
    title: "Inter-House Debate",
    type: "Activity",
    start: new Date("2026-05-10T11:00"),
    end: new Date("2026-05-10T13:00"),
    class: "All",
    venue: "Auditorium",
  },
];

/* ================= MAIN ================= */
export default function StudentAnnualCalendar() {
  const STUDENT_CLASS = "7A"; // 🔒 fixed – student ki class

  const [currentDate, setCurrentDate] = useState(new Date("2026-05-01"));
  const [view, setView] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* ================= FILTER EVENTS (CLASS FIXED) ================= */
  const filteredEvents = useMemo(() => {
    return EVENTS.filter(
      (e) => e.class === "All" || e.class === STUDENT_CLASS
    );
  }, []);

  /* ================= GROUP BY DAY ================= */
  const eventsByDay = useMemo(() => {
    const map = {};
    filteredEvents.forEach((e) => {
      const key = format(e.start, "yyyy-MM-dd");
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [filteredEvents]);

  /* ================= DATE MOVE ================= */
  const moveDate = (dir) => {
    setCurrentDate((prev) => {
      switch (view) {
        case "day":
          return dir === "next" ? addDays(prev, 1) : subDays(prev, 1);
        case "week":
          return dir === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1);
        case "month":
          return dir === "next" ? addMonths(prev, 1) : subMonths(prev, 1);
        case "year":
          return dir === "next" ? addYears(prev, 1) : subYears(prev, 1);
        default:
          return prev;
      }
    });
  };

  /* ================= HEADER ================= */
  const Header = () => (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <button className="px-2 py-1 border rounded" onClick={() => moveDate("prev")}>‹</button>

        <div>
          <div className="text-xl font-semibold">
            {view === "year"
              ? format(currentDate, "yyyy")
              : format(currentDate, "MMMM yyyy")}
          </div>

          {view === "day" && (
            <div className="text-sm text-gray-500">
              {format(currentDate, "EEEE, dd MMMM yyyy")}
            </div>
          )}
        </div>

        <button className="px-2 py-1 border rounded" onClick={() => moveDate("next")}>›</button>

        <button
          className="ml-3 px-3 py-1 bg-blue-50 rounded"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </button>
      </div>

      <select
        value={view}
        onChange={(e) => setView(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="year">Year</option>
        <option value="month">Month</option>
        <option value="week">Week</option>
        <option value="day">Day</option>
        <option value="list">List</option>
      </select>
    </div>
  );

  /* ================= EVENT MODAL (READ ONLY) ================= */
  const EventModal = () =>
    selectedEvent && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-[650px] rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <button onClick={() => setSelectedEvent(null)}>✕</button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {["title", "venue", "class", "type"].map((k) => (
              <div key={k}>
                <label className="text-xs text-gray-500">{k}</label>
                <input
                  disabled
                  className="w-full border rounded px-2 py-1 bg-gray-50"
                  value={selectedEvent[k]}
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs text-gray-500">Description</label>
            <textarea
              disabled
              className="w-full border rounded px-2 py-1 bg-gray-50"
              rows={3}
              value={selectedEvent.description || ""}
            />
          </div>
        </div>
      </div>
    );

  /* ================= RENDER ================= */
  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-auto">
        <Header />

        {view === "month" && (
          <StudentMonthView
            currentDate={currentDate}
            eventsByDay={eventsByDay}
            onDayClick={(d) => {
              setCurrentDate(startOfDay(d));
              setView("day");
            }}
            onEventClick={setSelectedEvent}
          />
        )}

        {view === "week" && (
          <StudentWeekView
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={setSelectedEvent}
          />
        )}

        {view === "day" && (
          <StudentDayView
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={setSelectedEvent}
          />
        )}

        {view === "year" && (
          <StudentYearView
            currentDate={currentDate}
            eventsByDay={eventsByDay}
            onMonthClick={(m) => {
              setCurrentDate(m);
              setView("month");
            }}
          />
        )}

        {view === "list" && (
          <StudentUpcomingEvents
            events={filteredEvents}
            onEventClick={setSelectedEvent}
          />
        )}
      </div>

      <StudentUpcomingEvents
        events={filteredEvents}
        onEventClick={setSelectedEvent}
      />

      <EventModal />
    </div>
  );
}