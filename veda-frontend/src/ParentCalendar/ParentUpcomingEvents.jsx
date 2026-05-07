import React from "react";
import { format, isAfter } from "date-fns";

export default function ParentUpcomingEvents({
  events = [],
  onEventClick = () => {}, // readonly safe
}) {
  const upcoming = events
    .filter((e) => isAfter(e.start, new Date()))
    .sort((a, b) => a.start - b.start)
    .slice(0, 8);

  return (
    <div className="w-80 min-w-[320px] border-l bg-white p-5 overflow-y-auto">
      <h3 className="font-semibold text-lg mb-5">
        Upcoming Events
      </h3>

      {upcoming.length === 0 ? (
        <div className="text-sm text-gray-400">
          No upcoming events
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onEventClick(ev)}
              className="
                rounded-lg border bg-white
                p-4 cursor-pointer
                hover:bg-gray-50
                transition-colors
              "
            >
              <div className="font-semibold text-sm leading-5">
                {ev.title}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {format(ev.start, "dd MMM yyyy • p")}
              </div>

              <span
                className="
                  inline-block mt-3
                  text-[10px]
                  px-2.5 py-1
                  rounded-full
                  bg-gray-100
                "
              >
                {ev.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}