import React, { useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import TemplateModal from "../components/TemplateModal";

export default function NoticeTemplates() {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: "Independence Day Celebration",
      message:
        "All the students of our school are hereby informed that our school is going to celebrate the Independence Day like previous years in the school premises. Students are requested to note that on the 15th August they will be assembled on the school ground at 7:30 a.m. positively.",
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      message:
        "Dear Parents, we are pleased to inform you that a Parent-Teacher Meeting is scheduled for this Saturday from 10:00 AM to 12:00 PM. Your presence is highly appreciated.",
    },
    {
      id: 3,
      title: "Holiday Notice",
      message:
        "This is to inform all students and parents that the school will remain closed on [Date] due to [Reason]. Regular classes will resume on [Next Date].",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleCreateTemplate = (templateData) => {
    const newTemplate = {
      id: Date.now(),
      ...templateData,
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleUpdateTemplate = (templateData) => {
    setTemplates(
      templates.map((template) =>
        template.id === editingTemplate.id
          ? { ...template, ...templateData }
          : template
      )
    );
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((template) => template.id !== templateId));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notice Templates</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiPlus size={16} />
          Create Template
        </button>
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-lg shadow">
        {templates.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No templates created yet.</p>
            <p className="text-sm">
              Click "Create Template" to add your first template.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {templates.map((template) => (
              <div key={template.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {template.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {template.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Edit template"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete template"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
        title={editingTemplate ? "Edit Template" : "Add Notice Template"}
        initialTitle={editingTemplate?.title || ""}
        initialMessage={editingTemplate?.message || ""}
      />
    </div>
  );
}
