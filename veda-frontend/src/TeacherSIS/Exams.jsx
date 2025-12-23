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
    <div className="p-0 m-0 min-h-screen">
      <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        Teacher Exam Timetable &gt;
      </p>
      <div className="flex items-center justify-between mb-4">
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
            "Generate downloadable exam reports and analytics",
          ]}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        {/* Subheading */}
        <h3 className="text-lg font-semibold mb-4">Uploaded Exam Timetable</h3>

        {/* Filters */}
        <div className="flex items-end justify-between mb-4">
          {/* Left Filters */}
          <div className="flex items-start gap-3">
            {/* Class */}
            <div className="flex flex-col">
              <label className="block mb-1">Class</label>
              <select
                className="border px-3 py-2 rounded-md bg-white  w-[160px]"
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
            </div>

            {/* Section */}
            <div className="flex flex-col">
              <label className=" block mb-1">Section</label>
              <select
                className="border px-3 py-2 rounded-md bg-white  w-[160px]"
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
            </div>

            {/* Exam Title */}
            <div className="flex flex-col">
              <label className="block mb-1">Exam Title</label>
              <select
                className="border px-3 py-2 rounded-md bg-white  w-[160px]"
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
            </div>

            {/* File Upload */}
            <div className="flex flex-col">
              <label className="block mb-1">Upload PDF</label>
              <input
                type="file"
                accept="application/pdf"
                className="border px-2 py-1.5 rounded-md bg-white  w-[180px]"
                onChange={(e) => setPdfFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Right Side Upload Button */}
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md  shadow"
            onClick={handleUpload}
          >
            <FiUpload className="" /> Upload Exam Timetable
          </button>
        </div>

        {/* Uploaded List */}
        <div className="mt-4">
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
                    <p className="">{exam.examTitle}</p>
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
  );
};

export default TeacherExams;
