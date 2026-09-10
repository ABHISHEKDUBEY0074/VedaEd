import React, { useState, useEffect } from "react";
import {
  FiX,
  FiFolder,
  FiFileText,
  FiSearch,
  FiExternalLink,
  FiPlus,
  FiCheck,
  FiChevronRight,
  FiRefreshCw,
  FiArrowLeft,
  FiLoader,
  FiVideo,
  FiCalendar,
} from "react-icons/fi";
import integrationAPI from "../../services/integrationAPI";
import Swal from "sweetalert2";

export default function ResourceExplorerModal({
  connection,
  isOpen,
  onClose,
  onResourceImported,
}) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState({ id: "", name: "Root" });
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: "", name: "Root" }]);
  const [importingId, setImportingId] = useState(null);
  const [importedIds, setImportedIds] = useState(new Set());

  const connectionId = connection?.id || connection?._id;

  const fetchResources = async (folderId = "", query = "") => {
    if (!connectionId) return;
    try {
      setLoading(true);
      const res = await integrationAPI.getConnectionResources(connectionId, {
        parentId: folderId,
        query,
      });
      setResources(res.data.data || []);
    } catch (err) {
      console.error("Resource fetch failed:", err);
      Swal.fire({
        icon: "error",
        title: "Explorer Error",
        text: err.response?.data?.message || err.message,
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && connectionId) {
      fetchResources(currentFolder.id, searchQuery);
    }
  }, [isOpen, connectionId, currentFolder.id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources(currentFolder.id, searchQuery);
  };

  const handleOpenFolder = (folder) => {
    const newBreadcrumb = [...breadcrumbs, { id: folder.id, name: folder.name }];
    setBreadcrumbs(newBreadcrumb);
    setCurrentFolder({ id: folder.id, name: folder.name });
    setSearchQuery("");
  };

  const handleNavigateBreadcrumb = (index) => {
    const target = breadcrumbs[index];
    const updated = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(updated);
    setCurrentFolder(target);
    setSearchQuery("");
  };

  const handleImport = async (resource) => {
    try {
      setImportingId(resource.id);
      await integrationAPI.importResource(connectionId, resource.id);
      setImportedIds((prev) => new Set(prev).add(resource.id));

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Imported "${resource.name}" into Veda School`,
        showConfirmButton: false,
        timer: 3000,
      });

      if (onResourceImported) onResourceImported();
    } catch (err) {
      console.error("Import error:", err);
      Swal.fire({
        icon: "error",
        title: "Import Failed",
        text: err.response?.data?.message || err.message,
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setImportingId(null);
    }
  };

  if (!isOpen || !connection) return null;

  const getFileIcon = (resource) => {
    if (resource.isFolder || resource.resourceType === "folder") {
      return <FiFolder className="w-5 h-5 text-amber-500 shrink-0" />;
    }
    if (resource.resourceType === "meeting") {
      return <FiVideo className="w-5 h-5 text-indigo-500 shrink-0" />;
    }
    if (resource.resourceType === "calendar_event") {
      return <FiCalendar className="w-5 h-5 text-purple-500 shrink-0" />;
    }
    return <FiFileText className="w-5 h-5 text-blue-500 shrink-0" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Explorer Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 p-2 flex items-center justify-center shadow-xs">
              <FiFolder className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span>{connection.provider?.name || connection.providerSlug} Resource Explorer</span>
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {connection.accountEmail || connection.accountName}
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Browse and select resources to import or link directly inside Veda School.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-xl transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Breadcrumbs & Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600 overflow-x-auto w-full sm:w-auto">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={b.id || idx}>
                {idx > 0 && <FiChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                <button
                  type="button"
                  onClick={() => handleNavigateBreadcrumb(idx)}
                  className={`hover:text-indigo-600 px-1.5 py-0.5 rounded transition ${
                    idx === breadcrumbs.length - 1
                      ? "font-bold text-gray-900 bg-gray-100"
                      : "text-gray-500"
                  }`}
                >
                  {b.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-72">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchResources(currentFolder.id, searchQuery)}
              title="Refresh"
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Resource Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
              <FiLoader className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="text-sm font-medium">Fetching resources...</span>
            </div>
          ) : resources.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <FiFolder className="w-12 h-12 stroke-1 text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-600">No items found</p>
              <p className="text-xs text-gray-400">This folder is empty or no search results match.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {resources.map((resItem) => {
                const isFolder = resItem.isFolder || resItem.resourceType === "folder";
                const isImported = importedIds.has(resItem.id);
                const isImporting = importingId === resItem.id;

                return (
                  <div
                    key={resItem.id}
                    className="py-3 px-3 rounded-xl hover:bg-gray-50 flex items-center justify-between gap-4 transition group"
                  >
                    <div
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      onClick={() => (isFolder ? handleOpenFolder(resItem) : null)}
                    >
                      {getFileIcon(resItem)}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition">
                          {resItem.name}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          <span>{resItem.resourceType || "file"}</span>
                          {resItem.sizeBytes > 0 && (
                            <>
                              <span>•</span>
                              <span>{(resItem.sizeBytes / 1024).toFixed(1)} KB</span>
                            </>
                          )}
                          {resItem.modifiedTime && (
                            <>
                              <span>•</span>
                              <span>{new Date(resItem.modifiedTime).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {resItem.webViewUrl && (
                        <a
                          href={resItem.webViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open deep link"
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {!isFolder && (
                        <button
                          type="button"
                          onClick={() => handleImport(resItem)}
                          disabled={isImported || isImporting}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isImported
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                          }`}
                        >
                          {isImporting ? (
                            <FiLoader className="w-3.5 h-3.5 animate-spin" />
                          ) : isImported ? (
                            <>
                              <FiCheck className="w-3.5 h-3.5" /> Imported
                            </>
                          ) : (
                            <>
                              <FiPlus className="w-3.5 h-3.5" /> Import
                            </>
                          )}
                        </button>
                      )}

                      {isFolder && (
                        <button
                          type="button"
                          onClick={() => handleOpenFolder(resItem)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                        >
                          Open Folder
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div>Showing {resources.length} items</div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
