import React, { useState, useEffect } from "react";
import { FiInfo, FiEye, FiEyeOff } from "react-icons/fi";
 import HelpInfo from "../components/HelpInfo";

const Section = ({ title, children }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
    <div className="flex items-center mb-3">
      <div className="text-indigo-500 mr-2">
        <FiInfo />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    <div className="space-y-2 text-sm text-gray-700">{children}</div>
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
    <div className="p-0 m-0 min-h-screen">
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Parents</span>
        <span>&gt;</span>
        <span>Profile</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Profile</h2>
<HelpInfo
  title="Profile Help"
  description={`1.1 Overview

This section displays complete parent profile information at the top, including:
• Parent Name – Registered parent/guardian name  
• Parent ID – Unique parent identity code  
• Contact Details – Email address and phone number  
• Profile Photo – Parent profile image (can be updated if allowed)

Below this, detailed parent information is shown in separate cards:

• Father Details – Name, contact number, and occupation  
• Mother Details – Name, contact number, and occupation  
• Address Details – Residential address and communication details  
• Additional Info – Any extra details provided by the school or parent

2.1 Children

This tab lists all children linked to the parent account.  
For each child, the following is displayed:
• Student Name  
• Class & Section  
• Admission Number  
• Child Profile Link – View complete student details

Parents can quickly switch between children using this section.

3.1 Credentials

This tab shows the login credentials assigned to the parent:
• Username / Registered Email  
• Option to reset password (if enabled)  
• Security info and account status

This helps parents manage their login access securely.
`}
  steps={[
    "Check parent personal details in the Overview section.",
    "Use the Children tab to view and manage all linked student profiles.",
            "Open the Credentials tab to update or manage login access.",
  ]}
/>
</div>

      <div className="bg-white p-3 rounded-lg shadow-sm border mb-4">
          {/* Header */}
        <div className="bg-white p-3 rounded-lg shadow-sm border mb-4 flex items-center gap-4">
            <img
              src="https://via.placeholder.com/120"
              alt={parent.fatherName}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-200"
            />
            <div>
            <h1 className="text-xl font-semibold">{parent.fatherName}</h1>
            <p className="text-indigo-600 font-medium text-sm">
              Parent ID: {parent.parentId}
            </p>
            <p className="text-xs text-gray-500">
                {parent.email} • {parent.fatherNumber}
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
              onClick={() => setActiveTab("children")}
              className={`px-4 py-2 rounded-lg ${
              activeTab === "children"
                ? "bg-indigo-600 text-white"
                : "bg-white border"
              }`}
            >
              Children
            </button>
            <button
              onClick={() => setActiveTab("credentials")}
              className={`px-4 py-2 rounded-lg ${
              activeTab === "credentials"
                ? "bg-indigo-600 text-white"
                : "bg-white border"
              }`}
            >
              Credentials
            </button>
          </div>

          {/* ================= OVERVIEW ================= */}
          {activeTab === "overview" && (
          <>
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
              <InfoRow
                label="Emergency Contact"
                value={parent.emergencyContact}
              />
              </Section>

              <Section title="Address Details">
              <div>
                <div className="font-medium text-gray-500 mb-1">
                  Permanent Address
                </div>
                <div>
                  {parent.permanentAddress.line1},{" "}
                  {parent.permanentAddress.line2},{" "}
                  {parent.permanentAddress.city},{" "}
                  {parent.permanentAddress.state} -{" "}
                    {parent.permanentAddress.pincode}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-500 mb-1">
                  Current Address
                </div>
                <div>
                    {parent.currentAddress.line1}, {parent.currentAddress.line2},{" "}
                    {parent.currentAddress.city}, {parent.currentAddress.state} -{" "}
                    {parent.currentAddress.pincode}
                </div>
                </div>
              </Section>
          </>
          )}

          {/* ================= CHILDREN ================= */}
          {activeTab === "children" && (
            <Section title="Children Details">
              {parent.childDetails.map((child, index) => (
              <div
                key={index}
                className="flex justify-between border-b border-gray-200 py-1 last:border-b-0"
              >
                <div>
                  <div className="font-medium text-gray-700">
                    {child.name} — Class {child.class} ({child.section})
                  </div>
                  <div className="text-xs text-gray-500">
                    Roll No: {child.rollNo} | Attendance: {child.attendance} |
                    Fee Status: {child.feeStatus}
                  </div>
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
              <div className="font-medium text-gray-500 mb-1">Password</div>
                <div className="flex items-center gap-2">
                <span className="font-mono">
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
            <div className="text-xs text-gray-500 mt-2">
                (Note: Passwords are shown here only for demo purpose)
              </div>
            </Section>
          )}
      </div>
    </div>
  );
}
