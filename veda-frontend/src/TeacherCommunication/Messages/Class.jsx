import React, { useState } from "react";

export default function Class() {
  const [selectedType, setSelectedType] = useState("SMS");
  const [message, setMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // Mock class data
  const classes = [
    { id: "1", name: "Class 1" },
    { id: "2", name: "Class 2" },
    { id: "3", name: "Class 3" },
    { id: "4", name: "Class 4" },
    { id: "5", name: "Class 5" },
    { id: "6", name: "Class 6" },
    { id: "7", name: "Class 7" },
    { id: "8", name: "Class 8" },
    { id: "9", name: "Class 9" },
    { id: "10", name: "Class 10" },
  ];

  const sections = [
    { id: "A", name: "Section A" },
    { id: "B", name: "Section B" },
    { id: "C", name: "Section C" },
    { id: "D", name: "Section D" },
  ];

  return (
    <div className="p-0 bg-gray-100 min-h-screen">
      {/* Outer Gray Container */}
      <div className="bg-gray-200 p-6 shadow-sm border border-gray-100">
        {/* White Inner Box */}
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
          {/* Header with Dropdown */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Send {selectedType} to Class (Teacher)
            </h3>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
            </select>
          </div>

          {/* Form Section */}
          <form className="space-y-4">
            {/* Class and Section Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Section <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Template Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {selectedType} Template
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select</option>
              </select>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter title"
              />
            </div>

            {/* Send Through Options */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Send Through <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="w-4 h-4" /> SMS
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="w-4 h-4" /> Mobile App
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Template ID (TID/Entity ID is required only for Indian SMS
                Gateway)
              </p>
              <input
                type="text"
                className="w-full mt-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter Template ID (if required)"
              />
            </div>

            {/* Message Box */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Type your message here..."
              ></textarea>
              <div className="text-xs text-gray-500 text-right mt-1">
                Character Count: {message.length}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Send {selectedType} to Class
              </button>
            </div>
          </form>
        </div>

        {/* Message To Container */}
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto mt-6">
          <h3 className="text-lg font-semibold mb-4">Message To</h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="w-4 h-4" />
                Students
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="w-4 h-4" />
                Guardians
              </label>
              {/* Admin and Super Admin are excluded for teachers */}
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="w-4 h-4" />
                Teacher
              </label>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="sendOption"
                  value="now"
                  defaultChecked
                  className="w-4 h-4"
                />
                Send Now
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="sendOption"
                  value="schedule"
                  className="w-4 h-4"
                />
                Schedule
              </label>
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition ml-auto"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
