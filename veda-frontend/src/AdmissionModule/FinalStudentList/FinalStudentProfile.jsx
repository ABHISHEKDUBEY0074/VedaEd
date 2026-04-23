import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiInfo,
  FiFileText,
  FiDollarSign,
  FiEdit3,
  FiSave,
  FiX,
  FiDownload,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import axios from "axios";
import config from "../../config";

/* ================= CONSTANTS ================= */

const documentAccept =
  ".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx";

/* ================= INITIAL DATA ================= */

const initialStudent = {
  stdId: "",
  name: "",
  class: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  nationality: "",
  religion: "",
  email: "",
  phone: "",
  altPhone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  previousSchool: "",
  board: "",
  lastClass: "",
  academicYear: "",
  fatherName: "",
  fatherOccupation: "",
  fatherPhone: "",
  fatherEmail: "",
  motherName: "",
  motherOccupation: "",
  motherPhone: "",
  motherEmail: "",
  guardianName: "",
  guardianRelation: "",
  guardianPhone: "",
  guardianEmail: "",
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone: "",
  transportRequired: "",
  feeStatus: "",
  medicalConditions: "",
  specialNeeds: "",
  regFeeAmount: "",
  paymentMode: "",
  paymentDate: "",
  receiptNo: "",
  remarks: "",
};
const initialDocs = [];

const getDocumentUrl = (docPath = "") => {
  if (!docPath) return "#";
  const normalizedPath = String(docPath).replace(/\\/g, "/");
  const publicPath = normalizedPath.includes("public/")
    ? normalizedPath.split("public/")[1]
    : normalizedPath.replace(/^\/+/, "");
  return `${config.API_BASE_URL.replace(/\/api$/, "")}/${publicPath.replace(
    /^\/+/,
    ""
  )}`;
};

const mapDocuments = (docs = []) =>
  docs.map((doc, idx) => ({
    id: doc._id || idx + 1,
    name: doc.name || doc.type || `Document ${idx + 1}`,
    fileUrl: getDocumentUrl(doc.path),
    date: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "-",
    fileType: doc.fileType || "",
  }));

const mapStudentForProfile = (raw = {}) => {
  const personal = raw.personalInfo || {};
  const contact = raw.contactInfo || {};
  const earlierAcademic = raw.earlierAcademic || {};
  const parents = raw.parents || {};
  const feeInfo = raw.feeInfo || {};
  const [street = "", city = "", stateZip = ""] = String(
    contact.address || ""
  )
    .split(",")
    .map((item) => item.trim());
  const stateFromAddress = stateZip.replace(/\s+\d{4,10}$/, "").trim();
  const zipFromAddressMatch = stateZip.match(/(\d{4,10})$/);
  const zipFromAddress = zipFromAddressMatch ? zipFromAddressMatch[1] : "";

  return {
    stdId: personal.stdId || "",
    name: personal.name || "",
    class: personal.class || personal.classApplied || "",
    dob: personal.dateOfBirth || "",
    gender: personal.gender || "",
    bloodGroup: personal.bloodGroup || "",
    nationality: personal.nationality || "",
    religion: personal.religion || "",
    email: contact.email || "",
    phone: contact.phone || "",
    altPhone: contact.alternatePhone || "",
    street,
    city: contact.city || city,
    state: contact.state || stateFromAddress,
    zip: contact.zipCode || contact.zip || zipFromAddress,
    previousSchool: earlierAcademic.schoolName || "",
    board: earlierAcademic.board || "",
    lastClass: earlierAcademic.lastClass || "",
    academicYear: earlierAcademic.academicYear || "",
    fatherName: parents.father?.name || "",
    fatherOccupation: parents.father?.occupation || "",
    fatherPhone: parents.father?.phone || "",
    fatherEmail: parents.father?.email || "",
    motherName: parents.mother?.name || "",
    motherOccupation: parents.mother?.occupation || "",
    motherPhone: parents.mother?.phone || "",
    motherEmail: parents.mother?.email || "",
    guardianName: parents.guardian?.name || "",
    guardianRelation: parents.guardian?.relation || "",
    guardianPhone: parents.guardian?.phone || "",
    guardianEmail: parents.guardian?.email || "",
    emergencyName: raw.emergencyContact?.name || "",
    emergencyRelation: raw.emergencyContact?.relation || "",
    emergencyPhone: raw.emergencyContact?.phone || "",
    transportRequired: raw.transportRequired || "",
    feeStatus: personal.fees || "",
    medicalConditions: raw.medicalConditions || "",
    specialNeeds: raw.specialNeeds || "",
    regFeeAmount: feeInfo.admissionFee || "",
    paymentMode: feeInfo.paymentMode || "",
    paymentDate: feeInfo.paymentDate || "",
    receiptNo: feeInfo.receiptNo || "",
    remarks: feeInfo.remarks || "",
  };
};

