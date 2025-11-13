import React, { useMemo, useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCalendar,
  FiBookOpen,
  FiUser,
  FiClock,
  FiChevronRight,
  FiCopy,
  FiEdit2,
} from "react-icons/fi";
import { format } from "date-fns";

const timetableSummaries = [
  {
    id: 1,
    title: "Class 10 A - Academic Year 2025",
    className: "Class 10",
    section: "A",
    classTeacher: "Anita Sharma",
    lastPublished: new Date(2025, 10, 4, 10, 15),
    version: "v4.2",
    status: "Published",
    coverage: "100% subjects mapped",
  },
  {
    id: 2,
    title: "Class 9 B - Monsoon Term",
    className: "Class 9",
    section: "B",
    classTeacher: "Rahul Mehta",
    lastPublished: new Date(2025, 9, 24, 16, 30),
    version: "v2.9",
    status: "Draft",
    coverage: "3 subjects pending slots",
  },
  {
    id: 3,
    title: "Class 8 C - Revised (Sports Week)",
    className: "Class 8",
    section: "C",
    classTeacher: "Priya Nair",
    lastPublished: new Date(2025, 10, 9, 9, 45),
    version: "v1.6",
    status: "Needs Review",
    coverage: "Conflicting slot detected",
  },
  {
    id: 4,
    title: "Class 7 A - Winter Schedule",
    className: "Class 7",
    section: "A",
    classTeacher: "Varun Kapoor",
    lastPublished: new Date(2025, 8, 30, 12, 0),
    version: "v3.3",
    status: "Published",
    coverage: "100% subjects mapped",
  },
];

const weeklyTemplate = {
  Monday: [
    { time: "08:00", subject: "Mathematics", teacher: "Anita Sharma", room: "101" },
    { time: "09:00", subject: "Physics", teacher: "Nikhil Rao", room: "Lab 1" },
    { time: "11:00", subject: "English", teacher: "Sneha Singh", room: "107" },
    { time: "13:00", subject: "Computer Science", teacher: "Rohit Jain", room: "Lab 2" },
  ],
  Tuesday: [
    { time: "08:00", subject: "Chemistry", teacher: "Shalini Verma", room: "Lab 3" },
    { time: "10:00", subject: "Mathematics", teacher: "Anita Sharma", room: "101" },
    { time: "12:00", subject: "History", teacher: "Vivek Patel", room: "204" },
  ],
  Wednesday: [
    { time: "08:00", subject: "Biology", teacher: "Rajeev Iyer", room: "202" },
    { time: "10:00", subject: "Hindi", teacher: "Preeti Kaur", room: "205" },
    { time: "13:00", subject: "Sports", teacher: "Coach Arjun", room: "Ground" },
  ],
  Thursday: [
    { time: "08:00", subject: "Mathematics", teacher: "Anita Sharma", room: "101" },
    { time: "10:00", subject: "Chemistry Lab", teacher: "Shalini Verma", room: "Lab 3" },
    { time: "12:00", subject: "Civics", teacher: "Neha Rao", room: "206" },
  ],
  Friday: [
    { time: "08:00", subject: "Physics", teacher: "Nikhil Rao", room: "Lab 1" },
    { time: "10:00", subject: "English", teacher: "Sneha Singh", room: "107" },
    { time: "12:00", subject: "Art", teacher: "Kavita Joshi", room: "Art Studio" },
  ],
  Saturday: [
    { time: "09:00", subject: "Mentor Hour", teacher: "Anita Sharma", room: "101" },
    { time: "11:00", subject: "Club Activities", teacher: "Activity Coordinators", room: "Auditorium" },
  ],
};

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"];
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const statusStyles = {
  Published: "bg-green-100 text-green-700",
  Draft: "bg-gray-100 text-gray-600",
  "Needs Review": "bg-orange-100 text-orange-700",
};

