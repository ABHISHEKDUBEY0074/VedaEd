import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SupportStaffDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        No Staff Data Found
      </div>
    );
  }

  const previewFile = (file) => {
    if (!file) return null;
    return URL.createObjectURL(file);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Staff Details</h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-6">

        {/* Photo Section */}
        <div className="flex flex-col items-center mb-6">
          {state.photo ? (
            <img
              src={previewFile(state.photo)}
              alt="Staff"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-500 shadow"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              No Photo
            </div>
          )}
          <h2 className="mt-4 text-xl font-semibold">
            {state.fullName}
          </h2>
          <p className="text-gray-500">{state.designation}</p>
          <span className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
            {state.status || "Active"}
          </span>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
          <div>
            <p><strong>Staff ID:</strong> {state.staffId}</p>
            <p><strong>Gender:</strong> {state.gender}</p>
            <p><strong>Date of Birth:</strong> {state.dob}</p>
            <p><strong>Blood Group:</strong> {state.bloodGroup}</p>
          </div>

          <div>
            <p><strong>Phone:</strong> {state.phone}</p>
            <p><strong>Emergency Contact:</strong> {state.emergencyContact}</p>
            <p><strong>Aadhaar:</strong> {state.aadhaar}</p>
          </div>
        </div>

        {/* Employment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6">
          <div>
            <p><strong>Department:</strong> {state.department}</p>
            <p><strong>Designation:</strong> {state.designation}</p>
            <p><strong>Profession:</strong> {state.profession}</p>
          </div>

          <div>
            <p><strong>Salary:</strong> ₹ {state.salary}</p>
            <p><strong>Joining Date:</strong> {state.joiningDate}</p>
            <p><strong>Status:</strong> {state.status}</p>
          </div>
        </div>

        {/* Address */}
        <div className="border-t pt-6 mt-6">
          <p><strong>Permanent Address:</strong></p>
          <p className="text-gray-600 mb-4">{state.permanentAddress}</p>

          <p><strong>Current Address:</strong></p>
          <p className="text-gray-600">{state.currentAddress}</p>
        </div>

        {/* Documents Section */}
        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Documents</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Aadhaar Preview */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-medium mb-2">Aadhaar Copy</p>
              {state.aadhaarDoc ? (
                <>
                  <a
                    href={previewFile(state.aadhaarDoc)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline block mb-2"
                  >
                    Preview
                  </a>
                  <a
                    href={previewFile(state.aadhaarDoc)}
                    download
                    className="text-green-600 underline"
                  >
                    Download
                  </a>
                </>
              ) : (
                <p className="text-gray-500">Not Uploaded</p>
              )}
            </div>

            {/* Other Docs */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-medium mb-2">Other Documents</p>
              {state.otherDocs ? (
                <>
                  <a
                    href={previewFile(state.otherDocs)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline block mb-2"
                  >
                    Preview
                  </a>
                  <a
                    href={previewFile(state.otherDocs)}
                    download
                    className="text-green-600 underline"
                  >
                    Download
                  </a>
                </>
              ) : (
                <p className="text-gray-500">Not Uploaded</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportStaffDetails;
