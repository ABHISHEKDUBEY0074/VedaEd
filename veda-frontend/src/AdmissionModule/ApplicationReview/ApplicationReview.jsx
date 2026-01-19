import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiInfo,
  FiFileText,
  FiBarChart,
  FiDollarSign,
} from "react-icons/fi";

/* ================= COMMON UI COMPONENTS (SAME AS STUDENT PROFILE) ================= */

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

const InfoDetail = ({ label, value }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-2 border-b border-gray-100 last:border-b-0">
    <p className="font-medium text-gray-500">{label}</p>
    <p className="col-span-2">{value || "N/A"}</p>
  </div>
);

const TabButton = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition ${
      isActive
        ? "bg-indigo-600 text-white shadow"
        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

/* ================= MAIN COMPONENT ================= */

const AdmissionReviewProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  // application data application list se aayega
  const application = state || {};

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen">

      {/* 🔙 HEADER */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
        >
          <FiArrowLeft className="mr-2" />
          Back to Application List
        </button>

        <div className="text-sm text-gray-600">
          <span className="font-semibold">Application ID:</span>{" "}
          {application.applicationId || `APP-${id}`}
        </div>
      </div>

      {/* 🧑 PROFILE HEADER */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center space-x-6">
        <img
          src={application.photo || "https://via.placeholder.com/150"}
          alt="Applicant"
          className="w-28 h-28 rounded-full object-cover ring-4 ring-indigo-200"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {application.studentName || "Student Name"}
          </h1>
          <p className="text-indigo-600 font-medium">
            Applying For Class: {application.applyingClass || "N/A"}
          </p>
        </div>
      </div>

      {/* 🧷 TABS */}
      <div className="mb-4">
        <div className="bg-white rounded-xl shadow-md p-2 inline-flex space-x-2">
          <TabButton
            label="Application Profile"
            icon={<FiInfo />}
            isActive={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <TabButton
            label="Documents"
            icon={<FiFileText />}
            isActive={activeTab === "documents"}
            onClick={() => setActiveTab("documents")}
          />
          <TabButton
            label="Assessment"
            icon={<FiBarChart />}
            isActive={activeTab === "assessment"}
            onClick={() => setActiveTab("assessment")}
          />
          <TabButton
            label="Payment"
            icon={<FiDollarSign />}
            isActive={activeTab === "payment"}
            onClick={() => setActiveTab("payment")}
          />
        </div>
      </div>

      {/* ================= TAB CONTENT ================= */}

      {/* ✅ APPLICATION PROFILE */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProfileCard label="Personal Information" icon={<FiInfo />}>
            <InfoDetail label="Full Name" value={application.studentName} />
            <InfoDetail label="Date of Birth" value={application.dob} />
            <InfoDetail label="Gender" value={application.gender} />
            <InfoDetail label="Blood Group" value={application.bloodGroup} />
            <InfoDetail label="Nationality" value={application.nationality} />
            <InfoDetail label="Religion" value={application.religion} />
          </ProfileCard>

          <ProfileCard label="Contact Information" icon={<FiInfo />}>
            <InfoDetail label="Phone" value={application.phone} />
            <InfoDetail label="Alternate Phone" value={application.alternatePhone} />
            <InfoDetail label="Email" value={application.email} />
            <InfoDetail label="Address" value={application.address} />
            <InfoDetail label="City" value={application.city} />
            <InfoDetail label="State" value={application.state} />
            <InfoDetail label="Zip Code" value={application.zipCode} />
          </ProfileCard>

          <ProfileCard label="Academic Information" icon={<FiInfo />}>
            <InfoDetail label="Previous School" value={application.previousSchool} />
            <InfoDetail label="Board" value={application.board} />
            <InfoDetail label="Last Class Studied" value={application.lastClass} />
            <InfoDetail label="Academic Year" value={application.academicYear} />
          </ProfileCard>

          <ProfileCard label="Parent / Guardian Details" icon={<FiInfo />}>
            <InfoDetail label="Father Name" value={application.fatherName} />
            <InfoDetail label="Father Phone" value={application.fatherPhone} />
            <InfoDetail label="Mother Name" value={application.motherName} />
            <InfoDetail label="Mother Phone" value={application.motherPhone} />
            <InfoDetail label="Guardian Name" value={application.guardianName} />
          </ProfileCard>
        </div>
      )}

      {/* ✅ DOCUMENTS */}
      {activeTab === "documents" && (
        <ProfileCard label="Uploaded Documents" icon={<FiFileText />}>
          <ul className="divide-y">
            {(application.documents || []).length > 0 ? (
              application.documents.map((doc, idx) => (
                <li key={idx} className="py-3 flex justify-between">
                  <span>{doc.name}</span>
                  <div className="flex gap-4">
                    <button className="text-blue-600 font-semibold">
                      Preview
                    </button>
                    <button className="text-indigo-600 font-semibold">
                      Download
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No documents uploaded.</p>
            )}
          </ul>
        </ProfileCard>
      )}

      {/* ⛔ ASSESSMENT */}
      {activeTab === "assessment" && (
        <ProfileCard label="Assessment" icon={<FiBarChart />}>
          <p className="text-gray-500">
            Assessment will be available after evaluation.
          </p>
        </ProfileCard>
      )}

      {/* ⛔ PAYMENT */}
      {activeTab === "payment" && (
        <ProfileCard label="Payment" icon={<FiDollarSign />}>
          <p className="text-gray-500">
            Payment details will be available after confirmation.
          </p>
        </ProfileCard>
      )}
    </div>
  );
};

export default AdmissionReviewProfile;