/* ================= SMALL COMPONENTS ================= */

const ProfileCard = ({ label, icon, children }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center mb-4 gap-2 text-indigo-600">
      {icon}
      <h3 className="font-semibold text-lg">{label}</h3>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const Field = ({ label, value, isEditing, onChange, type = "text" }) => (
  <div className="grid grid-cols-3 gap-4 border-b py-2 last:border-0">
    <p className="text-gray-500 font-medium">{label}</p>
    <div className="col-span-2">
      {isEditing ? (
        <input
          type={type}
          className="w-full border px-2 py-1 rounded focus:outline-indigo-500"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p>{value || "N/A"}</p>
      )}
    </div>
  </div>
);

/* ================= MAIN COMPONENT ================= */

const FinalStudentProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  /* REAL SAVED DATA */
  const [student, setStudent] = useState(initialStudent);

  /* EDIT COPY (IMPORTANT – FIX FOR BACKSPACE BUG) */
  const [editStudent, setEditStudent] = useState(null);

  const [documents, setDocuments] = useState(initialDocs);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [docsLoading, setDocsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  const fetchStudent = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`${config.API_BASE_URL}/admission/application/${id}`);
      if (res.data?.success && res.data?.data) {
        setStudent(mapStudentForProfile(res.data.data));
        setDocuments(mapDocuments(res.data.data.documents || []));
      }
    } catch (error) {
      console.error("Failed to fetch final student profile:", error);
    }
  };

  useEffect(() => {
    const stateStudent = location.state;
    if (stateStudent) {
      setStudent(mapStudentForProfile(stateStudent));
      setDocuments(mapDocuments(stateStudent.documents || []));
    }
    fetchStudent();
  }, [location.state, id]);

  /* ================= EDIT FLOW ================= */

  const downloadReceipt = () => {
  const content = `
STUDENT FEE RECEIPT

Student Name : ${data.name}
Student ID   : ${data.stdId}

Receipt No   : ${data.receiptNo}
Payment Date : ${data.paymentDate}
Payment Mode : ${data.paymentMode}

Amount Paid  : ₹${data.regFeeAmount}

Remarks      : ${data.remarks}

Status       : ${data.feeStatus}
`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `Fee_Receipt_${data.stdId}.txt`;
  a.click();

  URL.revokeObjectURL(url);
};

  const startEdit = () => {
    setEditStudent({ ...student });
    setIsEditing(true);
  };

  const saveEdit = () => {
    setStudent(editStudent);
    setEditStudent(null);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditStudent(null);
    setIsEditing(false);
  };

  const changeField = (key, value) => {
    setEditStudent((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const data = isEditing ? editStudent : student;

  /* ================= DOCUMENTS ================= */

  const uploadDoc = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!id) {
      alert("Student profile id is missing.");
      e.target.value = "";
      return;
    }

    try {
      setDocsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("applicationId", id);
      formData.append("type", "Admission Document");

      const res = await axios.post(
        `${config.API_BASE_URL}/admission/application/${id}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data?.success) {
        const updatedDocs = res.data?.data?.documents || [];
        setDocuments(mapDocuments(updatedDocs));
      }
    } catch (error) {
      console.error("Failed to upload document:", error);
      alert("Failed to upload document.");
    } finally {
      setDocsLoading(false);
      e.target.value = "";
    }
  };

  const deleteDoc = async (documentId) => {
    if (!id || !documentId) return;
    try {
      setDocsLoading(true);
      const res = await axios.delete(
        `${config.API_BASE_URL}/admission/application/${id}/document/${documentId}`
      );
      if (res.data?.success) {
        setDocuments(mapDocuments(res.data?.data?.documents || []));
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document.");
    } finally {
      setDocsLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-0 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>

        {!isEditing ? (
          <button
            onClick={startEdit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            <FiEdit3 className="inline mr-2" /> Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={saveEdit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              <FiSave className="inline mr-2" /> Save
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              <FiX className="inline mr-2" /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-xl shadow p-4 flex gap-6 items-center">
        <img
          src="https://via.placeholder.com/120"
          className="w-28 h-28 rounded-full"
          alt="student"
        />
        <div>
          <h1 className="text-2xl font-bold">{data.name}</h1>
           <p className="text-sm text-gray-500 font-medium">
    Student ID: {data.stdId}
  </p>
          <p className="text-indigo-600">{data.class}</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 bg-white p-2 rounded shadow">
        {["overview", "fee", "documents"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded ${
              activeTab === t
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-indigo-50"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
  <div className="grid lg:grid-cols-3 gap-3">

    {/* LEFT */}
    <div className="lg:col-span-2 space-y-4">

      <ProfileCard label="Personal Information" icon={<FiInfo />}>
        <Field label="Full Name" value={data.name} isEditing={isEditing} onChange={(v)=>changeField("name",v)} />
        <Field label="Date of Birth" type="date" value={data.dob} isEditing={isEditing} onChange={(v)=>changeField("dob",v)} />
        <Field label="Gender" value={data.gender} isEditing={isEditing} onChange={(v)=>changeField("gender",v)} />
        <Field label="Blood Group" value={data.bloodGroup} isEditing={isEditing} onChange={(v)=>changeField("bloodGroup",v)} />
        <Field label="Nationality" value={data.nationality} isEditing={isEditing} onChange={(v)=>changeField("nationality",v)} />
        <Field label="Religion" value={data.religion} isEditing={isEditing} onChange={(v)=>changeField("religion",v)} />
      </ProfileCard>

      <ProfileCard label="Contact Information" icon={<FiInfo />}>
        <Field label="Email" value={data.email} isEditing={isEditing} onChange={(v)=>changeField("email",v)} />
        <Field label="Phone" value={data.phone} isEditing={isEditing} onChange={(v)=>changeField("phone",v)} />
        <Field label="Alternate Phone" value={data.altPhone} isEditing={isEditing} onChange={(v)=>changeField("altPhone",v)} />
        <Field label="Street" value={data.street} isEditing={isEditing} onChange={(v)=>changeField("street",v)} />
        <Field label="City" value={data.city} isEditing={isEditing} onChange={(v)=>changeField("city",v)} />
        <Field label="State" value={data.state} isEditing={isEditing} onChange={(v)=>changeField("state",v)} />
        <Field label="Zip Code" value={data.zip} isEditing={isEditing} onChange={(v)=>changeField("zip",v)} />
      </ProfileCard>

      <ProfileCard label="Earlier Academic Information" icon={<FiInfo />}>
        <Field label="Previous School" value={data.previousSchool} isEditing={isEditing} onChange={(v)=>changeField("previousSchool",v)} />
        <Field label="Board / University" value={data.board} isEditing={isEditing} onChange={(v)=>changeField("board",v)} />
        <Field label="Class Last Studied" value={data.lastClass} isEditing={isEditing} onChange={(v)=>changeField("lastClass",v)} />
        <Field label="Academic Year" value={data.academicYear} isEditing={isEditing} onChange={(v)=>changeField("academicYear",v)} />
      </ProfileCard>

    </div>

    {/* RIGHT */}
    <div className="space-y-4">

      <ProfileCard label="Parent / Guardian Information" icon={<FiInfo />}>
        <Field label="Father Name" value={data.fatherName} isEditing={isEditing} onChange={(v)=>changeField("fatherName",v)} />
        <Field label="Father Occupation" value={data.fatherOccupation} isEditing={isEditing} onChange={(v)=>changeField("fatherOccupation",v)} />
        <Field label="Father Phone" value={data.fatherPhone} isEditing={isEditing} onChange={(v)=>changeField("fatherPhone",v)} />
        <Field label="Father Email" value={data.fatherEmail} isEditing={isEditing} onChange={(v)=>changeField("fatherEmail",v)} />

        <Field label="Mother Name" value={data.motherName} isEditing={isEditing} onChange={(v)=>changeField("motherName",v)} />
        <Field label="Mother Occupation" value={data.motherOccupation} isEditing={isEditing} onChange={(v)=>changeField("motherOccupation",v)} />
        <Field label="Mother Phone" value={data.motherPhone} isEditing={isEditing} onChange={(v)=>changeField("motherPhone",v)} />
        <Field label="Mother Email" value={data.motherEmail} isEditing={isEditing} onChange={(v)=>changeField("motherEmail",v)} />

        <Field label="Guardian Name" value={data.guardianName} isEditing={isEditing} onChange={(v)=>changeField("guardianName",v)} />
        <Field label="Relation" value={data.guardianRelation} isEditing={isEditing} onChange={(v)=>changeField("guardianRelation",v)} />
        <Field label="Guardian Phone" value={data.guardianPhone} isEditing={isEditing} onChange={(v)=>changeField("guardianPhone",v)} />
        <Field label="Guardian Email" value={data.guardianEmail} isEditing={isEditing} onChange={(v)=>changeField("guardianEmail",v)} />
      </ProfileCard>

      <ProfileCard label="Emergency Contact" icon={<FiInfo />}>
        <Field label="Contact Name" value={data.emergencyName} isEditing={isEditing} onChange={(v)=>changeField("emergencyName",v)} />
        <Field label="Relation" value={data.emergencyRelation} isEditing={isEditing} onChange={(v)=>changeField("emergencyRelation",v)} />
        <Field label="Phone" value={data.emergencyPhone} isEditing={isEditing} onChange={(v)=>changeField("emergencyPhone",v)} />
      </ProfileCard>

    </div>
  </div>
)}

      

      {/* FEE */}
      {activeTab === "fee" && (
  <ProfileCard label="Registration / Admission Fees" icon={<FiDollarSign />}>

    <div className="grid grid-cols-2 gap-4 text-sm">

      <div>
        <p className="text-gray-500">Receipt Number</p>
        <p className="font-semibold">{data.receiptNo || "N/A"}</p>
      </div>

      <div>
        <p className="text-gray-500">Payment Date</p>
        <p className="font-semibold">{data.paymentDate || "N/A"}</p>
      </div>

      <div>
        <p className="text-gray-500">Payment Mode</p>
        <p className="font-semibold">{data.paymentMode}</p>
      </div>

      <div>
        <p className="text-gray-500">Amount Paid</p>
        <p className="font-semibold text-green-600">
          ₹ {data.regFeeAmount || 0}
        </p>
      </div>

      <div className="col-span-2">
        <p className="text-gray-500">Remarks</p>
        <p>{data.remarks || "—"}</p>
      </div>

      <div className="col-span-2 flex items-center justify-between mt-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            data.feeStatus === "Paid"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {data.feeStatus}
        </span>

        <button
          onClick={downloadReceipt}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          <FiDownload /> Download Receipt
        </button>
      </div>
    </div>
  </ProfileCard>
)}
      {/* DOCUMENTS */}
      {activeTab === "documents" && (
        <ProfileCard label="Documents" icon={<FiFileText />}>
          <label className="inline-block bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer mb-3">
            Upload Document
            <input
              type="file"
              accept={documentAccept}
              className="hidden"
              disabled={docsLoading}
              onChange={uploadDoc}
            />
          </label>

          <ul className="divide-y">
            {documents.length === 0 && (
              <li className="py-3 text-gray-500">No documents uploaded yet.</li>
            )}
            {documents.map((d) => (
              <li key={d.id} className="py-2 flex justify-between items-center">
                <div>
                  <p>{d.name}</p>
                  <p className="text-xs text-gray-500">Uploaded: {d.date}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPreviewDoc(d)}
                    className="text-blue-600"
                    title="Preview"
                  >
                    <FiEye />
                  </button>
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600"
                    title="Download"
                  >
                    <FiDownload />
                  </a>
                  <button
                    onClick={() => deleteDoc(d.id)}
                    className="text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {previewDoc && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setPreviewDoc(null)}
            >
              <div
                className="bg-white p-4 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{previewDoc.name}</h3>
                  <button onClick={() => setPreviewDoc(null)} className="text-gray-600">
                    <FiX />
                  </button>
                </div>
                {previewDoc.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.name}
                    className="max-w-full h-auto mx-auto"
                  />
                ) : previewDoc.fileUrl.match(/\.pdf$/i) ? (
                  <iframe
                    src={previewDoc.fileUrl}
                    title={previewDoc.name}
                    className="w-full h-[70vh] border rounded"
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="mb-3">Preview is not available for this file type.</p>
                    <a
                      href={previewDoc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded"
                    >
                      <FiDownload />
                      Download Document
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </ProfileCard>
      )}
    </div>
  );
};

export default FinalStudentProfile;