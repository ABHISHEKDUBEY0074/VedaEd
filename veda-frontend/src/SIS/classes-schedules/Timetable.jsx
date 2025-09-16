import React, { useState } from "react";
import ClassTimetable from "./ClassTimetable";
import TeacherTimetable from "./TeacherTimetable";

const Timetable = () => {
  const [activeTab, setActiveTab] = useState("class"); // default class

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="flex space-x-3 border-b mb-6">
        <button
          onClick={() => setActiveTab("class")}
          className={`px-5 py-2 rounded-t-lg font-medium ${
            activeTab === "class"
              ? "bg-blue-500 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Class Timetable
        </button>
        <button
          onClick={() => setActiveTab("teacher")}
          className={`px-5 py-2 rounded-t-lg font-medium ${
            activeTab === "teacher"
              ? "bg-blue-500 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
