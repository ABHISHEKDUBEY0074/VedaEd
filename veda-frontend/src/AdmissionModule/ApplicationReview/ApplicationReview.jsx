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

const InfoDetail = ({
  label,
  value,
  editable,
  type = "text",
  error,
  onChange,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-b-0">
    <p className="font-medium text-gray-500">{label}</p>

    <div className="col-span-2">
      {editable ? (
        <>
          <input
            type={type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </>
      ) : (
        <p>{value || "N/A"}</p>
      )}
    </div>
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
const [isEdit, setIsEdit] = useState(false);
const [formData, setFormData] = useState(null);
const [errors, setErrors] = useState({});

  const [application, setApplication] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [activeTab, setActiveTab] = useState("profile");

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/admission/application/${id}`);
      if (res.data.success) {
        setApplication(res.data.data);
        setFormData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching application details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
  if (application) setFormData(application);
}, [application]);


  useEffect(() => {
    if (!application) {
      fetchApplication();
    }
  }, [application, fetchApplication]);

  if (loading) return <div className="p-10 text-center">Loading application details...</div>;
  if (!application) return <div className="p-10 text-center text-red-500">Application not found.</div>;

const handleToggleEdit = () => {
  if (isEdit) {
    setFormData(application); // RESET DATA
    setErrors({});
  }
  setIsEdit(!isEdit);
};

const handleDocumentUpload = async (file, type) => {
  const form = new FormData();
  form.append("file", file);
  form.append("type", type);

  try {
    const res = await axios.post(
      `http://localhost:5000/api/admission/application/${id}/upload`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.success) {
      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), res.data.document],
      }));
    }
  } catch (err) {
    console.error("Upload failed", err);
  }
};
const handleDeleteDocument = async (docId) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/admission/application/${id}/document/${docId}`
    );

    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d._id !== docId),
    }));
  } catch (err) {
    console.error("Delete failed", err);
  }
};



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
  const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isInteger = (val) => /^\d+$/.test(val);

const handleChange = (path, value, type = "text") => {
  let error = "";

  if (type === "number" && value && !isInteger(value)) {
    error = "Only numbers allowed";
  }

  if (type === "email" && value && !isValidEmail(value)) {
    error = "Invalid email";
  }

  setErrors(prev => ({ ...prev, [path]: error }));

  setFormData(prev => {
    const updated = { ...prev };
    const keys = path.split(".");
    let obj = updated;
    keys.slice(0, -1).forEach(k => (obj[k] = obj[k] || {}));
    obj[keys[keys.length - 1]] = value;
    return updated;
  });
};
const handleSave = async () => {
  // agar error hai toh save mat karo
  if (Object.values(errors).some(e => e)) return;

  try {
    await axios.put(
      `http://localhost:5000/api/admission/application/${id}`,
      formData
    );

    setApplication(formData); // UI update
    setIsEdit(false);
  } catch (err) {
    console.error("Save failed", err);
  }
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
        <button onClick={handleToggleEdit}

  className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
>
  {isEdit ? "Cancel Edit" : "Edit Profile"}
</button>
{isEdit && (
  <button
    onClick={handleSave}
    className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold"
  >
    Save Changes
  </button>
)}


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
  {(isEdit ? formData : application).personalInfo?.name}
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

    {/* PERSONAL INFORMATION */}
    <ProfileCard label="Personal Information" icon={<FiInfo />}>
      <InfoDetail
        label="Full Name"
        value={formData.personalInfo?.name}
        editable={isEdit}
        onChange={(v) => handleChange("personalInfo.name", v)}
      />
      <InfoDetail
        label="Date of Birth"
        value={formData.personalInfo?.dateOfBirth}
        editable={isEdit}
        onChange={(v) => handleChange("personalInfo.dateOfBirth", v)}
      />
      <InfoDetail
        label="Gender"
        value={formData.personalInfo?.gender}
        editable={isEdit}
        onChange={(v) => handleChange("personalInfo.gender", v)}
      />
      <InfoDetail
        label="Blood Group"
        value={formData.personalInfo?.bloodGroup}
        editable={isEdit}
        onChange={(v) => handleChange("personalInfo.bloodGroup", v)}
      />
      <InfoDetail
        label="Nationality"
        value={formData.personalInfo?.nationality}
        editable={isEdit}
        onChange={(v) => handleChange("personalInfo.nationality", v)}
      />
      <InfoDetail
        label="Religion"
        value={formData.personalInfo?.religion}
        editable={isEdit}
        onChange={(v) => handleChange("personalInfo.religion", v)}
      />
    </ProfileCard>

    {/* CONTACT INFORMATION */}
    <ProfileCard label="Contact Information" icon={<FiInfo />}>
    <InfoDetail
  label="Phone"
  type="number"
  value={formData.contactInfo?.phone}
  editable={isEdit}
  error={errors["contactInfo.phone"]}
  onChange={(v) =>
    handleChange("contactInfo.phone", v, "number")
  }
