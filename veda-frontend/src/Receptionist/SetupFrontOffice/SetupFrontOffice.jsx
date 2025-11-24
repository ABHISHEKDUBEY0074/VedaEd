import React, { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiSave,
  FiSearch,
  FiDownload,
  FiPlus,
} from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";

export default function SetupFrontOffice() {
  const tabs = ["Purpose", "Complaint Type", "Source", "Reference"];
  const [activeTab, setActiveTab] = useState("Purpose");

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [data, setData] = useState({
    Purpose: [],
    "Complaint Type": [],
    Source: [],
    Reference: [],
  });

  // SAVE / UPDATE
  const handleSave = () => {
    if (!formData.name.trim()) return alert("Name Required");

    if (editingId) {
      const updated = data[activeTab].map((item) =>
        item.id === editingId ? { ...item, ...formData } : item
      );
      setData({ ...data, [activeTab]: updated });
      setEditingId(null);
    } else {
      const newItem = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
      };
      setData({ ...data, [activeTab]: [...data[activeTab], newItem] });
    }

    setFormData({ name: "", description: "" });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, description: item.description });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      const filtered = data[activeTab].filter((i) => i.id !== id);
      setData({ ...data, [activeTab]: filtered });
    }
  };

  const filteredData = data[activeTab].filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Front Office &gt;</span>
        <span>Setup Front Office</span>
      </div>
<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Front Office</h2>

  <HelpInfo
    title="Communication Module Help"
    description="This module allows you to manage all Parents records, login access, roles, and other information."
    steps={[
      "Use All Staff tab to view and manage Parents details.",
      "Use Manage Login tab to update login credentials.",
      "Use Others tab for additional Parents-related tools."
    ]}
  />
</div>

      {/* Tabs like Admission Enquiry */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => {
              setActiveTab(t);
              setEditingId(null);
              setFormData({ name: "", description: "" });
            }}
            className={`pb-2 ${
              activeTab === t
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main big box */}
      <div className="bg-gray-200 p-6 border border-gray-100">
        <div className="bg-white p-4 rounded-lg shadow-sm">

          {/* Toolbar */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

           
          </div>

          {/* FORM */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-sm">
                {activeTab} Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="border rounded-md px-3 py-2 w-full"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-sm">
                Description
              </label>
              <input
                type="text"
                className="border rounded-md px-3 py-2 w-full"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-fit"
            >
              <FiSave className="inline mr-2" />
              {editingId ? "Update" : "Save"}
            </button>
          </div>

          {/* TABLE */}
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 font-semibold">{activeTab}</th>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.description || "—"}</td>
                  <td className="p-3 text-center flex gap-2 justify-center">
                    <FiEdit2
                      className="cursor-pointer text-blue-600"
                      onClick={() => handleEdit(item)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-red-600"
                      onClick={() => handleDelete(item.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <p className="text-center text-gray-500 py-4">No records found</p>
          )}
        </div>
      </div>
    </div>
  );
}
