import React, { useEffect, useState } from "react";
import {
  FiBell,
  FiMessageSquare,
  FiCalendar,
  FiAlertCircle,
  FiInfo,
  FiPhoneCall,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";

const dummySummary = {
  notices: 8,
  messages: 12,
  upcomingEvents: 3,
  unreadComplaints: 1,
};

const dummyNotices = [
  {
    id: "notice-1",
    title: "Parent-Teacher Meeting Schedule",
    date: "2025-09-20",
    description:
      "Annual PTM for Grade 8 will be held on 25th September. Slots will be shared shortly.",
    priority: "High",
  },
  {
    id: "notice-2",
    title: "Sports Day Instructions",
    date: "2025-09-18",
    description:
      "Students to report by 8:00 AM in house uniforms. Lunch will be provided on campus.",
    priority: "Medium",
  },
  {
    id: "notice-3",
    title: "Term 1 Result Announcement",
    date: "2025-09-15",
    description:
      "Results will be published on the portal on 22nd September at 6:00 PM.",
    priority: "Low",
  },
];

const dummyMessages = [
  {
    id: "msg-1",
    sender: "Class Teacher",
    subject: "Homework Reminder",
    date: "2025-09-19",
    preview:
      "Please ensure the science project is submitted by Monday. Reach out for any queries.",
    unread: true,
  },
  {
    id: "msg-2",
    sender: "Activity Coordinator",
    subject: "Consent Form Pending",
    date: "2025-09-17",
    preview:
      "Kindly submit the signed consent form for the museum visit before Friday.",
    unread: false,
  },
  {
    id: "msg-3",
    sender: "Transport Incharge",
    subject: "Route Timing Update",
    date: "2025-09-16",
    preview:
      "Morning pickup timings have been advanced by 10 minutes for your route.",
    unread: false,
  },
];

const dummyEvents = [
  {
    id: "event-1",
    title: "Parent-Teacher Meeting",
    date: "2025-09-25",
    time: "10:00 AM",
    location: "Block B, Room 204",
  },
  {
    id: "event-2",
    title: "Annual Sports Day",
    date: "2025-10-02",
    time: "08:30 AM",
    location: "School Ground",
  },
  {
    id: "event-3",
    title: "Career Guidance Webinar",
    date: "2025-10-10",
    time: "05:00 PM",
    location: "Online",
  },
];

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-blue-100 text-blue-700",
};

export default function ParentCommunication() {
  const [summary, setSummary] = useState(dummySummary);
  const [notices, setNotices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Mimic API responses with dummy data
    setNotices(dummyNotices);
    setMessages(dummyMessages);
    setEvents(dummyEvents);
  }, []);

  return (
    <div className="p-6">
      <p className="text-gray-500 text-sm mb-2">Communication &gt;</p>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-700">
        <FiBell /> Child Communication Hub
      </h2>

      <div className="bg-gray-200 p-6 rounded-lg shadow-sm border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            icon={<FiBell className="w-6 h-6" />}
            label="Active Notices"
            value={summary.notices}
            accent="bg-blue-100 text-blue-700"
          />
          <SummaryCard
            icon={<FiMessageSquare className="w-6 h-6" />}
            label="New Messages"
            value={summary.messages}
            accent="bg-green-100 text-green-700"
          />
          <SummaryCard
            icon={<FiCalendar className="w-6 h-6" />}
            label="Upcoming Events"
            value={summary.upcomingEvents}
            accent="bg-purple-100 text-purple-700"
          />
          <SummaryCard
            icon={<FiAlertCircle className="w-6 h-6" />}
            label="Open Complaints"
            value={summary.unreadComplaints}
            accent="bg-orange-100 text-orange-700"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <header className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiInfo className="text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Notices
                </h3>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View All <FiArrowRight />
              </button>
            </header>

            <div className="space-y-4">
              {notices.map((notice) => (
                <article
                  key={notice.id}
                  className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-gray-800">
                        {notice.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {notice.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityStyles[notice.priority]}`}
                    >
                      {notice.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Posted on {notice.date}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <header className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiMessageSquare className="text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Latest Messages
                </h3>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                Open Inbox <FiArrowRight />
              </button>
            </header>

            <div className="space-y-3">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`p-4 border border-gray-100 rounded-lg transition-all hover:shadow-sm ${
                    message.unread ? "bg-green-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        From {message.sender}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">{message.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {message.preview}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Upcoming Events & Meetings
              </h3>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Sync Calendar <FiArrowRight />
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:bg-white transition-colors"
              >
                <p className="text-sm font-semibold text-gray-800">
                  {event.title}
                </p>
                <p className="text-sm text-gray-500 mt-2">{event.date}</p>
                <p className="text-xs text-gray-400">{event.time}</p>
                <p className="text-xs text-gray-500 mt-2">{event.location}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiPhoneCall className="text-blue-600" />
            Quick Support & Contacts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SupportCard
              title="Class Teacher"
              name="Ms. Riya Malhotra"
              contact="riya.m@vedaschool.edu"
              icon={<FiMail />}
            />
            <SupportCard
              title="School Office"
              name="+91 98765 43210"
              contact="office@vedaschool.edu"
              icon={<FiPhoneCall />}
            />
            <SupportCard
              title="Transport Helpdesk"
              name="+91 91234 56789"
              contact="transport@vedaschool.edu"
              icon={<FiPhoneCall />}
            />
            <SupportCard
              title="Counsellor"
              name="counsellor@vedaschool.edu"
              contact="Available 9 AM - 4 PM"
              icon={<FiInfo />}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, accent }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-full ${accent}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function SupportCard({ title, name, contact, icon }) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 hover:bg-white transition-colors">
      <div className="flex items-center gap-2 text-gray-700">
        {icon}
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="text-sm text-gray-600 mt-2 font-medium">{name}</p>
      <p className="text-xs text-gray-500 mt-1">{contact}</p>
    </div>
  );
}

