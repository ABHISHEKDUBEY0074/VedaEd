import React, { useState, useEffect } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiInfo, FiFileText, FiCalendar, FiDollarSign, FiBarChart, FiEdit3, FiSave, FiX } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { authFetch } from "../services/apiClient";
const documentAccept = ".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx";

const mockPerformance = [
  { term: "Term 1", score: 78 },
  { term: "Term 2", score: 82 },
  { term: "Term 3", score: 91 },
];

const mockDocuments = [
  { name: "Report Card.pdf", date: "2024-03-15", size: "1.2 MB" },
  { name: "Transfer Certificate.pdf", date: "2023-06-10", size: "800 KB" },
];

const ProfileCard = ({ label, children, icon }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="text-indigo-500 mr-3">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
      </div>
      <div className="space-y-3 text-sm text-gray-600">{children}</div>
    </div>
  </div>
);

const InfoDetail = ({ label, value, isEditing, onChange, options, isDropdown }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-2 border-b border-gray-100 last:border-b-0">
    <p className="font-medium text-gray-500">{label}</p>
    <div className="col-span-2">
      {isEditing ? (
        isDropdown && options ? (
          <select
            value={value || ""}
            onChange={onChange}
            className="w-full border rounded-md px-2 py-1 text-gray-700"
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option._id || option} value={option._id || option}>
                {option.name || option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={value || ""}
            onChange={onChange}
            className="w-full border rounded-md px-2 py-1 text-gray-700"
          />
        )
      ) : (
        <p>{value || "N/A"}</p>
      )}
    </div>
  </div>
);

