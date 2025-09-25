import React, { useState, useEffect } from "react";
import { FiUpload, FiDownload, FiTrash2, FiClock, FiCheckCircle, FiBookOpen } from "react-icons/fi";
import { format, isPast, parseISO } from "date-fns";

const dummyAssignments = [
  {
    _id: "1",
    title: "Math Homework 1",
    subject: { name: "Math" },
    assignmentType: "Homework",
    dueDate: "2025-09-20",
    teacherFile: "math_homework1.pdf",
    submitted: false,
    studentFile: null,
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
    studentFile: "english_essay_submitted.docx",
  },
];

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState({});

  useEffect(() => {
    setAssignments(dummyAssignments);
  }, []);

  const handleFileChange = (assignmentId, file) => {
    setFiles({ ...files, [assignmentId]: file });
  };

  const handleSubmit = (assignmentId) => {
    const file = files[assignmentId];
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    setAssignments((prev) =>
      prev.map((a) =>
        a._id === assignmentId
          ? { ...a, submitted: true, studentFile: file.name }
          : a
      )
    );
    setFiles({ ...files, [assignmentId]: null });
    alert("✅ Assignment submitted successfully!");
  };

  const handleDelete = (assignmentId) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a._id === assignmentId ? { ...a, submitted: false, studentFile: null } : a
      )
    );
  };

  const handleDownload = (fileName) => {
    alert(`⬇️ Downloading ${fileName} ... (dummy)`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <FiBookOpen className="text-blue-600" /> My Assignments
      </h2>

      {assignments.length === 0 ? (
        <p className="text-gray-500">No assignments assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => {
            const isLate = !a.submitted && isPast(parseISO(a.dueDate));

            return (
              <div
                key={a._id}
                className="bg-white border rounded-xl shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition"
              >
                {/* Top Row */}
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
                    {isLate && <span className="text-red-600 font-medium ml-2">(Late)</span>}
                  </div>
                </div>

                {/* Status */}
                <div>
                  {a.submitted ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                      <FiCheckCircle /> Submitted
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-medium text-sm">Pending</span>
                  )}
                </div>

                {/* Teacher File */}
                <div>
                  {a.teacherFile ? (
                    <button
                      onClick={() => handleDownload(a.teacherFile)}
                      className="flex items-center gap-2 text-blue-600 text-sm hover:underline"
                    >
                      <FiDownload /> {a.teacherFile}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">No file</span>
                  )}
                </div>

                {/* Upload Section */}
                <div>
                  {!a.submitted ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(a._id, e.target.files[0])}
                        className="border text-sm px-2 py-1 rounded flex-1"
                        disabled={isLate}
                      />
                      <button
                        onClick={() => handleSubmit(a._id)}
                        disabled={isLate}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white text-sm font-medium ${
                          isLate
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        <FiUpload /> Submit
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 border px-3 py-2 rounded-md">
                      <span className="text-sm text-gray-700">
                        📂 {a.studentFile}
                      </span>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
