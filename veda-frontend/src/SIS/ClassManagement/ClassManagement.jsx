import React, { useState } from "react";
import Classes from "./Classes";
import Schedule from "./Schedule";

export default function ClassManagement() {
  const [activeTab, setActiveTab] = useState("classes"); 

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Classes & Schedule
      </h1>
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("classes")}
          className={`px-4 py-2 font-medium ${
            activeTab === "classes"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Classes
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-4 py-2 font-medium ${
            activeTab === "schedule"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Schedule
        </button>
      </div>
      <div>
        {activeTab === "classes" && <Classes />}
        {activeTab === "schedule" && <Schedule />}
      </div>
    </div>
  );
}