/>

     <InfoDetail
  label="Alternate Phone"
  type="number"
  value={formData.contactInfo?.alternatePhone}
  editable={isEdit}
  error={errors["contactInfo.alternatePhone"]}
  onChange={(v) =>
    handleChange("contactInfo.alternatePhone", v, "number")
  }
/>

      <InfoDetail
  label="Email"
  type="email"
  value={formData.contactInfo?.email}
  editable={isEdit}
  error={errors["contactInfo.email"]}
  onChange={(v) =>
    handleChange("contactInfo.email", v, "email")
  }
/>

      <InfoDetail
        label="Address"
        value={formData.contactInfo?.address}
        editable={isEdit}
        onChange={(v) => handleChange("contactInfo.address", v)}
      />
    </ProfileCard>

    {/* ACADEMIC INFORMATION */}
    <ProfileCard label="Academic Information" icon={<FiInfo />}>
      <InfoDetail
        label="Previous School"
        value={formData.earlierAcademic?.schoolName}
        editable={isEdit}
        onChange={(v) => handleChange("earlierAcademic.schoolName", v)}
      />
      <InfoDetail
        label="Board"
        value={formData.earlierAcademic?.board}
        editable={isEdit}
        onChange={(v) => handleChange("earlierAcademic.board", v)}
      />
      <InfoDetail
        label="Last Class Studied"
        value={formData.earlierAcademic?.lastClass}
        editable={isEdit}
        onChange={(v) => handleChange("earlierAcademic.lastClass", v)}
      />
      <InfoDetail
        label="Academic Year"
        value={formData.earlierAcademic?.academicYear}
        editable={isEdit}
        onChange={(v) => handleChange("earlierAcademic.academicYear", v)}
      />
    </ProfileCard>

    {/* PARENT / GUARDIAN DETAILS */}
    <ProfileCard label="Parent / Guardian Details" icon={<FiInfo />}>
      <InfoDetail
        label="Father Name"
        value={formData.parents?.father?.name}
        editable={isEdit}
        onChange={(v) => handleChange("parents.father.name", v)}
      />
     <InfoDetail
  label="Father Phone"
  type="number"
  value={formData.parentInfo?.fatherPhone}
  editable={isEdit}
  error={errors["parentInfo.fatherPhone"]}
  onChange={(v) =>
    handleChange("parentInfo.fatherPhone", v, "number")
  }
/>

      <InfoDetail
        label="Mother Name"
        value={formData.parents?.mother?.name}
        editable={isEdit}
        onChange={(v) => handleChange("parents.mother.name", v)}
      />
     <InfoDetail
  label="Mother Phone"
  type="number"
  value={formData.parentInfo?.motherPhone}
  editable={isEdit}
  error={errors["parentInfo.motherPhone"]}
  onChange={(v) =>
    handleChange("parentInfo.motherPhone", v, "number")
  }
/>

      <InfoDetail
        label="Guardian Name"
        value={formData.parents?.guardian?.name}
        editable={isEdit}
        onChange={(v) => handleChange("parents.guardian.name", v)}
      />
    </ProfileCard>

  </div>
)}


    {/*  DOCUMENTS */}
{activeTab === "documents" && (
  <ProfileCard label="Uploaded Documents" icon={<FiFileText />}>
    {isEdit && (
  <div className="mb-4">
    <label className="text-sm font-medium text-gray-600">
      Upload Document
    </label>
    <input
      type="file"
      className="mt-1 block text-sm"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) handleDocumentUpload(file, "General Document");
      }}
    />
  </div>
)}

    <ul className="divide-y">
      {((isEdit ? formData : application).documents || []).length > 0 ? (
        ((isEdit ? formData : application).documents || []).map((doc, idx) => (
          <li key={idx} className="py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FiFileText className="text-gray-400" />
              <span>
                {doc.name} <span className="text-xs text-gray-400">({doc.type})</span>
              </span>
            </div>
           <div className="flex gap-4">
  <button onClick={() => handlePreview(doc)} className="text-blue-600">
    <FiEye /> Preview
  </button>

  <button onClick={() => handleDownload(doc)} className="text-indigo-600">
    <FiDownload /> Download
  </button>

  {isEdit && (
    <button
      onClick={() => handleDeleteDocument(doc._id)}
      className="text-red-600"
    >
      Delete
    </button>
  )}
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
