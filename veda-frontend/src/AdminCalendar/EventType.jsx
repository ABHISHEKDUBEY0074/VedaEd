import React, { useMemo, useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
  FiChevronLeft,
  FiCalendar,
  FiSun,
  FiMoon,
  FiUsers,
} from "react-icons/fi";
import { format, addMonths, subMonths, startOfWeek, addDays } from "date-fns";
import axios from "axios";
import HelpInfo from "../components/HelpInfo";

const API_BASE = "http://localhost:5000/api";

const defaultEventTypes = [
  {
    id: 1,
    name: "Exam",
    description: " Board exams and unit tests",
    color: "#4285f4",
    visibility: "Public",
    icon: <FiSun size={16} />,
  },
  {
    id: 2,
    name: "PTM",
    description: " Parent teacher meetings across classes",
    color: "#ea4335",
    visibility: "Parents & Teachers",
    icon: <FiUsers size={16} />,
  },
  {
    id: 3,
    name: "Holiday",
    description: " School closed events and festivals",
    color: "#34a853",
    visibility: "Everyone",
    icon: <FiMoon size={16} />,
  },
  {
    id: 4,
    name: "Competition",
    description: " Olympiads, cultural & sports competitions",
    color: "#fbbc04",
    visibility: "Specific Groups",
    icon: <FiCalendar size={16} />,
  },
];

const badgeClass =
  "text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full";

const HELP_DESCRIPTION = `Page Description: Define all calendar event types, preview how each renders, and fine-tune visibility before publishing.


1.1 Event Type Library

Browse and search the complete list of event types.

Sections:
- Search Input: Filter by type name or description
- List Items: Show name, visibility, last updated info, and status pill
- Selection: Click any type to load its details on the preview panel


1.2 Preview Calendar Canvas

Visualize how the selected event type appears on a sample schedule.

Sections:
- Month Controls: Navigate months with chevrons
- Timeline Grid: Hourly slots with color-coded event chips
- Quick Summary Cards: Show label color, visibility, reminders, and audience


1.3 Configuration Sidebar

Update metadata for the selected event type.

Sections:
- Details Form: Edit name, description, color, icon, and audience
- Visibility Toggles: Control which roles can see the type
- Action Buttons: Save updates, duplicate types, or delete unused ones`;