const TabButton = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StudentProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const studentData = location.state || null;
  const resolvedStudentId = id || studentData?._id || studentData?.id;
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [student, setStudent] = useState(studentData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  // Fetch student data from backend if ID is provided
  useEffect(() => {
    const fetchStudent = async () => {
      if (!resolvedStudentId) {
        console.log("No ID provided in URL params");
        return;
      }

      console.log("Fetching student with ID:", resolvedStudentId);
      setLoading(true);
      setError(null);

      try {
        const response = await authFetch(`/students/${resolvedStudentId}`);
        if (!response.ok) {
          throw new Error('Student not found');
        }

        const data = await response.json();
        if (data.success && data.student) {
          const studentData = data.student;

          // Map backend data to frontend structure
          const mappedStudent = {
            id: studentData._id,
            name: studentData.personalInfo?.name || "",
            // Store both name and ID for classes and sections  
            grade: studentData.personalInfo?.class?.name || "",
            section: studentData.personalInfo?.section?.name || "",
            gradeId: studentData.personalInfo?.class?._id || "",
            sectionId: studentData.personalInfo?.section?._id || "",
            gender: studentData.personalInfo?.gender || "",
            dob: studentData.personalInfo?.DOB || "",
            age: studentData.personalInfo?.age || "",
            address: studentData.personalInfo?.address || "",
            contact: studentData.personalInfo?.contactDetails?.mobileNumber || "",
            email: studentData.personalInfo?.contactDetails?.email || "",
            photo: studentData.personalInfo?.image?.url || "",
            fatherName: studentData.parent?.fatherName || "",
            motherName: studentData.parent?.motherName || "",
            attendance: "85%", // Mock data - can be fetched from attendance API
            fee: studentData.personalInfo?.fees || "Paid",
            stdId: studentData.personalInfo?.stdId || "",
            rollNo: studentData.personalInfo?.rollNo || "",
            bloodGroup: studentData.personalInfo?.bloodGroup || "",
            admissionDate: studentData.personalInfo?.admissionDate || "",
            status: studentData.personalInfo?.status || "Active",
            documents: studentData.documents || []
          };

          setStudent(mappedStudent);
        }
      } catch (err) {
        console.error("Error fetching student:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [resolvedStudentId]);

  // Fetch documents for the student
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!resolvedStudentId) return;

      try {
        const response = await authFetch(`/students/documents/${resolvedStudentId}`);
        if (response.ok) {
          const docs = await response.json();
          setDocuments(docs);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    fetchDocuments();
  }, [resolvedStudentId]);

  // Fetch classes and sections
  useEffect(() => {
    const fetchClassesAndSections = async () => {
      try {
        // Fetch classes
        const classResponse = await authFetch(`/classes`);
        if (classResponse.ok) {
          const classData = await classResponse.json();
          console.log("Classes fetched:", classData.data);
          setClasses(classData.data || []);
        }

        // Fetch sections
        const sectionResponse = await authFetch(`/sections`);
        if (sectionResponse.ok) {
          const sectionData = await sectionResponse.json();
          console.log("Sections fetched:", sectionData.data);
          setSections(sectionData.data || []);
        }
      } catch (err) {
        console.error("Error fetching classes/sections:", err);
      }
    };

    fetchClassesAndSections();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Loading Student Profile...</h2>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Error: {error}</h2>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Student Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setStudent((prev) => ({ ...prev, [field]: value }));
  };

  // Handle dropdown changes specifically for class and section
  const handleDropdownChange = (field, value) => {
    if (field === 'grade') {
      const selectedClass = classes.find(c => c._id === value);
      setStudent((prev) => ({
        ...prev,
        [field]: value,
        gradeId: value,
        grade: selectedClass ? selectedClass.name : ""
      }));
    } else if (field === 'section') {
      const selectedSection = sections.find(s => s._id === value);
      setStudent((prev) => ({
        ...prev,
        [field]: value,
        sectionId: value,
        section: selectedSection ? selectedSection.name : ""
      }));
    } else {
      setStudent((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!student.id) return;

    setLoading(true);
    setError(null);

    try {
      // Find the selected class and section names
      const selectedClass = classes.find(c => c._id === student.gradeId);
      const selectedSection = sections.find(s => s._id === student.sectionId);

      const className = selectedClass ? selectedClass.name : student.grade;
      const sectionName = selectedSection ? selectedSection.name : student.section;

      // Map frontend data back to backend structure
      const updateData = {
        personalInfo: {
          name: student.name,
          stdId: student.stdId,
          class: className, // Send class name instead of ID
          section: sectionName, // Send section name instead of ID
          DOB: student.dob,
          gender: student.gender,
          age: student.age,
          address: student.address,
          contactDetails: {
            mobileNumber: student.contact,
            email: student.email
          },
          fees: student.fee,
          rollNo: student.rollNo,
          bloodGroup: student.bloodGroup
        }
      };

      console.log("Selected class object:", selectedClass);
      console.log("Selected section object:", selectedSection);
      console.log("Sending class name:", className);
      console.log("Sending section name:", sectionName);
      console.log("Complete update data:", updateData);
      console.log("Student ID:", resolvedStudentId);

      const response = await authFetch(`/students/${resolvedStudentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.message || 'Failed to update student');
      }

      const data = await response.json();
      if (data.success) {
        // Update student state with the new class and section names
        setStudent(prev => ({
          ...prev,
          grade: className,
          section: sectionName
        }));
        setIsEditing(false);
        // Optionally show success message
        console.log('Student updated successfully');
      }
    } catch (err) {
      console.error("Error updating student:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshDocuments = async () => {
    const response = await authFetch(`/students/documents/${resolvedStudentId}`);
    if (response.ok) {
      const docs = await response.json();
      setDocuments(docs);
    }
  };

  const handleUploadDocument = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !resolvedStudentId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", resolvedStudentId);

    try {
      const res = await authFetch("/students/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }
      await refreshDocuments();
    } catch (err) {
      console.error("Upload failed:", err);
      alert(err.message || "Failed to upload document");
    } finally {
      event.target.value = "";
    }
  };

  const openDocument = async (doc, mode = "preview") => {
    try {
      const filename = doc?.path?.split("/").pop();
      if (!filename) return;

      const response = await authFetch(`/students/${mode}/${filename}`);
      if (!response.ok) throw new Error("Unable to open document");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      if (mode === "preview") {
        window.open(blobUrl, "_blank", "noopener,noreferrer");
      } else {
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = doc.name || filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    } catch (error) {
      console.error(`${mode} failed:`, error);
      alert(error.message || `${mode} failed`);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!resolvedStudentId || !documentId) return;
    if (!window.confirm("Delete this document?")) return;

    try {
      const response = await authFetch(`/students/documents/${resolvedStudentId}/${documentId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }
      await refreshDocuments();
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.message || "Failed to delete document");
    }
  };

  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <ProfileCard label="General Information" icon={<FiInfo />}>
          <InfoDetail label="Student ID" value={student.stdId} isEditing={false} />
          <InfoDetail label="Roll No" value={student.rollNo} isEditing={isEditing} onChange={(e) => handleChange("rollNo", e.target.value)} />
          <InfoDetail label="Name" value={student.name} isEditing={isEditing} onChange={(e) => handleChange("name", e.target.value)} />
          <InfoDetail
            label="Class"
            value={student.grade || student.gradeId}
            isEditing={isEditing}
            onChange={(e) => handleDropdownChange("grade", e.target.value)}
            options={classes}
            isDropdown={true}
          />
          <InfoDetail
            label="Section"
            value={student.section || student.sectionId}
            isEditing={isEditing}
            onChange={(e) => handleDropdownChange("section", e.target.value)}
            options={sections}
            isDropdown={true}
          />
          <InfoDetail label="Gender" value={student.gender} isEditing={isEditing} onChange={(e) => handleChange("gender", e.target.value)} />
          <InfoDetail label="DOB" value={student.dob} isEditing={isEditing} onChange={(e) => handleChange("dob", e.target.value)} />
          <InfoDetail label="Age" value={student.age} isEditing={isEditing} onChange={(e) => handleChange("age", e.target.value)} />
          <InfoDetail label="Blood Group" value={student.bloodGroup} isEditing={isEditing} onChange={(e) => handleChange("bloodGroup", e.target.value)} />
          <InfoDetail label="Address" value={student.address} isEditing={isEditing} onChange={(e) => handleChange("address", e.target.value)} />
          <InfoDetail label="Contact" value={student.contact} isEditing={isEditing} onChange={(e) => handleChange("contact", e.target.value)} />
          <InfoDetail label="Email" value={student.email} isEditing={isEditing} onChange={(e) => handleChange("email", e.target.value)} />
        </ProfileCard>
      </div>
      <div className="space-y-4">
        <ProfileCard label="Parent Info" icon={<FiInfo />}>
          <InfoDetail label="Father" value={student.fatherName} isEditing={false} />
          <InfoDetail label="Mother" value={student.motherName} isEditing={false} />
          <InfoDetail label="Contact" value={student.contact} isEditing={false} />
        </ProfileCard>
      </div>
    </div>
  );

  const AttendanceTab = () => (
    <ProfileCard label="Attendance" icon={<FiCalendar />}>
      <InfoDetail label="Attendance %" value={student.attendance} isEditing={isEditing} onChange={(e) => handleChange("attendance", e.target.value)} />
      <InfoDetail label="Last Present" value="2024-08-05" isEditing={false} />
    </ProfileCard>
  );

  const FeeTab = () => (
    <ProfileCard label="Fee Details" icon={<FiDollarSign />}>
      <InfoDetail label="Total Fee" value="₹50,000" isEditing={false} />
      <InfoDetail
        label="Paid"
        value={student.fee === "Paid" ? "₹50,000" : "₹25,000"}
        isEditing={false}
      />
      <InfoDetail label="Due" value={student.fee === "Paid" ? "₹0" : "₹25,000"} isEditing={false} />
      <InfoDetail label="Status" value={student.fee} isEditing={isEditing} onChange={(e) => handleChange("fee", e.target.value)} />
    </ProfileCard>
  );

  return (
    <div className="min-h-screen p-0 m-0">
      <div className="mb-4">
        <div className="mb-4 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
            <FiArrowLeft className="w-5 h-5 mr-2" /> Back to Student Directory
          </button>

          {/* Edit / Save Buttons */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
            >
              <FiEdit3 className="w-5 h-5 mr-2" /> Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                <FiSave className="w-5 h-5 mr-2" /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600"
              >
                <FiX className="w-5 h-5 mr-2" /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-200" src={student.photo || "https://via.placeholder.com/150"} alt={student.name} />
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-lg text-indigo-600 font-medium">{student.grade} - {student.section}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex space-x-2">
            <TabButton label="Overview" isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<FiInfo />} />
            <TabButton label="Performance" isActive={activeTab === "performance"} onClick={() => setActiveTab("performance")} icon={<FiBarChart />} />
            <TabButton label="Attendance" isActive={activeTab === "attendance"} onClick={() => setActiveTab("attendance")} icon={<FiCalendar />} />
            <TabButton label="Fee" isActive={activeTab === "fee"} onClick={() => setActiveTab("fee")} icon={<FiDollarSign />} />
            <TabButton label="Documents" isActive={activeTab === "documents"} onClick={() => setActiveTab("documents")} icon={<FiFileText />} />
          </div>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === "overview" && OverviewTab()}
          {activeTab === "performance" && (
            <ProfileCard label="Performance" icon={<FiBarChart />}>
              {/* <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={mockPerformance} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="term" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#4f46e5" name="Score" barSize={40} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div> */}
            </ProfileCard>
          )}
          {activeTab === "attendance" && AttendanceTab()}
          {activeTab === "fee" && FeeTab()}
          {activeTab === "documents" && (
            <ProfileCard label="Documents" icon={<FiFileText />}>
              {/* Upload Button */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Documents
                </h3>
                <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700">
                  Upload Document
                  <input
                    type="file"
                    accept={documentAccept}
                    className="hidden"
                    onChange={handleUploadDocument}
                  />
                </label>
              </div>

              {/* Documents List */}
              <ul className="divide-y divide-gray-200">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <li key={doc._id || doc.path} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{doc.name}</p>
                        <p className="text-gray-500">
                          {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "N/A"} - {((doc.size || 0) / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDocument(doc, "preview")}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => openDocument(doc, "download")}
                          className="text-indigo-600 hover:underline font-semibold"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc._id)}
                          className="text-red-600 hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-3 text-gray-500">No documents uploaded yet.</li>
                )}
              </ul>
            </ProfileCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;