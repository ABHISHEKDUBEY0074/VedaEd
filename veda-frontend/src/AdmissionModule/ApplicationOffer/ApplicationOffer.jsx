import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiSend,
  FiX,
  FiSearch,
  FiFilter,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiEye,
} from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    selected: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <FiCheckCircle />,
      label: "Selected",
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <FiClock />,
      label: "Pending",
    },
    offer_sent: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: <FiMail />,
      label: "Offer Sent",
    },
    accepted: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <FiCheckCircle />,
      label: "Accepted",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: <FiX />,
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

// Standard Admission Offer Template
const ADMISSION_OFFER_TEMPLATE = {
  id: "tpl1",
  name: "Standard Admission Offer",
  subject: "Congratulations! Admission Offer Letter - {{student_name}}",
  content: `Dear {{parent_name}},

Congratulations! We are pleased to inform you that {{student_name}} has been selected for admission to {{class_name}} at our institution.

**Admission Details:**
- Student Name: {{student_name}}
- Application ID: {{application_id}}
- Class: {{class_name}}
- Academic Year: {{academic_year}}
- Admission Date: {{admission_date}}

**Next Steps:**
- Pay the admission fee

We look forward to welcoming {{student_name}} to our institution.

Best regards,
Admission Office
{{school_name}}`,
};

