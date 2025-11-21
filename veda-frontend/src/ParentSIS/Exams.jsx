import React, { useState } from "react";
import { FiFileText } from "react-icons/fi";
import HelpInfo from "../components/HelpInfo"; 
const ParentExams = () => {
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);

  // Dummy uploaded exam timetables (Teacher uploaded list)
  const uploadedExams = [
    {
      id: 1,
      classId: "Class 10",
      sectionId: "A",
      examTitle: "Unit Test",
      fileName: "UnitTest_Class10A.pdf",
      fileUrl: "/dummy/unit-test-class10a.pdf",
      uploadDate: "2025-01-10",
    },
    {
      id: 2,
      classId: "Class 9",
      sectionId: "B",
      examTitle: "Half Yearly",
      fileName: "HalfYearly_Class9B.pdf",
      fileUrl: "/dummy/half-yearly-class9b.pdf",
      uploadDate: "2025-01-15",
    },
    {
      id: 3,
      classId: "Class 8",
      sectionId: "C",
      examTitle: "Final Exam",
      fileName: "Final_Class8C.pdf",
      fileUrl: "/dummy/final-class8c.pdf",
      uploadDate: "2025-01-20",
    },
    {
      id: 4,
      classId: "Class 10",
      sectionId: "A",
      examTitle: "Half Yearly",
      fileName: "HalfYearly_Class10A.pdf",
      fileUrl: "/dummy/half-yearly-class10a.pdf",
      uploadDate: "2025-02-01",
    },
    {
      id: 5,
      classId: "Class 10",
      sectionId: "A",
      examTitle: "Final Exam",
      fileName: "FinalExam_Class10A.pdf",
      fileUrl: "/dummy/final-exam-class10a.pdf",
      uploadDate: "2025-02-15",
    },
    {
      id: 6,
      classId: "Class 9",
      sectionId: "A",
      examTitle: "Unit Test",
      fileName: "UnitTest_Class9A.pdf",
      fileUrl: "/dummy/unit-test-class9a.pdf",
      uploadDate: "2025-01-12",
    },
    {
      id: 7,
      classId: "Class 9",
      sectionId: "A",
      examTitle: "Half Yearly",
      fileName: "HalfYearly_Class9A.pdf",
      fileUrl: "/dummy/half-yearly-class9a.pdf",
      uploadDate: "2025-02-05",
    },
    {
      id: 8,
      classId: "Class 8",
      sectionId: "A",
      examTitle: "Unit Test",
      fileName: "UnitTest_Class8A.pdf",
      fileUrl: "/dummy/unit-test-class8a.pdf",
      uploadDate: "2025-01-08",
    },
    {
      id: 9,
      classId: "Class 8",
      sectionId: "B",
      examTitle: "Half Yearly",
      fileName: "HalfYearly_Class8B.pdf",
      fileUrl: "/dummy/half-yearly-class8b.pdf",
      uploadDate: "2025-02-10",
    },
    {
      id: 10,
      classId: "Class 7",
      sectionId: "A",
      examTitle: "Unit Test",
      fileName: "UnitTest_Class7A.pdf",
      fileUrl: "/dummy/unit-test-class7a.pdf",
      uploadDate: "2025-01-14",
    },
    {
      id: 11,
      classId: "Class 7",
      sectionId: "B",
      examTitle: "Final Exam",
      fileName: "FinalExam_Class7B.pdf",
      fileUrl: "/dummy/final-exam-class7b.pdf",
      uploadDate: "2025-02-20",
    },
    {
      id: 12,
      classId: "Class 6",
      sectionId: "A",
      examTitle: "Unit Test",
      fileName: "UnitTest_Class6A.pdf",
      fileUrl: "/dummy/unit-test-class6a.pdf",
      uploadDate: "2025-01-16",
    },
  ];

  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
  const sections = ["A", "B", "C"];
  const examTypes = ["Unit Test", "Half Yearly", "Final Exam"];

  const handleSearch = () => {
    const exam = uploadedExams.find(
      (ex) =>
        ex.classId === classId &&
        ex.sectionId === sectionId &&
        ex.examTitle === examTitle
    );
    setSelectedExam(exam || null);
  };

  return (
   <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumb + Heading */}
      <p className="text-gray-500 text-sm mb-2">Exams &gt;</p>
                                                                                    <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Exams Timetable</h2>

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

      {/* Gray Wrapper */}
      <div className="bg-gray-200 p-6 rounded-lg shadow-sm border border-gray-100">
        {/* White Inner Box */}
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

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Result */}
        <div className="mt-6">
          {selectedExam ? (
            <div className="border p-4 rounded shadow bg-white flex items-center justify-between">
              <div>
                <p className="font-bold">{selectedExam.examTitle}</p>
                <p className="text-sm text-gray-600">
                  {selectedExam.classId} - Section {selectedExam.sectionId}
                </p>
                <p className="text-sm">{selectedExam.fileName}</p>
              </div>
              <a
                href={selectedExam.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FiFileText /> Open PDF
              </a>
            </div>
          ) : (
            <p className="text-gray-500">
              No timetable found. Please select class, section and exam.
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ParentExams;

