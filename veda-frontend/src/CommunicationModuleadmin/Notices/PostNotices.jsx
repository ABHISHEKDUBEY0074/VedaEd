import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostNotices() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [noticeDate, setNoticeDate] = useState("");
  const [publishOn, setPublishOn] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [roles, setRoles] = useState({
    Student: false,
    Parent: false,
    Admin: false,
    Teacher: false,
    Accountant: false,
    Librarian: false,
    Receptionist: false,
    "Super Admin": false,
  });
  const [channels, setChannels] = useState({ Email: false, SMS: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedRoles = Object.keys(roles).filter((r) => roles[r]);
    const selectedChannels = Object.keys(channels).filter((c) => channels[c]);

    const entry = {
      title: title.trim(),
      message: message.trim(),
      roles: selectedRoles,
      channels: selectedChannels,
      noticeDate: noticeDate || null,
      publishOn: publishOn || null,
      attachmentName: attachmentName || null,
      sentAt: new Date().toISOString(),
    };

    try {
      const raw = localStorage.getItem("sent_notices_logs");
      const existing = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(existing) ? [entry, ...existing] : [entry];
      localStorage.setItem("sent_notices_logs", JSON.stringify(next));
    } catch {
      localStorage.setItem("sent_notices_logs", JSON.stringify([entry]));
    }

    navigate("/communication/logs");
  };

  const canSubmit =
    title.trim().length > 0 &&
    message.trim().length > 0 &&
    (roles.Student ||
      roles.Parent ||
      roles.Admin ||
      roles.Teacher ||
      roles.Accountant ||
      roles.Librarian ||
      roles.Receptionist ||
      roles["Super Admin"]) &&
    (channels.Email || channels.SMS);

  const toggleRole = (role) =>
    setRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  const toggleChannel = (ch) =>
    setChannels((prev) => ({ ...prev, [ch]: !prev[ch] }));

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setAttachmentName(file ? file.name : "");
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Post Notices</h3>
      <div className="bg-white p-4 rounded shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notice title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notice Date
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={noticeDate}
                onChange={(e) => setNoticeDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publish On
              </label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={publishOn}
                onChange={(e) => setPublishOn(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your notice message"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachment
            </label>
            <input type="file" onChange={onFileChange} />
            {attachmentName && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {attachmentName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Message To
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(roles).map((role) => (
                  <label key={role} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={roles[role]}
                      onChange={() => toggleRole(role)}
                    />
                    <span className="text-sm">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                Send By
              </div>
              <div className="flex gap-6">
                {Object.keys(channels).map((ch) => (
                  <label key={ch} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={channels[ch]}
                      onChange={() => toggleChannel(ch)}
                    />
                    <span className="text-sm">{ch}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                canSubmit ? "bg-blue-600" : "bg-blue-300 cursor-not-allowed"
              }`}
              disabled={!canSubmit}
            >
              Send Notice
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={() => navigate("/communication/logs")}
            >
              View Logs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
