import React, { useState, useEffect } from "react";
import { FiUpload, FiEdit, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { assignmentAPI, dropdownAPI } from "../../services/assignmentAPI";

export default function CreateAssignment() {
  // Base URL for uploaded files served from backend
  const FILE_BASE_URL = "http://localhost:5000";

  const [form, setForm] = useState({
    classId: "",
    sectionId: "",
    subjectId: "",
    assignmentType: "Homework",
    dueDate: "",
    title: "",
    file: null,
    description: "",
  });

  const [assignments, setAssignments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // Dropdown data state
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Fetch dropdown data on component mount
  useEffect(() => {
    fetchDropdownData();
    fetchAssignments();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [classesData, sectionsData, subjectsData] = await Promise.all([
        dropdownAPI.getClasses(),
        dropdownAPI.getSections(),
        dropdownAPI.getSubjects(),
      ]);

      console.log("Classes data:", classesData);
      console.log("Sections data:", sectionsData);
      console.log("Subjects data:", subjectsData);

      // Ensure data is an array, fallback to empty array if not
      setClasses(Array.isArray(classesData) ? classesData : []);
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setError("Failed to load form data");
      // Set empty arrays as fallback
      setClasses([]);
      setSections([]);
      setSubjects([]);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await assignmentAPI.getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleSave = async () => {
    if (!form.classId || !form.sectionId || !form.subjectId || !form.title) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editId) {
        // Update existing assignment
        await assignmentAPI.updateAssignment(editId, form);
        alert("Assignment updated successfully!");
      } else {
        // Create new assignment
        await assignmentAPI.createAssignment(form);
        alert("Assignment created successfully!");
      }

      // Reset form
      setForm({
        classId: "",
        sectionId: "",
        subjectId: "",
        assignmentType: "Homework",
        dueDate: "",
        title: "",
        file: null,
        description: "",
      });
      setEditId(null);

      // Refresh assignments list
      fetchAssignments();
    } catch (error) {
      console.error("Error saving assignment:", error);
      const errorMessage =
        error.message || "Failed to save assignment. Please try again.";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const assignment = assignments.find((a) => a._id === id);
    if (assignment) {
      setForm({
        classId: assignment.class?._id || "",
        sectionId: assignment.section?._id || "",
        subjectId: assignment.subject?._id || "",
        assignmentType: assignment.assignmentType || "Homework",
        dueDate: assignment.dueDate
          ? new Date(assignment.dueDate).toISOString().split("T")[0]
          : "",
        title: assignment.title || "",
        file: null,
        description: assignment.description || "",
      });
      setEditId(id);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentAPI.deleteAssignment(id);
        alert("Assignment deleted successfully!");
        fetchAssignments();

        if (editId === id) {
          setEditId(null);
          setForm({
            classId: "",
            sectionId: "",
            subjectId: "",
            assignmentType: "Homework",
            dueDate: "",
            title: "",
            file: null,
            description: "",
          });
        }
      } catch (error) {
        alert("Failed to delete assignment. Please try again.");
        console.error("Error deleting assignment:", error);
      }
    }
  };

  // Check if URL is localhost
  const isLocalhost = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1";
    } catch {
      return false;
    }
  };

  // Get preview URL based on file type
  const getPreviewUrl = (fileUrl) => {
    const fileExtension = fileUrl.split(".").pop().toLowerCase();
    const isLocal = isLocalhost(fileUrl);

    // For PDFs, use direct URL (works on localhost)
    if (fileExtension === "pdf") {
      return fileUrl;
    }

    // For localhost Word docs, external viewers won't work - return null to show download option
    if (
      isLocal &&
      ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension)
    ) {
      return null; // Signal that we need to show download option
    }

    // For Word docs (.doc, .docx) and Excel files on public URLs, use Microsoft Office Online Viewer
    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension)) {
      const encodedUrl = encodeURIComponent(fileUrl);
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
    }

    // For other files, try Google Docs Viewer
    const encodedUrl = encodeURIComponent(fileUrl);
    return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
  };

  return (
<<<<<<< HEAD
    <div className="p-6 bg-gray-100 min-h-screen">
      <p className="text-gray-500 text-sm mb-2">Assignment&gt;</p>
      <h2 className="text-2xl font-bold mb-6">Assignment</h2>
      <div className="bg-gray-200 p-6 rounded-lg shadow-sm border border-gray-100">
        {/* Create Assignment Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h2 className="text-xl font-semibold"></h2>
=======
    <div className="p-0 m-0 min-h-screen">
        <p className="text-gray-500 text-sm mb-2">Assignment&gt;</p>
<h2 className="text-2xl font-bold mb-6">Assignment</h2>
  <div className="bg- p-0 rounded-lg shadow-sm border border-gray-100">
    
      {/* Create Assignment Form */}
      <div className="bg-white p-6 mb-4 rounded-xl shadow-lg space-y-6">
        <h2 className="text-lg font-semibold "> Create Assignment</h2>
        <h2 className="text-xl font-semibold"></h2>
>>>>>>> 29103792aeea7f70e7978ba1c196f54046dca273

          {/* Class / Section / Subject */}
          <div className="border rounded-lg p-4 grid grid-cols-3 gap-4">
            {/* Class */}
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select
                value={form.classId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    classId: e.target.value,
                    sectionId: "",
                    subjectId: "",
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Class</option>
                {classes && classes.length > 0 ? (
                  classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No classes available</option>
                )}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <select
                value={form.sectionId}
                onChange={(e) =>
                  setForm({ ...form, sectionId: e.target.value })
                }
                disabled={!form.classId}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Section</option>
                {sections && sections.length > 0 ? (
                  sections.map((sec) => (
                    <option key={sec._id} value={sec._id}>
                      {sec.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No sections available</option>
                )}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select
                value={form.subjectId}
                onChange={(e) =>
                  setForm({ ...form, subjectId: e.target.value })
                }
                disabled={!form.classId}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Subject</option>
                {subjects && subjects.length > 0 ? (
                  subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No subjects available</option>
                )}
              </select>
            </div>
          </div>

<<<<<<< HEAD
          {/* Assignment Type & Due Date */}
          <div className="border rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Assignment Type
              </label>
              <select
                value={form.assignmentType}
                onChange={(e) =>
                  setForm({ ...form, assignmentType: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Homework">Homework</option>
                <option value="Project">Project</option>
                <option value="Quiz">Quiz</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
=======
          {/* Section */}
          <div>
            <label className="block  mb-1">Section</label>
            <select
              value={form.sectionId}
              onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
              disabled={!form.classId}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Section</option>
              {sections && sections.length > 0 ? (
                sections.map((sec) => (
                  <option key={sec._id} value={sec._id}>
                    {sec.name}
                  </option>
                ))
              ) : (
                <option disabled>No sections available</option>
              )}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-1">Subject</label>
            <select
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              disabled={!form.classId}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Subject</option>
              {subjects && subjects.length > 0 ? (
                subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))
              ) : (
                <option disabled>No subjects available</option>
              )}
            </select>
          </div>
        </div>

        {/* Assignment Type & Due Date */}
        <div className="border rounded-lg p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block  mb-1">
              Assignment Type
            </label>
            <select
              value={form.assignmentType}
              onChange={(e) =>
                setForm({ ...form, assignmentType: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Homework">Homework</option>
              <option value="Project">Project</option>
              <option value="Quiz">Quiz</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block  mb-1">Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Title & Upload */}
        <div className="border rounded-lg p-4 space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter assignment title"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block  font-medium mb-1">
              Upload Document (PDF/Word)
            </label>
            <div className="flex items-center gap-3">
>>>>>>> 29103792aeea7f70e7978ba1c196f54046dca273
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
<<<<<<< HEAD
            </div>
          </div>

          {/* Title & Upload */}
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter assignment title"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Document (PDF/Word)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setForm({ ...form, file: e.target.files[0] })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
                <FiUpload className="text-xl text-gray-500" />
              </div>
              {form.file && (
                <p className="text-sm mt-1 text-green-600">{form.file.name}</p>
              )}
            </div>
          </div>

          {/* Description with Textarea */}
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Enter assignment description"
              rows={5}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm({
                  classId: "",
                  sectionId: "",
                  subjectId: "",
                  assignmentType: "Homework",
                  dueDate: "",
                  title: "",
                  file: null,
                  description: "",
                });
                setEditId(null);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : editId ? "Update" : "Save"}
            </button>
          </div>
        </div>

        {/* Saved Assignments */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-3">Saved Assignments</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {assignments.length === 0 ? (
            <p className="text-gray-500">No assignments saved yet.</p>
          ) : (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Section</th>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Due Date</th>
                  <th className="p-2 border">File</th>
                  <th className="p-2 border">Actions</th>
=======
              <FiUpload className=" text-gray-500" />
            </div>
            {form.file && (
              <p className=" mt-1 text-green-600">{form.file.name}</p>
            )}
          </div>
        </div>

        {/* Description with Textarea */}
        <div className="border rounded-lg p-4">
          <label className="block mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter assignment description"
            rows={5}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setForm({
                classId: "",
                sectionId: "",
                subjectId: "",
                assignmentType: "Homework",
                dueDate: "",
                title: "",
                file: null,
                description: "",
              });
              setEditId(null);
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : editId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Saved Assignments */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-3">Saved Assignments</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {assignments.length === 0 ? (
          <p className="text-gray-500">No assignments saved yet.</p>
        ) : (
          <table className="w-full  border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Class</th>
                <th className="p-2 border">Section</th>
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Due Date</th>
                <th className="p-2 border">File</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a._id}>
                  <td className="p-2 border">{a.class?.name || "N/A"}</td>
                  <td className="p-2 border">{a.section?.name || "N/A"}</td>
                  <td className="p-2 border">{a.subject?.name || "N/A"}</td>
                  <td className="p-2 border">{a.assignmentType}</td>
                  <td className="p-2 border">{a.title}</td>
                  <td className="p-2 border">
                    {a.dueDate
                      ? format(new Date(a.dueDate), "dd MMM yyyy")
                      : "-"}
                  </td>
                  <td className="p-2 border">
                    {a.document ? "Uploaded" : "-"}
                  </td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                        onClick={() => handleEdit(a._id)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(a._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
>>>>>>> 29103792aeea7f70e7978ba1c196f54046dca273
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a._id}>
                    <td className="p-2 border">{a.class?.name || "N/A"}</td>
                    <td className="p-2 border">{a.section?.name || "N/A"}</td>
                    <td className="p-2 border">{a.subject?.name || "N/A"}</td>
                    <td className="p-2 border">{a.assignmentType}</td>
                    <td className="p-2 border">{a.title}</td>
                    <td className="p-2 border">
                      {a.dueDate
                        ? format(new Date(a.dueDate), "dd MMM yyyy")
                        : "-"}
                    </td>
                    <td className="p-2 border">
                      {a.document ? (
                        <button
                          onClick={() =>
                            setPreviewFile(`${FILE_BASE_URL}${a.document}`)
                          }
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Preview
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-2 border">
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 border rounded hover:bg-gray-100"
                          onClick={() => handleEdit(a._id)}
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(a._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">File Preview</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex items-center justify-center">
              {getPreviewUrl(previewFile) ? (
                <iframe
                  src={getPreviewUrl(previewFile)}
                  className="w-full h-full border-0"
                  title="File Preview"
                />
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-600 mb-4">
                    This file type cannot be previewed directly on localhost.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Please download the file to view it.
                  </p>
                  <a
                    href={previewFile}
                    download
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
