
// src/Teacher SIS/AssignmentDashboardUI.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assignmentAPI } from "../../services/assignmentAPI";
import axios from "axios";
import HelpInfo from "../../components/HelpInfo";
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

  // State for classes
  const [classes, setClasses] = useState([]);

  // Fetch assignments and classes from backend
  useEffect(() => {
    fetchAssignments();
    fetchClasses();
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

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/classes");
      if (response.data.success && Array.isArray(response.data.data)) {
        setClasses(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
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
    <div className="p-0 m-0 min-h-screen ">
        <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">Assignment&gt;</p>
<div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Assignment</h2>

 <HelpInfo
  title="Assignments Dashboard"
  description={`2.1 Teacher Assignments (Assignments Overview)

Manage all assignments for assigned classes. Create, edit, grade, and track assignment submissions in one place.

Sections:
- Assignments List: Display all assignments created by the teacher
- Assignment Status: View pending, submitted, and graded assignments
- Create Assignment Button: Quick access to create new assignments
- Submission Tracking: Monitor which students submitted
- Grading Interface: Grade assignments & give feedback
- Assignment Statistics: Track submission rates & average grades


2.2 Assignments Overview Card

This section displays all assignments created by the teacher along with their status.

Each assignment card includes:
- Assignment title
- Subject and class info
- Due date
- Total submissions received
- Status tags (Pending / Submitted / Graded)
- Quick actions (Edit / View / Grade)


2.3 Assignment Tools & Actions Card

Tools available inside the assignments dashboard:
- Create New Assignment
- View Student Submission List
- Open Grading Interface
- Provide written or file-based feedback
- Track assignment submission percentage
- View performance insights & average scoring trends
- Export submissions and reports as PDF/Excel
`}
  steps={[
    "View list of assignments created for each class",
    "Track submission and grading status in real-time",
    "Open grading interface to review and grade submissions",
    "Create new assignments using the Add Assignment button",
    "Check class-wise and student-wise assignment statistics"
  ]}
/>

</div>
 
    <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800"></h2>
        <button
          onClick={handleCreateHomework}
          className="flex items-center mb-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Homework
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center border-t-4 border-blue-500">
          <p className="text-lg text-gray-500">Active Number</p>
          <h3 className=" font-bold text-gray-800 mt-2">
            {stats.active}
          </h3>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center border-t-4 border-blue-500">
          <p className="text-lg text-gray-500">Review Pending</p>
          <h3 className="text font-bold text-gray-800 mt-2">
            {stats.pendingReview}
          </h3>
        </div>
        <div className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center border-t-4 border-blue-500">
          <p className="text-lg text-gray-500">Late Submission</p>
          <h3 className=" font-bold text-gray-800 mt-2">
            {stats.lateSubmission}
          </h3>
        </div>
     

      {/* Filters */}
      

      </div>
 </div>
      {/* Assignment Table */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
        
          <h3 className="text-lg font-semibold mb-4">Assignment List</h3>
                 <div className="flex items-end gap-4 w-full mb-4">

  {/* Status */}
  <div className="flex flex-col w-40">
   
    <select
      id="status"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border px-3 py-2 rounded-md bg-white "
    >
      <option>All status</option>
      <option>Active</option>
      <option>Pending Review</option>
      <option>Late Submission</option>
    </select>
  </div>

  {/* Class */}
  <div className="flex flex-col w-40">
    
    <select
      id="class"
      value={classFilter}
      onChange={(e) => setClassFilter(e.target.value)}
      className="border px-3 py-2 rounded-md bg-white"
    >
      <option>All Class</option>
      {classes.map((cls) => (
        <option key={cls._id} value={cls.name}>
          {cls.name}
        </option>
      ))}
    </select>
  </div>

  {/* Subject */}
  <div className="flex flex-col w-40">
    
    <select
      id="subject"
      value={subjectFilter}
      onChange={(e) => setSubjectFilter(e.target.value)}
      className="border px-3 py-2 rounded-md bg-white "
    >
      <option>All Subject</option>
      <option>Math</option>
      <option>Science</option>
      <option>English</option>
      <option>History</option>
      <option>Physics</option>
    </select>
  </div>

  {/* Clear Filter */}
 
        </div>
          <p className=" text-gray-500 mb-4">
            Showing {filteredAssignments.length} assignments
          </p>
        

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
            <table className="w-full border ">
              <thead className="bg-gray-100">
                <tr>
                   <th className="p-2 border">S.No</th>
                  <th className="p-2 border">
                    Assignment
                  </th>
                  <th className="p-2 border">
                    Class
                  </th>
                  <th className="p-2 border">
                    Subject
                  </th>
                  <th className="p-2 border">
                    Status
                  </th>
                  <th className="p-2 border">
                    Due Date
                  </th>
                  <th className="p-2 border">
                    Submissions
                  </th>
                  <th className="p-2 border">
                    Actions
                  </th>
                </tr>
              </thead>
             <tbody>
  {filteredAssignments.map((assignment, idx) => (
    <tr key={assignment._id} className="text-center hover:bg-gray-50">

      {/* Index */}
      <td className="p-2 border">{idx + 1}</td>

      {/* Title + Created Date */}
      <td className="p-2 border text-left">
        <div className="flex flex-col">
          <span className="font-medium">{assignment.title}</span>
          <span className=" text-gray-500">
            Created: {new Date(assignment.createdAt).toLocaleDateString()}
          </span>
        </div>
      </td>

      {/* Class */}
      <td className="p-2 border">{assignment.class?.name || "N/A"}</td>

      {/* Subject */}
      <td className="p-2 border">{assignment.subject?.name || "N/A"}</td>

      {/* Status */}
      <td className="p-2 border">
        <span
          className={`px-2 py-1  font-semibold rounded-full ${getStatusColor(
            assignment.status
          )}`}
        >
          {assignment.status}
        </span>
      </td>

      {/* Due Date */}
      <td className="p-2 border">
        {new Date(assignment.dueDate).toLocaleDateString()}
      </td>

      {/* Submissions */}
      <td className="p-2 border">
        {assignment.submissions?.length || 0}
      </td>

      {/* Actions — yaha ab correct hoga */}
      <td className="p-2 border space-x-2">
        <button
          onClick={() => handleViewAssignment(assignment._id)}
          className="text-blue-500"
        >
          View
        </button>

        <button
          onClick={() => handleEditAssignment(assignment._id)}
          className="text-green-500"
        >
          Edit
        </button>

        <button
          onClick={() => handleDeleteAssignment(assignment._id)}
          className="text-red-500"
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