import React, { useState, useEffect } from "react";
import {
  FiInfo,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiUser,
  FiBookOpen,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import HelpInfo from "../components/HelpInfo";

// Card Component
const ProfileCard = ({ label, icon, children }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
    <div className="flex items-center mb-3">
      <div className="text-indigo-500 mr-2">{icon}</div>
      <h3 className="text-sm font-semibold">{label}</h3>
    </div>
    <div className="space-y-2 text-sm text-gray-700">{children}</div>
  </div>
);

// Info row
const InfoDetail = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-200 py-1 last:border-b-0">
    <span className="font-medium text-gray-500">{label}</span>
    <span>{value || "N/A"}</span>
  </div>
);

export default function TeacherProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [teacher, setTeacher] = useState(null);

  // Dummy teacher data based on staff model
  useEffect(() => {
    const dummyTeacher = {
      _id: "T123",
      personalInfo: {
        staffId: "T001",
        name: "Dr. Sarah Johnson",
        username: "sarah.johnson",
        gender: "Female",
        role: "Teacher",
        department: "Science",
        email: "sarah.johnson@school.edu",
        mobileNumber: "9876543210",
        emergencyContact: "9876543211",
        address: "456 Teacher Lane, Education City",
        password: "********",
      },
      joiningDate: "2020-08-15",
      qualification: "M.Sc. Physics, B.Ed., Ph.D. in Education",
      experience: 8,
      classesAssigned: ["10A", "10B", "11A"],
      salaryDetails: {
        salary: "₹45,000",
        lastPayment: "2024-01-31",
      },
      status: "Active",
      documents: [
        {
          name: "Teaching Certificate.pdf",
          date: "2020-08-10",
          size: "1.5 MB",
        },
        { name: "Degree Certificate.pdf", date: "2015-06-15", size: "2.1 MB" },
        { name: "Experience Letter.pdf", date: "2020-08-12", size: "800 KB" },
        {
          name: "Salary Slip - Jan 2024.pdf",
          date: "2024-02-01",
          size: "600 KB",
        },
      ],
    };
    setTeacher(dummyTeacher);
  }, []);

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-xl">Loading teacher profile...</p>
      </div>
    );
  }

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumb + Header (match Gradebook) */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Teacher</span>
        <span>&gt;</span>
        <span>Profile</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Teacher Profile</h2>
        <HelpInfo
          title="Teacher Profile"
          description={`3.1 Teacher Profile (Personal & Professional Information)

View and update your personal and professional details, manage account settings, and review your assigned subjects.

Sections:
- Personal Information: View and edit name, email, phone number, address, and profile photo
- Professional Details: Add or update qualifications, certifications, and teaching experience
- Assigned Classes and Subjects: See the list of classes and subjects currently assigned
- Account Settings: Manage password, security options, and notification preferences
- Profile Photo: Upload, change, or remove your profile picture
`}
          steps={[
            "View your personal and professional details",
            "Update qualifications and contact details",
            "Check assigned classes and subjects",
            "Manage password and notification preferences",
            "Upload or update your profile photo",
          ]}
        />
      </div>

      {/* Main container */}
      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
        {/* Teacher Header */}
        <div className="bg-white p-3 rounded-lg shadow-sm border mb-4 flex items-center gap-4">
          <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {teacher.personalInfo.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-semibold">
              {teacher.personalInfo.name}
            </h1>
            <p className="text-indigo-600 font-medium text-sm">
              {teacher.personalInfo.role} - {teacher.personalInfo.department}
            </p>
            <p className="text-gray-500 text-xs">
              Staff ID: {teacher.personalInfo.staffId}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white"
                : "bg-white border"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("academic")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "academic"
                ? "bg-indigo-600 text-white"
                : "bg-white border"
            }`}
          >
            Academic
          </button>
          <button
            onClick={() => setActiveTab("salary")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "salary"
                ? "bg-indigo-600 text-white"
                : "bg-white border"
            }`}
          >
            Salary
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "documents"
                ? "bg-indigo-600 text-white"
                : "bg-white border"
            }`}
          >
            Documents
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <>
            <ProfileCard label="Personal Information" icon={<FiUser />}>
              <InfoDetail
                label="Staff ID"
                value={teacher.personalInfo.staffId}
              />
              <InfoDetail label="Name" value={teacher.personalInfo.name} />
              <InfoDetail
                label="Username"
                value={teacher.personalInfo.username}
              />
              <InfoDetail label="Gender" value={teacher.personalInfo.gender} />
              <InfoDetail label="Role" value={teacher.personalInfo.role} />
              <InfoDetail
                label="Department"
                value={teacher.personalInfo.department}
              />
              <InfoDetail label="Status" value={teacher.status} />
              <InfoDetail
                label="Address"
                value={teacher.personalInfo.address}
              />
            </ProfileCard>

            <ProfileCard label="Contact Information" icon={<FiPhone />}>
              <InfoDetail label="Email" value={teacher.personalInfo.email} />
              <InfoDetail
                label="Mobile Number"
                value={teacher.personalInfo.mobileNumber}
              />
              <InfoDetail
                label="Emergency Contact"
                value={teacher.personalInfo.emergencyContact}
              />
            </ProfileCard>

            <ProfileCard label="Employment Details" icon={<FiCalendar />}>
              <InfoDetail
                label="Date of Joining"
                value={new Date(teacher.joiningDate).toLocaleDateString()}
              />
              <InfoDetail
                label="Experience"
                value={`${teacher.experience} years`}
              />
              <InfoDetail
                label="Assigned Classes"
                value={teacher.classesAssigned.join(", ")}
              />
            </ProfileCard>
          </>
        )}

        {activeTab === "academic" && (
          <ProfileCard label="Academic Information" icon={<FiBookOpen />}>
            <InfoDetail label="Qualification" value={teacher.qualification} />
            <InfoDetail
              label="Experience"
              value={`${teacher.experience} years`}
            />
            <InfoDetail
              label="Department"
              value={teacher.personalInfo.department}
            />
            <InfoDetail
              label="Assigned Classes"
              value={teacher.classesAssigned.join(", ")}
            />
            <InfoDetail label="Role" value={teacher.personalInfo.role} />
            <InfoDetail
              label="Date of Joining"
              value={new Date(teacher.joiningDate).toLocaleDateString()}
            />
          </ProfileCard>
        )}

        {activeTab === "salary" && (
          <ProfileCard label="Salary Details" icon={<FiDollarSign />}>
            <InfoDetail
              label="Current Salary"
              value={teacher.salaryDetails.salary}
            />
            <InfoDetail
              label="Last Payment Date"
              value={teacher.salaryDetails.lastPayment}
            />
            <InfoDetail label="Payment Status" value="Up to Date" />
            <InfoDetail
              label="Experience"
              value={`${teacher.experience} years`}
            />
            <InfoDetail
              label="Department"
              value={teacher.personalInfo.department}
            />
          </ProfileCard>
        )}

        {activeTab === "documents" && (
          <ProfileCard label="Documents" icon={<FiFileText />}>
            <ul className="divide-y divide-gray-200">
              {teacher.documents.map((doc, idx) => (
                <li key={idx} className="py-2 flex justify-between">
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-gray-500 text-sm">
                      {doc.date} - {doc.size}
                    </p>
                  </div>
                  <a
                    href="#"
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </ProfileCard>
        )}
      </div>
    </div>
  );
}
