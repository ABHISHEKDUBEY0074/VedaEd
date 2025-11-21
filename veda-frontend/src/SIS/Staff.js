import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  FiPlus, FiUpload, FiSearch, FiTrash2 } from "react-icons/fi";
import HelpInfo from "../components/HelpInfo";


export default function Staff() {
  const [activeTab, setActiveTab] = useState("all");
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 10;
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const dropdownRef = useRef(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);

  const navigate = useNavigate();

  // 🔹 Fetch staff from API 
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/staff/") 
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.staff)) {
          setStaff(res.data.staff);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      })
      .catch((err) => console.error("Error fetching staff:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const imported = data.map((row, idx) => ({
        id: staff.length + idx + 1,
        personalInfo: {
          staffId: row["Staff ID"] || `IMP${idx + 1}`,
          name: row["Name"] || "Unnamed",
          role: row["Role"] || "-",
          department: row["Department"] || "-",
          assignedClasses: (row["Assigned Classes"] || "").split(",").map(c => c.trim()),
          email: row["Email"] || "-",
          password: row["Password"] || "",
        },
        status: row["Status"] || "Active",
      }));

      setStaff((prev) => [...imported, ...prev]);
      setSuccessMsg("Staff imported successfully ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
    };
    reader.readAsBinaryString(file);
  };

  const handleAddManually = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newStaff = {
      personalInfo: {
        staffId: form.staffId.value,
        name: form.name.value,
        role: form.role.value,
        department: form.department.value,
        assignedClasses: form.assignedClasses.value.split(",").map(c => c.trim()),
        email: form.email.value,
        password: form.password.value,
      },
      status: form.status.value,
      id: staff.length + 1,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/staff/", newStaff);
      if (res.data.success) {
        setStaff([res.data.staff, ...staff]);
        setShowForm(false);
        setSuccessMsg("Staff added successfully ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (error) {
      console.error("Error adding staff:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setSuccessMsg("Failed to add staff ❌");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  // Delete Staff function
  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this staff member?")) {
        await axios.delete(`http://localhost:5000/api/staff/${id}`);
        setStaff(staff.filter((s) => s._id !== id));
        setSuccessMsg("Staff deleted ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting staff:", err);
    }
  };

  // Update Staff Password function
  const handleUpdatePassword = async (id, newPassword) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/staff/${id}`, {
        personalInfo: {
          password: newPassword
        }
      });
      if (res.data.success) {
        setStaff(staff.map(s =>
          s._id === id ? {
            ...s,
            personalInfo: { ...s.personalInfo, password: newPassword }
          } : s
        ));
        setSuccessMsg("Password updated successfully ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setSuccessMsg("Failed to update password ❌");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      (s.personalInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.personalInfo?.staffId?.toLowerCase().includes(search.toLowerCase()) ||
        s.personalInfo?.role?.toLowerCase().includes(search.toLowerCase()) ||
        s.personalInfo?.department?.toLowerCase().includes(search.toLowerCase())) &&
      (filterRole ? s.personalInfo?.role === filterRole : true) &&
      (filterDept ? s.personalInfo?.department === filterDept : true) &&
      (filterStatus ? s.status === filterStatus : true)
  );

  const indexOfLast = currentPage * staffPerPage;
  const indexOfFirst = indexOfLast - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);

  const getFieldValue = (field) => {
    if (!selectedStaff) return "N/A";
    switch (field) {
      case "Address": return selectedStaff.personalInfo?.address || selectedStaff.address || "N/A";
      case "Phone": return selectedStaff.personalInfo?.phone || selectedStaff.phone || "N/A";
      case "Experience": return selectedStaff.personalInfo?.experience || selectedStaff.experience || "N/A";
      case "Qualification": return selectedStaff.personalInfo?.qualification || selectedStaff.qualification || "N/A";
      case "Emergency Contact": return selectedStaff.personalInfo?.emergencyContact || selectedStaff.emergencyContact || "N/A";
      case "Salary": return selectedStaff.personalInfo?.salary || selectedStaff.salary || "N/A";
      case "Last Payment": return selectedStaff.personalInfo?.lastPayment || selectedStaff.lastPayment || "N/A";
      case "Username": return selectedStaff.personalInfo?.username || selectedStaff.username || "N/A";
      case "Password": return selectedStaff.personalInfo?.password || selectedStaff.password || "N/A";
      case "Date of Joining": return selectedStaff.personalInfo?.doj || selectedStaff.doj || selectedStaff.dateOfJoining || "N/A";
      default: return "N/A";
    }
  };

  const getRemainingFields = () => {
    if (!selectedStaff) return [];
    // Return any additional fields that might exist in the staff data
    const extraFields = [];
    Object.keys(selectedStaff).forEach(key => {
      if (!['id', '_id', 'personalInfo', 'status', 'documents', 'performance'].includes(key)) {
        const value = selectedStaff[key];
        // Only include primitive values or arrays that can be safely rendered
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || 
            (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string')) {
          extraFields.push({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: Array.isArray(value) ? value.join(', ') : value
          });
        }
      }
    });
    return extraFields;
  };

  const statusBadge = (status) => {
    if (status === "Active")
      return "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs";
    if (status === "On Leave")
      return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs";
    return "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {successMsg && (
        <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>
      )}
    {/* Breadcrumbs */}
<div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
  <button
    onClick={() => setActiveTab("all")}
    className="hover:underline"
  >
     Staff
  </button>
  <span>&gt;</span>
  <span>
    {activeTab === "all" && "All Staff"}
    {activeTab === "login" && "Manage Login"}
    {activeTab === "others" && "Others"}
  </span>
</div>

<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Staff</h2>

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



      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
  <button
    onClick={() => setActiveTab("all")}
    className={`pb-2 ${
      activeTab === "all"
        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
        : "text-gray-500"
    }`}
  >
    All Staff
  </button>
  <button
    onClick={() => setActiveTab("login")}
    className={`pb-2 ${
      activeTab === "login"
        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
        : "text-gray-500"
    }`}
  >
    Manage Login
  </button>
  <button
    onClick={() => setActiveTab("others")}
    className={`pb-2 ${
      activeTab === "others"
        ? "text-blue-600 font-semibold border-b-2 border-blue-600"
        : "text-gray-500"
    }`}
  >
    Others
  </button>
</div>


      {/* All Staff Tab */}
      {activeTab === "all" && (
          <div className="bg-gray-200 p-6  shadow-sm border border-gray-200">
    <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Search + Filters + Add */}
          <div className="flex items-end mb-6 w-full">
            <div className="flex flex-col w-1/3 mr-4">
              <label className="text-sm font-medium mb-1">Search Staff</label>
              <input
                type="text"
                placeholder="Enter name, ID, role, or department"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="border px-3 py-2 rounded-lg"
              />
            </div>

            <div className="flex flex-col w-1/5 mr-4">
              <label className="text-sm font-medium mb-1">Filter Role</label>
              <select
                value={filterRole}
                onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="">All Roles</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="flex flex-col w-1/5 mr-4">
              <label className="text-sm font-medium mb-1">Filter Department</label>
              <select
                value={filterDept}
                onChange={(e) => { setFilterDept(e.target.value); setCurrentPage(1); }}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="">All Departments</option>
                <option value="Science">Science</option>
                <option value="IT">IT</option>
                <option value="Kindergarten">Kindergarten</option>
              </select>
            </div>

            <div className="flex flex-col w-1/5 mr-4">
              <label className="text-sm font-medium mb-1">Filter Status</label>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div className="ml-auto relative" ref={dropdownRef}>
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add Staff
              </button>
              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <button
  onClick={() => { setShowForm(true); setShowOptions(false); }}
  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
>
  <FiPlus className="inline-block mr-2" /> Add Manually
</button>

<label className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
  <FiUpload className="inline-block mr-2" /> Import Excel
  <input
    type="file"
    accept=".xlsx,.xls,.csv"
    onChange={handleImport}
    className="hidden"
  />
</label>
                </div>
              )}
            </div>
          </div>

          {/* Staff Stats */}
          <div className="text-sm text-gray-500 mb-3">
            Active: {filteredStaff.filter((s) => s.status === "Active").length} | On Leave:{" "}
            {filteredStaff.filter((s) => s.status === "On Leave").length}
          </div>

          {/* Staff Table */}
          <h3 className="text-lg font-semibold mb-3">Staff List</h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">S. no.</th>
                <th className="p-2 border">Staff ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentStaff.map((s, idx) => (
                <tr key={s._id || s.id || idx} className="text-center hover:bg-gray-50">
                  <td className="p-2 border">{indexOfFirst + idx + 1}</td>
                  <td className="p-2 border">{s.personalInfo?.staffId}</td>
                  <td className="p-2 border text-left">
                    <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-indigo-500 text-white flex items-center justify-center rounded-full">
                      {s.personalInfo?.name?.[0] || "S"}
                    </span>
                    <span>{s.personalInfo?.name}</span></div>
                  </td>
                  <td className="p-2 border">{s.personalInfo?.role}</td>
                  <td className="p-2 border">{s.personalInfo?.department}</td>
                  <td className="p-2 border">{s.personalInfo?.email}</td>
                  <td className="p-2 border">
                    <span className={statusBadge(s.status)}>{s.status}</span>
                  </td>
                  <td className="p-2 border">
                    <button
  className="text-blue-500"
  onClick={() => setSelectedStaff(s)}
  title="View"
>
  <FiSearch />
</button>
<button
  className="text-red-500 ml-2"
  onClick={() => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      handleDelete(s._id);
    }
  }}
  title="Delete"
>
  <FiTrash2 />
</button>

                  </td>
                </tr>
              ))}
              {currentStaff.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={9}>
                    No staff found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
            <p>Page {currentPage} of {totalPages || 1}</p>
            <div className="space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Login / Others Tabs */}
      {activeTab === "login" && (
       <div className="bg-gray-200 p-6 shadow-sm border border-gray-200">
    <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Manage Staff Login</h3>
          </div>
          
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, staff ID, or username..."
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Login Credentials Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border-b font-medium text-gray-700">Staff ID</th>
                  <th className="text-left p-3 border-b font-medium text-gray-700">Name</th>
                  <th className="text-left p-3 border-b font-medium text-gray-700">Username</th>
                  <th className="text-left p-3 border-b font-medium text-gray-700">Password</th>
                  <th className="text-left p-3 border-b font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.slice(0, 5).map((s, idx) => (
                  <tr key={s._id || s.id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-b text-sm">{s.personalInfo?.staffId || "N/A"}</td>
                    <td className="p-3 border-b text-sm font-medium">{s.personalInfo?.name || "N/A"}</td>
                    <td className="p-3 border-b text-sm text-gray-600">{s.personalInfo?.username || "N/A"}</td>
                    <td className="p-3 border-b text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">••••••••</span>
                        <button 
                          className="text-blue-500 hover:text-blue-700 text-xs"
                          onClick={() => {
                            setEditingPassword(s);
                            setShowPasswordModal(true);
                          }}
                        >
                          Show
                        </button>
                      </div>
                    </td>
                    <td className="p-3 border-b text-sm">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setEditingPassword(s);
                            setShowPasswordModal(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this staff member?")) {
                              handleDelete(s._id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
            <p>Showing 1-5 of {staff.length} staff members</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
        </div>
      )}
      {activeTab === "others" && (
        <div className="bg-gray-200 p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Others</h3>
          <p className="text-sm text-gray-600">
            Yahan aap future me HR documents, leaves, appraisal ya training records jaisi cheezein rakh sakte ho.
          </p>
        </div>
        </div>
      )}

      {/* Add Staff Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Add Staff Manually</h3>
            <form onSubmit={handleAddManually} className="space-y-3">
              <input name="staffId" placeholder="Staff ID" className="border px-3 py-2 w-full rounded" required />
              <input name="name" placeholder="Full Name" className="border px-3 py-2 w-full rounded" required />
              <select name="role" className="border px-3 py-2 w-full rounded" required>
                <option value="">Select Role</option>
                <option value="Teacher">Teacher</option>
                <option value="Principal">Principal</option>
                <option value="Accountant">Accountant</option>
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
                <option value="Other">Other</option>
              </select>
              <input name="department" placeholder="Department" className="border px-3 py-2 w-full rounded" required />
              <select name="status" className="border px-3 py-2 w-full rounded">
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </select>
              <input name="assignedClasses" placeholder="Assigned Classes (comma-separated)" className="border px-3 py-2 w-full rounded" />
              <input type="email" name="email" placeholder="Contact Email" className="border px-3 py-2 w-full rounded" required />
              <input type="password" name="password" placeholder="Password" className="border px-3 py-2 w-full rounded" required />
              <div className="flex justify-end space-x-2 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
              </div>
            </form>
          </div>
        </div>
        
      )}

      {/* Password Update Modal */}
      {showPasswordModal && editingPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Update Password for {editingPassword.personalInfo?.name}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const newPassword = e.target.password.value;
              if (newPassword) {
                handleUpdatePassword(editingPassword._id, newPassword);
                setShowPasswordModal(false);
                setEditingPassword(null);
              }
            }} className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Current Password:</label>
                <input 
                  type="text" 
                  value={editingPassword.personalInfo?.password || "N/A"} 
                  className="border px-3 py-2 w-full rounded bg-gray-100" 
                  readOnly 
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">New Password:</label>
                <input 
                  name="password"
                  type="text" 
                  placeholder="Enter new password"
                  className="border px-3 py-2 w-full rounded" 
                  required 
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowPasswordModal(false);
                    setEditingPassword(null);
                  }} 
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Sidebar */}
      {selectedStaff && (
        <div className="fixed top-0 right-0 h-full w-[380px] bg-white border-l shadow-xl z-50 overflow-y-auto">
          <div className="flex justify-between items-start p-4 border-b">
            <div className="flex-3">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">{selectedStaff.personalInfo?.name || "N/A"}</h2>
                <button
                  onClick={() =>
                    navigate(`/staff-profile/${selectedStaff._id}`, {
                      state: selectedStaff
                    })
                  }
                  className="text-sm bg-yellow-500 text-white px-4 py-1 rounded"
                >
                  View Full Profile
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Staff ID : {selectedStaff.personalInfo?.staffId || "N/A"}
              </p>
            </div>
            <button
              className="p-1 rounded hover:bg-gray-100 text-gray-500"
              onClick={() => setSelectedStaff(null)}
              aria-label="Close"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="p-4 space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">General Information</h3>
              <p>Role : {selectedStaff.personalInfo?.role || "N/A"}</p>
              <p>Department : {selectedStaff.personalInfo?.department || "N/A"}</p>
              <p>Status : {selectedStaff.status || "N/A"}</p>
              <p>Address : {getFieldValue("Address")}</p>
              <p>Phone : {getFieldValue("Phone")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Academic / Assignment</h3>
              <p>Assigned Classes : {selectedStaff.personalInfo?.assignedClasses?.join(", ") || "N/A"}</p>
              <p>Experience : {getFieldValue("Experience")}</p>
              <p>Qualification : {getFieldValue("Qualification")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Contact</h3>
              <p>Email : {selectedStaff.personalInfo?.email || "N/A"}</p>
              <p>Emergency Contact : {getFieldValue("Emergency Contact")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Payroll</h3>
              <p>Salary : {getFieldValue("Salary")}</p>
              <p>Last Payment : {getFieldValue("Last Payment")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Credentials</h3>
              <p>Username  : {getFieldValue("Username")}</p>
              <p>Password : {getFieldValue("Password")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Other Info</h3>
              {getRemainingFields().length > 0 ? (
                getRemainingFields().map((f, i) => (
                  <p key={i}>{f.label} : {f.value || "N/A"}</p>
                ))
              ) : (
                <p className="text-gray-500 italic">No extra data</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
