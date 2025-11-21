import React, { useState, useEffect } from "react";
import { FiInfo, FiUsers, FiEdit2, FiEye, FiEyeOff } from "react-icons/fi";
 import HelpInfo from "../components/HelpInfo";
const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
      <FiInfo className="text-indigo-500" /> {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div>
    <div className="text-gray-500 text-sm font-medium">{label}</div>
    <div className="text-gray-800">{value || "N/A"}</div>
  </div>
);

export default function ParentProfile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPassword, setShowPassword] = useState(false);
  const [parent, setParent] = useState(null);

  useEffect(() => {
    const dummy = {
      parentId: "P101",
      fatherName: "Ramesh Kumar",
      motherName: "Suman Kumari",
      fatherOccupation: "Business Owner",
      motherOccupation: "Teacher",
      fatherNumber: "9876543210",
      motherNumber: "9811122233",
      email: "rameshfamily@example.com",
      emergencyContact: "9898989898",
      permanentAddress: {
        line1: "45 Green Avenue",
        line2: "Near City Park",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
      },
      currentAddress: {
        line1: "Flat 304, Rose Residency",
        line2: "Sector 18, Gurugram",
        city: "Gurugram",
        state: "Haryana",
        pincode: "122001",
      },
      username: "ramesh.k",
      password: "R@mesh2024",
      childDetails: [
        {
          name: "Aarav Kumar",
          class: "8",
          section: "B",
          rollNo: "23",
          attendance: "92%",
          feeStatus: "Paid",
        },
        {
          name: "Siya Kumar",
          class: "4",
          section: "A",
          rollNo: "07",
          attendance: "95%",
          feeStatus: "Pending",
        },
      ],
    };
    setParent(dummy);
  }, []);

  if (!parent)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600 text-xl">Loading parent profile...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <p className="text-gray-500 text-sm mb-2">Parents &gt;</p>
                                                                                     <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Student Profile</h2>

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

      <div className="bg-gray-200 p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex items-center space-x-6">
            <img
              src="https://via.placeholder.com/120"
              alt={parent.fatherName}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-200"
            />
            <div>
              <h1 className="text-2xl font-bold">{parent.fatherName}</h1>
              <p className="text-indigo-600 font-medium">Parent ID: {parent.parentId}</p>
              <p className="text-sm text-gray-600 mt-1">
                {parent.email} • {parent.fatherNumber}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex space-x-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "overview" ? "bg-indigo-600 text-white" : "bg-white border"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("children")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "children" ? "bg-indigo-600 text-white" : "bg-white border"
              }`}
            >
              Children
            </button>
            <button
              onClick={() => setActiveTab("credentials")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "credentials" ? "bg-indigo-600 text-white" : "bg-white border"
              }`}
            >
              Credentials
            </button>
          </div>

          {/* ================= OVERVIEW ================= */}
          {activeTab === "overview" && (
            <div>
              <Section title="Father Details">
                <InfoRow label="Father's Name" value={parent.fatherName} />
                <InfoRow label="Occupation" value={parent.fatherOccupation} />
                <InfoRow label="Contact Number" value={parent.fatherNumber} />
              </Section>

              <Section title="Mother Details">
                <InfoRow label="Mother's Name" value={parent.motherName} />
                <InfoRow label="Occupation" value={parent.motherOccupation} />
                <InfoRow label="Contact Number" value={parent.motherNumber} />
              </Section>

              <Section title="Contact Details">
                <InfoRow label="Primary Email" value={parent.email} />
                <InfoRow label="Emergency Contact" value={parent.emergencyContact} />
              </Section>

              <Section title="Address Details">
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-1">Permanent Address</h4>
                  <p className="text-gray-800">
                    {parent.permanentAddress.line1}, {parent.permanentAddress.line2},{" "}
                    {parent.permanentAddress.city}, {parent.permanentAddress.state} -{" "}
                    {parent.permanentAddress.pincode}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-700 mb-1">Current Address</h4>
                  <p className="text-gray-800">
                    {parent.currentAddress.line1}, {parent.currentAddress.line2},{" "}
                    {parent.currentAddress.city}, {parent.currentAddress.state} -{" "}
                    {parent.currentAddress.pincode}
                  </p>
                </div>
              </Section>
            </div>
          )}

          {/* ================= CHILDREN ================= */}
          {activeTab === "children" && (
            <Section title="Children Details">
              {parent.childDetails.map((child, index) => (
                <div key={index} className="border-b py-3 last:border-none">
                  <div className="font-semibold text-gray-800">
                    {child.name} — Class {child.class} ({child.section})
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Roll No: {child.rollNo} | Attendance: {child.attendance} | Fee Status:{" "}
                    {child.feeStatus}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ================= CREDENTIALS ================= */}
          {activeTab === "credentials" && (
            <Section title="Login Credentials">
              <InfoRow label="Username" value={parent.username} />
              <div>
                <div className="text-gray-500 text-sm font-medium mb-1">Password</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-800">
                    {showPassword ? parent.password : "••••••••"}
                  </span>
                  <button
                    onClick={() => setShowPassword((s) => !s)}
                    className="px-2 py-1 border rounded-md text-sm"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="col-span-2 text-xs text-gray-500 mt-2">
                (Note: Passwords are shown here only for demo purpose)
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
