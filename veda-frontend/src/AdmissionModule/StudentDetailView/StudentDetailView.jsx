import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiBookOpen,
  FiArrowLeft,
} from "react-icons/fi";

const Section = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2">
      {icon} {title}
    </h3>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

const StudentDetailView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="p-6">
        <p className="text-red-500">No student data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    personalInfo,
    contactInfo,
    earlierAcademic,
    parents,
    emergencyContact,
    transportRequired,
    medicalConditions,
    specialNeeds,
  } = state;

  return (
    <div className="p-0 m-0 min-h-screen">

      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-blue-600 hover:underline"
      >
        <FiArrowLeft /> Back
      </button>

      {/* Personal Info */}
      <Section title="Personal Information" icon={<FiUser />}>
        <div className="grid grid-cols-2 gap-6">
          <Row label="Full Name" value={personalInfo?.name} />
          <Row label="Date of Birth" value={personalInfo?.dateOfBirth} />
          <Row label="Gender" value={personalInfo?.gender} />
          <Row label="Blood Group" value={personalInfo?.bloodGroup} />
          <Row label="Nationality" value={personalInfo?.nationality} />
          <Row label="Religion" value={personalInfo?.religion} />
          <Row label="Fees Status" value={personalInfo?.fees} />
        </div>
      </Section>

      {/* Contact Info */}
      <Section title="Contact Information" icon={<FiPhone />}>
        <div className="grid grid-cols-2 gap-6">
          <Row label="Email" value={contactInfo?.email} />
          <Row label="Phone" value={contactInfo?.phone} />
          <Row label="Alternate Phone" value={contactInfo?.alternatePhone} />
          <Row label="Address" value={contactInfo?.address} />
        </div>
      </Section>

      {/* Earlier Academic */}
      <Section title="Earlier Academic Information" icon={<FiBookOpen />}>
        <div className="grid grid-cols-2 gap-6">
          <Row label="Previous School" value={earlierAcademic?.schoolName} />
          <Row label="Board" value={earlierAcademic?.board} />
          <Row label="Last Class Studied" value={earlierAcademic?.lastClass} />
          <Row label="Academic Year" value={earlierAcademic?.academicYear} />
        </div>
      </Section>

      {/* Parents */}
      <Section title="Father Information" icon={<FiUser />}>
        <div className="grid grid-cols-2 gap-6">
          <Row label="Name" value={parents?.father?.name} />
          <Row label="Occupation" value={parents?.father?.occupation} />
          <Row label="Phone" value={parents?.father?.phone} />
          <Row label="Email" value={parents?.father?.email} />
        </div>
      </Section>

      <Section title="Mother Information" icon={<FiUser />}>
        <div className="grid grid-cols-2 gap-6">
          <Row label="Name" value={parents?.mother?.name} />
          <Row label="Occupation" value={parents?.mother?.occupation} />
          <Row label="Phone" value={parents?.mother?.phone} />
          <Row label="Email" value={parents?.mother?.email} />
        </div>
      </Section>

      <Section title="Guardian Information" icon={<FiUser />}>
        <div className="grid grid-cols-2 gap-6">
          <Row label="Name" value={parents?.guardian?.name} />
          <Row label="Relation" value={parents?.guardian?.relation} />
          <Row label="Phone" value={parents?.guardian?.phone} />
          <Row label="Email" value={parents?.guardian?.email} />
        </div>
      </Section>

      {/* Emergency */}
      <Section title="Emergency Contact" icon={<FiPhone />}>
        <div className="grid grid-cols-2 gap-6">
          <Row label="Name" value={emergencyContact?.name} />
          <Row label="Relation" value={emergencyContact?.relation} />
          <Row label="Phone" value={emergencyContact?.phone} />
        </div>
      </Section>

      {/* Additional */}
      <Section title="Additional Information" icon={<FiBookOpen />}>
        <div className="grid grid-cols-2 gap-6">
          <Row label="Transport Required" value={transportRequired} />
          <Row label="Medical Conditions" value={medicalConditions} />
          <Row label="Special Needs" value={specialNeeds} />
        </div>
      </Section>

    </div>
  );
};

export default StudentDetailView;