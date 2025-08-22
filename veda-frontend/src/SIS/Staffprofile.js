import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Row = ({ label, value, editable, onChange }) => (
  <div className="flex justify-between border-b py-2 text-sm items-center">
    <span className="font-medium text-gray-700 w-1/2">{label} :</span>
    <span className="w-1/2 text-gray-800">
      {editable ? (
        <input
          className="w-full border p-1 rounded"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        value || "N/A"
      )}
    </span>
  </div>
);

const StaffProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state || {};
  const [activeTab, setActiveTab] = useState("Profile");
  const [editMode, setEditMode] = useState(false);
  const [staffData, setStaffData] = useState({ ...initialData });

  const handleChange = (key, value) => {
    setStaffData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setEditMode(false);
  };

  const handleCancel = () => {
    setStaffData({ ...initialData });
    setEditMode(false);
  };

  const tabs = [
    "Profile",
    "Documents",
    "Attendance",
    "Performance",
    "Fees",
    "Transport",
    "Hostel",
    "Future Item",
  ];

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500 mb-2">
        <span
          className="hover:underline cursor-pointer text-blue-600"
          onClick={() => navigate("/staff")}
        >
          Staff
        </span>
        <span className="mx-2"> &gt; </span>
        <span className="text-gray-700 font-medium">Profile</span>
      </div>

      <h1 className="text-2xl font-bold mb-4">Staff</h1>

      {/* Profile Header */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow">
        <div className="flex items-center gap-4">
          <img
            src={staffData.photo || "https://via.placeholder.com/80"}
            alt="staff"
            className="w-20 h-20 object-cover rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">{staffData.name}</h2>
            <p className="text-gray-600">Staff ID: {staffData.id}</p>
            <p className="text-gray-600">Role: {staffData.role}</p>
          </div>
        </div>
        {!editMode ? (
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b mb-4 text-sm font-medium text-gray-500 overflow-x-auto flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 ${
              activeTab === tab ? "border-b-2 border-black text-black" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Personal Information
            </h3>
            <Row
              label="Full Name"
              value={staffData.name}
              editable={editMode}
              onChange={(val) => handleChange("name", val)}
            />
            <Row
              label="Gender"
              value={staffData.gender}
              editable={editMode}
              onChange={(val) => handleChange("gender", val)}
            />
            <Row
              label="Date of Birth"
              value={staffData.dob}
              editable={editMode}
              onChange={(val) => handleChange("dob", val)}
            />
            <Row
              label="Age"
              value={staffData.age}
              editable={editMode}
              onChange={(val) => handleChange("age", val)}
            />
            <Row
              label="Address"
              value={staffData.address}
              editable={editMode}
              onChange={(val) => handleChange("address", val)}
            />
            <Row
              label="Contact Number"
              value={staffData.contact}
              editable={editMode}
              onChange={(val) => handleChange("contact", val)}
            />
            <Row
              label="Email"
              value={staffData.email}
              editable={editMode}
              onChange={(val) => handleChange("email", val)}
            />
          </div>

          {/* Right Column */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Job Information
            </h3>
            <Row label="Staff ID" value={staffData.id} />
            <Row
              label="Role"
              value={staffData.role}
              editable={editMode}
              onChange={(val) => handleChange("role", val)}
            />
            <Row
              label="Qualification"
              value={staffData.qualification}
              editable={editMode}
              onChange={(val) => handleChange("qualification", val)}
            />
            <Row
              label="Experience"
              value={staffData.experience}
              editable={editMode}
              onChange={(val) => handleChange("experience", val)}
            />
            <Row
              label="Joining Date"
              value={staffData.joiningDate}
              editable={editMode}
              onChange={(val) => handleChange("joiningDate", val)}
            />
            <Row
              label="Department"
              value={staffData.department}
              editable={editMode}
              onChange={(val) => handleChange("department", val)}
            />
          </div>
        </div>
      )}


      {activeTab !== "Profile" && (
        <div className="bg-white p-6 rounded shadow text-gray-500">
          <p>{activeTab} content coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default StaffProfile;