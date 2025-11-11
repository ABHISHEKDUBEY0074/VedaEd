import React, { useState } from "react";
import { FiFileText } from "react-icons/fi";

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
    },
    {
      id: 2,
      classId: "Class 9",
      sectionId: "B",
      examTitle: "Half Yearly",
      fileName: "HalfYearly_Class9B.pdf",
      fileUrl: "/dummy/half-yearly-class9b.pdf",
    },
    {
      id: 3,
      classId: "Class 8",
      sectionId: "C",
      examTitle: "Final Exam",
      fileName: "Final_Class8C.pdf",
      fileUrl: "/dummy/final-class8c.pdf",
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
      <h2 className="text-2xl font-bold mb-6">Exam Timetable</h2>

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

