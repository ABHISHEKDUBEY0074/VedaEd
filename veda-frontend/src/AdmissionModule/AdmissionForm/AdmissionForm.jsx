import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiBookOpen,
  FiSave,
  FiX,
} from "react-icons/fi";

export default function AdmissionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [classes, setClasses] = useState([]);

  const [formData, setFormData] = useState({
    // Personal Information
    studentName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    nationality: "",
    religion: "",

    // Contact Information
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Academic Information
    studentId: "",
    rollNumber: "",
    class: "",
    section: "",
    academicYear: "",
    admissionDate: "",
    admissionType: "",

    // Parent/Guardian Information
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

    // Emergency Contact
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",

    // Additional Information
    previousSchool: "",
    transportRequired: "",
    medicalConditions: "",
    specialNeeds: "",

    // Login Credentials
    username: "",
    password: "",
    feesStatus: "Due",
  });

  // Fetch classes from API
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

  // Auto-generate username from student name
  useEffect(() => {
    if (formData.studentName) {
      const username = formData.studentName
        .toLowerCase()
        .replace(/\s+/g, ".")
        .substring(0, 20);
      setFormData((prev) => ({ ...prev, username }));
    }
  }, [formData.studentName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // Prepare student data in the format expected by the backend
      const newStudent = {
        personalInfo: {
          name: formData.studentName,
          stdId: formData.studentId,
          rollNo: formData.rollNumber,
          class: formData.class,
          section: formData.section,
          password: formData.password,
          fees: formData.feesStatus,
          // Additional personal info
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          nationality: formData.nationality,
          religion: formData.religion,
        },
        // Contact info
        email: formData.email,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,

        // Academic info
        academicYear: formData.academicYear,
        admissionDate: formData.admissionDate,
        admissionType: formData.admissionType,
        previousSchool: formData.previousSchool,

        // Parent/Guardian info
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

        // Emergency contact
        emergencyContact: {
          name: formData.emergencyContactName,
          relation: formData.emergencyContactRelation,
          phone: formData.emergencyContactPhone,
        },

        // Additional info
        username: formData.username,
        transportRequired: formData.transportRequired,
        medicalConditions: formData.medicalConditions,
        specialNeeds: formData.specialNeeds,
      };

      const res = await axios.post(
        "http://localhost:5000/api/students",
        newStudent
      );

      if (res.data.success) {
        setSuccessMsg("Student enrolled successfully!");
        setTimeout(() => {
          navigate("/students");
        }, 2000);
      } else {
        setErrorMsg(res.data.message || "Failed to enroll student");
      }
    } catch (err) {
      console.error("Error enrolling student:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Error enrolling student. Please try again."
      );
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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        {/* Personal Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center gap-2">
            <FiUser /> Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Religion</label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center gap-2">
            <FiPhone /> Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Alternate Phone
              </label>
              <input
                type="tel"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center gap-2">
            <FiBookOpen /> Academic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Student ID *
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Roll Number *
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Class *</label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls.name}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Section *
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Academic Year *
              </label>
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="e.g., 2024-2025"
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Admission Date *
              </label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Admission Type
              </label>
              <select
                name="admissionType"
                value={formData.admissionType}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Regular">Regular</option>
                <option value="Transfer">Transfer</option>
                <option value="New">New</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Previous School
              </label>
              <input
                type="text"
                name="previousSchool"
                value={formData.previousSchool}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Parent/Guardian Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center gap-2">
            <FiUser /> Parent/Guardian Information
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <h4 className="font-medium text-gray-700 mb-2">
                Father's Information
              </h4>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Father's Name
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="fatherPhone"
                value={formData.fatherPhone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="fatherEmail"
                value={formData.fatherEmail}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <h4 className="font-medium text-gray-700 mb-2">
                Mother's Information
              </h4>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mother's Name
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="motherPhone"
                value={formData.motherPhone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="motherEmail"
                value={formData.motherEmail}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <h4 className="font-medium text-gray-700 mb-2">
                Guardian Information (if applicable)
              </h4>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Guardian's Name
              </label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Relation</label>
              <input
                type="text"
                name="guardianRelation"
                value={formData.guardianRelation}
                onChange={handleChange}
                placeholder="e.g., Uncle, Aunt"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="guardianEmail"
                value={formData.guardianEmail}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center gap-2">
            <FiPhone /> Emergency Contact
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Name *
              </label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Relation *
              </label>
              <input
                type="text"
                name="emergencyContactRelation"
                value={formData.emergencyContactRelation}
                onChange={handleChange}
                placeholder="e.g., Father, Mother, Uncle"
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center gap-2">
            <FiBookOpen /> Additional Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Transport Required
              </label>
              <select
                name="transportRequired"
                value={formData.transportRequired}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fees Status
              </label>
              <select
                name="feesStatus"
                value={formData.feesStatus}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Paid">Paid</option>
                <option value="Due">Due</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Medical Conditions
              </label>
              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                rows="3"
                placeholder="Any known medical conditions or allergies"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Special Needs
              </label>
              <textarea
                name="specialNeeds"
                value={formData.specialNeeds}
                onChange={handleChange}
                rows="3"
                placeholder="Any special educational or physical needs"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Login Credentials Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center gap-2">
            <FiUser /> Login Credentials
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-generated from name (you can edit)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password *
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Password for student login
              </p>
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