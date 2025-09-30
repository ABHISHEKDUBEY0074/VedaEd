import React, { useState } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Teacher Exam Timetables</h2>

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
  );
};

export default TeacherExams;
