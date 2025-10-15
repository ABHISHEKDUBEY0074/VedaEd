import React, { useState, useEffect } from "react";
import { FiMail, FiCalendar, FiUser, FiDownload } from "react-icons/fi";
import CommunicationAPI from "../communicationAPI";

export default function NoticesOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real student ID from database
  const studentId = "68c27fb96a063075c9a73ee2";
  const studentModel = "Student";

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await CommunicationAPI.getPublishedNotices(
        studentId,
        studentModel
      );
      setNotices(response.data || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
      setError("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  // Dummy data for received notices (fallback)
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
        "Parent-Teacher meetings are scheduled for next week. Please check the attached schedule for your class timing.",
      sender: "Class Teacher - Grade 8A",
      sentDate: "2024-01-14",
      publishDate: "2024-01-14",
      roles: ["Student", "Parent"],
      channels: ["Email"],
      attachment: "ptm_schedule.pdf",
      isRead: true,
      priority: "medium",
    },
    {
      id: 3,
      title: "Library Book Return Reminder",
      message:
        "Please return your overdue library books by the end of this week to avoid late fees.",
      sender: "Library Department",
      sentDate: "2024-01-13",
      publishDate: "2024-01-13",
      roles: ["Student"],
      channels: ["SMS"],
      attachment: null,
      isRead: false,
      priority: "low",
    },
    {
      id: 4,
      title: "Sports Day Preparation",
      message:
        "Sports day is coming up next month. Students interested in participating should register with their class teachers.",
      sender: "Sports Department",
      sentDate: "2024-01-12",
      publishDate: "2024-01-12",
      roles: ["Student", "Parent"],
      channels: ["Email", "SMS"],
      attachment: "sports_day_info.pdf",
      isRead: true,
      priority: "medium",
    },
    {
      id: 5,
      title: "Exam Schedule - Mid Term",
      message:
        "Mid-term examination schedule has been published. Please check the attached timetable and prepare accordingly.",
      sender: "Examination Department",
      sentDate: "2024-01-11",
      publishDate: "2024-01-11",
      roles: ["Student", "Parent"],
      channels: ["Email"],
      attachment: "exam_schedule.pdf",
      isRead: false,
      priority: "high",
    },
  ];

  // Use real notices from API, fallback to dummy data if needed
  const displayNotices = notices.length > 0 ? notices : dummyNotices;

  const filteredNotices = displayNotices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notice.author?.personalInfo?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesRole =
      filterRole === "all" ||
      notice.targetAudience === "all" ||
      (filterRole === "Student" && notice.targetAudience === "students") ||
      (filterRole === "Parent" && notice.targetAudience === "parents") ||
      (filterRole === "Teacher" && notice.targetAudience === "teachers");

    return matchesSearch && matchesRole;
  });

  const unreadCount = displayNotices.filter(
    (notice) =>
      !notice.views?.some((view) => view.user.toString() === studentId)
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-0 bg-gray-100 min-h-screen">
        <div className="bg-gray-200 p-6 shadow-sm border border-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notices...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-0 bg-gray-100 min-h-screen">
        <div className="bg-gray-200 p-6 shadow-sm border border-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchNotices}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 bg-gray-100 min-h-screen">
      <div className="bg-gray-200 p-6 shadow-sm border border-gray-100">
        {/* Header Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Received Notices</h3>
            <div className="flex items-center gap-2">
              <FiMail className="text-blue-600" />
              <span className="text-sm text-gray-600">
                {unreadCount} unread notices
              </span>
            </div>
          </div>

          {/* Search and Filter */}
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
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="Student">Student</option>
              <option value="Parent">Parent</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => {
              const isRead = notice.views?.some(
                (view) => view.user.toString() === studentId
              );
              const authorName =
                notice.author?.personalInfo?.name || "Unknown Author";

              return (
                <div
                  key={notice._id || notice.id}
                  className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                    isRead ? "border-gray-300" : "border-blue-500"
                  } ${!isRead ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4
                          className={`font-semibold ${
                            !isRead ? "text-blue-900" : "text-gray-900"
                          }`}
                        >
                          {notice.title}
                        </h4>
                        {!isRead && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
                            notice.priority
                          )}`}
                        >
                          {notice.priority}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {notice.content || notice.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiUser />
                          <span>{authorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiCalendar />
                          <span>
                            Published: {formatDate(notice.publishDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiMail />
                          <span>{notice.targetAudience}</span>
                        </div>
                        {notice.attachments &&
                          notice.attachments.length > 0 && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <FiDownload />
                              <span>{notice.attachments[0].originalName}</span>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      {notice.attachments && notice.attachments.length > 0 && (
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <FiMail className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notices found
              </h3>
              <p className="text-gray-500">
                {searchQuery || filterRole !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't received any notices yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
