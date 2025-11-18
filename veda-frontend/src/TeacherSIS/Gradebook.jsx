// src/TeacherSIS/Gradebook.js
import React, { useState } from "react";
import GradebookClass from "./GradebookClass";
import { FiArrowRight } from "react-icons/fi";

export default function Gradebook() {
  // Dummy data: classes teacher teaches (class + section + subjects)
  const myClasses = [
    { id: "c10a", className: "Class 10", section: "A", subjects: ["Mathematics","Science"] , studentsCount: 32 },
    { id: "c10b", className: "Class 10", section: "B", subjects: ["English","Social Science"], studentsCount: 28 },
    { id: "c9a",  className: "Class 9",  section: "A", subjects: ["Mathematics","English"], studentsCount: 30 },
  ];

  const [selectedClass, setSelectedClass] = useState(null);

  // When teacher clicks open -> show GradebookClass with props
  if (selectedClass) {
    return (
      <GradebookClass
        classObj={selectedClass}
        onBack={() => setSelectedClass(null)}
      />
    );
  }

  // Landing: list of classes
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <p className="text-gray-500 text-sm mb-2">Teacher Gradebook &gt;</p>
      <h2 className="text-2xl font-bold mb-6">My Classes</h2>

      <div className="bg-gray-200 p-6 rounded-lg shadow-sm border border-gray-300">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-700 mb-4">These are classes you teach. Click "Open" to manage that class' gradebook.</p>

          <div className="grid gap-4">
            {myClasses.map((c) => (
              <div key={c.id} className="flex justify-between items-center border p-4 rounded shadow-sm bg-white">
                <div>
                  <p className="font-semibold text-lg">{c.className} — Section {c.section}</p>
                  <p className="text-sm text-gray-600">Subjects: {c.subjects.join(", ")}</p>
                  <p className="text-sm text-gray-500">Students: {c.studentsCount}</p>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setSelectedClass(c)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow"
                  >
                    Open <FiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
