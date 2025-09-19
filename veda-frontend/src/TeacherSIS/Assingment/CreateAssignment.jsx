import React, { useState } from "react";
import { FiUpload, FiEdit, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";

/* Dummy dropdown data (later fetch from backend) */
const CLASSES = [
  {
    id: 1,
    name: "Class 6",
    sections: ["A", "B", "C"],
    subjects: ["Math", "Science", "English"],
  },
  { id: 2, name: "Class 7", sections: ["A", "B"], subjects: ["Math", "History"] },
];

export default function CreateAssignment() {
  const [form, setForm] = useState({
    class: "",
    section: "",
    subject: "",
    type: "Homework",
    dueDate: "",
    title: "",
    file: null,
    description: "",
  });

  const [assignments, setAssignments] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleSave = () => {
    if (!form.class || !form.section || !form.subject || !form.title) {
      alert("Please fill all required fields");
      return;
    }

    if (editId) {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === editId ? { ...form, id: editId } : a
        )
      );
      setEditId(null);
    } else {
      const newAssignment = { ...form, id: Date.now() };
      setAssignments([...assignments, newAssignment]);
    }

    setForm({
      class: "",
      section: "",
      subject: "",
      type: "Homework",
      dueDate: "",
      title: "",
      file: null,
      description: "",
    });
  };

  const handleEdit = (id) => {
    const assignment = assignments.find((a) => a.id === id);
    if (assignment) {
      setForm({ ...assignment });
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    setAssignments(assignments.filter((a) => a.id !== id));
    if (editId === id) {
      setEditId(null);
      setForm({
        class: "",
        section: "",
        subject: "",
        type: "Homework",
        dueDate: "",
        title: "",
        file: null,
        description: "",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Create Assignment Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-xl font-semibold">Create Assignment</h2>

        {/* Class / Section / Subject */}
        <div className="border rounded-lg p-4 grid grid-cols-3 gap-4">
          {/* Class */}
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              value={form.class}
              onChange={(e) =>
                setForm({ ...form, class: e.target.value, section: "", subject: "" })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Class</option>
              {CLASSES.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium mb-1">Section</label>
            <select
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              disabled={!form.class}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Section</option>
              {CLASSES.find((c) => c.name === form.class)?.sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              disabled={!form.class}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Subject</option>
              {CLASSES.find((c) => c.name === form.class)?.subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assignment Type & Due Date */}
        <div className="border rounded-lg p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Assignment Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Homework">Homework</option>
              <option value="Worksheet">Worksheet</option>
              <option value="Project">Project</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
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
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
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
          <label className="block text-sm font-medium mb-2">Description</label>
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
                class: "",
                section: "",
                subject: "",
                type: "Homework",
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
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {editId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Saved Assignments */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-3">Saved Assignments</h2>
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
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td className="p-2 border">{a.class}</td>
                  <td className="p-2 border">{a.section}</td>
                  <td className="p-2 border">{a.subject}</td>
                  <td className="p-2 border">{a.type}</td>
                  <td className="p-2 border">{a.title}</td>
                  <td className="p-2 border">
                    {a.dueDate ? format(new Date(a.dueDate), "dd MMM yyyy") : "-"}
                  </td>
                  <td className="p-2 border">{a.file ? a.file.name : "-"}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                        onClick={() => handleEdit(a.id)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="px-2 py-1 border rounded text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(a.id)}
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
  );
}
