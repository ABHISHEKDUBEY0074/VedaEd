import React, { useState } from "react";
import { FiMail, FiCalendar, FiUser, FiDownload } from "react-icons/fi";

export default function NoticesOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("Parent");

  // Dummy data (same as student)
  const dummyNotices = [
    {
      id: 1,
      title: "Holiday Notice - Diwali Break",
      message:
        "School will remain closed from 12th to 16th November for Diwali celebrations. Classes will resume on 17th November.",
      sender: "Principal Office",
      sentDate: "2024-01-15",
      publishDate: "2024-01-15",
      roles: ["Student", "Parent"],
      channels: ["Email", "SMS"],
      attachment: "holiday_schedule.pdf",
      isRead: false,
      priority: "high",
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting Schedule",
      message:
        "Parent-Teacher meetings are scheduled for next week. Please check the attached schedule for your child’s class timing.",
      sender: "Class Teacher - Grade 8A",
      sentDate: "2024-01-14",
      publishDate: "2024-01-14",
      roles: ["Parent"],
      channels: ["Email"],
      attachment: "ptm_schedule.pdf",
      isRead: true,
      priority: "medium",
    },
    {
      id: 3,
      title: "Exam Schedule - Mid Term",
      message:
        "Mid-term examination schedule has been published. Please check the attached timetable for your child’s exams.",
      sender: "Examination Department",
      sentDate: "2024-01-11",
      publishDate: "2024-01-11",
      roles: ["Parent"],
      channels: ["Email"],
      attachment: "exam_schedule.pdf",
      isRead: false,
      priority: "high",
    },
  ];

  const filteredNotices = dummyNotices.filter(
    (n) =>
      n.roles.includes("Parent") &&
      (n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.sender.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const unreadCount = dummyNotices.filter(
    (n) => n.roles.includes("Parent") && !n.isRead
  ).length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div>
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Received Parent Notices</h3>
          <div className="flex items-center gap-2">
            <FiMail className="text-blue-600" />
            <span className="text-gray-600">
              {unreadCount} unread notices
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                notice.isRead ? "border-gray-300" : "border-blue-500"
              } ${!notice.isRead ? "bg-blue-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4
                      className={`font-semibold ${
                        !notice.isRead ? "text-blue-900" : "text-gray-900"
                      }`}
                    >
                      {notice.title}
                    </h4>
                    {!notice.isRead && (
                      <span className="bg-blue-600 text-white  px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    <span
                      className={` px-2 py-1 rounded-full border ${getPriorityColor(
                        notice.priority
                      )}`}
                    >
                      {notice.priority}
                    </span>
                  </div>

                  <p className="text-gray-700  mb-3 line-clamp-2">
                    {notice.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4  text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiUser />
                      <span>{notice.sender}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar />
                      <span>Sent: {formatDate(notice.sentDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiMail />
                      <span>{notice.channels.join(", ")}</span>
                    </div>
                    {notice.attachment && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <FiDownload />
                        <span>{notice.attachment}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <button className="text-blue-600 hover:text-blue-800  font-medium">
                    View Details
                  </button>
                  {notice.attachment && (
                    <button className="text-gray-600 hover:text-gray-800 ">
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <FiMail className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notices for parents
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search."
                : "No notices related to your child yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
