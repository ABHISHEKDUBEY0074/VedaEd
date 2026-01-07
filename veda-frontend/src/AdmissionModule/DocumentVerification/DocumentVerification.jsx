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

// Dummy Data for demonstration
const getDummyData = () => {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return [
    {
      _id: "1",
      personalInfo: {
        name: "Rahul Sharma",
        stdId: "STD001",
        rollNo: "101",
        class: "Class 10-A",
        section: "A",
      },
      documents: [
        {
          _id: "doc1",
          name: "Birth_Certificate.pdf",
          path: "/uploads/birth-certificate.pdf",
          size: 245760,
          uploadedAt: lastMonth,
          verificationStatus: "verified",
          verifiedBy: "Admin",
          verifiedAt: new Date(lastMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
          comment: "Certificate verified. All details are correct.",
        },
        {
          _id: "doc2",
          name: "Transfer_Certificate.pdf",
          path: "/uploads/transfer-certificate.pdf",
          size: 189440,
          uploadedAt: lastWeek,
          verificationStatus: "pending",
          verifiedBy: "",
          verifiedAt: null,
          comment: "",
        },
        {
          _id: "doc3",
          name: "Marksheet_Class9.pdf",
          path: "/uploads/marksheet.pdf",
          size: 321024,
          uploadedAt: lastWeek,
          verificationStatus: "verified",
          verifiedBy: "Admin",
          verifiedAt: new Date(lastWeek.getTime() + 1 * 24 * 60 * 60 * 1000),
          comment: "Verified successfully.",
        },
      ],
    },
    {
      _id: "2",
      personalInfo: {
        name: "Priya Patel",
        stdId: "STD002",
        rollNo: "102",
        class: "Class 10-B",
        section: "B",
      },
      documents: [
        {
          _id: "doc4",
          name: "Birth_Certificate.pdf",
          path: "/uploads/birth-certificate-2.pdf",
          size: 267264,
          uploadedAt: lastWeek,
          verificationStatus: "verified",
          verifiedBy: "Admin",
          verifiedAt: new Date(lastWeek.getTime() + 1 * 24 * 60 * 60 * 1000),
          comment: "Document verified.",
        },
        {
          _id: "doc5",
          name: "Medical_Certificate.jpg",
          path: "/uploads/medical-cert.jpg",
          size: 524288,
          uploadedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          verificationStatus: "rejected",
          verifiedBy: "Admin",
          verifiedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          comment: "Certificate is not clear. Please upload a clearer copy.",
        },
        {
          _id: "doc6",
          name: "Aadhaar_Card.pdf",
          path: "/uploads/aadhaar.pdf",
          size: 156672,
          uploadedAt: lastMonth,
          verificationStatus: "pending",
          verifiedBy: "",
          verifiedAt: null,
          comment: "",
        },
      ],
    },
    {
      _id: "3",
      personalInfo: {
        name: "Amit Kumar",
        stdId: "STD003",
        rollNo: "103",
        class: "Class 9-A",
        section: "A",
      },
      documents: [
        {
          _id: "doc7",
          name: "Birth_Certificate.pdf",
          path: "/uploads/birth-certificate-3.pdf",
          size: 230400,
          uploadedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          verificationStatus: "pending",
          verifiedBy: "",
          verifiedAt: null,
          comment: "",
        },
        {
          _id: "doc8",
          name: "Previous_School_TC.pdf",
          path: "/uploads/tc.pdf",
          size: 198656,
          uploadedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
          verificationStatus: "pending",
          verifiedBy: "",
          verifiedAt: null,
          comment: "",
        },
      ],
    },
    {
      _id: "4",
      personalInfo: {
        name: "Sneha Reddy",
        stdId: "STD004",
        rollNo: "104",
        class: "Class 11-A",
        section: "A",
      },
      documents: [
        {
          _id: "doc9",
          name: "Birth_Certificate.pdf",
          path: "/uploads/birth-certificate-4.pdf",
          size: 278528,
          uploadedAt: lastMonth,
          verificationStatus: "verified",
          verifiedBy: "Admin",
          verifiedAt: new Date(lastMonth.getTime() + 1 * 24 * 60 * 60 * 1000),
          comment: "Verified and approved.",
        },
        {
          _id: "doc10",
          name: "Class_10_Marksheet.pdf",
          path: "/uploads/marksheet-10.pdf",
          size: 345088,
          uploadedAt: lastWeek,
          verificationStatus: "verified",
          verifiedBy: "Admin",
          verifiedAt: new Date(lastWeek.getTime() + 1 * 24 * 60 * 60 * 1000),
          comment: "All marks verified. Good performance.",
        },
        {
          _id: "doc11",
          name: "Photo.jpg",
          path: "/uploads/photo.jpg",
          size: 458752,
          uploadedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          verificationStatus: "rejected",
          verifiedBy: "Admin",
          verifiedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          comment:
            "Photo quality is poor. Please upload a clear passport size photo.",
        },
        {
          _id: "doc12",
          name: "Caste_Certificate.pdf",
          path: "/uploads/caste-cert.pdf",
          size: 189952,
          uploadedAt: lastWeek,
          verificationStatus: "pending",
          verifiedBy: "",
          verifiedAt: null,
          comment: "",
        },
      ],
    },
    {
      _id: "5",
      personalInfo: {
        name: "Vikram Singh",
        stdId: "STD005",
        rollNo: "105",
        class: "Class 8-B",
        section: "B",
      },
      documents: [
        {
          _id: "doc13",
          name: "Birth_Certificate.pdf",
          path: "/uploads/birth-certificate-5.pdf",
          size: 256000,
          uploadedAt: lastMonth,
          verificationStatus: "verified",
          verifiedBy: "Admin",
          verifiedAt: new Date(lastMonth.getTime() + 3 * 24 * 60 * 60 * 1000),
          comment: "Verified successfully.",
        },
      ],
    },
    {
      _id: "6",
      personalInfo: {
        name: "Ananya Desai",
        stdId: "STD006",
        rollNo: "106",
        class: "Class 12-A",
        section: "A",
      },
      documents: [
        {
          _id: "doc14",
          name: "Birth_Certificate.pdf",
          path: "/uploads/birth-certificate-6.pdf",
          size: 267264,
          uploadedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
          verificationStatus: "pending",
          verifiedBy: "",
          verifiedAt: null,
          comment: "",
        },
        {
          _id: "doc15",
          name: "Class_11_Marksheet.pdf",
          path: "/uploads/marksheet-11.pdf",
          size: 378880,
          uploadedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          verificationStatus: "pending",
          verifiedBy: "",
          verifiedAt: null,
          comment: "",
        },
        {
          _id: "doc16",
          name: "Character_Certificate.pdf",
          path: "/uploads/character-cert.pdf",
          size: 145920,
          uploadedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
          verificationStatus: "verified",
          verifiedBy: "Admin",
          verifiedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          comment: "Character certificate verified.",
        },
      ],
    },
  ];
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
      // TODO: Replace with actual API call when backend is ready
      // Set USE_DUMMY_DATA to false to use real API
      const USE_DUMMY_DATA = true; // Change to false when connecting to backend

      if (USE_DUMMY_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        const dummyData = getDummyData();
        setStudents(dummyData);
        setLoading(false);
        return;
      }

      // Real API call (will be used when backend is ready)
      const res = await axios.get("http://localhost:5000/api/students");
      if (res.data.success && Array.isArray(res.data.students)) {
        const studentsWithDocs = await Promise.all(
          res.data.students.map(async (student) => {
            try {
              const docsRes = await axios.get(
                `http://localhost:5000/api/students/documents/${student._id}`
              );
              const documents = (docsRes.data || []).map((doc) => ({
                ...doc,
                verificationStatus: doc.verificationStatus || "pending",
                verifiedBy: doc.verifiedBy || "",
                verifiedAt: doc.verifiedAt || null,
                comment: doc.comment || "",
              }));
              return { ...student, documents };
            } catch (err) {
              console.error(
                `Error fetching docs for student ${student._id}:`,
                err
              );
              return { ...student, documents: [] };
            }
          })
        );
        setStudents(studentsWithDocs);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      // Fallback to dummy data if API fails
      console.log("Falling back to dummy data...");
      const dummyData = getDummyData();
      setStudents(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewDocument = async (doc, studentId) => {
    try {
      // For dummy data, show a placeholder message
      if (doc.path.startsWith("/uploads/") && !doc.path.includes("http")) {
        setPreviewDoc({
          ...doc,
          url: null,
          studentId,
          isDummy: true,
        });
        return;
      }
      const fileUrl = `http://localhost:5000${doc.path}`;
      setPreviewDoc({ ...doc, url: fileUrl, studentId });
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
      // Update document verification status
      // Note: This would typically be an API call to update the document status
      // For now, we'll update it locally
      const updatedStudents = students.map((student) => {
        if (student._id === selectedStudent._id) {
          const updatedDocs = student.documents.map((doc) => {
            if (
              doc._id === selectedDocument._id ||
              doc.name === selectedDocument.name
            ) {
              return {
                ...doc,
                verificationStatus,
                comment: verificationComment,
                verifiedBy: "Admin", // This would come from auth context
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

      // Here you would typically make an API call:
      // await axios.put(`http://localhost:5000/api/students/documents/${selectedStudent._id}/verify`, {
      //   documentId: selectedDocument._id,
      //   status: verificationStatus,
      //   comment: verificationComment
      // });
    } catch (err) {
      console.error("Error verifying document:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = (doc) => {
    // For dummy data, show a message
    if (doc.path.startsWith("/uploads/") && !doc.path.includes("http")) {
      alert(
        "This is dummy data. In production, this will download the actual document."
      );
      return;
    }
    const fileUrl = `http://localhost:5000${doc.path}`;
    window.open(fileUrl, "_blank");
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
