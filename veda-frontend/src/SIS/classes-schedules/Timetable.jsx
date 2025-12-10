import React, { useState } from "react";
import ClassTimetable from "./ClassTimetable";
import TeacherTimetable from "./TeacherTimetable";

const Timetable = () => {
  const [activeTab, setActiveTab] = useState("class"); // default class

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Tabs */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setActiveTab("class")}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === "class"
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 transform scale-105"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          Class Timetable
        </button>
        <button
          onClick={() => setActiveTab("teacher")}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === "teacher"
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 transform scale-105"
              : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          Teacher Timetable
        </button>
      </div>

      {/* Render Tabs */}
      {activeTab === "class" && <ClassTimetable />}
      {activeTab === "teacher" && <TeacherTimetable />}
    </div>
  );
};

export default Timetable;
