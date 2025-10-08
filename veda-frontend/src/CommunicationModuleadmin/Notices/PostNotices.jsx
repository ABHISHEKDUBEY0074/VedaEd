import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// API Endpoints for future backend integration
const API_ENDPOINTS = {
  CREATE_NOTICE: "/api/notices",
  UPLOAD_ATTACHMENT: "/api/notices/upload",
};

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedRoles = Object.keys(roles).filter((r) => roles[r]);
    const selectedChannels = Object.keys(channels).filter((c) => channels[c]);

    const noticeData = {
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
      // TODO: Replace with actual API call
      // const response = await fetch(API_ENDPOINTS.CREATE_NOTICE, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(noticeData)
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to create notice');
      // }

      // For now, clear localStorage and show success message
      localStorage.removeItem("sent_notices_logs");

      alert(
        "Notice created successfully! (localStorage cleared - ready for backend integration)"
      );
      navigate("/communication/logs");
    } catch (error) {
      console.error("Error creating notice:", error);
      alert("Failed to create notice. Please try again.");
    }
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
    <div className="p-0 bg-gray-100 min-h-screen">
      {/* Outer Gray Container */}
      <div className="bg-gray-200 p-6 shadow-sm border border-gray-100">
        {/* White Inner Box */}
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Post Notices</h3>
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

        {/* Message To Container */}
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto mt-6">
          <h3 className="text-lg font-semibold mb-4">Message To</h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(roles).map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={roles[role]}
                    onChange={() => toggleRole(role)}
                    className="w-4 h-4"
                  />
                  {role}
                </label>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-4">
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
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="ml-auto flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="sendOption"
                    value="now"
                    defaultChecked
                    className="w-4 h-4"
                  />
                  Send Now
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="sendOption"
                    value="schedule"
                    className="w-4 h-4"
                  />
                  Schedule
                </label>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
