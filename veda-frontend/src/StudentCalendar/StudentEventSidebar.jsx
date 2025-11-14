import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { FiX } from "react-icons/fi";

/* Read-only sidebar — mirrors Teacher layout but all fields are display-only */
export default function StudentEventSidebar({ initial = {}, selectedDate, onClose, typeColors = {} }) {
  const [ev, setEv] = useState(initial);

  useEffect(() => {
    setEv(initial || {});
  }, [initial]);

  if (!ev) return null;

  const start = ev.start ? new Date(ev.start) : ev.date ? new Date(ev.date) : null;
  const end = ev.end ? new Date(ev.end) : ev.date ? new Date(ev.date) : null;

  return (
    <div className="fixed top-0 right-0 w-[400px] h-full bg-white border-l shadow-2xl z-50 animate-slideIn">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div>
          <div className="text-xs opacity-80">Event Title</div>
          <div className="mt-1 w-[300px] text-lg font-medium">{ev.title || "—"}</div>
        </div>

        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition" title="Close">
          <FiX size={22} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-5 overflow-auto h-[calc(100%-72px)] text-gray-800">
        {/* DATE TIME */}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Date & Time</label>
          <div className="flex flex-wrap items-center gap-2">
            <div className="border rounded-lg px-2 py-2 min-w-[120px]">
              {start ? format(start, "yyyy-MM-dd") : (ev.date ? format(new Date(ev.date), "yyyy-MM-dd") : "—")}
            </div>
            <div className="border rounded-lg px-2 py-2 min-w-[80px]">
              {start ? format(start, "HH:mm") : "—"}
            </div>
            <span className="text-gray-400">—</span>
            <div className="border rounded-lg px-2 py-2 min-w-[120px]">
              {end ? format(end, "yyyy-MM-dd") : (ev.date ? format(new Date(ev.date), "yyyy-MM-dd") : "—")}
            </div>
            <div className="border rounded-lg px-2 py-2 min-w-[80px]">
              {end ? format(end, "HH:mm") : "—"}
            </div>
          </div>
        </div>

        {/* REPEAT (display) */}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Repeat</label>
          <div className="border rounded-lg px-2 py-2">{ev.repeat || "Does not repeat"}</div>
        </div>

        {/* GUESTS */}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Guests</label>
          <div className="border rounded-lg px-2 py-2">{ev.attendees || "—"}</div>
        </div>

        {/* MEET (display only) */}
        <div className="flex flex-col gap-3">
          <label className="text-xs text-gray-500 block mb-1">Location / Meet</label>
          <div className="border rounded-lg px-2 py-2">{ev.location || "—"}</div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-xs text-gray-500 block mb-1">Description</label>
          <div className="w-full border rounded-lg p-2 h-24 resize-none">{ev.description || "—"}</div>
        </div>

        {/* OTHER OPTIONS (display only) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Event Type</label>
            <div className="border rounded-lg px-2 py-2">{ev.type || "—"}</div>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Show as</label>
            <div className="border rounded-lg px-2 py-2">{ev.busyStatus || "Busy"}</div>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Visibility</label>
            <div className="border rounded-lg px-2 py-2">{ev.visibility || "Default visibility"}</div>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Notification</label>
            <div className="border rounded-lg px-2 py-2">{ev.notification || "30 minutes before"}</div>
          </div>
        </div>

        {/* FOOTER (no save/delete — only close) */}
        <div className="flex justify-end items-center pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
