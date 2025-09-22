// src/Teacher SIS/AssignmentDashboardUI.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assignmentAPI } from "../../services/assignmentAPI";

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
  const navigate = useNavigate();

  // State for assignments and loading
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assignments from backend
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignmentAPI.getAssignments();
      setAssignments(data);
    } catch (err) {
      setError("Failed to fetch assignments");
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments based on selected filters
  const filteredAssignments = assignments.filter((assignment) => {
    const statusMatch =
      statusFilter === "All status" || assignment.status === statusFilter;
    const classMatch =
      classFilter === "All Class" || assignment.class?.name === classFilter;
    const subjectMatch =
      subjectFilter === "All Subject" ||
      assignment.subject?.name === subjectFilter;
    return statusMatch && classMatch && subjectMatch;
  });

  // Calculate statistics
  const stats = {
    active: assignments.filter((a) => a.status === "Active").length,
    pendingReview: assignments.filter((a) => a.status === "Pending Review")
      .length,
    lateSubmission: assignments.filter((a) => a.status === "Late Submission")
      .length,
  };

  // Button handlers
  const handleCreateHomework = () => {
    navigate("/teacher/assignment/create");
  };
  const handleClearFilter = () => {
    setStatusFilter("All status");
    setClassFilter("All Class");
    setSubjectFilter("All Subject");
  };

  const handleViewAssignment = (assignmentId) => {
    // Navigate to assignment detail view
    navigate(`/teacher/assignment/${assignmentId}`);
  };

  const handleEditAssignment = (assignmentId) => {
    // Navigate to edit assignment page
    navigate(`/teacher/assignment/edit/${assignmentId}`);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentAPI.deleteAssignment(assignmentId);
        // Refresh the assignments list
        fetchAssignments();
        alert("Assignment deleted successfully!");
      } catch (error) {
        alert("Failed to delete assignment. Please try again.");
        console.error("Error deleting assignment:", error);
      }
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
          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {stats.active}
          </h3>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center">
          <p className="text-sm text-gray-500">Review Pending</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {stats.pendingReview}
          </h3>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center">
          <p className="text-sm text-gray-500">Late Submission</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            {stats.lateSubmission}
          </h3>
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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading assignments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchAssignments}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
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
                  <tr key={assignment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        Created:{" "}
                        {new Date(assignment.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.class?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.subject?.name || "N/A"}
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
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.submissions?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewAssignment(assignment._id)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditAssignment(assignment._id)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

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
