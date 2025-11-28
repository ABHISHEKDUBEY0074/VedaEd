import React, { useEffect, useMemo, useState } from "react";
import {
  format,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  setHours,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";

import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";

import TeacherMiniCalendar from "./TeacherMiniCalendar";
import TeacherEventSidebar from "./TeacherEventSidebar";
import HelpInfo from "../components/HelpInfo";

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

const TYPE_COLORS = {
  Meeting: "bg-green-600",
  Holiday: "bg-red-600",
  Task: "bg-yellow-600",
  Reminder: "bg-indigo-600",
  Other: "bg-blue-600",
};

export default function TeacherAnnualCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Month");
  const [events, setEvents] = useState(() => loadEvents());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [holidays] = useState([
    { date: new Date(2025, 0, 26), title: "Republic Day" },
    { date: new Date(2025, 7, 15), title: "Independence Day" },
  ]);

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setCurrentDate(day);
  };

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

  const eventsByDay = useMemo(() => {
    const map = {};
    for (const ev of events) {
      const key = ev.start
        ? format(new Date(ev.start), "yyyy-MM-dd")
        : ev.date
        ? format(new Date(ev.date), "yyyy-MM-dd")
        : null;
      if (!key) continue;
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  // ---------------- Views ----------------
  const DayViewInline = () => {
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
              <li
                key={ev.id || ev.title}
                className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                onClick={() => openEventSidebar(ev)}
              >
                <div className="font-semibold">{ev.title}</div>
                <div className="text-sm text-gray-600">{ev.location || "No location"}</div>
                <div className="text-sm text-gray-600">
                  {ev.start ? format(new Date(ev.start), "hh:mm a") : ""}
                </div>
                {ev.description && <div className="mt-2 text-sm text-gray-700">{ev.description}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const WeekViewInline = () => {
    const start = startOfWeek(currentDate);
    const days = eachDayOfInterval({ start, end: addDays(start, 6) });
    return (
      <div className="p-4">
        <h3 className="font-semibold mb-3">Week of {format(start, "PPP")}</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const cnt = events.filter((ev) => ev.start && isSameDay(new Date(ev.start), d)).length;
            return (
              <div key={d.toISOString()} className="p-2 border rounded text-center">
                <div className="font-medium">{format(d, "EEE d")}</div>
                <div className="text-xs mt-1 text-blue-600">{cnt} event(s)</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const MonthViewInline = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });
    return (
      <div className="p-4 grid grid-cols-7 gap-1 text-sm">
        {days.map((day, idx) => {
          const today = isSameDay(day, new Date());
          const sameMonth = isSameMonth(day, currentDate);
          const holiday = holidays.find((h) => isSameDay(h.date, day));
          const list = eventsByDay[format(day, "yyyy-MM-dd")] || [];
          return (
            <div
              key={idx}
              className={`min-h-[80px] p-2 border rounded cursor-pointer
                ${today ? "bg-blue-50" : ""}
                ${holiday ? "bg-red-50" : ""}
                ${!sameMonth ? "opacity-50" : ""}`}
              onClick={() => {
                if (list.length > 0) {
                  setSelectedDate(day);
                  setView("Day");
                }
              }}
            >
              <div className="flex justify-between">
                <span className="text-xs font-semibold">{format(day, "d")}</span>
                {holiday && <span className="text-xs text-red-600">{holiday.title}</span>}
              </div>
              <div className="mt-2 space-y-1 text-[11px]">
                {list.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id || ev.title}
                    className="truncate cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEventSidebar(ev);
                    }}
                  >
                    • {ev.title}
                  </div>
                ))}
                {list.length > 3 && <div className="text-[10px] text-gray-500">+{list.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const YearViewInline = () => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1));
    return (
      <div className="p-4 grid grid-cols-3 gap-4">
        {months.map((m) => {
          const mk = format(m, "yyyy-MM");
          const count = events.filter((ev) => ev.start && format(new Date(ev.start), "yyyy-MM") === mk).length;
          return (
            <div
              key={mk}
              className="border rounded p-3 cursor-pointer bg-white"
              onClick={() => {
                setCurrentDate(m);
                setView("Month");
              }}
            >
              <div className="font-semibold text-center">{format(m, "MMMM yyyy")}</div>
              <div className="text-sm text-blue-600 mt-2">{count} event(s)</div>
            </div>
          );
        })}
      </div>
    );
  };

  // ---------------- Render ----------------
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Teachers &gt;</span>
        <span>Annual Calendar</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Annual Calendar</h1>
         <HelpInfo
      title="Teacher Annual Calendar Help"
      description={`
1.1 Mini Calendar 
The mini calendar allows quick navigation to any date. Clicking a date instantly updates the main calendar on the right.  
- Use the month arrows to switch months.  
- Dates containing events display indicator dots.  
- Double-clicking a date can optionally open the Create Event modal.

2.1 Full Calendar View (Main Calendar Area)  
The main calendar displays all scheduled events with multiple view options such as Month, Week, Day, and List.  
- Use the view buttons at the top to switch between views.  
- Clicking an event opens the Event Details sidebar.  
- Clicking an empty date slot opens the Create Event dialog.  
- Use the “Today” button to return to the current date instantly.  
- Month view shows compact event indicators; Week/Day views show timeline-based event blocks.

3.1 Create Event (Add Event Modal) 
This modal allows teachers to create new events such as meetings, exams, reminders, and school activities.  
- Enter the Event Title.  
- Select the Start and End Date/Time.  
- Choose who the event is for (Class / Section / Staff / All).  
- Add additional Description if required.  
- Choose an event color (optional).  
- Click “Save Event” to add it to the calendar.  
- Validation errors will highlight incorrect or missing details before saving.
      `}
      steps={[
        "Use the Mini Calendar to quickly jump to any date.",
        "Switch between Month, Week, Day, and List views in the main calendar.",
        "Click an event to view full details in the sidebar.",
        "Click an empty date slot to open the Create Event modal.",
        "Fill in event details including title, date/time, and audience.",
        "Save the event to display it on the main calendar.",
      ]}
    />
      </div>

      <div className="flex min-h-[600px] bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-md p-4 border-r overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Mini Calendar</h2>
          <TeacherMiniCalendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onDateClick={handleDateClick}
            holidays={holidays}
            selectedDate={selectedDate}
            events={events}
          />

          <button
            onClick={() => openEventSidebar({ start: currentDate })}
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

        {/* Main Calendar Area */}
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
              <button onClick={() => setCurrentDate(new Date())} className="ml-2 px-3 py-1 bg-gray-100 text-sm rounded hover:bg-gray-200">
                Today
              </button>

              <h2 className="text-xl font-semibold ml-3">
                {view === "Year" ? format(currentDate, "yyyy") : format(currentDate, "MMMM yyyy")}
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
                onClick={() => openEventSidebar({ start: currentDate })}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded"
              >
                <FiPlus /> Create
              </button>
            </div>
          </div>

          {/* Calendar Views */}
          <div className="flex-1 overflow-auto bg-white">
            {view === "Day" && <DayViewInline />}
            {view === "Week" && <WeekViewInline />}
            {view === "Month" && <MonthViewInline />}
            {view === "Year" && <YearViewInline />}
          </div>
        </div>
      </div>

      {/* Event Sidebar */}
      {isSidebarOpen && selectedEvent && (
        <TeacherEventSidebar
          initial={selectedEvent}
          selectedDate={selectedDate}
          onClose={closeSidebar}
          typeColors={TYPE_COLORS}
        />
      )}
    </div>
  );
}