export default function TimetableSetup() {
  const [search, setSearch] = useState("");
  const [selectedTimetableId, setSelectedTimetableId] = useState(timetableSummaries[0].id);

  const filteredTimetables = useMemo(() => {
    if (!search.trim()) return timetableSummaries;
    return timetableSummaries.filter((item) =>
      `${item.title} ${item.classTeacher}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const selectedTimetable =
    filteredTimetables.find((item) => item.id === selectedTimetableId) ??
    filteredTimetables[0] ??
    timetableSummaries[0];

  const publishedCount = timetableSummaries.filter((item) => item.status === "Published").length;
  const draftCount = timetableSummaries.filter((item) => item.status === "Draft").length;
  const reviewCount = timetableSummaries.filter((item) => item.status === "Needs Review").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Calendar &gt; Timetable Setup</p>
          <h1 className="text-2xl font-bold text-gray-900">Timetable Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review curated class timetables, resolve conflicts, and publish updates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <FiDownload size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            <FiPlus size={18} />
            Create Timetable
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Timetables</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{timetableSummaries.length}</span>
            <span className="text-sm text-gray-400">classes</span>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Published</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-green-600">{publishedCount}</span>
            <span className="text-sm text-gray-400">live</span>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Draft</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-700">{draftCount}</span>
            <span className="text-sm text-gray-400">in progress</span>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Needs Review</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-orange-600">{reviewCount}</span>
            <span className="text-sm text-gray-400">attention</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            1 timetable has overlapping slots during sports week adjustments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">
        {/* Timetable list panel */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col">
          <div className="border-b border-gray-100 px-5 py-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by class, teacher, or version"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                <FiFilter size={14} />
                Filters
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                Published
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
                Draft
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
                Needs Review
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {filteredTimetables.map((item) => {
              const isActive = item.id === selectedTimetable.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedTimetableId(item.id)}
                  className={`w-full text-left border rounded-xl p-4 transition duration-150 ${
                    isActive ? "border-blue-300 bg-blue-50 shadow-sm" : "border-gray-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${statusStyles[item.status]}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.className} • Section {item.section} • {item.version}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">{item.coverage}</p>
                    </div>
                    <div className="text-xs text-gray-400 text-right space-y-1">
                      <p>Class Teacher</p>
                      <p className="font-medium text-gray-700">{item.classTeacher}</p>
                      <p>Updated {format(item.lastPublished, "dd MMM")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button className="flex items-center gap-1 text-xs text-blue-600 font-semibold uppercase tracking-wide">
                      View Draft
                      <FiChevronRight size={12} />
                    </button>
                    <span className="text-gray-300">•</span>
                    <button className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wide">
                      Change Log
                      <FiChevronRight size={12} />
                    </button>
                  </div>
                </button>
              );
            })}

            {filteredTimetables.length === 0 && (
              <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-gray-500">
                No timetables match “{search}”. Try adjusting filters or search keywords.
              </div>
            )}
          </div>
        </div>

        {/* Preview panel */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6">
          {selectedTimetable ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <FiCalendar size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedTimetable.title}</h2>
                      <p className="text-sm text-gray-500">
                        Last published on {format(selectedTimetable.lastPublished, "dd MMM yyyy, hh:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                    <FiCopy size={16} />
                    Duplicate
                  </button>
                  <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700">
                    Publish Update
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <FiBookOpen size={16} />
                    Subjects
                  </div>
                  <div className="mt-2 text-sm text-gray-900">
                    12 core subjects • 3 electives • 2 lab sessions
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <FiClock size={16} />
                    Slot Pattern
                  </div>
                  <div className="mt-2 text-sm text-gray-900">
                    45 min sessions • 2 breaks • Activity Friday
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <FiUser size={16} />
                    Assigned Team
                  </div>
                  <div className="mt-2 text-sm text-gray-900">
                    {selectedTimetable.classTeacher} (Class Teacher) • Academic Office
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Weekly Snapshot</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Monday to Saturday overview
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[760px] w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-3 text-left">Time</th>
                        {weekDays.map((day) => (
                          <th key={day} className="px-4 py-3 text-left">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((slot) => (
                        <tr key={slot} className="border-t border-gray-200">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-600">{slot}</td>
                          {weekDays.map((day) => {
                            const subjectBlock = weeklyTemplate[day]?.find((item) => item.time === slot);
                            return (
                              <td key={day} className="px-4 py-3 align-top">
                                {subjectBlock ? (
                                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 space-y-1">
                                    <div className="text-sm font-semibold text-blue-700">
                                      {subjectBlock.subject}
                                    </div>
                                    <div className="text-xs text-blue-600 flex items-center gap-1">
                                      <FiUser size={12} />
                                      {subjectBlock.teacher}
                                    </div>
                                    <div className="text-xs text-blue-600 flex items-center gap-1">
                                      <FiBookOpen size={12} />
                                      Room {subjectBlock.room}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-16 border border-dashed border-gray-200 rounded-lg bg-gray-50" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    Conflict alert: Sports practice overlaps with Computer Science on Wednesday.
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Suggestion: Move Computer Science to 2:00 PM slot or reassign lab session.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded-lg text-sm hover:bg-blue-100">
                  Resolve now
                  <FiChevronRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center border border-dashed border-gray-200 rounded-xl p-10 text-gray-500">
              <FiCalendar size={40} className="mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700">Select a timetable to preview</h3>
              <p className="text-sm text-gray-500 mt-2">
                Use the panel on the left to browse existing timetables or create a new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
