// src/Teacher SIS/AssignmentDashboardUI.jsx
import React, { useState } from "react";

// Icon Components
const ChevronDownIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const PlusIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const AssignmentDashboardUI = () => {
  // State for filters
  const [statusFilter, setStatusFilter] = useState("All status");
  const [classFilter, setClassFilter] = useState("All Class");
  const [subjectFilter, setSubjectFilter] = useState("All Subject");

  // Hardcoded assignment data
  const assignments = [
    {
      id: 1,
      title: "Math Homework - Chapter 5",
      class: "Class V",
      subject: "Math",
      status: "Active",
      dueDate: "2024-01-15",
      submissions: 24,
      totalStudents: 30,
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      title: "Science Project - Solar System",
      class: "Class VI",
      subject: "Science",
      status: "Pending Review",
      dueDate: "2024-01-12",
      submissions: 28,
      totalStudents: 32,
      createdAt: "2024-01-08",
    },
    {
      id: 3,
      title: "English Essay - My Favorite Book",
      class: "Class V",
      subject: "English",
      status: "Late Submission",
      dueDate: "2024-01-08",
      submissions: 25,
      totalStudents: 30,
      createdAt: "2024-01-05",
    },
    {
      id: 4,
      title: "History Quiz - World War II",
      class: "Class VI",
      subject: "History",
      status: "Active",
      dueDate: "2024-01-20",
      submissions: 15,
      totalStudents: 32,
      createdAt: "2024-01-12",
    },
    {
      id: 5,
      title: "Physics Lab Report",
      class: "Class VI",
      subject: "Physics",
      status: "Pending Review",
      dueDate: "2024-01-14",
      submissions: 20,
      totalStudents: 32,
      createdAt: "2024-01-09",
    },
  ];

  // Filter assignments based on selected filters
  const filteredAssignments = assignments.filter((assignment) => {
    const statusMatch =
      statusFilter === "All status" || assignment.status === statusFilter;
    const classMatch =
      classFilter === "All Class" || assignment.class === classFilter;
    const subjectMatch =
      subjectFilter === "All Subject" || assignment.subject === subjectFilter;
    return statusMatch && classMatch && subjectMatch;
  });

  // Button handlers
  const handleCreateHomework = () => {
    alert(
      "Create Homework button clicked! This would open a form to create new assignment."
    );
  };

  const handleClearFilter = () => {
    setStatusFilter("All status");
    setClassFilter("All Class");
    setSubjectFilter("All Subject");
  };

  const handleViewAssignment = (assignmentId) => {
    alert(`View assignment ${assignmentId} clicked!`);
  };

  const handleEditAssignment = (assignmentId) => {
    alert(`Edit assignment ${assignmentId} clicked!`);
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      alert(`Delete assignment ${assignmentId} clicked!`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800";
      case "Late Submission":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Assignment</h2>
        <button
          onClick={handleCreateHomework}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Homework
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center">
          <p className="text-sm text-gray-500">Active Number</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">12</h3>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center">
          <p className="text-sm text-gray-500">Review Pending</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">04</h3>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center">
          <p className="text-sm text-gray-500">Late Submission</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">01</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Status */}
          <div className="flex-1">
            <label
              htmlFor="status"
              className="text-xs font-medium text-gray-500"
            >
              Status
            </label>
            <div className="relative mt-1">
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All status</option>
                <option>Active</option>
                <option>Pending Review</option>
                <option>Late Submission</option>
              </select>
              <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Class */}
          <div className="flex-1">
            <label
              htmlFor="class"
              className="text-xs font-medium text-gray-500"
            >
              Class
            </label>
            <div className="relative mt-1">
              <select
                id="class"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All Class</option>
                <option>Class V</option>
                <option>Class VI</option>
              </select>
              <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Subject */}
          <div className="flex-1">
            <label
              htmlFor="subject"
              className="text-xs font-medium text-gray-500"
            >
              Subject
            </label>
            <div className="relative mt-1">
              <select
                id="subject"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All Subject</option>
                <option>Math</option>
                <option>Science</option>
                <option>English</option>
                <option>History</option>
                <option>Physics</option>
              </select>
              <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Clear filter */}
          <div className="pt-5">
            <button
              onClick={handleClearFilter}
              className="text-sm text-blue-600 hover:underline whitespace-nowrap transition-colors"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Assignment List</h3>
          <p className="text-sm text-gray-500">
            Showing {filteredAssignments.length} assignments
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assignment.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created: {assignment.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        assignment.status
                      )}`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.submissions}/{assignment.totalStudents}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewAssignment(assignment.id)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditAssignment(assignment.id)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(assignment.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No assignments found matching your filters.
              </p>
              <button
                onClick={handleClearFilter}
                className="mt-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear filters to see all assignments
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDashboardUI;
