import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  FiPlus, FiUpload, FiSearch, FiTrash2 } from "react-icons/fi";


export default function Parents() {
  const [activeTab, setActiveTab] = useState("all");
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParent, setSelectedParent] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);

  const dropdownRef = useRef(null);
  const parentsPerPage = 10;
  const navigate = useNavigate();

  // Fetch parents from backend for shivam
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/parents");
        console.log("Fetched parents data:", JSON.stringify(res.data, null, 2));
        setParents(res.data.parents);
      } catch (err) {
        console.error("Error fetching parents:", err);
      }
    };
    fetchParents();
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

  //Import Excel send to backend  for shivam
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/parents/import",
          data
        );
        setParents(res.data);
        setSuccessMsg("Parents imported successfully ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch (err) {
        console.error("Error importing parents:", err);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Add Parent Manually send to backend shivam bro ke liye
  const handleAddManually = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newParent = {
      parentId: form.parentId.value,
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      linkedStudentId: [form.studentId.value], // ✅ fix: send array
      role: form.role.value,
      status: "Active",
      password: form.password.value || "default123",
    };

    try {
      console.log("Sending parent data to backend:", JSON.stringify(newParent, null, 2));
      const res = await axios.post(
        "http://localhost:5000/api/parents",
        newParent
      );
      console.log("Backend response:", JSON.stringify(res.data, null, 2));
      setParents([res.data.parent, ...parents]); // changed-----------------------
      setShowForm(false);
      setSuccessMsg("Parent added successfully ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error adding parent:", err);
      setSuccessMsg("Failed to add parent ❌");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };
  // const handleAddManually = async (e) => {
  //   e.preventDefault();
  //   const form = e.target;

  //   const newParent = {
  //     parentId: form.parentId.value,
  //     name: form.name.value,
  //     email: form.email.value,
  //     phone: form.phone.value,
  //     linkedStudentId: [form.studentId.value], // ✅ backend expects array
  //     role: form.role.value,
  //     status: "Active",
  //     password: form.password.value || "default123",
  //   };

  //   try {
  //     const res = await axios.post("http://localhost:5000/api/parents", newParent);

  //     if (res.data.success) {
  //       // ✅ extract the parent object
  //       const createdParent = res.data.parent;

  //       // optional: normalize children so UI is easier
  //       const normalizedParent = {
  //         id: createdParent._id,
  //         parentId: createdParent.parentId,
  //         name: createdParent.name,
  //         email: createdParent.email,
  //         phone: createdParent.phone,
  //         status: createdParent.status,
  //         children: createdParent.children?.map((c) => ({
  //           id: c._id,
  //           name: c.personalInfo?.name,
  //           class: c.personalInfo?.class,
  //           section: c.personalInfo?.section,
  //           rollNo: c.personalInfo?.rollNo,
  //           fees: c.personalInfo?.fees,
  //         })) || [],
  //       };

  //       // ✅ push only the parent into state
  //       setParents((prev) => [normalizedParent, ...prev]);

  //       setShowForm(false);
  //       setSuccessMsg(res.data.message || "Parent added successfully ✅");
  //       setTimeout(() => setSuccessMsg(""), 3000);
  //     } else {
  //       setSuccessMsg("❌ Failed to add parent");
  //       setTimeout(() => setSuccessMsg(""), 3000);
  //     }
  //   } catch (err) {
  //     console.error("Error adding parent:", err);
  //     setSuccessMsg("❌ Error adding parent");
  //     setTimeout(() => setSuccessMsg(""), 3000);
  //   }
  // };

  //  Delete Parent for backend points
  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this parent?")) {
        await axios.delete(`http://localhost:5000/api/parents/${id}`);
        setParents(parents.filter((p) => p._id !== id));
        setSuccessMsg("Parent deleted ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting parent:", err);
    }
  };

  // Update Parent Password function
  const handleUpdatePassword = async (id, newPassword) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/parents/${id}`, {
        password: newPassword
      });
      if (res.data.success) {
        setParents(parents.map(p => p._id === id ? { ...p, password: newPassword } : p));
        setSuccessMsg("Password updated successfully ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setSuccessMsg("Failed to update password ❌");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const filteredParents = parents.filter(
    (p) =>
      ((p.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (p.parentId?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (p.children?.map(c => c.personalInfo?.stdId || c.stdId).join(", ")?.toLowerCase() || "").includes(
          search.toLowerCase()
        )) &&
      (filterRole ? p.role === filterRole : true)
  );

  const indexOfLast = currentPage * parentsPerPage;
  const indexOfFirst = indexOfLast - parentsPerPage;
  const currentParents = filteredParents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredParents.length / parentsPerPage);

  const getFieldValue = (field) => "N/A";
  const getRemainingFields = () => [];

  return (
    <div className="p-6">
      {successMsg && (
        <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>
      )}
      <div className="text-gray-500 text-sm mb-2">Parents &gt;</div>
      <h2 className="text-2xl font-bold mb-2">Parents</h2>
      <div className="flex space-x-4 text-sm mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`${
            activeTab === "all"
              ? "text-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          {" "}
          All Parents
        </button>
        <button
          onClick={() => setActiveTab("login")}
          className={`${
            activeTab === "login"
              ? "text-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Manage Login
        </button>
        <button
          onClick={() => setActiveTab("others")}
          className={`${
            activeTab === "others"
              ? "text-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Reports & Permissions
        </button>
      </div>{" "}
      {activeTab === "all" && (
        <div className="bg-white shadow rounded-lg p-6">
          {" "}
          <div className="flex items-end mb-6 w-full">
            <div className="flex flex-col w-1/3 mr-4">
              <label className="text-sm font-medium mb-1">Search Parent</label>
              <input
                type="text"
                placeholder="Enter name, Parent ID, or Student ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              />
            </div>
            <div className="flex flex-col w-1/3 mr-4">
              <label className="text-sm font-medium mb-1">Filter by Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="">All Roles</option>
                <option>Primary Guardian</option>
                <option>Secondary Guardian</option>
              </select>
            </div>
            <div className="ml-auto relative" ref={dropdownRef}>
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add Parent
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
                  <button
  onClick={() => {
    setShowForm(true);
    setShowOptions(false);
  }}
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
          </div>{" "}
          <h3 className="text-lg font-semibold mb-3">Parent List</h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">S. no.</th>
                <th className="p-2 border">Parent ID</th>
                <th className="p-2 border">Parent Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Linked Student ID</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
  {currentParents.map((p, idx) => (
    <tr
      key={p._id || idx} // ✅ use Mongo _id as key
      className="text-center hover:bg-gray-50"
    >
      <td className="p-2 border">{indexOfFirst + idx + 1}</td>
      <td className="p-2 border">{p.parentId}</td>
      <td className="p-2 border text-left">
  <div className="flex items-center gap-2 ">
        <span className="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full">
          {p.name ? p.name[0] : "?"}
        </span>
        <span>{p.name}</span></div>
      </td>
      <td className="p-2 border">{p.email}</td>
      <td className="p-2 border">{p.phone}</td>
      <td className="p-2 border">
        {p.children?.length > 0 ? p.children.map((c) => c.stdId || c.personalInfo?.stdId).filter(Boolean).join(", ") : "N/A"}
      </td>
      <td className="p-2 border">Parent</td>
      <td className="p-2 border">{p.status}</td>
      <td className="p-2 border">
  <button
    className="text-blue-500"
    onClick={() => setSelectedParent(p)}
    title="View"
  >
    <FiSearch />
  </button>
  <button
    className="text-red-500 ml-2"
    onClick={() => handleDelete(p._id)}
    title="Delete"
  >
    <FiTrash2 />
  </button>
</td>
    </tr>
  ))}
</tbody>

          </table>
          <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <div className="space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Management Tab */}
      {activeTab === "login" && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Manage Parent Login</h3>
          </div>
          
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, parent ID, or email..."
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
                  <th className="text-left p-3 border-b font-medium text-gray-700">Parent ID</th>
                  <th className="text-left p-3 border-b font-medium text-gray-700">Name</th>
                  <th className="text-left p-3 border-b font-medium text-gray-700">Email</th>
                  <th className="text-left p-3 border-b font-medium text-gray-700">Username</th>
                  <th className="text-left p-3 border-b font-medium text-gray-700">Password</th>
                  <th className="text-left p-3 border-b font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parents.slice(0, 5).map((p, idx) => (
                  <tr key={p._id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-b text-sm">{p.parentId || "N/A"}</td>
                    <td className="p-3 border-b text-sm font-medium">{p.name || "N/A"}</td>
                    <td className="p-3 border-b text-sm text-gray-600">{p.email || "N/A"}</td>
                    <td className="p-3 border-b text-sm text-gray-600">{p.parentId || "N/A"}</td>
                    <td className="p-3 border-b text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">••••••••</span>
                        <button 
                          className="text-blue-500 hover:text-blue-700 text-xs"
                          onClick={() => {
                            setEditingPassword(p);
                            setShowPasswordModal(true);
                          }}
                        >
                          Show
                        </button>
                      </div>
                    </td>
                    <td className="p-3 border-b text-sm">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors">
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
            <p>Showing 1-5 of {parents.length} parents</p>
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
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Add Parent Manually</h3>
            <form onSubmit={handleAddManually} className="space-y-3">
              <input
                name="parentId"
                placeholder="Parent ID"
                className="border px-3 py-2 w-full rounded"
                required
              />
              <input
                name="name"
                placeholder="Name"
                className="border px-3 py-2 w-full rounded"
                required
              />
              <input
                name="email"
                placeholder="Email"
                className="border px-3 py-2 w-full rounded"
              />
              <input
                name="phone"
                placeholder="Phone"
                className="border px-3 py-2 w-full rounded"
              />
              <input
                name="studentId"
                placeholder="Linked Student ID"
                className="border px-3 py-2 w-full rounded"
                required
              />
              <select name="role" className="border px-3 py-2 w-full rounded">
                <option value="Primary Guardian">Primary Guardian</option>
                <option value="Secondary Guardian">Secondary Guardian</option>
              </select>
              <input
                name="password"
                placeholder="Password"
                className="border px-3 py-2 w-full rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedParent && (
        <div className="fixed top-0 right-0 h-full w-[380px] bg-white border-l shadow-xl z-50 overflow-y-auto">
          <div className="flex justify-between items-start p-4 border-b">
            <div className="flex-3">
              <div className="flex items-center gap-7">
                <h2 className="text-xl font-semibold">{selectedParent.name}</h2>
                <button
                  onClick={() =>
                    navigate(`/parent-profile/${selectedParent._id}`, {
                      state: selectedParent,
                    })
                  }
                  className="text-sm bg-yellow-500 text-white px-8 py-1 rounded"
                >
                  View Full Profile
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Parent ID : {selectedParent.parentId}
              </p>
            </div>
            <button
              className="p-1 rounded hover:bg-gray-100 text-gray-500"
              onClick={() => setSelectedParent(null)}
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="p-4 space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                General Information
              </h3>
              <p>Email : {selectedParent.email}</p>
              <p>Phone : {selectedParent.phone}</p>
              <p>
                Children :{" "}
                {selectedParent.children
                  ?.map((c) => c.stdId || c.personalInfo?.stdId)
                  .join(", ")}
              </p>
              <p>Status : {selectedParent.status}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Account</h3>
              <p>Password : {selectedParent.password}</p>
              <p>
                Created At :{" "}
                {new Date(selectedParent.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Password Update Modal */}
      {showPasswordModal && editingPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Update Password for {editingPassword.name}</h3>
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
                  value={editingPassword.password} 
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
    </div>
  );
}
