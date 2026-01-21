import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiFileText,
  FiEye,
  FiX,
  FiSearch,
  FiFilter,
  FiDownload,
  FiAlertCircle,
  FiClock,
  FiUser,
  FiBookOpen,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <FiClock />,
      label: "Pending",
    },
    verified: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <FiCheckCircle />,
      label: "Verified",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: <FiXCircle />,
      label: "Rejected",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.icon} {config.label}
    </span>
  );
};


export default function DocumentVerification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationComment, setVerificationComment] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
  });

  const filterStudents = useCallback(() => {
    let filtered = students.filter((student) => {
      const nameMatch = student.personalInfo?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const idMatch = student.personalInfo?.stdId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const studentMatch = nameMatch || idMatch;

      if (statusFilter === "all") return studentMatch;

      const hasDocumentsWithStatus = student.documents?.some(
        (doc) => doc.verificationStatus === statusFilter
      );
      return studentMatch && hasDocumentsWithStatus;
    });

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter]);

  const calculateStats = useCallback(() => {
    let total = 0;
    let pending = 0;
    let verified = 0;
    let rejected = 0;

    students.forEach((student) => {
      if (student.documents && student.documents.length > 0) {
        student.documents.forEach((doc) => {
          total++;
          if (doc.verificationStatus === "pending") pending++;
          else if (doc.verificationStatus === "verified") verified++;
          else if (doc.verificationStatus === "rejected") rejected++;
        });
      }
    });

    setStats({ total, pending, verified, rejected });
  }, [students]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [filterStudents]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admission/application");
      if (res.data.success && Array.isArray(res.data.data)) {
        // Map application data to structure expected by UI
        const mappedData = res.data.data.map((app) => ({
             _id: app._id,
             // Use applicationId for display if available, else standard ID
             personalInfo: {
                 name: app.personalInfo?.name || "N/A",
                 stdId: app.applicationId || "N/A", 
                 rollNo: "N/A", // Not assigned yet
                 class: app.earlierAcademic?.lastClass || "N/A",
                 section: "N/A",
             },
             documents: (app.documents || []).map(doc => ({
                 _id: doc._id || doc.name, // Fallback ID
                 name: doc.name,
                 path: doc.path,
                 size: doc.size,
                 uploadedAt: doc.uploadedAt,
                 verificationStatus: doc.verificationStatus || "pending", // You might need to add this field to your doc schema if valid status is per-doc
                 verifiedBy: "",
                 verifiedAt: null,
                 comment: "",
                 type: doc.type // preserve type
             }))
        }));
        
        // Filter out apps with no documents if you only want to see actionable items
        const appsWithDocs = mappedData.filter(app => app.documents.length > 0);
        setStudents(appsWithDocs);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
      // setStudents([]); // Clear on error or keep empty
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewDocument = async (doc, studentId) => {
    try {
      if (doc.path) {
          // Construct URL properly. Assuming backend serves 'uploads' statically
          // If path is absolute or relative, ensure it maps to http://localhost:5000/uploads/...
          // The backend saves path like 'public\uploads\file.pdf' or similar. 
          // We need to normalize it.
          // For now, let's assume backend serves /uploads.
          
          let cleanPath = doc.path.replace(/\\/g, "/"); // Normalize windows slashes
          // If path contains 'public/uploads', strip it or adjust
          if (cleanPath.includes("public/")) {
              cleanPath = cleanPath.split("public/")[1];
          }
          
          const fileUrl = `http://localhost:5000/${cleanPath}`;
          setPreviewDoc({ ...doc, url: fileUrl, studentId });
      }
    } catch (err) {
      console.error("Error previewing document:", err);
    }
  };

  const handleOpenVerificationModal = (doc, student) => {
    setSelectedDocument(doc);
    setSelectedStudent(student);
    setVerificationStatus(doc.verificationStatus || "pending");
    setVerificationComment(doc.comment || "");
    setShowVerificationModal(true);
  };

  const handleVerifyDocument = async () => {
    if (!selectedDocument || !selectedStudent) return;

    setLoading(true);
    try {
      // Update document verification status via API
      const res = await axios.put(
        `http://localhost:5000/api/admission/application/${selectedStudent._id}/document/${selectedDocument._id}/verify`,
        {
          status: verificationStatus,
          comment: verificationComment,
        }
      );

      if (res.data.success) {
        // Update local state
        const updatedStudents = students.map((student) => {
          if (student._id === selectedStudent._id) {
            const updatedDocs = student.documents.map((doc) => {
              if (doc._id === selectedDocument._id) {
                return {
                  ...doc,
                  verificationStatus,
                  comment: verificationComment,
                  verifiedBy: "Admin",
                  verifiedAt: new Date(),
                };
              }
              return doc;
            });
            return { ...student, documents: updatedDocs };
          }
          return student;
        });

        setStudents(updatedStudents);
        setShowVerificationModal(false);
        setSelectedDocument(null);
        setSelectedStudent(null);
        setVerificationComment("");
      }
    } catch (err) {
      console.error("Error verifying document:", err);
      alert("Failed to update document status");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = (doc) => {
      if (doc.path) {
          let cleanPath = doc.path.replace(/\\/g, "/");
          if (cleanPath.includes("public/")) {
              cleanPath = cleanPath.split("public/")[1];
          }
          const fileUrl = `http://localhost:5000/${cleanPath}`;
          window.open(fileUrl, "_blank");
      }
  };

  const getDocumentType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "Image";
    if (ext === "pdf") return "PDF";
    if (["doc", "docx"].includes(ext)) return "Word";
    return "Document";
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button
          onClick={() => navigate("/students")}
          className="hover:underline"
        >
          Students
        </button>
        <span>&gt;</span>
        <span>Document Verification</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Document Verification</h2>
        <HelpInfo
          title="Document Verification Help"
          description={`1.1 Overview

This page is used to verify and manage student documents submitted for admission or academic purposes. It provides a clear status overview and detailed document information.

2.1 Document Status Summary

- Total Documents: Total number of documents uploaded by students.
- Pending: Documents awaiting verification.
- Verified: Documents that have been checked and approved.
- Rejected: Documents that did not meet verification criteria and were rejected.

3.1 Document Search and Filters

Use the search bar to find documents by student name or ID. Filter documents based on their status (All, Pending, Verified, Rejected). Use the Refresh button to update the list.

4.1 Document Details List

For each student, you will see:

- Student Name, Class, ID, and Roll Number for identification.
- Documents Count: Number of documents uploaded by the student.
- Document File Name with format (e.g., PDF) and size.
- Upload Date: When the document was submitted.
- Verification Date: When the document was verified (if applicable).
- Note: Any remarks related to the verification.
- Status: Current verification status — Pending, Verified, or Rejected.

Use this page to carefully verify each document and update the status accordingly.`}
        />
      </div>

      <div className="bg-white p-3 rounded-lg shadow-sm border">
        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <FiFileText className="text-blue-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.pending}
                </p>
              </div>
              <FiClock className="text-yellow-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.verified}
                </p>
              </div>
              <FiCheckCircle className="text-green-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.rejected}
                </p>
              </div>
              <FiXCircle className="text-red-500 text-3xl" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-3">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button
              onClick={fetchStudents}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </div>

        {/* Main content box */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading && filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="mx-auto text-gray-400 text-5xl mb-4" />
              <p className="text-gray-600">No students found with documents</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Student Header */}
                  <div className="flex items-center justify-between mb-3 pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FiUser className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {student.personalInfo?.name || "Unknown Student"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1  text-gray-600">
                          <span className="flex items-center gap-1">
                            <FiBookOpen />{" "}
                            {student.personalInfo?.class || "N/A"}
                          </span>
                          <span>
                            ID: {student.personalInfo?.stdId || "N/A"}
                          </span>
                          <span>
                            Roll: {student.personalInfo?.rollNo || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className=" text-gray-600">Documents</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {student.documents?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Documents List */}
                  {student.documents && student.documents.length > 0 ? (
                    <div className="space-y-3">
                      {student.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="bg-gray-100 p-3 rounded-lg">
                              <FiFileText className="text-blue-500 text-xl" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <p className="font-medium text-gray-800">
                                  {doc.name}
                                </p>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {getDocumentType(doc.name)}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{(doc.size / 1024).toFixed(2)} KB</span>
                                <span>
                                  Uploaded:{" "}
                                  {doc.uploadedAt
                                    ? new Date(
                                        doc.uploadedAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                                {doc.verifiedAt && (
                                  <span>
                                    Verified:{" "}
                                    {new Date(
                                      doc.verifiedAt
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {doc.comment && (
                                <p className="text-xs text-gray-600 mt-1 italic">
                                  Note: {doc.comment}
                                </p>
                              )}
                            </div>
                            <StatusBadge status={doc.verificationStatus} />
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() =>
                                handlePreviewDocument(doc, student._id)
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <FiEye />
                            </button>
                            <button
                              onClick={() => handleDownloadDocument(doc)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Download"
                            >
                              <FiDownload />
                            </button>
                            <button
                              onClick={() =>
                                handleOpenVerificationModal(doc, student)
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                doc.verificationStatus === "verified"
                                  ? "text-green-600 hover:bg-green-50"
                                  : doc.verificationStatus === "rejected"
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-yellow-600 hover:bg-yellow-50"
                              }`}
                              title="Verify/Reject"
                            >
                              {doc.verificationStatus === "verified" ? (
                                <FiCheckCircle />
                              ) : doc.verificationStatus === "rejected" ? (
                                <FiXCircle />
                              ) : (
                                <FiAlertCircle />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiFileText className="mx-auto text-3xl mb-2" />
                      <p>No documents uploaded</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">{previewDoc.name}</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              {previewDoc.isDummy ? (
                <div className="text-center py-12">
                  <FiFileText className="mx-auto text-5xl text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2 font-medium">
                    Dummy Data Preview
                  </p>
                  <p className="text-gray-500  mb-3">
                    This is sample data for demonstration purposes.
                  </p>
                  <p className="text-gray-600  mb-3">
                    <strong>Document:</strong> {previewDoc.name}
                  </p>
                  <p className="text-gray-500 ">
                    When connected to backend, actual document preview will be
                    shown here.
                  </p>
                </div>
              ) : previewDoc.path?.endsWith(".pdf") ? (
                <iframe
                  src={previewDoc.url}
                  className="w-full h-[70vh] border rounded"
                  title={previewDoc.name}
                />
              ) : previewDoc.path?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.name}
                  className="max-w-full h-auto mx-auto"
                />
              ) : (
                <div className="text-center py-12">
                  <FiFileText className="mx-auto text-5xl text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-3">
                    Preview not available for this file type
                  </p>
                  <button
                    onClick={() => handleDownloadDocument(previewDoc)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto"
                  >
                    <FiDownload /> Download to view
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && selectedDocument && selectedStudent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowVerificationModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Verify Document</h3>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mb-3">
              <p className=" text-gray-600 mb-2">Student:</p>
              <p className="font-medium">
                {selectedStudent.personalInfo?.name}
              </p>
            </div>

            <div className="mb-3">
              <p className="text-gray-600 mb-2">Document:</p>
              <p className="font-medium">{selectedDocument.name}</p>
            </div>

            <div className="mb-3">
              <label className="block font-medium mb-2">
                Verification Status *
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block  font-medium mb-2">
                Comment / Notes
              </label>
              <textarea
                value={verificationComment}
                onChange={(e) => setVerificationComment(e.target.value)}
                rows="4"
                placeholder="Add any comments or notes about this document..."
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyDocument}
                disabled={loading}
                className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 ${
                  verificationStatus === "verified"
                    ? "bg-green-500 hover:bg-green-600"
                    : verificationStatus === "rejected"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } disabled:opacity-50`}
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    {verificationStatus === "verified" ? (
                      <>
                        <FiCheckCircle /> Verify Document
                      </>
                    ) : verificationStatus === "rejected" ? (
                      <>
                        <FiXCircle /> Reject Document
                      </>
                    ) : (
                      <>
                        <FiClock /> Update Status
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
