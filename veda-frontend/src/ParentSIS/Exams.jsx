import React, { useState } from "react";
import { FiFileText } from "react-icons/fi";
import HelpInfo from "../components/HelpInfo"; 

import { useEffect } from "react";
import { dropdownAPI } from "../services/assignmentAPI";
import { examTimetableAPI } from "../services/examTimetableAPI";
import config from "../config";

const ParentExams = () => {
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [examType, setExamType] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [allExams, setAllExams] = useState([]);
  const [examTypes] = useState(["Unit Test", "Half Yearly", "Final Exam", "Other"]);
  
  const FILE_BASE_URL = config.SERVER_URL;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch Classes
      try {
        const classesData = await dropdownAPI.getClasses();
        setClasses(classesData);
      } catch (err) { console.error("Error fetching classes", err); }

      // Fetch Sections
      try {
        const sectionsData = await dropdownAPI.getSections();
        setSections(sectionsData);
      } catch (err) { console.error("Error fetching sections", err); }
      
      // Fetch All Exams
      try {
        const examsData = await examTimetableAPI.getAll();
        setAllExams(examsData);
      } catch (err) { console.error("Error fetching exams", err); }

    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const handleSearch = () => {
    const found = allExams.find((ex) => {
      const matchClass = classId ? ex.class?._id === classId : true;
      const matchSection = sectionId ? ex.section?._id === sectionId : true;
      const matchType = examType ? ex.examType === examType : true;
      return matchClass && matchSection && matchType;
    });

    if (found) {
      setSelectedExam(found);
    } else {
      setSelectedExam(null);
      alert("No timetable found for the selected criteria.");
    }
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Exams</span>
        <span>&gt;</span>
      </div>
      <div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Exams Timetable</h2>
 <HelpInfo
  title="Exams Timetable"
  description={`4.6 Exams Timetable

View the complete exam schedule for your child by selecting class, section, and exam title.

Sections:
- Class Selection: Choose the class for which you want to view the timetable
- Section Selection: Select the child's section
- Exam Title: Pick the exam name (e.g., Mid Term, Final Exam)
- Timetable Display: Shows subject-wise exam dates and timings (after search)
- No Record Message: Shows when no timetable is available for selected filters
`}
  steps={[
    "Select the Class from the first dropdown.",
    "Choose the appropriate Section.",
    "Select the desired Exam Title.",
    "Click on the Search button to view the exam schedule.",
            "If no timetable is found, adjust your selection and try again.",
  ]}
/>
</div>

      <div className="bg-white p-3 rounded-lg shadow-sm border">
         <h3 className="text-lg font-semibold mb-4">Exam List</h3>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <select
            className="border p-2 rounded"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
          >
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
          >
            <option value="">Select Exam Title</option>
            {examTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
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
                <p className="font-bold">{selectedExam.title || selectedExam.examType}</p>
                <p className=" text-gray-600">
                  {selectedExam.class?.name} - Section {selectedExam.section?.name}
                </p>
                <p className="text-sm text-gray-400">Uploaded: {new Date(selectedExam.createdAt).toLocaleDateString()}</p>
              </div>
              <a
                href={`${FILE_BASE_URL}/${selectedExam.file}`}
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
  );
};

export default ParentExams;
