import React, { useState } from "react";
import { FiSearch, FiSave } from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";   

export default function StaffAttendance() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [globalAttendance, setGlobalAttendance] = useState("");

  const roles = [
    "Admin",
    "Teacher",
    "Accountant",
    "Librarian",
    "Receptionist",
    "Super Admin",
  ];

  const staffData = [
    { id: 9002, name: "Shivam Verma", role: "Teacher" },
    { id: 90006, name: "Jason Sharlton", role: "Teacher" },
    { id: 54545454, name: "Albert Thomas", role: "Teacher" },
  ];

  const handleSearch = () => {
    if (selectedRole && attendanceDate) {
      const filtered = staffData.filter((s) => s.role === selectedRole);
      setStaffList(filtered);
    } else {
      alert("Please select both Role and Date");
    }
  };

  const handleAttendanceChange = (id, status) => {
    setStaffList((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, attendance: status } : staff
      )
    );
  };

  const handleGlobalAttendance = (status) => {
    setGlobalAttendance(status);
    setStaffList((prev) =>
      prev.map((staff) => ({ ...staff, attendance: status }))
    );
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="bg-gray-200 p-6 shadow-sm border border-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-sm">
             
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Select Criteria
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">Select</option>
                      {roles.map((r, i) => (
                        <option key={i} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Attendance Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <button
                      onClick={handleSearch}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <FiSearch /> Search
                    </button>
                  </div>
                </div>
              </div>

              {/* --- Staff List --- */}
              {staffList.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Staff List
                    </h3>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      <FiSave /> Save Attendance
                    </button>
                  </div>

                  {/* Global Attendance */}
                  <div className="mb-4 border-b pb-3 text-sm">
                    <span className="font-medium mr-3 text-gray-700">
                      Set attendance for all Staff as
                    </span>
                    {[
                      "Present",
                      "Late",
                      "Absent",
                      "Half Day",
                      "Holiday",
                      "Half Day Second Shift",
                    ].map((status) => (
                      <label key={status} className="mr-3">
                        <input
                          type="radio"
                          name="globalAttendance"
                          value={status}
                          checked={globalAttendance === status}
                          onChange={() => handleGlobalAttendance(status)}
                          className="mr-1 accent-blue-600"
                        />
                        {status}
                      </label>
                    ))}
                  </div>

                  {/* Staff Table */}
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full border-collapse text-sm text-left">
                      <thead className="bg-blue-50 text-blue-700">
                        <tr>
                          <th className="p-2 border">#</th>
                          <th className="p-2 border">Staff ID</th>
                          <th className="p-2 border">Name</th>
                          <th className="p-2 border">Role</th>
                          <th className="p-2 border">Attendance</th>
                          <th className="p-2 border">Source</th>
                          <th className="p-2 border">Entry Time</th>
                          <th className="p-2 border">Exit Time</th>
                          <th className="p-2 border">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffList.map((staff, idx) => (
                          <tr
                            key={staff.id}
                            className="border-t hover:bg-gray-50 transition"
                          >
                            <td className="p-2 border">{idx + 1}</td>
                            <td className="p-2 border">{staff.id}</td>
                            <td className="p-2 border font-medium text-gray-800">
                              {staff.name}
                            </td>
                            <td className="p-2 border text-gray-600">
                              {staff.role}
                            </td>
                            <td className="p-2 border">
                              {[
                                "Present",
                                "Late",
                                "Absent",
                                "Half Day",
                                "Holiday",
                                "Half Day Second Shift",
                              ].map((status) => (
                                <label key={status} className="mr-2">
                                  <input
                                    type="radio"
                                    name={`attendance-${staff.id}`}
                                    value={status}
                                    checked={staff.attendance === status}
                                    onChange={() =>
                                      handleAttendanceChange(staff.id, status)
                                    }
                                    className="mr-1 accent-blue-600"
                                  />
                                  {status}
                                </label>
                              ))}
                            </td>
                            <td className="p-2 border text-gray-500">Manual</td>
                            <td className="p-2 border">
                              <input
                                type="time"
                                className="border border-gray-300 rounded p-1 w-full focus:ring-1 focus:ring-blue-400"
                              />
                            </td>
                            <td className="p-2 border">
                              <input
                                type="time"
                                className="border border-gray-300 rounded p-1 w-full focus:ring-1 focus:ring-blue-400"
                              />
                            </td>
                            <td className="p-2 border">
                              <input
                                type="text"
                                placeholder="Note"
                                className="border border-gray-300 rounded p-1 w-full focus:ring-1 focus:ring-blue-400"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button onClick={() => setActiveTab("overview")} className="hover:underline">
          HR
        </button>
        <span>&gt;</span>
        <span>{activeTab === "overview" && "Staff Attendance"}</span>
      </div>

    <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Staff Attendance</h2>
        
          <HelpInfo
            title="Communication Module Help"
            description="This module allows you to manage all Parents records, login access, roles, and other information."
            steps={[
              "Use All Staff tab to view and manage Parents details.",
              "Use Manage Login tab to update login credentials.",
              "Use Others tab for additional Parents-related tools."
            ]}
          />
        </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300">
        {["overview"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-2 ${
              activeTab === tab
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab === "overview" ? "Overview" : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTab()}</div>
    </div>
  );
}