// Dummy Data for demonstration
const getDummyData = () => {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return [
    {
      _id: "1",
      personalInfo: {
        name: "Rahul Sharma",
        stdId: "APP001",
        rollNo: "101",
        class: "Class 10-A",
        section: "A",
      },
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      
      status: "selected",
      offerStatus: "pending",
      offerSentAt: null,
      appliedDate: lastWeek,
      selectedDate: new Date(lastWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "2",
      personalInfo: {
        name: "Priya Patel",
        stdId: "APP002",
        rollNo: "102",
        class: "Class 10-B",
        section: "B",
      },
      email: "priya.patel@example.com",
      phone: "+91 98765 43211",
      
      status: "selected",
      offerStatus: "offer_sent",
      offerSentAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      appliedDate: lastWeek,
      selectedDate: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "3",
      personalInfo: {
        name: "Amit Kumar",
        stdId: "APP003",
        rollNo: "103",
        class: "Class 9-A",
        section: "A",
      },
      email: "amit.kumar@example.com",
      phone: "+91 98765 43212",
     
      status: "selected",
      offerStatus: "accepted",
      offerSentAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      appliedDate: lastWeek,
      selectedDate: new Date(lastWeek.getTime() + 4 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "4",
      personalInfo: {
        name: "Sneha Reddy",
        stdId: "APP004",
        rollNo: "104",
        class: "Class 11-A",
        section: "A",
      },
      email: "sneha.reddy@example.com",
      phone: "+91 98765 43213",
      
      status: "selected",
      offerStatus: "pending",
      offerSentAt: null,
      appliedDate: lastWeek,
      selectedDate: new Date(lastWeek.getTime() + 1 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "5",
      personalInfo: {
        name: "Vikram Singh",
        stdId: "APP005",
        rollNo: "105",
        class: "Class 8-B",
        section: "B",
      },
      email: "vikram.singh@example.com",
      phone: "+91 98765 43214",
      
      status: "selected",
      offerStatus: "offer_sent",
      offerSentAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      appliedDate: lastWeek,
      selectedDate: new Date(lastWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      _id: "6",
      personalInfo: {
        name: "Ananya Desai",
        stdId: "APP006",
        rollNo: "106",
        class: "Class 12-A",
        section: "A",
      },
      email: "ananya.desai@example.com",
      phone: "+91 98765 43215",
     
      status: "selected",
      offerStatus: "pending",
      offerSentAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      appliedDate: lastWeek,
      selectedDate: new Date(lastWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
  ];
};

export default function ApplicationOffer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewMessage, setPreviewMessage] = useState("");
  const [admissionFrom, setAdmissionFrom] = useState("");
const [admissionTo, setAdmissionTo] = useState("");
const [schoolName, setSchoolName] = useState("");


  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    offer_sent: 0,
    accepted: 0,
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
      return studentMatch && student.offerStatus === statusFilter;
    });

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter]);

  const calculateStats = useCallback(() => {
    let total = students.length;
    let pending = 0;
    let offer_sent = 0;
    let accepted = 0;
    let rejected = 0;

    students.forEach((student) => {
      if (student.offerStatus === "pending") pending++;
      else if (student.offerStatus === "offer_sent") offer_sent++;
      else if (student.offerStatus === "accepted") accepted++;
      else if (student.offerStatus === "rejected") rejected++;
    });

    setStats({ total, pending, offer_sent, accepted, rejected });
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
      const USE_DUMMY_DATA = true; // Change to false when connecting to backend

      if (USE_DUMMY_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const dummyData = getDummyData();
        setStudents(dummyData);
        setLoading(false);
        return;
      }

      // Real API call (will be used when backend is ready)
      const res = await axios.get(
        "http://localhost:5000/api/admissions/selected"
      );
      if (res.data.success && Array.isArray(res.data.students)) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error("Error fetching selected students:", err);
      const dummyData = getDummyData();
      setStudents(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      }
      return [...prev, studentId];
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s._id));
    }
  };

  const replaceTemplateVariables = (template, student) => {
    let content = template.content;
    let subject = template.subject;

    const variables = {
      student_name: student.personalInfo?.name || "Student",
      parent_name: student.parents?.father?.name || "Parent",
      application_id: student.personalInfo?.stdId || "N/A",
      class_name: student.personalInfo?.class || "N/A",
      academic_year:
        new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
     admission_date:
  admissionFrom && admissionTo
    ? `${admissionFrom} to ${admissionTo}`
    : "To be announced",

      
     school_name: schoolName || "School Name",

      scholarship_percentage: student.testScore > 90 ? "25" : "15",
    };

    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      content = content.replace(regex, variables[key]);
      subject = subject.replace(regex, variables[key]);
    });

    return { content, subject };
  };

  const handlePreviewOffer = (student) => {
    const { content, subject } = replaceTemplateVariables(
      ADMISSION_OFFER_TEMPLATE,
      student
    );
    setPreviewMessage(content);
    setShowPreviewModal(true);
  };

  const handleSendOffer = async (studentIds) => {
    setLoading(true);
    try {
      const studentsToSend = students.filter((s) => studentIds.includes(s._id));

      // TODO: Replace with actual API call when backend is ready
      const USE_DUMMY_DATA = true;

      if (USE_DUMMY_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const updatedStudents = students.map((student) => {
          if (studentIds.includes(student._id)) {
            const { content, subject } = replaceTemplateVariables(
              ADMISSION_OFFER_TEMPLATE,
              student
            );
            return {
              ...student,
              offerStatus: "offer_sent",
              offerSentAt: new Date(),
              offerSubject: subject,
              offerContent: content,
            };
          }
          return student;
        });

        setStudents(updatedStudents);
        setSelectedStudents([]);
        setShowTemplateModal(false);

        alert(
          `Offer letters sent successfully to ${studentsToSend.length} student(s)!`
        );
        return;
      }

      // Real API call (will be used when backend is ready)
      for (const student of studentsToSend) {
        const { content, subject } = replaceTemplateVariables(
          ADMISSION_OFFER_TEMPLATE,
          student
        );
        await axios.post("http://localhost:5000/api/admissions/send-offer", {
          studentId: student._id,
          email: student.email,
          subject,
          content,
          templateId: ADMISSION_OFFER_TEMPLATE.id,
        });
      }

      setSelectedStudents([]);
      setShowTemplateModal(false);
    } catch (err) {
      console.error("Error sending offers:", err);
      alert("Error sending offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission</span>
        <span>&gt;</span>
        <span>Application Offer</span>
      </div>

      {/* Page title */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Application Offer</h2>
          <HelpInfo
            title="Application Offer Help"
            description={`1.1 Overview

This page manages the offer process for student applications, tracking their selection status and communicating offers.

2.1 Offer Status Summary

- Total Selected: Number of students shortlisted for offers.
- Pending: Applications for which offers are yet to be sent.
- Offer Sent: Applications for which offer letters have been dispatched.
- Accepted: Students who have accepted the offer.
- Rejected: Students who have declined the offer.

3.1 Search and Filter

Use the search bar to find applications by student name or ID. Filter applications by status to view specific groups.

4.1 Application Details List

Each entry includes:

- Student Name, ID, and Class for identification.
- Email and Phone for communication.
- Current Status of the offer process (Pending, Offer Sent, Accepted, Rejected).
- Test Score and Interview Score reflecting applicant evaluation.
- Selected Date indicating when the student was shortlisted.
- Options to Preview Offer and Send Offer to manage communications.

Use this page to efficiently track and manage application offers and ensure timely communication with candidates.`}
          />
        </div>
        <button
          onClick={fetchStudents}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

     
        {/* Statistics Cards */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-gray-600">Total Selected</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <FiCheckCircle className="text-blue-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.pending}
                </p>
              </div>
              <FiClock className="text-yellow-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-gray-600">Offer Sent</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.offer_sent}
                </p>
              </div>
              <FiMail className="text-blue-500 text-3xl" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.accepted}
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
              <FiX className="text-red-500 text-3xl" />
            </div>
          </div>
        </div>\

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-3">
          <div className="flex gap-4 items-center">
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
                <option value="offer_sent">Offer Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
       

        {/* Selected Students Actions */}
        {selectedStudents.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedStudents.length} student(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedStudents([])}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Selection
                </button>
                <button
                  onClick={() => {
                    if (selectedStudents.length > 0) {
                      setShowTemplateModal(true);
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <FiSend /> Send Offer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content box */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {loading && filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading selected students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <FiUser className="mx-auto text-gray-400 text-5xl mb-4" />
              <p className="text-gray-600">No selected students found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              <div className="flex items-center gap-3 pb-3 border-b">
                <input
                  type="checkbox"
                  checked={
                    selectedStudents.length === filteredStudents.length &&
                    filteredStudents.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className=" font-medium text-gray-700">
                  Select All ({filteredStudents.length})
                </span>
              </div>

              {/* Students List */}
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleSelectStudent(student._id)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {student.personalInfo?.name || "Unknown Student"}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-gray-600">
                           <span>
  Application ID: {student.personalInfo?.stdId || "N/A"}
</span>

                            <span>
                              Class: {student.personalInfo?.class || "N/A"}
                            </span>
                            <span>Email: {student.email || "N/A"}</span>
                            <span>Phone: {student.phone || "N/A"}</span>
                          </div>
                        </div>
                        <StatusBadge status={student.offerStatus} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 ">
                        
                        <div>
                          <span className="text-gray-600">Selected Date: </span>
                          <span className="font-medium">
                            {student.selectedDate
                              ? new Date(
                                  student.selectedDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        {student.offerSentAt && (
                          <div>
                            <span className="text-gray-600">Offer Sent: </span>
                            <span className="font-medium">
                              {new Date(
                                student.offerSentAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreviewOffer(student)}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100 flex items-center gap-1"
                        >
                          <FiEye /> Preview Offer
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudents([student._id]);
                            setShowTemplateModal(true);
                          }}
                          className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded hover:bg-green-100 flex items-center gap-1"
                        >
                          <FiSend /> Send Offer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowTemplateModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Send Offer Letter</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block  font-medium mb-2">
                Template:{" "}
                <span className="font-normal text-gray-600">
                  {ADMISSION_OFFER_TEMPLATE.name}
                </span>
              </label>
            </div>

            <div className="mb-4">
              <label className="block  font-medium mb-2">
                Selected Students ({selectedStudents.length}):
              </label>
              <div className="border rounded-lg p-3 max-h-40 overflow-auto">
                {students
                  .filter((s) => selectedStudents.includes(s._id))
                  .map((student) => (
                    <div
                      key={student._id}
                      className=" text-gray-700 py-1"
                    >
                      {student.personalInfo?.name} ({student.email})
                    </div>
                  ))}
              </div>
            </div>
<div className="mb-4 grid grid-cols-2 gap-4">
  <div>
    <label className="block font-medium mb-1">
      Admission From Date
    </label>
    <input
      type="date"
      value={admissionFrom}
      onChange={(e) => setAdmissionFrom(e.target.value)}
      className="w-full border px-3 py-2 rounded-lg"
    />
  </div>

  <div>
    <label className="block font-medium mb-1">
      Admission To Date
    </label>
    <input
      type="date"
      value={admissionTo}
      onChange={(e) => setAdmissionTo(e.target.value)}
      className="w-full border px-3 py-2 rounded-lg"
    />
  </div>
</div>

<div className="mb-4">
  <label className="block font-medium mb-1">
    School Name
  </label>
  <input
    type="text"
    value={schoolName}
    onChange={(e) => setSchoolName(e.target.value)}
    placeholder="Enter school name"
    className="w-full border px-3 py-2 rounded-lg"
  />
</div>


            <div className="mb-3">
              <label className="block  font-medium mb-2">
                Email Subject (Preview):
              </label>
              <div className="border rounded-lg p-3 bg-gray-50 ">
                {selectedStudents.length > 0 &&
                  replaceTemplateVariables(
                    ADMISSION_OFFER_TEMPLATE,
                    students.find((s) => selectedStudents.includes(s._id))
                  ).subject}
              </div>
            </div>

            <div className="mb-3">
              <label className="block  font-medium mb-2">
                Message Content (Preview):
              </label>
              <textarea
                value={
                  selectedStudents.length > 0
                    ? replaceTemplateVariables(
                        ADMISSION_OFFER_TEMPLATE,
                        students.find((s) => selectedStudents.includes(s._id))
                      ).content
                    : ""
                }
                readOnly
                rows="12"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono  bg-gray-50"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendOffer(selectedStudents)}
                disabled={loading || selectedStudents.length === 0}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend /> Send to {selectedStudents.length} Student(s)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Offer Letter Preview</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="whitespace-pre-wrap ">
                {previewMessage}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
