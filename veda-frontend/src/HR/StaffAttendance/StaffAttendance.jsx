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
          <div className="bg-white p-0 rounded-lg ">
            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Select Criteria
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    
                    <select
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      {roles.map((r, i) => (
                        <option key={i} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                   
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
              <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Staff List
                    </h3>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      <FiSave /> Save Attendance
                    </button>
                  </div>

                  {/* Global Attendance */}
                  <div className="mb-4 border-b pb-3 ">
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
                    <table className="w-full border-collapse  text-left">
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>HR</span>
        <span>&gt;</span>
        <span>Staff Attendance</span>
      </div>

      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Staff Attendance</h2>
         <HelpInfo
  title="Staff Attendance"
  description={`5.1 Staff Attendance

This page allows HR to manage, view, and track daily/overall attendance for all staff members.

Sections:

• Staff Filters  
Filter attendance records by Department, Role (Teacher, Admin, Accountant, Driver etc.), and Date.

• Daily Attendance Marking  
HR can mark Present, Absent, Late, Half-Day, or Leave for each staff member.

• Bulk Actions  
Options to mark attendance for all staff at once (Present/Absent/Holiday).

• Attendance Table  
Displays complete list of staff with:
- Staff Name  
- Department / Role  
- Status (Present, Absent, Late, Leave)  
- In Time / Out Time  
- Notes or reasons (optional)

• Attendance Summary  
Shows daily summary:
- Total Staff  
- Present Count  
- Absent Count  
- Late Count  
- Leave Count  

• Monthly View  
HR can switch to Monthly Calendar View to check:
- Monthly attendance status  
- Leave patterns  
- Working days vs. attended days

• Export / Download  
Download attendance in:
- Excel  
- PDF  
- CSV  
for reporting or payroll.

• Attendance History  
Check previous month attendance logs for any staff member.

• Manual Corrections  
HR can edit incorrect entries or update past attendance.

`}
  steps={[
    "Select Department and Role to filter staff.",
    "Choose the date for attendance.",
    "Mark attendance individually or use bulk marking.",
    "Verify attendance status in the table.",
    "Export or save attendance as required.",
            "Use Monthly View to analyze patterns for payroll.",
  ]}
/>
        </div>

      {/* Tabs */}
      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
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
      <div>{renderTab()}</div>
    </div>
  );
}
