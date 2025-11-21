import React, { useEffect, useState } from "react";
import { FiDownload, FiClock, FiCheckCircle, FiBookOpen } from "react-icons/fi";
import { format, parseISO, isPast } from "date-fns";
 import HelpInfo from "../components/HelpInfo"; 

const dummyAssignments = [
  {
    _id: "1",
    title: "Math Homework 1",
    subject: { name: "Math" },
    assignmentType: "Homework",
    dueDate: "2025-09-20",
    teacherFile: "math_homework1.pdf",
    submitted: true,
    studentFile: "math_homework1_Riya.pdf",
  },
  {
    _id: "2",
    title: "Science Project",
    subject: { name: "Science" },
    assignmentType: "Project",
    dueDate: "2025-10-05",
    teacherFile: "science_project.docx",
    submitted: false,
    studentFile: null,
  },
  {
    _id: "3",
    title: "English Essay",
    subject: { name: "English" },
    assignmentType: "Homework",
    dueDate: "2025-09-15",
    teacherFile: "english_essay.docx",
    submitted: true,
    studentFile: "english_essay_final.docx",
  },
];

export default function ParentAssignments() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Normally API se data aayega (child assignments)
    setAssignments(dummyAssignments);
  }, []);

  const handleDownload = (fileName) => {
    alert(`⬇️ Downloading ${fileName} (demo mode)`);
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <p className="text-gray-500 text-sm mb-2">Assignments &gt;</p>

                                                                                  <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold"> Child's Assignments</h2>

  <HelpInfo
    title="Staff Module Help"
    description="This module allows you to manage all staff records, login access, roles, and other information."
    steps={[
      "Use All Staff tab to view and manage staff details.",
      "Use Manage Login tab to update login credentials.",
      "Use Others tab for additional staff-related tools."
    ]}
  />
</div>

      {/* Outer Wrapper */}
      <div className="bg-gray-200 p-6 rounded-lg shadow-sm border">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {assignments.length === 0 ? (
            <p className="text-gray-500">No assignments available for your child.</p>
          ) : (
            <div className="space-y-4">
              {assignments.map((a) => {
                const isLate = !a.submitted && isPast(parseISO(a.dueDate));

                return (
                  <div
                    key={a._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                  >
                    {/* Title Row */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{a.title}</h3>
                        <p className="text-sm text-gray-500">
                          {a.subject?.name} • {a.assignmentType}
                        </p>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FiClock className="text-gray-500" />
                        <span className="font-medium">
                          {format(parseISO(a.dueDate), "dd MMM yyyy")}
                        </span>
                        {isLate && (
                          <span className="text-red-600 font-medium ml-2">(Late)</span>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-1">
                      {a.submitted ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                          <FiCheckCircle /> Submitted by child
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-medium text-sm">
                          Pending submission
                        </span>
                      )}
                    </div>

                    {/* Files */}
                    <div className="mt-2 flex flex-col gap-1">
                      {a.teacherFile && (
                        <button
                          onClick={() => handleDownload(a.teacherFile)}
                          className="flex items-center gap-2 text-blue-600 text-sm hover:underline"
                        >
                          <FiDownload /> Teacher File: {a.teacherFile}
                        </button>
                      )}
                      {a.studentFile ? (
                        <button
                          onClick={() => handleDownload(a.studentFile)}
                          className="flex items-center gap-2 text-green-600 text-sm hover:underline"
                        >
                          <FiDownload /> Submitted File: {a.studentFile}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No submission uploaded yet
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