const EventType = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(defaultEventTypes[0].id);
  const [eventTypes, setEventTypes] = useState(defaultEventTypes);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1));

  // Helper function to get icon for event type
  const getIconForType = (name) => {
    const nameLower = name?.toLowerCase() || "";
    if (nameLower.includes("exam")) return <FiSun size={16} />;
    if (nameLower.includes("ptm") || nameLower.includes("meeting"))
      return <FiUsers size={16} />;
    if (nameLower.includes("holiday")) return <FiMoon size={16} />;
    return <FiCalendar size={16} />;
  };

  // Fetch event types from backend (similar to TimetableSetup)
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const res = await axios.get(`${API_BASE}/calendar/event-types`);
        const data = res.data?.success ? res.data.data || [] : [];

        if (data.length > 0) {
          // Transform backend data to include icons
          const transformedData = data.map((type) => ({
            ...type,
            id: type._id,
            icon: getIconForType(type.name),
          }));

          setEventTypes(transformedData);
          // Set selectedId to first item from backend
          setSelectedId(transformedData[0]._id || transformedData[0].id);
        }
      } catch (error) {
        console.error("Error fetching event types from backend:", error);
        // Keep using default event types if API fails
      }
    };

    fetchEventTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedEventType = useMemo(
    () => eventTypes.find((item) => item.id === selectedId) ?? eventTypes[0],
    [selectedId, eventTypes]
  );

  const filteredEventTypes = useMemo(() => {
    if (!searchTerm.trim()) return eventTypes;
    return eventTypes.filter((item) =>
      `${item.name} ${item.description}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [eventTypes, searchTerm]);

  const handleCreateEventType = async () => {
    const newEventTypeData = {
      name: "New Event Type",
      description: "Customize details on the right panel",
      color: "#9c27b0",
      visibility: "Draft",
    };

    try {
      // Try to create in backend
      const res = await axios.post(
        `${API_BASE}/calendar/event-types`,
        newEventTypeData
      );
      if (res.data?.success && res.data.data) {
        const created = {
          ...res.data.data,
          id: res.data.data._id,
          icon: getIconForType(res.data.data.name),
        };
        setEventTypes((prev) => [created, ...prev]);
        setSelectedId(created.id);
        return;
      }
    } catch (error) {
      console.error("Error creating event type in backend:", error);
    }

    // Fallback to local creation if backend fails
    const newId = Date.now();
    const newEventType = {
      id: newId,
      ...newEventTypeData,
      icon: <FiCalendar size={16} />,
    };
    setEventTypes((prev) => [newEventType, ...prev]);
    setSelectedId(newId);
  };

  return (
    <div className="p-0 m-0  min-h-screen">
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admin Calendar &gt;</span>
        <span>Event Types</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage calendar categories, colors, and visibility labels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HelpInfo title="Event Type Help" description={HELP_DESCRIPTION} />
          <button
            onClick={handleCreateEventType}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            <FiPlus size={18} />
            Create Event Type
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left / Preview */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
          {/* Month Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Preview calendar
              </h2>
              <p className="text-sm text-gray-500">
                How the selected event type appears on the calendar view
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <FiChevronLeft size={18} />
              </button>
              <div className="min-w-[160px] text-center">
                <div className="text-xs font-semibold text-gray-500 uppercase">
                  {format(currentMonth, "MMMM yyyy")}
                </div>
                <div className="text-[10px] text-gray-400">
                  Week of {format(startOfWeek(currentMonth), "d MMM")} -{" "}
                  {format(addDays(startOfWeek(currentMonth), 6), "d MMM")}
                </div>
              </div>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Preview timeline */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[80px_1fr] border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wide">
              <div className="px-4 py-3">Time</div>
              <div className="px-4 py-3">Schedule</div>
            </div>
            <div className="max-h-[360px] overflow-y-auto relative">
              {Array.from({ length: 12 }, (_, idx) => 8 + idx).map((hour) => {
                const label =
                  hour === 12
                    ? "12 PM"
                    : hour > 12
                    ? `${hour - 12} PM`
                    : `${hour} AM`;
                const isEvent =
                  hour === 9 ||
                  hour === 14 ||
                  (hour === 17 && selectedEventType.id === 3);

                return (
                  <div
                    key={hour}
                    className="grid grid-cols-[80px_1fr] border-b border-gray-100"
                  >
                    <div className="px-4 py-4 text-sm text-gray-400">
                      {label}
                    </div>
                    <div className="relative px-4 py-3">
                      {isEvent ? (
                        <div
                          className="rounded-lg p-3 text-white shadow-sm w-[280px] flex flex-col gap-1 cursor-pointer"
                          style={{ background: selectedEventType.color }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">
                              {selectedEventType.name}
                            </span>
                            <span className="text-xs opacity-80">
                              {hour === 9
                                ? "9:30 – 10:30 AM"
                                : hour === 14
                                ? "2:00 – 3:00 PM"
                                : "5:30 – 6:00 PM"}
                            </span>
                          </div>
                          <p className="text-xs opacity-90 max-w-[240px]">
                            {selectedEventType.description}
                          </p>
                          <span className="text-[10px] uppercase font-semibold opacity-90">
                            {selectedEventType.visibility}
                          </span>
                        </div>
                      ) : (
                        <div className="h-16 rounded border border-dashed border-transparent hover:border-blue-200 transition-colors"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick configuration summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="text-xs uppercase font-semibold text-gray-500">
                Label
              </p>
              <p className="mt-1 font-medium text-gray-900 flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: selectedEventType.color }}
                />
                {selectedEventType.name}
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="text-xs uppercase font-semibold text-gray-500">
                Visibility
              </p>
              <p className="mt-1 font-medium text-gray-900">
                {selectedEventType.visibility}
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <p className="text-xs uppercase font-semibold text-gray-500">
                Audience
              </p>
              <p className="mt-1 text-gray-800 text-sm">
                {selectedEventType.description}
              </p>
            </div>
          </div>
        </div>

        {/* Event type list / editor */}
        <div className="bg-white rounded-xl shadow border border-gray-100 flex flex-col">
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search event types"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                Manage access
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {filteredEventTypes.map((item) => {
              const isActive = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left border rounded-xl p-4 transition-all ${
                    isActive
                      ? "border-blue-300 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <span
                            className={`${badgeClass} ${
                              item.visibility === "Draft"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {item.visibility}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-white border border-gray-200 text-gray-500">
                        <FiEdit2 size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white border border-gray-200 text-gray-500">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredEventTypes.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-10 border border-dashed border-gray-200 rounded-xl">
                No event types match “{searchTerm}”. Try another search.
              </div>
            )}
          </div>

          {/* Configuration form (read-only for now) */}
          {selectedEventType && (
            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Configuration
              </h4>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <label className="flex flex-col gap-1">
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    Event Type Name
                  </span>
                  <input
                    readOnly
                    value={selectedEventType.name}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                    Description
                  </span>
                  <textarea
                    readOnly
                    rows={3}
                    value={selectedEventType.description}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 resize-none"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                      Visibility
                    </span>
                    <input
                      readOnly
                      value={selectedEventType.visibility}
                      className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                      Color
                    </span>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white">
                      <span
                        className="w-5 h-5 rounded-full border border-gray-200"
                        style={{ backgroundColor: selectedEventType.color }}
                      />
                      <span className="text-gray-700 text-sm font-medium">
                        {selectedEventType.color.toUpperCase()}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-white">
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventType;
