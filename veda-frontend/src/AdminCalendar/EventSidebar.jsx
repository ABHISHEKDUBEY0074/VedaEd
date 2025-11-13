import React, { useEffect, useState } from "react";
import { format, setHours } from "date-fns";
import { FiX, FiTrash2 } from "react-icons/fi";

/* --- Small Confirm Modal --- */
function ConfirmDialog({ open, title = "Confirm", message = "Are you sure?", onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-[380px] p-6 animate-fadeIn">
        <div className="text-lg font-semibold mb-1">{title}</div>
        <p className="text-gray-600 text-sm mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-1"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- Main Sidebar --- */
export default function EventSidebar({
  initial,
  selectedDate,
  onClose,
  onSave,
  onDelete,
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [type, setType] = useState(initial?.type || "Meeting");
  const [startDate, setStartDate] = useState(
    format(initial?.start || selectedDate || new Date(), "yyyy-MM-dd")
  );
  const [startTime, setStartTime] = useState(
    format(initial?.start || selectedDate || setHours(new Date(), 9), "HH:mm")
  );
  const [endDate, setEndDate] = useState(
    format(initial?.end || selectedDate || new Date(), "yyyy-MM-dd")
  );
  const [endTime, setEndTime] = useState(
    format(initial?.end || selectedDate || setHours(new Date(), 10), "HH:mm")
  );
  const [isAllDay, setIsAllDay] = useState(initial?.allDay || false);
  const [repeat, setRepeat] = useState(initial?.repeat || "Does not repeat");
  const [guests, setGuests] = useState(initial?.attendees || "");
  const [addMeet, setAddMeet] = useState(false);
  const [location, setLocation] = useState(initial?.location || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [busyStatus, setBusyStatus] = useState(initial?.busyStatus || "Busy");
  const [visibility, setVisibility] = useState(initial?.visibility || "Default visibility");
  const [notification, setNotification] = useState(initial?.notification || "30 minutes before");
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* --- When editing existing event --- */
  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setType(initial.type || "Meeting");
      setStartDate(format(initial.start, "yyyy-MM-dd"));
      setStartTime(format(initial.start, "HH:mm"));
      setEndDate(format(initial.end, "yyyy-MM-dd"));
      setEndTime(format(initial.end, "HH:mm"));
      setIsAllDay(Boolean(initial.allDay));
      setRepeat(initial.repeat || "Does not repeat");
      setGuests(initial.attendees || "");
      setLocation(initial.location || "");
      setDescription(initial.description || "");
      setBusyStatus(initial.busyStatus || "Busy");
      setVisibility(initial.visibility || "Default visibility");
      setNotification(initial.notification || "30 minutes before");
    }
  }, [initial]);

  /* --- Save Event --- */
  const handleSubmit = (e) => {
    e.preventDefault();
    const start = isAllDay ? new Date(`${startDate}T00:00`) : new Date(`${startDate}T${startTime}`);
    const end = isAllDay ? new Date(`${endDate}T23:59`) : new Date(`${endDate}T${endTime}`);
    const payload = {
      id: initial?.id || null,
      title: title.trim(),
      type,
      start,
      end,
      allDay: isAllDay,
      repeat,
      attendees: guests.trim(),
      addMeet,
      location: location.trim(),
      description: description.trim(),
      busyStatus,
      visibility,
      notification,
    };
    onSave(payload);
  };

  /* --- Delete Flow --- */
  const requestDelete = () => setConfirmOpen(true);
  const cancelDelete = () => setConfirmOpen(false);
  const confirmDelete = () => {
    setConfirmOpen(false);
    if (initial?.id) onDelete(initial.id);
  };

  return (
    <>
      <div className="fixed top-0 right-0 w-[400px] h-full bg-white border-l shadow-2xl z-50 animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div>
            <div className="text-xs opacity-80">Event Title</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add title..."
              className="mt-1 w-[300px] bg-transparent border-b border-white/50 px-1 py-1 text-lg font-medium placeholder-white/70 focus:outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition"
            title="Close"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-auto h-[calc(100%-72px)] text-gray-800">
          {/* Date and Time */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Date & Time</label>
            <div className="flex flex-wrap items-center gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded-lg px-2 py-2" />
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border rounded-lg px-2 py-2" disabled={isAllDay} />
              <span className="text-gray-400">—</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded-lg px-2 py-2" />
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border rounded-lg px-2 py-2" disabled={isAllDay} />
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)} />
                All day
              </label>
              <button type="button" className="text-blue-600 hover:underline">Time zone</button>
            </div>
          </div>

          {/* Repeat */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Repeat</label>
            <select value={repeat} onChange={(e) => setRepeat(e.target.value)} className="w-full border rounded-lg px-2 py-2">
              <option>Does not repeat</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
              <option>Custom...</option>
            </select>
          </div>

          {/* Guests */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Guests</label>
            <input value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Add guests (emails separated by commas)" className="w-full border rounded-lg px-2 py-2" />
          </div>

          {/* Meet + Location */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={addMeet} onChange={(e) => setAddMeet(e.target.checked)} />
              Add Google Meet link
            </label>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Add location" className="w-full border rounded-lg px-2 py-2" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
              className="w-full border rounded-lg p-2 h-24 resize-none"
            />
            <div className="text-sm text-blue-600 mt-2 cursor-pointer hover:underline">Attach from Google Drive</div>
          </div>

          {/* Other Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Event Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded-lg px-2 py-2">
                <option>Meeting</option>
                <option>Holiday</option>
                <option>Task</option>
                <option>Reminder</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Show as</label>
              <select value={busyStatus} onChange={(e) => setBusyStatus(e.target.value)} className="w-full border rounded-lg px-2 py-2">
                <option>Busy</option>
                <option>Free</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Visibility</label>
              <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="w-full border rounded-lg px-2 py-2">
                <option>Default visibility</option>
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Notification</label>
              <select value={notification} onChange={(e) => setNotification(e.target.value)} className="w-full border rounded-lg px-2 py-2">
                <option>30 minutes before</option>
                <option>10 minutes before</option>
                <option>1 hour before</option>
                <option>1 day before</option>
              </select>
              <div className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline">Add another notification</div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-3">
              {initial?.id && (
                <button
                  type="button"
                  onClick={requestDelete}
                  className="px-4 py-2 text-sm border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 shadow-md transition"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete event"
        message="Are you sure you want to delete this event?"
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}


