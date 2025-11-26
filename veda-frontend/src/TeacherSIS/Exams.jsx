import React, { useState } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import HelpInfo from "../components/HelpInfo";

const TeacherExams = () => {
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [examList, setExamList] = useState([]);

  // Dummy Class & Section data
  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  const sections = ["A", "B", "C"];
  const examTypes = ["Unit Test", "Half Yearly", "Final Exam"];

  const handleUpload = () => {
    if (!classId || !sectionId || !examTitle || !pdfFile) {
      alert("Please select all fields and upload a file.");
      return;
    }

    const newExam = {
      id: Date.now(),
      classId,
      sectionId,
      examTitle,
      fileName: pdfFile.name,
      fileUrl: URL.createObjectURL(pdfFile),
    };

    setExamList([...examList, newExam]);
    setClassId("");
    setSectionId("");
    setExamTitle("");
    setPdfFile(null);
  };

  const handleDelete = (id) => {
    setExamList(examList.filter((exam) => exam.id !== id));
  };

  return (
   <div className="p-6 bg-gray-100 min-h-screen">
    <p className="text-gray-500 text-sm mb-2">Teacher Exam Timetable &gt;</p>
<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Teacher Exam Timetable</h2>

  <HelpInfo
  title="Teacher Exams"
  description={`2.1 Teacher Exams (Exams Overview)

Manage exam schedules, create exam papers, enter grades, and track student performance across different examinations.

Sections:
- Exam Schedule: View upcoming and past exam schedules for assigned classes
- Exam Creation: Create new exams, set dates, and define exam structure
- Grade Entry: Enter exam marks and grades for students
- Exam Results: View and analyze exam results and student performance
- Performance Analytics: Track class and individual student performance trends
- Exam Reports: Generate exam result reports and statistics


2.2 Exam Schedule & Overview Card

This section displays all upcoming and completed exams assigned to the teacher.

Each exam card includes:
- Exam Name & Subject
- Class & Section
- Exam Date & Type (Unit Test / Mid Term / Final)
- Syllabus coverage & exam structure
- Status tags (Upcoming / Completed)
- Quick actions (Edit / View / Delete)


2.3 Exam Tools & Actions Card

Tools available for exam management:
- Create New Exam with subjects and date selection
- Enter Marks page for grading students
- View detailed student-wise exam results
- Analyze performance charts and trends
- Compare exam performance with previous terms
- Download mark sheets and PDF/Excel summaries
- Export complete exam reports for record keeping
`}
  steps={[
    "Check upcoming and completed exam schedules",
    "Create new exams and define exam details",
    "Enter marks after exam completion",
    "Review class-wise and student-wise performance",
    "Generate downloadable exam reports and analytics"
  ]}
/>

</div>
  <div className="bg-gray-200 p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="bg-white p-4 rounded-lg shadow-sm">
      

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls, idx) => (
            <option key={idx} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
        >
          <option value="">Select Section</option>
          {sections.map((sec, idx) => (
            <option key={idx} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
        >
          <option value="">Select Exam Title</option>
          {examTypes.map((exam, idx) => (
            <option key={idx} value={exam}>
              {exam}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="application/pdf"
          className="border p-2 rounded"
          onChange={(e) => setPdfFile(e.target.files[0])}
        />
      </div>

      {/* Upload Button */}
      <button
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow"
        onClick={handleUpload}
      >
        <FiUpload /> Upload Exam Timetable
      </button>

      {/* Uploaded List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Uploaded Exam Timetables</h3>
        {examList.length === 0 ? (
          <p className="text-gray-500">No exam timetables uploaded yet.</p>
        ) : (
          <div className="grid gap-4">
            {examList.map((exam) => (
              <div
                key={exam.id}
                className="flex justify-between items-center border p-4 rounded shadow-sm bg-white"
              >
                <div>
                  <p className="font-bold">{exam.examTitle}</p>
                  <p className="text-sm text-gray-600">
                    {exam.classId} - Section {exam.sectionId}
                  </p>
                  <a
                    href={exam.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    {exam.fileName}
                  </a>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(exam.id)}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default TeacherExams;
