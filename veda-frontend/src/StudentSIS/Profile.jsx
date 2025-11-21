import React, { useState, useEffect } from "react";
import { FiInfo, FiCalendar, FiDollarSign, FiFileText } from "react-icons/fi";
import HelpInfo from "../components/HelpInfo"; 
// Card Component
const ProfileCard = ({ label, icon, children }) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <div className="flex items-center mb-4">
      <div className="text-indigo-500 mr-2">{icon}</div>
      <h3 className="text-lg font-semibold">{label}</h3>
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

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [student, setStudent] = useState(null);

  // Dummy student data
  useEffect(() => {
    const dummyStudent = {
      stdId: "S123",
      rollNo: "12",
      name: "John Doe",
      grade: "10",
      section: "A",
      gender: "Male",
      dob: "2008-05-12",
      age: "17",
      bloodGroup: "B+",
      address: "123 Main Street",
      contact: "9876543210",
      email: "john@example.com",
      fatherName: "Mr. Doe",
      motherName: "Mrs. Doe",
      parentContact: "9876543210",
      attendance: "85%",
      fee: "Paid",
      documents: [
        { name: "Report Card.pdf", date: "2024-03-15", size: "1.2 MB" },
        { name: "Transfer Certificate.pdf", date: "2023-06-10", size: "800 KB" },
      ],
    };
    setStudent(dummyStudent);
  }, []);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-xl">Loading student profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumb + Heading */}
      <p className="text-gray-500 text-sm mb-2">Students &gt;</p>
                                                                                     <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">My Profile</h2>

  <HelpInfo
    title="Staff Module Help"
    description="This module allows you to manage all staff records, login access, roles, and other information."
    steps={[
      "Use All Staff tab to view and manage staff details.",
      "Use Manage Login tab to update login credentials.",
      "Use Others tab for additional staff-related tools."
    ]}
  />
</div>

      {/* Gray Wrapper */}
      <div className="bg-gray-200 p-6 rounded-lg shadow-sm border border-gray-100">
        {/* White Inner Box */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
        {/* Student Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex items-center space-x-6">
          <img
            src="https://via.placeholder.com/150"
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-200"
          />
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-indigo-600 font-medium">{student.grade} - {student.section}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg ${activeTab === "overview" ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 rounded-lg ${activeTab === "attendance" ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab("fee")}
            className={`px-4 py-2 rounded-lg ${activeTab === "fee" ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            Fee
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-lg ${activeTab === "documents" ? "bg-indigo-600 text-white" : "bg-white border"}`}
          >
            Documents
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <ProfileCard label="General Information" icon={<FiInfo />}>
            <InfoDetail label="Student ID" value={student.stdId} />
            <InfoDetail label="Roll No" value={student.rollNo} />
            <InfoDetail label="Name" value={student.name} />
            <InfoDetail label="Class" value={student.grade} />
            <InfoDetail label="Section" value={student.section} />
            <InfoDetail label="Gender" value={student.gender} />
            <InfoDetail label="DOB" value={student.dob} />
            <InfoDetail label="Age" value={student.age} />
            <InfoDetail label="Blood Group" value={student.bloodGroup} />
            <InfoDetail label="Address" value={student.address} />
            <InfoDetail label="Contact" value={student.contact} />
            <InfoDetail label="Email" value={student.email} />
            <InfoDetail label="Father" value={student.fatherName} />
            <InfoDetail label="Mother" value={student.motherName} />
            <InfoDetail label="Parent Contact" value={student.parentContact} />
          </ProfileCard>
        )}

        {activeTab === "attendance" && (
          <ProfileCard label="Attendance" icon={<FiCalendar />}>
            <InfoDetail label="Attendance %" value={student.attendance} />
          </ProfileCard>
        )}

        {activeTab === "fee" && (
          <ProfileCard label="Fee Details" icon={<FiDollarSign />}>
            <InfoDetail label="Status" value={student.fee} />
          </ProfileCard>
        )}

        {activeTab === "documents" && (
          <ProfileCard label="Documents" icon={<FiFileText />}>
            <ul className="divide-y divide-gray-200">
              {student.documents.map((doc, idx) => (
                <li key={idx} className="py-2 flex justify-between">
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-gray-500 text-sm">{doc.date} - {doc.size}</p>
                  </div>
                  <a href="#" className="text-indigo-600 hover:underline font-semibold">Download</a>
                </li>
              ))}
            </ul>
          </ProfileCard>
        )}
      </div>
    </div>
    </div>
  );
}
