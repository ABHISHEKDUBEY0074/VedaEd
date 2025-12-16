import React, { useEffect, useState } from "react";
import { FiDownload, FiClock, FiCheckCircle } from "react-icons/fi";
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
    <div className="p-0 m-0 min-h-screen">
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Assignments</span>
        <span>&gt;</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Child's Assignments</h2>
        <HelpInfo
          title="Child's Assignments"
          description={`4.5 Child's Assignments (Homework & Projects)

View all assignments given to your child, including homework and project tasks, along with their submission status and files.

Sections:
- Assignment List: Displays all assignments with subject-wise grouping
- Submission Status: Shows Submitted, Pending, or Late status
- Due Date: Indicates assignment deadline with late highlight
- Teacher Files: Download files shared by the teacher
- Child Submission Files: View files uploaded by your child
- Pending Area: Shows tasks where submission is not yet uploaded
`}
          steps={[
            "Scroll through the list to view all assignments with subject and type.",
            "Check the submission status to know whether the child has submitted or not.",
            "Download the teacher's file for instructions or study material.",
            "Click on child submission file to view uploaded work.",
            "Note the due date and Late indicator for missed deadlines.",
            "Help your child upload pending submissions before the due date.",
          ]}
        />
      </div>

      <div className="bg-white p-3 rounded-lg shadow-sm border">
        {assignments.length === 0 ? (
          <p className="text-gray-500">
            No assignments available for your child.
          </p>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => {
              const isLate = !a.submitted && isPast(parseISO(a.dueDate));

              return (
                <div
                  key={a._id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  {/* Title Row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {a.title}
                      </h3>
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
                        <span className="text-red-600 font-medium ml-2">
                          (Late)
                        </span>
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
  );
}
