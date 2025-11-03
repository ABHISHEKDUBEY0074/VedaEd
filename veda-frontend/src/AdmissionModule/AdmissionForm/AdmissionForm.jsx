import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiPhone,
  FiBookOpen,
  FiSave,
  FiX,
  FiUpload,
  FiFileText,
  FiEye,
  FiTrash2,
} from "react-icons/fi";

// Reusable Form Field Component
const FormField = ({ label, name, value, onChange, type = "text", required = false, placeholder = "", className = "", children, ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium mb-1">
      {label} {required && "*"}
    </label>
    {children || (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    )}
  </div>
);

// Reusable Select Component
const SelectField = ({ label, name, value, onChange, required = false, options = [], className = "", children }) => (
  <FormField label={label} name={name} required={required} className={className}>
    {children || (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label.replace("*", "").trim()}</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    )}
  </FormField>
);

// Section Header Component
const SectionHeader = ({ icon, title }) => (
  <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center gap-2">
    {icon} {title}
  </h3>
);

export default function AdmissionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [classes, setClasses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [formData, setFormData] = useState({
    studentName: "", dateOfBirth: "", gender: "", bloodGroup: "", nationality: "", religion: "",
    email: "", phone: "", alternatePhone: "", address: "", city: "", state: "", zipCode: "",
    studentId: "", rollNumber: "", class: "", section: "", academicYear: "", admissionDate: "", admissionType: "",
    fatherName: "", fatherOccupation: "", fatherPhone: "", fatherEmail: "",
    motherName: "", motherOccupation: "", motherPhone: "", motherEmail: "",
    guardianName: "", guardianRelation: "", guardianPhone: "", guardianEmail: "",
    emergencyContactName: "", emergencyContactRelation: "", emergencyContactPhone: "",
    previousSchool: "", transportRequired: "", medicalConditions: "", specialNeeds: "",
    username: "", password: "", feesStatus: "Due",
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/classes");
        if (res.data.success && Array.isArray(res.data.data)) {
          setClasses(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (formData.studentName) {
      const username = formData.studentName.toLowerCase().replace(/\s+/g, ".").substring(0, 20);
      setFormData((prev) => ({ ...prev, username }));
    }
  }, [formData.studentName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileData = {
      id: Date.now(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
    };
    setDocuments((prev) => [...prev, fileData]);
    e.target.value = "";
  };

  const handleRemoveDocument = (id) => {
    setDocuments((prev) => {
      const doc = prev.find((d) => d.id === id);
      if (doc?.preview) URL.revokeObjectURL(doc.preview);
      return prev.filter((d) => d.id !== id);
    });
    if (previewDoc?.id === id) setPreviewDoc(null);
  };

  const handlePreviewDocument = (doc) => {
    if (doc.file.type.startsWith("image/")) {
      setPreviewDoc(doc);
    } else if (doc.file.type === "application/pdf") {
      window.open(doc.preview, "_blank");
    } else {
      window.open(doc.preview, "_blank");
    }
  };

  const uploadDocuments = async (studentId) => {
    for (const doc of documents) {
      const formData = new FormData();
      formData.append("file", doc.file);
      formData.append("studentId", studentId);
      try {
        await axios.post("http://localhost:5000/api/students/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        console.error(`Error uploading document ${doc.name}:`, err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const newStudent = {
        personalInfo: {
          name: formData.studentName,
          stdId: formData.studentId,
          rollNo: formData.rollNumber,
          class: formData.class,
          section: formData.section,
          password: formData.password,
          fees: formData.feesStatus,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          nationality: formData.nationality,
          religion: formData.religion,
        },
        email: formData.email,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        academicYear: formData.academicYear,
        admissionDate: formData.admissionDate,
        admissionType: formData.admissionType,
        previousSchool: formData.previousSchool,
        parents: {
          father: {
            name: formData.fatherName,
            occupation: formData.fatherOccupation,
            phone: formData.fatherPhone,
            email: formData.fatherEmail,
          },
          mother: {
            name: formData.motherName,
            occupation: formData.motherOccupation,
            phone: formData.motherPhone,
            email: formData.motherEmail,
          },
          guardian: {
            name: formData.guardianName,
            relation: formData.guardianRelation,
            phone: formData.guardianPhone,
            email: formData.guardianEmail,
          },
        },
        emergencyContact: {
          name: formData.emergencyContactName,
          relation: formData.emergencyContactRelation,
          phone: formData.emergencyContactPhone,
        },
        username: formData.username,
        transportRequired: formData.transportRequired,
        medicalConditions: formData.medicalConditions,
        specialNeeds: formData.specialNeeds,
      };

      const res = await axios.post("http://localhost:5000/api/students", newStudent);

      if (res.data.success) {
        const studentId = res.data.data?._id || res.data.data?.id;
        if (studentId && documents.length > 0) {
          await uploadDocuments(studentId);
        }
        setSuccessMsg("Student enrolled successfully!");
        setTimeout(() => navigate("/students"), 2000);
      } else {
        setErrorMsg(res.data.message || "Failed to enroll student");
      }
    } catch (err) {
      console.error("Error enrolling student:", err);
      setErrorMsg(err.response?.data?.message || "Error enrolling student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2">
        <button
          onClick={() => navigate("/students")}
          className="hover:underline"
        >
          Students
        </button>
        <span className="mx-1">/</span>
        <span>Admission Form</span>
      </div>

        {/* Page title */}
      <h2 className="text-2xl font-bold mb-6">Admission Form</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      {/* Main content box */}
      <div className="bg-gray-200 p-6 border border-gray-100">
        <div className="bg-white p-4 rounded-lg shadow-sm">

      {/* Messages */}
      {successMsg && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        {/* Personal Information */}
        <div className="mb-8">
          <SectionHeader icon={<FiUser />} title="Personal Information" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name" name="studentName" value={formData.studentName} onChange={handleChange} required />
            <FormField label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" required />
            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} required options={["Male", "Female", "Other"]} />
            <SelectField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} />
            <FormField label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
            <FormField label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <SectionHeader icon={<FiPhone />} title="Contact Information" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
            <FormField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} type="tel" required />
            <FormField label="Alternate Phone" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} type="tel" />
            <FormField label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Street address" className="col-span-2" />
            <FormField label="City" name="city" value={formData.city} onChange={handleChange} />
            <FormField label="State" name="state" value={formData.state} onChange={handleChange} />
            <FormField label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} />
          </div>
        </div>

        {/* Academic Information */}
        <div className="mb-8">
          <SectionHeader icon={<FiBookOpen />} title="Academic Information" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} required />
            <FormField label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
            <SelectField label="Class" name="class" value={formData.class} onChange={handleChange} required>
              <select name="class" value={formData.class} onChange={handleChange} required className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls.name}>{cls.name}</option>
                ))}
              </select>
            </SelectField>
            <FormField label="Section" name="section" value={formData.section} onChange={handleChange} required />
            <FormField label="Academic Year" name="academicYear" value={formData.academicYear} onChange={handleChange} placeholder="e.g., 2024-2025" required />
            <FormField label="Admission Date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} type="date" required />
            <SelectField label="Admission Type" name="admissionType" value={formData.admissionType} onChange={handleChange} options={["Regular", "Transfer", "New"]} />
            <FormField label="Previous School" name="previousSchool" value={formData.previousSchool} onChange={handleChange} />
          </div>
        </div>

        {/* Parent/Guardian Information */}
        <div className="mb-8">
          <SectionHeader icon={<FiUser />} title="Parent/Guardian Information" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <h4 className="col-span-2 font-medium text-gray-700 mb-2">Father's Information</h4>
            <FormField label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
            <FormField label="Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} />
            <FormField label="Phone" name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} type="tel" />
            <FormField label="Email" name="fatherEmail" value={formData.fatherEmail} onChange={handleChange} type="email" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <h4 className="col-span-2 font-medium text-gray-700 mb-2">Mother's Information</h4>
            <FormField label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
            <FormField label="Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} />
            <FormField label="Phone" name="motherPhone" value={formData.motherPhone} onChange={handleChange} type="tel" />
            <FormField label="Email" name="motherEmail" value={formData.motherEmail} onChange={handleChange} type="email" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <h4 className="col-span-2 font-medium text-gray-700 mb-2">Guardian Information (if applicable)</h4>
            <FormField label="Guardian's Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
            <FormField label="Relation" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange} placeholder="e.g., Uncle, Aunt" />
            <FormField label="Phone" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} type="tel" />
            <FormField label="Email" name="guardianEmail" value={formData.guardianEmail} onChange={handleChange} type="email" />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mb-8">
          <SectionHeader icon={<FiPhone />} title="Emergency Contact" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Contact Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required />
            <FormField label="Relation" name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} placeholder="e.g., Father, Mother, Uncle" required />
            <FormField label="Phone Number" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} type="tel" required />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <SectionHeader icon={<FiBookOpen />} title="Additional Information" />
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Transport Required" name="transportRequired" value={formData.transportRequired} onChange={handleChange} options={["Yes", "No"]} />
            <SelectField label="Fees Status" name="feesStatus" value={formData.feesStatus} onChange={handleChange} options={["Paid", "Due"]} />
            <FormField label="Medical Conditions" name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} className="col-span-2">
              <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} rows="3" placeholder="Any known medical conditions or allergies" className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormField>
            <FormField label="Special Needs" name="specialNeeds" value={formData.specialNeeds} onChange={handleChange} className="col-span-2">
              <textarea name="specialNeeds" value={formData.specialNeeds} onChange={handleChange} rows="3" placeholder="Any special educational or physical needs" className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormField>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mb-8">
          <SectionHeader icon={<FiFileText />} title="Documents" />
          <div className="mb-4">
            <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 inline-flex items-center gap-2">
              <FiUpload /> Upload Document
              <input type="file" className="hidden" onChange={handleDocumentUpload} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
            </label>
          </div>
          {documents.length > 0 && (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FiFileText className="text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handlePreviewDocument(doc)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <FiEye /> Preview
                    </button>
                    <button type="button" onClick={() => handleRemoveDocument(doc.id)} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {previewDoc && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setPreviewDoc(null)}>
              <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{previewDoc.name}</h3>
                  <button onClick={() => setPreviewDoc(null)} className="text-gray-500 hover:text-gray-700">
                    <FiX size={24} />
                  </button>
                </div>
                {previewDoc.file.type.startsWith("image/") && (
                  <img src={previewDoc.preview} alt={previewDoc.name} className="max-w-full h-auto" />
                )}
                {previewDoc.file.type === "application/pdf" && (
                  <iframe src={previewDoc.preview} className="w-full h-[70vh]" title={previewDoc.name} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Login Credentials */}
        <div className="mb-8">
          <SectionHeader icon={<FiUser />} title="Login Credentials" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormField label="Username" name="username" value={formData.username} onChange={handleChange} required />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from name (you can edit)</p>
            </div>
            <div>
              <FormField label="Password" name="password" value={formData.password} onChange={handleChange} required />
              <p className="text-xs text-gray-500 mt-1">Password for student login</p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <FiSave /> Save & Enroll Student
              </>
            )}
          </button>
        </div>
      </form>
    </div>
    </div></div>
  );
}