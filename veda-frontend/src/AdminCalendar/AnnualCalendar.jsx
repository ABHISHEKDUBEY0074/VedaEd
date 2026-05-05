import React, { useMemo, useState, useEffect } from "react";
import * as calendarAPI from "../services/calendarAPI";
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
  MonthView,
  WeekView,
  DayView,
  YearView,
} from "./CalendarViews";

import UpcomingEvents from "./UpcomingEvents";

const EVENT_TYPES = [
  "Holiday",
  "Exam",
  "Timetable",
  "Assignment",
  "Activity",
  "Meeting",
  "Other"
];

/* ================= MAIN ================= */
export default function AnnualCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date("2026-05-01"));
  const [view, setView] = useState("month");
  const [selectedClass, setSelectedClass] = useState("All");
  const [activeTypes, setActiveTypes] = useState(EVENT_TYPES);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await calendarAPI.getAllEvents();
      if (res.success) {
        const mapped = res.data.map(e => ({
          ...e,
          id: e._id,
          type: e.type || e.eventType || "Other",
          start: new Date(e.startDate),
          end: new Date(e.endDate),
          // Map backend classes array to single string for UI if needed, 
          // or just use the first one/All
          class: e.classes && e.classes.length > 0 ? e.classes[0] : "All"
        }));
        setEvents(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER EVENTS ================= */
  const filteredEvents = useMemo(() => {
    return events.filter(
      (e) =>
        (selectedClass === "All" ||
          e.class === selectedClass ||
          e.class === "All") &&
        activeTypes.includes(e.type)
    );
  }, [events, selectedClass, activeTypes]);

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

  /* ================= DATE MOVE (FIXED LOGIC) ================= */
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
        <button
          className="px-2 py-1 border rounded"
          onClick={() => moveDate("prev")}
        >
          ‹
        </button>

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

        <button
          className="px-2 py-1 border rounded"
          onClick={() => moveDate("next")}
        >
          ›
        </button>

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

  /* ================= FILTERS ================= */
  const Filters = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div>
        <label className="text-sm font-semibold">Class</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="All">All</option>
          <option value="7A">Class 7A</option>
          <option value="10A">Class 10A</option>
        </select>
      </div>

      <div className="col-span-3 relative">
        <label className="text-sm font-semibold">Event Types</label>

        <details className="mt-1">
          <summary className="cursor-pointer border rounded px-3 py-2 bg-white">
            Select Event Types
          </summary>

          <div className="absolute z-10 mt-2 bg-white border rounded shadow p-3 w-full">
            {EVENT_TYPES.map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm mb-2">
                <input
                  type="checkbox"
                  checked={activeTypes.includes(t)}
                  onChange={() =>
                    setActiveTypes((p) =>
                      p.includes(t)
                        ? p.filter((x) => x !== t)
                        : [...p, t]
                    )
                  }
                />
                {t}
              </label>
            ))}
          </div>
        </details>
      </div>
    </div>
  );

  /* ================= EVENT MODAL ================= */
  const EventModal = () =>
    selectedEvent && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-[650px] rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editMode ? "Edit Event" : "Event Details"}
            </h2>
            <button onClick={() => setSelectedEvent(null)}>✕</button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {["title", "venue", "class", "type"].map((k) => (
              <div key={k}>
                <label className="text-xs text-gray-500">{k}</label>
                <input
                  disabled={!editMode}
                  className="w-full border rounded px-2 py-1"
                  value={selectedEvent[k]}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      [k]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs text-gray-500">Description</label>
            <textarea
              disabled={!editMode}
              className="w-full border rounded px-2 py-1"
              rows={3}
              value={selectedEvent.description || ""}
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={async () => {
                  try {
                    const payload = {
                      ...selectedEvent,
                      startDate: selectedEvent.start,
                      endDate: selectedEvent.end,
                    };
                    await calendarAPI.updateEvent(selectedEvent.id, payload);
                    fetchEvents();
                    setEditMode(false);
                    setSelectedEvent(null);
                  } catch (err) {
                    console.error("Failed to update event", err);
                    alert("Error updating event");
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    );

  /* ================= RENDER ================= */
  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-auto">
        <Header />
        <Filters />

        {view === "month" && (
          <MonthView
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
          <WeekView
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={setSelectedEvent}
          />
        )}

        {view === "day" && (
          <DayView
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={setSelectedEvent}
          />
        )}

        {view === "year" && (
          <YearView
            currentDate={currentDate}
            eventsByDay={eventsByDay}
            onMonthClick={(m) => {
              setCurrentDate(m);
              setView("month");
            }}
          />
        )}

        {view === "list" && (
          <UpcomingEvents
            events={filteredEvents}
            onEventClick={setSelectedEvent}
          />
        )}
      </div>

      <UpcomingEvents
        events={filteredEvents}
        onEventClick={setSelectedEvent}
      />

      <EventModal />
    </div>
  );
}