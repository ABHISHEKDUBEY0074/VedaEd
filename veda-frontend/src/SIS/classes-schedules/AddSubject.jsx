import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const AddSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Theory");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔹 Load Subjects from Backend
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subjects"); // GET endpoint
      console.log("fetch subj:", res);
      if (res.data.success) {
        setSubjects(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching subjects", err);
    }
  };

  // Save Subject (POST / PUT)
  const handleSave = async () => {
    if (!name) return alert("Subject name is required!");

    try {
      if (editId) {
        // Update existing subject
        await axios.put(`/api/subjects/${editId}`, { subjectName: name, type });
      } else {
        // Add new subject
        await axios.post("http://localhost:5000/api/subjects", { subjectName: name, type });
      }
      fetchSubjects(); // Refresh list
      setName("");
      setType("Theory");
      setEditId(null);
    } catch (err) {
      console.error("Error saving subject", err);
    }
  };

  //  Delete Subject
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error("Error deleting subject", err);
    }
  };

  // Edit
  const handleEdit = (sub) => {
    setName(sub.subjectName);
    setType(sub.type);
    setEditId(sub._id);
  };

  // Export Excel
  const exportExcel = () => {
    const ws = utils.json_to_sheet(
      subjects.map((s) => ({
        Subject: s.subjectName,
        "Subject Code": s.subjectCode, // backend se auto generate
        "Subject Type": s.type,
      }))
    );
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Subjects");
    writeFile(wb, "subjects.xlsx");
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Subject List", 14, 15);
    autoTable(doc, {
      head: [["Subject", "Code", "Type"]],
      body: subjects.map((s) => [s.subjectName, s.subjectCode, s.type]),
    });
    doc.save("subjects.pdf");
  };

  // Filter subjects
  const filteredSubjects = subjects.filter((s) =>
    s.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubjects = filteredSubjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-6">
        <ol className="flex text-gray-600">
          <li>
            <Link
              to="/classes-schedules"
              className="text-blue-600 hover:underline"
            >
              Classes & Schedules
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link
              to="/classes-schedules/add-class"
              className="text-blue-600 hover:underline"
            >
              Add class
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-gray-800 font-medium">Add Subject</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left form */}
        <div className="bg-white shadow p-4 rounded md:col-span-1">
          <h3 className="text-lg font-semibold mb-4">
            {editId ? "Edit Subject" : "Add Subject"}
          </h3>

          <label className="block mb-2">Subject Name*</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter subject name"
            className="w-full border px-2 py-1 mb-3 rounded"
          />

          <label className="block mb-2">Subject Type*</label>
          <div className="flex gap-4 mb-3">
            <label>
              <input
                type="radio"
                value="Theory"
                checked={type === "Theory"}
                onChange={() => setType("Theory")}
              />{" "}
              Theory
            </label>
            <label>
              <input
                type="radio"
                value="Practical"
                checked={type === "Practical"}
                onChange={() => setType("Practical")}
              />{" "}
              Practical
            </label>
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            {editId ? "Update" : "Save"}
          </button>
        </div>

        {/* Right List */}
        <div className="bg-white shadow p-4 rounded md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Subject List</h3>
            <div className="flex gap-3">
              <button
                onClick={exportExcel}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Excel
              </button>
              <button
                onClick={exportPDF}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                PDF
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2 py-1 rounded mb-3 w-full"
          />

          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left">Subject</th>
                <th className="border px-2 py-1">Subject Code</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubjects.map((s) => (
                <tr key={s._id}>
                  <td className="border px-2 py-1">{s.subjectName}</td>
                  <td className="border px-2 py-1 text-center">
                    {s.subjectCode}
                  </td>
                  <td className="border px-2 py-1 text-center">{s.type}</td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedSubjects.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-gray-500">
                    No subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next button */}
      <div className="absolute bottom-4 right-4">
        <Link
          to="/classes-schedules/subject-group"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700"
        >
          Next →
        </Link>
      </div>
    </div>
  );
};

export default AddSubject;
