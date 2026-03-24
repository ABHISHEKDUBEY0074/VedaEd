import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddSupportStaff = () => {
  const navigate = useNavigate();

  const generateStaffId = () => {
    return "SS-" + Math.floor(1000 + Math.random() * 9000);
  };
const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    staffId: "",
    fullName: "",
    designation: "",
    department: "",
    phone: "",
    emergencyContact: "",
    aadhaar: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    salary: "",
    joiningDate: "",
    status: "Active",
    profession: "",
    permanentAddress: "",
    currentAddress: "",
    photo: null,
    aadhaarDoc: null,
    otherDocs: null,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      staffId: generateStaffId(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Name restriction (alphabets only)
    if (name === "fullName") {
      const alphaOnly = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData({ ...formData, [name]: alphaOnly });
      return;
    }

    // Phone & emergency (numbers only)
    if (name === "phone" || name === "emergencyContact") {
      const numeric = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: numeric });
      return;
    }

    // Aadhaar restriction (12 digit)
    if (name === "aadhaar") {
      const numeric = value.replace(/\D/g, "").slice(0, 12);
      setFormData({ ...formData, [name]: numeric });
      return;
    }

    // Salary numeric only
    if (name === "salary") {
      const numeric = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numeric });
      return;
    }

    // File Upload
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Age validation (18+)
    const age =
      new Date().getFullYear() - new Date(formData.dob).getFullYear();

    if (age < 18) {
      alert("Staff must be 18+ years old");
      return;
    }

    console.log("Saved Support Staff:", formData);

    navigate("/hr/support-staff");
  };
const validateKey = (e, field) => {
  const letterOnly = ["fullName", "designation"];
  const numberOnly = ["phone", "emergencyContact", "aadhaar", "salary"];

  // LETTER ONLY
  if (
    letterOnly.includes(field) &&
    !/^[a-zA-Z\s]$/.test(e.key) &&
    !["Backspace", "Tab"].includes(e.key)
  ) {
    e.preventDefault();
    setErrors((p) => ({ ...p, [field]: "Only letters allowed" }));
  }

  // NUMBER ONLY
  if (
    numberOnly.includes(field) &&
    !/^\d$/.test(e.key) &&
    !["Backspace", "Tab"].includes(e.key)
  ) {
    e.preventDefault();
    setErrors((p) => ({ ...p, [field]: "Only numbers allowed" }));
  }
};
  return (
    <div className="p-0 m-0 min-h-screen">
  
      <div className="flex items-center justify-between mb-4">
  <h1 className="text-2xl font-bold">Add Support Staff</h1>

  <button
    type="button"
    onClick={() => navigate("/hr/support-staff")}
    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
  >
    ← Back
  </button>
</div>


      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Staff ID */}
        <div>
          <label className="block text-sm font-medium">Staff ID</label>
          <input
            value={formData.staffId}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
  name="fullName"
  value={formData.fullName}
  onKeyDown={(e) => validateKey(e, "fullName")}
  onChange={(e) => {
    setErrors((p) => ({ ...p, fullName: "" }));
    setFormData({ ...formData, fullName: e.target.value });
  }}
  className="w-full border p-2 rounded"
  required
/>
{errors.fullName && (
  <p className="text-xs text-red-500">{errors.fullName}</p>
)}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium">Designation</label>
         <input
  name="designation"
  onKeyDown={(e) => validateKey(e, "designation")}
  onChange={(e) => {
    setErrors((p) => ({ ...p, designation: "" }));
    setFormData({ ...formData, designation: e.target.value });
  }}
  className="w-full border p-2 rounded"
  required
/>
{errors.designation && (
  <p className="text-xs text-red-500">{errors.designation}</p>
)}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium">Department</label>
          <select
            name="department"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Department</option>
            <option>Maintenance</option>
            <option>Security</option>
            <option>Housekeeping</option>
            <option>Transport</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
  name="phone"
  value={formData.phone}
  onKeyDown={(e) => validateKey(e, "phone")}
  onChange={(e) => {
    setErrors((p) => ({ ...p, phone: "" }));
    setFormData({ ...formData, phone: e.target.value.slice(0, 10) });
  }}
  className="w-full border p-2 rounded"
  required
/>
{errors.phone && (
  <p className="text-xs text-red-500">{errors.phone}</p>
)}
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium">
            Emergency Contact
          </label>
          <input
  name="emergencyContact"
  value={formData.emergencyContact}
  onKeyDown={(e) => validateKey(e, "emergencyContact")}
  onChange={(e) => {
    setErrors((p) => ({ ...p, emergencyContact: "" }));
    setFormData({
      ...formData,
      emergencyContact: e.target.value.slice(0, 10),
    });
  }}
  className="w-full border p-2 rounded"
/>
{errors.emergencyContact && (
  <p className="text-xs text-red-500">{errors.emergencyContact}</p>
)}
        </div>

        {/* Aadhaar */}
        <div>
          <label className="block text-sm font-medium">Aadhaar Number</label>
          <input
  name="aadhaar"
  value={formData.aadhaar}
  onKeyDown={(e) => validateKey(e, "aadhaar")}
  onChange={(e) => {
    setErrors((p) => ({ ...p, aadhaar: "" }));
    setFormData({
      ...formData,
      aadhaar: e.target.value.slice(0, 12),
    });
  }}
  className="w-full border p-2 rounded"
/>
{errors.aadhaar && (
  <p className="text-xs text-red-500">{errors.aadhaar}</p>
)}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="gender"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-medium">Salary</label>
          <input
  name="salary"
  value={formData.salary}
  onKeyDown={(e) => validateKey(e, "salary")}
  onChange={(e) => {
    setErrors((p) => ({ ...p, salary: "" }));
    setFormData({ ...formData, salary: e.target.value });
  }}
  className="w-full border p-2 rounded"
/>
{errors.salary && (
  <p className="text-xs text-red-500">{errors.salary}</p>
)}
        </div>

        {/* Joining Date */}
        <div>
          <label className="block text-sm font-medium">Joining Date</label>
          <input
            type="date"
            name="joiningDate"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium">Blood Group</label>
          <select
            name="bloodGroup"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            <option>A+</option>
            <option>B+</option>
            <option>O+</option>
            <option>AB+</option>
            <option>A-</option>
            <option>B-</option>
            <option>O-</option>
            <option>AB-</option>
          </select>
        </div>

        {/* Addresses */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">
            Permanent Address
          </label>
          <textarea
            name="permanentAddress"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">
            Current Address
          </label>
          <textarea
            name="currentAddress"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* File Uploads */}
        <div>
          <label className="block text-sm font-medium">Upload Photo</label>
          <input type="file" name="photo" onChange={handleChange} />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Upload Aadhaar Copy
          </label>
          <input type="file" name="aadhaarDoc" onChange={handleChange} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">
            Other Documents
          </label>
          <input type="file" name="otherDocs" onChange={handleChange} />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
            Save Support Staff
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupportStaff;
