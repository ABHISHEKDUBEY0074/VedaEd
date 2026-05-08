import React from "react";
import { format, isAfter } from "date-fns";

export default function UpcomingEvents({ events = [], onEventClick }) {
  const upcoming = events
    .filter(e => isAfter(e.start, new Date()))
    .sort((a, b) => a.start - b.start)
    .slice(0, 8);

  return (
    <div className="w-80 border-l bg-white p-4">
      <h3 className="font-semibold text-lg mb-4">Upcoming Events</h3>

      {upcoming.length === 0 ? (
        <div className="text-sm text-gray-400">No upcoming events</div>
      ) : (
        upcoming.map(ev => (
          <div
            key={ev.id}
            onClick={() => onEventClick(ev)}
            className="mb-3 p-3 rounded border hover:bg-gray-50 cursor-pointer"
          >
            <div className="font-semibold text-sm">{ev.title}</div>
            <div className="text-xs text-gray-500">
              {format(ev.start, "dd MMM yyyy • p")}
            </div>
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-gray-100">
              {ev.type}
            </span>
          </div>
        ))
      )}
    </div>
  );
}