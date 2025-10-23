import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";

export default function StudentDetails() {
  const [students, setStudents] = useState([
    {
      studentId: "S001",
      name: "John Doe",
      class: "Class 1",
      section: "A",
      dob: "2012-06-12",
      gender: "Male",
      mobile: "9876543210",
    },
    {
      studentId: "S002",
      name: "Jane Smith",
      class: "Class 2",
      section: "B",
      dob: "2011-09-23",
      gender: "Female",
      mobile: "8765432109",
    },
    {
      studentId: "S003",
      name: "Alex Johnson",
      class: "Class 1",
      section: "B",
      dob: "2012-03-10",
      gender: "Male",
      mobile: "9123456780",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const filteredStudents = students.filter(
    (s) =>
      (selectedClass ? s.class === selectedClass : true) &&
      (selectedSection ? s.section === selectedSection : true) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStudents);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "StudentDetails.xlsx");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Receptionist &gt;</span>
        <span>Student Details</span>
      </div>

      {/* Page Title */}
      <h2 className="text-2xl font-bold mb-6">Student Details</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      {/* Outer Grey Box */}
      <div className="bg-gray-200 p-6 border border-gray-100 ">
        {/* Inner White Box */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Select Criteria */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Criteria</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  className="border rounded-md px-3 py-2 w-full"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Select Class</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Section</label>
                <select
                  className="border rounded-md px-3 py-2 w-full"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Search</label>
                <input
                  type="text"
                  placeholder="Search by Name or Student ID"
                  className="border rounded-md px-3 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table + Export */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <FiDownload /> Excel
              </button>
            </div>

            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 font-semibold">Student ID</th>
                  <th className="p-3 font-semibold">Student Name</th>
                  <th className="p-3 font-semibold">Class</th>
                  <th className="p-3 font-semibold">Section</th>
                  <th className="p-3 font-semibold">Date of Birth</th>
                  <th className="p-3 font-semibold">Gender</th>
                  <th className="p-3 font-semibold">Mobile Number</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{s.studentId}</td>
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.class}</td>
                      <td className="p-3">{s.section}</td>
                      <td className="p-3">{s.dob}</td>
                      <td className="p-3">{s.gender}</td>
                      <td className="p-3">{s.mobile}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-4">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}