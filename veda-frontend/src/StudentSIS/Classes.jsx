// src/Student/MyClasses.jsx
import React, { useState } from "react";
import {
  FiBookOpen,
  FiUser,
  FiClock,
  FiArrowLeft,
  FiFileText,
  FiStar,
  FiFolder,
  FiAlertCircle,
  FiLayers,
  FiCheckCircle,
} from "react-icons/fi";
import HelpInfo from "../components/HelpInfo";

export default function MyClasses() {
  const [selectedClass, setSelectedClass] = useState(null);

  // DUMMY CLASS DATA - emojis replaced with icons
  const classes = [
    {
      id: 1,
      name: "Mathematics - Grade 10",
      teacher: "Mr. Rohan Sharma",
      time: "Mon–Fri | 09:00–09:45 AM",
      room: "Room 204",
      overview:
        "This Mathematics class covers Algebra, Geometry, Trigonometry and Real Numbers with weekly tests and assignments.",
      materials: [
        { title: "Chapter 1 Notes (PDF)", type: "pdf", size: "1.2 MB" },
        { title: "Algebra Video Lecture", type: "video", size: "15 min" },
        { title: "Worksheet – Polynomials", type: "doc", size: "400 KB" },
      ],
      assignments: [
        {
          title: "Algebra Assignment",
          due: "25 Nov",
          status: "Pending",
          marks: "-",
        },
        {
          title: "Geometry Class Test",
          due: "Completed",
          status: "Submitted",
          marks: "18/20",
        },
      ],
      attendance: { present: 42, absent: 3 },
      announcements: [
        { msg: "Chapter 4 Test on Monday!", date: "18 Nov" },
        { msg: "New worksheet uploaded.", date: "14 Nov" },
      ],
    },

    {
      id: 2,
      name: "Science - Grade 10",
      teacher: "Ms. Anjali Gupta",
      time: "Mon–Fri | 10:00–10:45 AM",
      room: "Lab 1",
      overview:
        "Science includes Physics, Chemistry, and Biology modules with regular experiments and activities.",
      materials: [
        { title: "Biology Notes (PDF)", type: "pdf", size: "1.5 MB" },
        { title: "Chemistry Lab Guide", type: "doc", size: "350 KB" },
      ],
      assignments: [
        {
          title: "Physics Numericals",
          due: "28 Nov",
          status: "Pending",
          marks: "-",
        },
      ],
      attendance: { present: 40, absent: 5 },
      announcements: [{ msg: "Bring lab coat tomorrow!", date: "15 Nov" }],
    },
  ];

  // DETAIL VIEW
  const DetailView = ({ cls }) => (
    <div className="bg-white p-3 rounded-lg shadow-sm border">
      {/* BACK */}
      <button
        onClick={() => setSelectedClass(null)}
        className="flex items-center gap-2 mb-5 text-blue-600 hover:underline"
      >
        <FiArrowLeft /> Back to Classes
      </button>

      {/* TITLE */}
      <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
        <FiBookOpen /> {cls.name}
      </h2>

      <p className="text-gray-600 mt-1 flex items-center gap-2">
        <FiUser /> {cls.teacher}
      </p>
      <p className="text-gray-600 mt-1 flex items-center gap-2">
        <FiClock /> {cls.time}
      </p>
      <p className="text-gray-600 mt-1 flex items-center gap-2">
        <FiLayers /> {cls.room}
      </p>

      {/* OVERVIEW */}
      <div className="mt-6 bg-gray-50 rounded-xl border p-4">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <FiAlertCircle /> Class Overview
        </h3>
        <p className="text-gray-700">{cls.overview}</p>
      </div>

      {/* MATERIALS */}
      <div className="mt-6 bg-gray-50 rounded-xl border p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FiFolder /> Study Materials
        </h3>

        {cls.materials.map((m, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b py-2"
          >
            <div>
              <p className="font-medium">{m.title}</p>
              <p className="text-gray-500 text-sm">
                {m.type.toUpperCase()} • {m.size}
              </p>
            </div>
            <FiFileText className="text-lg" />
          </div>
        ))}
      </div>

      {/* ASSIGNMENTS */}
      <div className="mt-6 bg-gray-50 rounded-xl border p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FiBookOpen /> Assignments
        </h3>

        {cls.assignments.map((a, i) => (
          <div key={i} className="border-b py-2">
            <p className="font-medium">{a.title}</p>
            <p className="text-gray-500 text-sm">Due: {a.due}</p>

            <p
              className={`text-sm mt-1 ${
                a.status === "Pending" ? "text-red-500" : "text-green-600"
              }`}
            >
              Status: {a.status}
            </p>

            <p className="text-gray-700">Marks: {a.marks}</p>
          </div>
        ))}
      </div>

      {/* ATTENDANCE */}
      <div className="mt-6 bg-gray-50 rounded-xl border p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FiCheckCircle /> Attendance
        </h3>
        <p>Present: {cls.attendance.present}</p>
        <p>Absent: {cls.attendance.absent}</p>
      </div>

      {/* ANNOUNCEMENTS */}
      <div className="mt-6 bg-gray-50 rounded-xl border p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <FiAlertCircle /> Announcements
        </h3>

        {cls.announcements.map((n, i) => (
          <div key={i} className="border-b py-2">
            <p className="font-medium">{n.msg}</p>
            <p className="text-gray-500 text-sm">Date: {n.date}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // MAIN UI
  return (
    <div className="p-0 m-0 min-h-screen">
      {/* BREADCRUMB */}
      <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        Classes &gt;
      </p>

      {/* HEADING */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Classes</h2>

        <HelpInfo
          title="My Classes Help"
          description={`Page Description: View all your enrolled classes and subjects. Access class details, study materials, assignments, announcements, and attendance information for each class. Click on any class card to open the detailed view.


1.1 Classes Overview

View all classes you are enrolled in.
Explore teacher information, class timing, and classroom details.
Open a class card to see complete class resources and announcements.

Sections:
- Classes Grid: Visual cards showing subject name, teacher, schedule, and room information for every class
- Quick Actions: “View Class” button on each card to open the detailed class page
- Class Detail View: In-depth view that shows overview, study materials, assignments, attendance, and announcements
- Class Overview Block: Summary of curriculum topics and learning objectives
- Study Materials Block: Downloadable notes, worksheets, and video lectures with file type and size
- Assignments Block: List of assignments with due date, submission status, and marks
- Attendance Block: Present/absent count specific to that class
- Announcements Block: Important updates and reminders from the teacher`}
        />
      </div>

      {/* WHITE INNER WRAPPER */}
      {!selectedClass ? (
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Classes List</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((cls) => (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className="bg-gray-50 rounded-xl border p-5 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <FiBookOpen className=" text-blue-600" />
                  <FiStar className="text-gray-400" />
                </div>

                <h3 className=" text-lg mt-3">{cls.name}</h3>

                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <FiUser /> {cls.teacher}
                </p>

                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <FiClock /> {cls.time}
                </p>

                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <FiLayers /> {cls.room}
                </p>

                <button className="mt-4 px-4 py-1 bg-blue-600 text-white rounded-lg">
                  View Class
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DetailView cls={selectedClass} />
      )}
    </div>
  );
}
