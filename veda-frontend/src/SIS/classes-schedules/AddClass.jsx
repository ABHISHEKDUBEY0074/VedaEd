import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const defaultSections = ["A", "B", "C", "D", "E", "F"];

const AddClass = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [sections, setSections] = useState(defaultSections);
  const [newSection, setNewSection] = useState("");
  const [editId, setEditId] = useState(null);

  // ✅ Fetch sections and classes when component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sections
        const secRes = await axios.get("http://localhost:5000/api/sections/");
        if (secRes.data.success && secRes.data.data.length > 0) {
          setSections([
            ...new Set([
              ...defaultSections,
              ...secRes.data.data.map((s) => s.name),
            ]),
          ]);
        }

        // Fetch classes
        const classRes = await axios.get("http://localhost:5000/api/classes/");
        if (classRes.data.success) {
          const formatted = classRes.data.data.map((c) => ({
            id: c._id,
            name: c.name,
            sections: c.sections.map((s) => s.name),
          }));
          setClasses(formatted);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Add / Update class
  const handleSaveClass = async () => {
    if (!className) return alert("Class name required!");
    if (selectedSections.length === 0)
      return alert("Select at least one section!");

    try {
      // Step 1: Create sections in backend (only new ones)
      const sectionIds = [];
      for (let sec of selectedSections) {
        const res = await axios.post("http://localhost:5000/api/sections/", {
          name: sec,
        });
        if (res.data.success) {
          sectionIds.push(res.data.data._id);
        }
      }

      // Step 2: Create class in backend
      const classRes = await axios.post("http://localhost:5000/api/classes/", {
        name: className,
        sections: sectionIds,
        capacity: "60",
      });

      if (classRes.data.success) {
        const newClass = {
          id: classRes.data.data._id,
          name: classRes.data.data.name,
          sections: classRes.data.data.sections.map((s) => s.name),
        };
        setClasses([...classes, newClass]);
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to save class!");
    }

    setClassName("");
    setSelectedSections([]);
    setEditId(null);
  };

  // Add new section (frontend list only, backend when saving)
  const handleAddSection = () => {
    if (!newSection) return;
    if (sections.includes(newSection)) return alert("Already exists!");
    setSections([...sections, newSection]);
    setNewSection("");
  };

  // Delete class
  const handleDelete = (id) => {
    setClasses(classes.filter((c) => c.id !== id));
    
  };

  // Edit class
  const handleEdit = (cls) => {
    setClassName(cls.name);
    setSelectedSections(cls.sections);
    setEditId(cls.id);
  };

  // Export Excel
  const exportExcel = () => {
    const ws = utils.json_to_sheet(
      classes.map((c) => ({ Class: c.name, Sections: c.sections.join(", ") }))
    );
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Classes");
    writeFile(wb, "classes.xlsx");
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Class List", 14, 15);
    autoTable(doc, {
      head: [["Class", "Sections"]],
      body: classes.map((c) => [c.name, c.sections.join(", ")]),
    });
    doc.save("classes.pdf");
  };

  return (
    <div className="p-6">
      <nav className="text-sm mb-6">
        <ol className="flex text-gray-600">
          <li>
            <Link to="/" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link
              to="/classes-schedules"
              className="text-blue-600 hover:underline"
            >
              Classes & Schedules
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-gray-800 font-medium">Add Class & Section</li>
        </ol>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Add Class & Section</h2>
        <Link
          to="/classes-schedules/add-subject"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Class */}
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">Add Class</h3>
          <label className="block mb-2">Class Name*</label>
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
            className="w-full border px-2 py-1 mb-3 rounded"
          />
          <label className="block mb-2">Sections*</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {sections.map((sec) => (
              <label key={sec} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedSections.includes(sec)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSections([...selectedSections, sec]);
                    } else {
                      setSelectedSections(
                        selectedSections.filter((s) => s !== sec)
                      );
                    }
                  }}
                />
                {sec}
              </label>
            ))}
          </div>
          <button
            onClick={handleSaveClass}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            {editId ? "Update" : "Save"}
          </button>
        </div>

        {/* Add Section */}
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">Add Section</h3>
          <label className="block mb-2">Section name*</label>
          <div className="flex gap-2 mb-3">
            <input
              value={newSection}
              onChange={(e) => setNewSection(e.target.value.toUpperCase())}
              placeholder="Enter new section"
              className="flex-1 border px-2 py-1 rounded"
            />
            <button
              onClick={handleAddSection}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
          <h4 className="font-medium mb-2">Sections List</h4>
          <ul className="border p-2 rounded max-h-40 overflow-y-auto">
            {sections.map((sec, i) => (
              <li key={i} className="py-1">
                {sec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Class List */}
      <div className="bg-white shadow mt-8 p-4 rounded">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Class List</h3>
          <div className="flex gap-3">
            <button
              onClick={exportExcel}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Export Excel
            </button>
            <button
              onClick={exportPDF}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Export PDF
            </button>
          </div>
        </div>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Class</th>
              <th className="border px-2 py-1">Sections</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td className="border px-2 py-1">{c.name}</td>
                <td className="border px-2 py-1">{c.sections.join(", ")}</td>
                <td className="border px-2 py-1 flex gap-3">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-3 text-gray-500">
                  No classes added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddClass;
