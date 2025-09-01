import React from "react";
import { Link, useParams } from "react-router-dom";

const ClassDetailPage = () => {
  const { classId, sectionId } = useParams();

  // Dummy data (later API se connect karna hoga)
  const classInfo = {
    room: "101",
    capacity: 60,
    teacher: "Mr. Sharma",
    subjects: [
      { name: "Maths", teacher: "Mr. Verma" },
      { name: "Science", teacher: "Ms. Gupta" },
      { name: "English", teacher: "Mr. Singh" },
      { name: "Social Science", teacher: "Ms. Rani" },
    ],
    students: [
      { roll: 1, name: "Aman Kumar", gender: "M" },
      { roll: 2, name: "Neha Sharma", gender: "F" },
      { roll: 3, name: "Rohit Verma", gender: "M" },
    ],
    timetable: [
      { day: "Monday", periods: ["Maths", "Science", "English", "SST"] },
      { day: "Tuesday", periods: ["English", "Maths", "Science", "SST"] },
    ],
    exams: [
      { name: "Unit Test 1", date: "2025-09-15", totalMarks: 50 },
      { name: "Half Yearly", date: "2025-12-10", totalMarks: 100 },
    ],
    assignments: [
      { title: "Maths Homework 1", due: "2025-09-05" },
      { title: "Science Project", due: "2025-09-12" },
    ],
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-6">
        <ol className="flex text-gray-600">
          <li>
            <Link to="/classes-schedules" className="text-blue-600 hover:underline">
              Classes & Schedules
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-gray-800 font-medium">
            Class {classId} - Section {sectionId}
          </li>
        </ol>
      </nav>

      {/* Page Title */}
      <h2 className="text-2xl font-bold mb-6">
        Class {classId} - Section {sectionId} Full Details
      </h2>

      {/* Overview */}
      <section className="mb-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Overview</h3>
        <p><strong>Room:</strong> {classInfo.room}</p>
        <p><strong>Capacity:</strong> {classInfo.capacity}</p>
        <p><strong>Class Teacher:</strong> {classInfo.teacher}</p>
      </section>

      {/* Subjects */}
      <section className="mb-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Subjects</h3>
        <ul className="list-disc pl-6">
          {classInfo.subjects.map((sub, idx) => (
            <li key={idx}>{sub.name} - {sub.teacher}</li>
          ))}
        </ul>
      </section>

      {/* Students */}
      <section className="mb-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Students</h3>
        <p>Total Students: {classInfo.students.length}</p>
        <table className="w-full border mt-3">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Roll No</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Gender</th>
            </tr>
          </thead>
          <tbody>
            {classInfo.students.map((s) => (
              <tr key={s.roll}>
                <td className="border px-2 py-1">{s.roll}</td>
                <td className="border px-2 py-1">{s.name}</td>
                <td className="border px-2 py-1">{s.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Timetable */}
      <section className="mb-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Timetable</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Day</th>
              <th className="border px-2 py-1">Period 1</th>
              <th className="border px-2 py-1">Period 2</th>
              <th className="border px-2 py-1">Period 3</th>
              <th className="border px-2 py-1">Period 4</th>
            </tr>
          </thead>
          <tbody>
            {classInfo.timetable.map((day, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{day.day}</td>
                {day.periods.map((p, j) => (
                  <td key={j} className="border px-2 py-1">{p}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Exams */}
      <section className="mb-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Exams</h3>
        <ul className="list-disc pl-6">
          {classInfo.exams.map((exam, i) => (
            <li key={i}>
              {exam.name} - {exam.date} (Total Marks: {exam.totalMarks})
            </li>
          ))}
        </ul>
      </section>

      {/* Assignments */}
      <section className="mb-8 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Assignments</h3>
        <ul className="list-disc pl-6">
          {classInfo.assignments.map((a, i) => (
            <li key={i}>
              {a.title} (Due: {a.due})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ClassDetailPage;
