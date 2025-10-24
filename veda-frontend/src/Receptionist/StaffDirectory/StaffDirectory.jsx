import React, { useState, useEffect } from "react";
import { FiDownload, FiCopy } from "react-icons/fi";
import * as XLSX from "xlsx";

export default function StaffDirectory() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Copy to clipboard function
  const copyToClipboard = async (text, staffId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(staffId);
      setTimeout(() => setCopiedId(null), 2000); // Clear after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Fetch staff data on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        // Direct call to backend API
        const response = await fetch("http://localhost:5000/api/staff", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setStaff(data.staff);
        } else {
          setError("Failed to fetch staff");
        }
      } catch (err) {
        setError("Error fetching staff: " + err.message);
        console.error("Error fetching staff:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Transform staff data to match the expected format
  const transformedStaff = staff.map((staffMember) => ({
    staffId: staffMember.personalInfo.staffId,
    name: staffMember.personalInfo.name,
    role: staffMember.personalInfo.role || "N/A",
    department: staffMember.personalInfo.department || "N/A",
    email: staffMember.personalInfo.email || "N/A",
    mobile: staffMember.personalInfo.mobileNumber || "N/A",
    gender: staffMember.personalInfo.gender || "N/A",
    status: staffMember.status || "N/A",
    joiningDate: staffMember.joiningDate
      ? new Date(staffMember.joiningDate).toLocaleDateString()
      : "N/A",
  }));

  // Get unique roles, departments, and statuses for dropdown options
  const uniqueRoles = [
    ...new Set(transformedStaff.map((s) => s.role).filter((r) => r !== "N/A")),
  ];
  const uniqueDepartments = [
    ...new Set(
      transformedStaff.map((s) => s.department).filter((d) => d !== "N/A")
    ),
  ];
  const uniqueStatuses = [
    ...new Set(
      transformedStaff.map((s) => s.status).filter((s) => s !== "N/A")
    ),
  ];

  const filteredStaff = transformedStaff.filter(
    (s) =>
      (selectedRole ? s.role === selectedRole : true) &&
      (selectedDepartment ? s.department === selectedDepartment : true) &&
      (selectedStatus ? s.status === selectedStatus : true) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStaff);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staff Directory");
    XLSX.writeFile(wb, "StaffDirectory.xlsx");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
          <span>Receptionist &gt;</span>
          <span>Staff Directory</span>
        </div>
        <h2 className="text-2xl font-bold mb-6">Staff Directory</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">
            Loading staff directory...
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
          <span>Receptionist &gt;</span>
          <span>Staff Directory</span>
        </div>
        <h2 className="text-2xl font-bold mb-6">Staff Directory</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Receptionist &gt;</span>
        <span>Staff Directory</span>
      </div>

      {/* Page Title */}
      <h2 className="text-2xl font-bold mb-6">Staff Directory</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      {/* Outer Grey Box */}
      <div className="bg-gray-200 p-6 border border-gray-100 ">
        {/* Inner White Box */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Select Criteria */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Criteria</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  className="border rounded-md px-3 py-2 w-full"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  {uniqueRoles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Department</label>
                <select
                  className="border rounded-md px-3 py-2 w-full"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {uniqueDepartments.map((department, index) => (
                    <option key={index} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  className="border rounded-md px-3 py-2 w-full"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  {uniqueStatuses.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Search</label>
                <input
                  type="text"
                  placeholder="Search by Name, Staff ID, or Email"
                  className="border rounded-md px-3 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table + Export */}
          <div>
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <FiDownload /> Excel
              </button>
            </div>

            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 font-semibold">Staff ID</th>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold">Department</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Mobile</th>
                  <th className="p-3 font-semibold">Gender</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((s, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2 group cursor-pointer">
                          <span
                            className="hover:text-blue-600 transition-colors"
                            onClick={() =>
                              copyToClipboard(s.staffId, s.staffId)
                            }
                            title="Click to copy Staff ID"
                          >
                            {s.staffId}
                          </span>
                          <FiCopy
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-600"
                            size={14}
                            onClick={() =>
                              copyToClipboard(s.staffId, s.staffId)
                            }
                          />
                          {copiedId === s.staffId && (
                            <span className="text-xs text-green-600 font-medium">
                              Copied!
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.role}</td>
                      <td className="p-3">{s.department}</td>
                      <td className="p-3">{s.email}</td>
                      <td className="p-3">{s.mobile}</td>
                      <td className="p-3">{s.gender}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            s.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3">{s.joiningDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-500 py-4">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
