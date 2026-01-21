import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiInfo,
  FiFileText,
  FiBarChart,
  FiDollarSign,
  FiDownload,
  FiEye,
  FiUser
} from "react-icons/fi";
import axios from "axios";

/* ================= COMMON UI COMPONENTS (SAME AS STUDENT PROFILE) ================= */

const ProfileCard = ({ label, children, icon }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
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

  const [application, setApplication] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [activeTab, setActiveTab] = useState("profile");

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/admission/application/${id}`);
      if (res.data.success) {
        setApplication(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching application details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!application) {
      fetchApplication();
    }
  }, [application, fetchApplication]);

  if (loading) return <div className="p-10 text-center">Loading application details...</div>;
  if (!application) return <div className="p-10 text-center text-red-500">Application not found.</div>;

  const handleDownload = (doc) => {
    if (doc.path) {
        let cleanPath = doc.path.replace(/\\/g, "/");
        if (cleanPath.includes("public/")) {
            cleanPath = cleanPath.split("public/")[1];
        }
        const fileUrl = `http://localhost:5000/${cleanPath}`;
        window.open(fileUrl, "_blank");
    }
  };

  const handlePreview = (doc) => {
    handleDownload(doc); // For now just open in new tab
  };

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
          {application.applicationId || application._id}
        </div>
      </div>

      {/*  PROFILE HEADER */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center space-x-6">
        <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 ring-4 ring-indigo-200">
             {application.documents?.find(d => d.type === "Passport Size Photo") ? (
                 <img 
                    src={`http://localhost:5000/${application.documents.find(d => d.type === "Passport Size Photo").path.replace(/\\/g, "/").split("public/")[1]}`} 
                    alt="Applicant" 
                    className="w-full h-full rounded-full object-cover"
                 />
             ) : (
                 <FiUser size={48} />
             )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {application.personalInfo?.name || "Student Name"}
          </h1>
          <p className="text-indigo-600 font-medium">
            Applying For Class: {application.earlierAcademic?.lastClass || "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            Status: <span className={`font-semibold ${application.applicationStatus === 'Approved' ? 'text-green-600' : application.applicationStatus === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{application.applicationStatus}</span>
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

      {/*  APPLICATION PROFILE */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ProfileCard label="Personal Information" icon={<FiInfo />}>
            <InfoDetail label="Full Name" value={application.personalInfo?.name} />
            <InfoDetail label="Date of Birth" value={application.personalInfo?.dateOfBirth} />
            <InfoDetail label="Gender" value={application.personalInfo?.gender} />
            <InfoDetail label="Blood Group" value={application.personalInfo?.bloodGroup} />
            <InfoDetail label="Nationality" value={application.personalInfo?.nationality} />
            <InfoDetail label="Religion" value={application.personalInfo?.religion} />
          </ProfileCard>

          <ProfileCard label="Contact Information" icon={<FiInfo />}>
            <InfoDetail label="Phone" value={application.contactInfo?.phone} />
            <InfoDetail label="Alternate Phone" value={application.contactInfo?.alternatePhone} />
            <InfoDetail label="Email" value={application.contactInfo?.email} />
            <InfoDetail label="Address" value={application.contactInfo?.address} />
          </ProfileCard>

          <ProfileCard label="Academic Information" icon={<FiInfo />}>
            <InfoDetail label="Previous School" value={application.earlierAcademic?.schoolName} />
            <InfoDetail label="Board" value={application.earlierAcademic?.board} />
            <InfoDetail label="Last Class Studied" value={application.earlierAcademic?.lastClass} />
            <InfoDetail label="Academic Year" value={application.earlierAcademic?.academicYear} />
          </ProfileCard>

          <ProfileCard label="Parent / Guardian Details" icon={<FiInfo />}>
            <InfoDetail label="Father Name" value={application.parents?.father?.name} />
            <InfoDetail label="Father Phone" value={application.parents?.father?.phone} />
            <InfoDetail label="Mother Name" value={application.parents?.mother?.name} />
            <InfoDetail label="Mother Phone" value={application.parents?.mother?.phone} />
            <InfoDetail label="Guardian Name" value={application.parents?.guardian?.name} />
          </ProfileCard>
        </div>
      )}

      {/*  DOCUMENTS */}
      {activeTab === "documents" && (
        <ProfileCard label="Uploaded Documents" icon={<FiFileText />}>
          <ul className="divide-y">
            {(application.documents || []).length > 0 ? (
              application.documents.map((doc, idx) => (
                <li key={idx} className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <FiFileText className="text-gray-400" />
                      <span>{doc.name} <span className="text-xs text-gray-400">({doc.type})</span></span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                        onClick={() => handlePreview(doc)}
                        className="text-blue-600 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <FiEye /> Preview
                    </button>
                    <button 
                        onClick={() => handleDownload(doc)}
                        className="text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <FiDownload /> Download
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

      {/*  ASSESSMENT */}
      {activeTab === "assessment" && (
        <ProfileCard label="Assessment" icon={<FiBarChart />}>
          <p className="text-gray-500">
            Assessment will be available after evaluation.
          </p>
        </ProfileCard>
      )}

      {/*  PAYMENT */}
      {activeTab === "payment" && (
        <ProfileCard label="Payment" icon={<FiDollarSign />}>
          <p className="text-gray-500 border-b pb-2 mb-2">
            Fees Status: <span className={`font-semibold ${application.personalInfo?.fees === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>{application.personalInfo?.fees || 'Due'}</span>
          </p>
          <p className="text-gray-500">
            Detailed payment history will be available after confirmation.
          </p>
        </ProfileCard>
      )}
    </div>  );
};

export default AdmissionReviewProfile;
