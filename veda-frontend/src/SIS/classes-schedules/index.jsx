import React, { useState } from "react";
import Classes from "./Classes";
import SubjectGroup from "./SubjectGroup";
import Timetable from "./Timetable";
import AssignTeacher from "./AssignTeacher";

const Index = () => {
  const [activeTab, setActiveTab] = useState("classes"); // default tab = Classes

  const renderTab = () => {
    switch (activeTab) {
      case "classes":
        return <Classes />;
      case "subjectGroup":
        return <SubjectGroup />;
      case "timetable":
        return <Timetable />;
      case "assignTeacher":
        return <AssignTeacher />;
      default:
        return <Classes />;
    }
  };

  return (
    <div className="p-4">
      {/* Page Title */}
      <h2 className="text-2xl font-bold mb-4">Classes & Schedules</h2>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-4">
       <button
  className={`pb-2 ${
    activeTab === "classes"
      ? "text-blue-600 font-semibold"
      : "text-gray-500"
  }`}
  onClick={() => setActiveTab("classes")}
>
  Classes
</button>
<button
  className={`pb-2 ${
    activeTab === "subjectGroup"
      ? "text-blue-600 font-semibold"
      : "text-gray-500"
  }`}
  onClick={() => setActiveTab("subjectGroup")}
>
  Subject Group
</button>
<button
  className={`pb-2 ${
    activeTab === "timetable"
      ? "text-blue-600 font-semibold"
      : "text-gray-500"
  }`}
  onClick={() => setActiveTab("timetable")}
>
  Timetable
</button>
<button
  className={`pb-2 ${
    activeTab === "assignTeacher"
      ? "text-blue-600 font-semibold"
      : "text-gray-500"
  }`}
  onClick={() => setActiveTab("assignTeacher")}
>
  Assign Teacher
</button>

      </div>

      {/* Tab Content */}
      <div>{renderTab()}</div>
    </div>
  );
};

export default Index;
