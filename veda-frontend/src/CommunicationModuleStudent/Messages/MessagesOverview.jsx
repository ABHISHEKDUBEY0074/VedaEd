import React, { useState } from "react";
import {
  FiMessageCircle,
  FiCalendar,
  FiUser,
  FiSend,
  FiInbox,
} from "react-icons/fi";

export default function MessagesOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");

  // Dummy data for received messages
  const dummyMessages = [
    {
      id: 1,
      title: "Assignment Submission Reminder",
      message:
        "Dear student, please submit your mathematics assignment by tomorrow. Late submissions will not be accepted.",
      sender: "Mrs. Sunita Verma",
      senderRole: "Teacher",
      sentDate: "2024-01-15",
      messageType: "Individual",
      channel: "SMS",
      isRead: false,
      priority: "high",
      class: "Grade 8A",
    },
    {
      id: 2,
      title: "Class Test Schedule",
      message:
        "Science class test is scheduled for Friday. Please prepare chapters 5-8 thoroughly.",
      sender: "Mr. Anil Kumar",
      senderRole: "Teacher",
      sentDate: "2024-01-14",
      messageType: "Class",
      channel: "Email",
      isRead: true,
      priority: "medium",
      class: "Grade 8A",
    },
    {
      id: 3,
      title: "Library Book Return",
      message:
        "Your library book 'Advanced Mathematics' is due for return. Please return it to avoid late fees.",
      sender: "Library Staff",
      senderRole: "Staff",
      sentDate: "2024-01-13",
      messageType: "Individual",
      channel: "SMS",
      isRead: false,
      priority: "low",
      class: "Grade 8A",
    },
    {
      id: 4,
      title: "Sports Day Participation",
      message:
        "Students interested in participating in Sports Day events should register with their class teachers by this week.",
      sender: "Sports Department",
      senderRole: "Staff",
      sentDate: "2024-01-12",
      messageType: "Group",
      channel: "Email",
      isRead: true,
      priority: "medium",
      class: "All Classes",
    },
    {
      id: 5,
      title: "Parent Meeting Invitation",
      message:
        "Parent-teacher meeting is scheduled for next week. Your parents are invited to discuss your progress.",
      sender: "Class Teacher",
      senderRole: "Teacher",
      sentDate: "2024-01-11",
      messageType: "Individual",
      channel: "Email",
      isRead: false,
      priority: "high",
      class: "Grade 8A",
    },
    {
      id: 6,
      title: "Exam Preparation Tips",
      message:
        "Here are some important tips for your upcoming exams: 1) Revise daily 2) Practice previous year papers 3) Maintain proper sleep schedule.",
      sender: "Principal Office",
      senderRole: "Admin",
      sentDate: "2024-01-10",
      messageType: "Group",
      channel: "SMS",
      isRead: true,
      priority: "medium",
      class: "All Classes",
    },
  ];

  const filteredMessages = dummyMessages.filter((message) => {
    const matchesSearch =
      message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === "all" || message.messageType === filterType;
    const matchesChannel =
      filterChannel === "all" || message.channel === filterChannel;

    return matchesSearch && matchesType && matchesChannel;
  });

  const unreadCount = dummyMessages.filter((message) => !message.isRead).length;

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

  const getMessageTypeColor = (type) => {
    switch (type) {
      case "Individual":
        return "bg-blue-100 text-blue-800";
      case "Class":
        return "bg-green-100 text-green-800";
      case "Group":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Received Messages</h3>
          <div className="flex items-center gap-2">
            <FiInbox className="text-blue-600" />
            <span className="text-sm text-gray-600">
              {unreadCount} unread messages
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="Individual">Individual</option>
            <option value="Class">Class</option>
            <option value="Group">Group</option>
          </select>
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="SMS">SMS</option>
            <option value="Email">Email</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
                message.isRead ? "border-gray-300" : "border-blue-500"
              } ${!message.isRead ? "bg-blue-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4
                      className={`font-semibold ${
                        !message.isRead ? "text-blue-900" : "text-gray-900"
                      }`}
                    >
                      {message.title}
                    </h4>
                    {!message.isRead && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
                        message.priority
                      )}`}
                    >
                      {message.priority}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getMessageTypeColor(
                        message.messageType
                      )}`}
                    >
                      {message.messageType}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                    {message.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiUser />
                      <span>
                        {message.sender} ({message.senderRole})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar />
                      <span>Sent: {formatDate(message.sentDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiSend />
                      <span>{message.channel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiMessageCircle />
                      <span>Class: {message.class}</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <FiMessageCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No messages found
            </h3>
            <p className="text-gray-500">
              {searchQuery || filterType !== "all" || filterChannel !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You haven't received any messages yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
