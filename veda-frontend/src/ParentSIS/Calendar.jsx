import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns";
import {
  FiCalendar,
  FiClock,
  FiEdit,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiSearch,
  FiSettings,
  FiCheck,
  FiUser,
  FiMapPin,
} from "react-icons/fi";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Day"); // Day, Week, Month
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Tool Talk: Edutech Insights",
      start: new Date(2025, 10, 12, 9, 30),
      end: new Date(2025, 10, 12, 10, 30),
      color: "#4285f4",
      calendar: "My Calendar",
    },
    {
      id: 2,
      title: "Update Call",
      start: new Date(2025, 10, 12, 17, 30),
      end: new Date(2025, 10, 12, 18, 0),
      color: "#4285f4",
      calendar: "My Calendar",
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    color: "#4285f4",
    calendar: "My Calendar",
  });
  const [calendars, setCalendars] = useState([
    { name: "My Calendar", color: "#4285f4", visible: true },
    { name: "Birthdays", color: "#ea4335", visible: true },
    { name: "Tasks", color: "#fbbc04", visible: true },
  ]);

  // Generate time slots (7 AM to 11 PM)
  const timeSlots = [];
  for (let hour = 7; hour < 24; hour++) {
    timeSlots.push(hour);
  }

  // Get current time for indicator
  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  };

  // Get events for a specific day
  const getEventsForDay = (date) => {
    return events.filter((event) => isSameDay(event.start, date));
  };

  // Get events for current view
  const getEventsForView = () => {
    if (view === "Day") {
      return getEventsForDay(currentDate);
    } else if (view === "Week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return events.filter(
        (event) => event.start >= weekStart && event.start <= weekEnd
      );
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return events.filter(
        (event) => event.start >= monthStart && event.start <= monthEnd
      );
    }
  };

  // Calculate event position and height for day view
  const getEventStyle = (event) => {
    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
    const endHour = event.end.getHours() + event.end.getMinutes() / 60;
    const duration = endHour - startHour;
    const top = ((startHour - 7) / 17) * 100;
    const height = (duration / 17) * 100;

    return {
      top: `${top}%`,
      height: `${height}%`,
      backgroundColor: event.color,
    };
  };

  // Handle date navigation
  const navigateDate = (direction) => {
    if (view === "Day") {
      setCurrentDate(addDays(currentDate, direction));
    } else if (view === "Week") {
      setCurrentDate(addDays(currentDate, direction * 7));
    } else {
      setCurrentDate(
        direction > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1)
      );
    }
  };

  // Handle create/edit event
  const handleSaveEvent = () => {
    if (isEditing && selectedEvent) {
      // Update existing event
      setEvents(
        events.map((e) =>
          e.id === selectedEvent.id
            ? { ...eventForm, id: selectedEvent.id }
            : e
        )
      );
    } else {
      // Create new event
      const newEvent = {
        ...eventForm,
        id: Date.now(),
      };
      setEvents([...events, newEvent]);
    }
    setShowEventModal(false);
    setSelectedEvent(null);
    setIsEditing(false);
    setEventForm({
      title: "",
      start: new Date(),
      end: new Date(),
      color: "#4285f4",
      calendar: "My Calendar",
    });
  };

  // Handle delete event
  const handleDeleteEvent = () => {
    setEvents(events.filter((e) => e.id !== selectedEvent.id));
    setShowEventModal(false);
    setSelectedEvent(null);
    setIsEditing(false);
  };

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEventForm({
      title: event.title,
      start: event.start,
      end: event.end,
      color: event.color,
      calendar: event.calendar,
    });
    setIsEditing(true);
    setShowEventModal(true);
  };

  // Handle create new event
  const handleCreateEvent = (date, hour) => {
    const startDate = new Date(date);
    startDate.setHours(hour || 9, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(hour ? hour + 1 : 10, 0, 0, 0);

    setEventForm({
      title: "",
      start: startDate,
      end: endDate,
      color: "#4285f4",
      calendar: "My Calendar",
    });
    setIsEditing(false);
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  // Get days for week view
  const getWeekDays = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  // Get days for month view
  const getMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white -m-6">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col">
        {/* Create Button */}
        <div className="p-4 border-b">
          <button
            onClick={() => handleCreateEvent(currentDate)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <FiPlus size={18} />
            Create
          </button>
        </div>

        {/* Mini Calendar */}
        <div className="p-4 border-b">
          <Calendar
            value={currentDate}
            onChange={setCurrentDate}
            className="w-full border-0"
            tileClassName={({ date }) =>
              isSameDay(date, currentDate) ? "bg-blue-600 text-white rounded" : ""
            }
          />
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for people"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Booking Pages */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Booking pages</span>
            <FiPlus size={16} className="cursor-pointer hover:text-gray-800" />
          </div>
        </div>

        {/* My Calendars */}
        <div className="p-4 border-b flex-1 overflow-y-auto">
          <div className="text-sm font-semibold text-gray-700 mb-2">My calendars</div>
          {calendars.map((cal, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-2 rounded"
            >
              <input
                type="checkbox"
                checked={cal.visible}
                onChange={(e) => {
                  const updated = [...calendars];
                  updated[idx].visible = e.target.checked;
                  setCalendars(updated);
                }}
                className="w-4 h-4"
                style={{ accentColor: cal.color }}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cal.color }}
              />
              <span className="text-sm text-gray-700">{cal.name}</span>
            </label>
          ))}
        </div>

        {/* Other Calendars */}
        <div className="p-4 border-t">
          <div className="text-sm font-semibold text-gray-700 mb-2">Other calendars</div>
          <label className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-2 rounded">
            <input type="checkbox" className="w-4 h-4" defaultChecked />
            <span className="text-sm text-gray-600">2:30-4:00/september bat...</span>
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Calendar</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDate(-1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Today
              </button>
              <button
                onClick={() => navigateDate(1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiChevronRight size={20} />
              </button>
              <div className="ml-4 text-lg font-medium">
                {view === "Day"
                  ? format(currentDate, "MMMM d, yyyy")
                  : view === "Week"
                  ? `${format(startOfWeek(currentDate, { weekStartsOn: 0 }), "MMM d")} - ${format(endOfWeek(currentDate, { weekStartsOn: 0 }), "MMM d, yyyy")}`
                  : format(currentDate, "MMMM yyyy")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
            </select>
            <button className="p-2 hover:bg-gray-100 rounded">
              <FiSearch size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <FiSettings size={18} />
            </button>
          </div>
        </div>

        {/* Calendar View */}
        <div className="flex-1 overflow-y-auto">
          {view === "Day" && (
            <div className="relative h-full">
              {/* Time Column */}
              <div className="absolute left-0 top-0 w-16 border-r border-gray-200 bg-white z-10">
                <div className="h-12 border-b border-gray-200"></div>
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-gray-100 text-xs text-gray-500 px-2 pt-1"
                  >
                    {hour === 12
                      ? "12 PM"
                      : hour > 12
                      ? `${hour - 12} PM`
                      : `${hour} AM`}
                  </div>
                ))}
              </div>

              {/* Events Area */}
              <div className="ml-16 relative h-full">
                {/* Current Time Indicator */}
                {isSameDay(currentDate, new Date()) && (
                  <div
                    className="absolute left-0 right-0 z-20"
                    style={{
                      top: `${((getCurrentTime() - 7) / 17) * 100}%`,
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full -ml-1"></div>
                      <div className="h-0.5 bg-red-600 flex-1"></div>
                    </div>
                  </div>
                )}

                {/* Time Slots */}
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-gray-100 cursor-pointer hover:bg-blue-50"
                    onClick={() => handleCreateEvent(currentDate, hour)}
                  ></div>
                ))}

                {/* Events */}
                {getEventsForDay(currentDate).map((event) => {
                  const style = getEventStyle(event);
                  return (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className="absolute left-1 right-1 rounded px-2 py-1 text-white text-sm cursor-pointer hover:opacity-90 z-10"
                      style={style}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs opacity-90">
                        {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === "Week" && (
            <div className="relative h-full">
              {/* Header with days */}
              <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <div className="flex">
                  <div className="w-16 border-r border-gray-200 h-12"></div>
                  {getWeekDays().map((day, idx) => (
                    <div
                      key={idx}
                      className="flex-1 border-r border-gray-200 p-2 text-center"
                    >
                      <div className="text-xs text-gray-500">
                        {format(day, "EEE")}
                      </div>
                      <div
                        className={`text-lg font-medium ${
                          isSameDay(day, new Date())
                            ? "text-blue-600 bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                            : ""
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time slots and events */}
              <div className="flex">
                <div className="w-16 border-r border-gray-200">
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-gray-100 text-xs text-gray-500 px-2 pt-1"
                    >
                      {hour === 12
                        ? "12 PM"
                        : hour > 12
                        ? `${hour - 12} PM`
                        : `${hour} AM`}
                    </div>
                  ))}
                </div>
                {getWeekDays().map((day, dayIdx) => (
                  <div key={dayIdx} className="flex-1 border-r border-gray-200 relative">
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="h-16 border-b border-gray-100 cursor-pointer hover:bg-blue-50"
                        onClick={() => handleCreateEvent(day, hour)}
                      ></div>
                    ))}
                    {getEventsForDay(day).map((event) => {
                      const style = getEventStyle(event);
                      return (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className="absolute left-1 right-1 rounded px-2 py-1 text-white text-sm cursor-pointer hover:opacity-90 z-10"
                          style={style}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs opacity-90">
                            {format(event.start, "h:mm a")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "Month" && (
            <div className="p-4">
              {/* Month Header */}
              <div className="grid grid-cols-7 border-b border-gray-200 pb-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-7 gap-1">
                {getMonthDays().map((day, idx) => {
                  const dayEvents = getEventsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={idx}
                      className={`min-h-24 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 ${
                        !isCurrentMonth ? "bg-gray-50" : ""
                      }`}
                      onClick={() => {
                        setCurrentDate(day);
                        setView("Day");
                      }}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday
                            ? "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            : isCurrentMonth
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            className="text-xs px-1 py-0.5 rounded text-white truncate"
                            style={{ backgroundColor: event.color }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {isEditing ? "Edit Event" : "Create Event"}
              </h2>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                  setIsEditing(false);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Event title"
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    value={format(eventForm.start, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        start: new Date(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End
                  </label>
                  <input
                    type="datetime-local"
                    value={format(eventForm.end, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        end: new Date(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calendar
                </label>
                <select
                  value={eventForm.calendar}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, calendar: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {calendars.map((cal) => (
                    <option key={cal.name} value={cal.name}>
                      {cal.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  {[
                    "#4285f4",
                    "#ea4335",
                    "#fbbc04",
                    "#34a853",
                    "#9c27b0",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setEventForm({ ...eventForm, color })
                      }
                      className={`w-8 h-8 rounded-full border-2 ${
                        eventForm.color === color
                          ? "border-gray-800"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              {isEditing && (
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FiTrash2 size={18} className="inline mr-1" />
                  Delete
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isEditing ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

