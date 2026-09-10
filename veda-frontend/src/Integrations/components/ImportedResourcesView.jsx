import React, { useState } from "react";
import {
  FiFileText,
  FiFolder,
  FiExternalLink,
  FiTrash2,
  FiSearch,
  FiDownloadCloud,
  FiCalendar,
  FiVideo,
} from "react-icons/fi";

export default function ImportedResourcesView({
  resources = [],
  loading = false,
  onDeleteResource,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filtered = resources.filter((r) => {
    const matchesSearch =
      !searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || r.resourceType === selectedType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type) => {
    switch (type) {
      case "document":
        return <FiFileText className="w-5 h-5 text-blue-600" />;
      case "spreadsheet":
        return <FiFileText className="w-5 h-5 text-emerald-600" />;
      case "presentation":
        return <FiFileText className="w-5 h-5 text-amber-600" />;
      case "meeting":
        return <FiVideo className="w-5 h-5 text-indigo-600" />;
      case "calendar_event":
        return <FiCalendar className="w-5 h-5 text-purple-600" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search imported resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {["all", "document", "spreadsheet", "presentation", "design", "meeting"].map(
            (type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition shrink-0 ${
                  selectedType === type
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            )
          )}
        </div>
      </div>

      {/* Grid of Imported Resources */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl border border-gray-200 p-4 h-32"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-base font-semibold text-gray-900">No Resources Imported Yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Open any connected app like Google Drive or Notion to attach or import documents into Veda School.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource) => (
            <div
              key={resource._id}
              className="bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-sm p-4.5 flex flex-col justify-between transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      {getIcon(resource.resourceType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-sm font-semibold text-gray-900 truncate"
                        title={resource.name}
                      >
                        {resource.name}
                      </h4>
                      <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                        {resource.providerSlug} • {resource.resourceType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                  <span>
                    Imported: {new Date(resource.importedAt || resource.createdAt).toLocaleDateString()}
                  </span>
                  {resource.sizeBytes > 0 && (
                    <>
                      <span>•</span>
                      <span>{(resource.sizeBytes / 1024).toFixed(1)} KB</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <a
                  href={resource.webViewUrl || resource.deepLinkUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                >
                  <FiExternalLink className="w-3.5 h-3.5" /> Open in {resource.providerSlug}
                </a>

                <button
                  type="button"
                  onClick={() => onDeleteResource(resource._id, resource.name)}
                  title="Remove from Veda"
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
