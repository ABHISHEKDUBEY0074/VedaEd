import React, { useState } from "react";
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
  isWithinInterval,
} from "date-fns";
import { FiChevronLeft, FiChevronRight, FiPlus, FiX } from "react-icons/fi";

/* ---------------------------- Main Component ---------------------------- */
export default function AnnualCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Month");
  const [events, setEvents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [holidays] = useState([
    { date: new Date(2025, 0, 26), title: "Republic Day" },
    { date: new Date(2025, 7, 15), title: "Independence Day" },
    { date: new Date(2025, 9, 2), title: "Gandhi Jayanti" },
    { date: new Date(2025, 10, 14), title: "Children’s Day" },
  ]);

  // navigation
  const goPrev = () => {
    if (view === "Month") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "Year") setCurrentDate(subYears(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 7));
  };
  const goNext = () => {
    if (view === "Month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "Year") setCurrentDate(addYears(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 7));
  };

  const handleMiniDateClick = (date) => {
    setCurrentDate(date);
    setView("Day");
  };

  const openSidebarModal = (date) => {
    setSelectedDate(date);
    setIsSidebarOpen(true);
  };

  const closeSidebarModal = () => {
    setIsSidebarOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ---------------- Mini Calendar Sidebar ---------------- */}
      <div className="w-64 bg-white shadow-md p-4 border-r overflow-auto">
        <h2 className="text-lg font-semibold mb-2">Mini Calendar</h2>
        <MiniCalendar
          currentDate={currentDate}
          onDateClick={handleMiniDateClick}
          holidays={holidays}
        />

        <button
          onClick={() => openSidebarModal(currentDate)}
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

      {/* ---------------- Main View Area ---------------- */}
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
        </div>

        {/* Views */}
        <div className="flex-1 overflow-auto bg-white">
          {view === "Day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              onSlotClick={openSidebarModal}
            />
          )}
          {view === "Week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onDayClick={(d) => setCurrentDate(d)}
              onSlotClick={openSidebarModal}
            />
          )}
          {view === "Month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              holidays={holidays}
              onDayClick={(d) => {
                setCurrentDate(d);
                setView("Day");
              }}
            />
          )}
          {view === "Year" && (
            <YearView
              currentDate={currentDate}
              holidays={holidays}
              onMonthClick={(m) => {
                setCurrentDate(m);
                setView("Month");
              }}
            />
          )}
        </div>
      </div>

      {/* ---------------- Sidebar Modal (for Add Event) ---------------- */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl border-l z-50 animate-slideIn">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold">Create Event</h3>
            <button
              onClick={closeSidebarModal}
              className="text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-500">
              Event form will be integrated here.
            </p>
            {selectedDate && (
              <p className="text-gray-600">
                Selected Date: <b>{format(selectedDate, "PPP")}</b>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
            title={isHoliday ? holidays.find((h) => isSameDay(h.date, day)).title : ""}
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
    (date.getHours() * 60 + date.getMinutes()) - startHour * 60;

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
                const slot = setMinutes(setHours(startOfDay(currentDate), h), 0);
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
          <MiniCalendar currentDate={month} onDateClick={() => {}} holidays={holidays} />
        </div>
      ))}
    </div>
  );
}
