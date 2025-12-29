import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  FiPlus, FiUpload, FiSearch, FiTrash2, FiEdit, FiUser, FiDownload, FiChevronDown } from "react-icons/fi";
import HelpInfo from "../components/HelpInfo";


export default function Parents() {
  const [activeTab, setActiveTab] = useState("all");
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loginPage, setLoginPage] = useState(1);
  const [selectedParent, setSelectedParent] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);

  const dropdownRef = useRef(null);
  const bulkActionRef = useRef(null);
  const roleDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
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
      if (bulkActionRef.current && !bulkActionRef.current.contains(e.target)) {
        setShowBulkActions(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setShowRoleDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
        setShowStatusDropdown(false);
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
    <div className="p-0 m-0 min-h-screen">


      {successMsg && (
        <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>
      )}
      {/* Breadcrumbs */}
<div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
  <button
    onClick={() => {
      setActiveTab("all");
      setLoginPage(1);
    }}
    className="hover:underline"
  >
     Parents
  </button>
  <span>&gt;</span>
  <span>
    {activeTab === "all" && "All Parents"}
    {activeTab === "login" && "Manage Login"}
    {activeTab === "others" && "Reports & Permissions"}
  </span>
</div>

<div className="flex justify-between items-center mb-4">

  <h2 className="text-2xl font-bold">Parents</h2>

  <HelpInfo
    title="Parents Module Help"
    description={`Page Description: Manage parent accounts and information. View parent details, contact information, and associated students. Link parents to student records and control portal access.

4.1 All Parents Tab
Description: View and manage the complete directory of all parent accounts. Display information including name, parent ID, email, phone number, linked students, role (father/mother/guardian), and account status. Search and filter parents by name, email, student association, or status. Add new parents manually or import from Excel. Link or unlink students to parent accounts. Manage parent contact information and communication preferences.
Sections:
- Parent Directory Table: Comprehensive list of all parents with key information.
- Search and Filter: Find parents by name, email, phone, or associated student.
- Parent-Student Linking: Manage relationships between parents and students.
- Contact Information: View and update parent contact details.
- Action Buttons: Add parent, import data, export directory, send communications.

4.2 Manage Login Tab
Description: Manage parent login credentials and account access. View parent login information including usernames, passwords, and account status. Reset passwords, activate/deactivate parent accounts, and manage login permissions. Search and filter parents by login status. Generate login credentials for new parents or bulk reset passwords. Configure parent portal access and notification settings.
Sections:
- Login Credentials Table: Display parent ID, name, email, username, password status, and account status.
- Search and Filter: Find parents by name, ID, email, or login status.
- Password Management: Reset individual or bulk passwords; send password reset emails.
- Account Status Management: Activate, deactivate, or suspend parent accounts.
- Portal Access Settings: Configure what information parents can access through their portal.

4.3 Reports & Permissions Tab
Description: Manage parent permissions, access rights, and generate parent-related reports. Configure what information parents can view about their children. Generate reports on parent engagement, communication history, and account usage. Manage parent categories and permissions for different types of access.
Sections:
- Permission Settings: Configure what data parents can access (grades, attendance, fees, etc.).
- Access Reports: View parent login history and portal usage statistics.
- Communication Reports: Track parent engagement with messages and notices.
- Parent Categories: Manage different parent types and their access levels.
- Export Tools: Generate parent directory reports and permission summaries.`}
  />
</div>


      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
        <button
          onClick={() => {
            setActiveTab("all");
            setLoginPage(1);
          }}
          className={`pb-2 ${
            activeTab === "all"
              ? "text-blue-600 font-semibold border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          All Parents
        </button>

        <button
          onClick={() => {
            setActiveTab("login");
            setLoginPage(1);
          }}
          className={`pb-2 ${
            activeTab === "login"
              ? "text-blue-600 font-semibold border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Manage Login
        </button>

        <button
          onClick={() => {
            setActiveTab("others");
            setLoginPage(1);
          }}
          className={`pb-2 ${
            activeTab === "others"
              ? "text-blue-600 font-semibold border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Reports & Permissions
        </button>
      </div>

      {activeTab === "all" && (
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Parent List</h3>
          <div className="flex items-center gap-3 mb-4 w-full">
            <div className="flex items-center border px-3 py-2 rounded-md bg-white w-1/3 min-w-[220px]">
              <FiSearch className="text-gray-500 mr-2 text-sm" />
              <input
                type="text"
                placeholder="Search parent name or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none "
              />
            </div>

            <div className="relative group" ref={roleDropdownRef}>
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="border px-3 py-2 rounded-md  bg-white flex items-center gap-2 w-[120px] justify-between hover:border-blue-500"
              >
                <span>{filterRole || "Role"}</span>
                <FiChevronDown className="text-xs" />
              </button>

              {showRoleDropdown && (
                <div 
                  className="absolute left-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10 text-sm max-h-60 overflow-y-auto"
                >
                  <button
                    onClick={() => {
                      setFilterRole("");
                      setShowRoleDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    All Roles
                  </button>
                  <button
                    onClick={() => {
                      setFilterRole("Primary Guardian");
                      setShowRoleDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Primary Guardian
                  </button>
                  <button
                    onClick={() => {
                      setFilterRole("Secondary Guardian");
                      setShowRoleDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Secondary Guardian
                  </button>
                </div>
              )}
            </div>

            <div className="relative group" ref={bulkActionRef}>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="border px-3 py-2 rounded-md  bg-white flex items-center gap-2 min-w-[120px]  hover:border-blue-500"
              >
                <span>Bulk Action</span>
                <FiChevronDown className="text-xs" />
              </button>

              {showBulkActions && (
                <div 
                  className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-10 text-sm"
                >
                  <button
                    onClick={() => {
                      setShowBulkActions(false);
                      // Add select functionality here
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FiUser className="text-sm" />
                    Select
                  </button>
                  <button
                    onClick={() => {
                      setShowBulkActions(false);
                      // Add export CSV functionality here
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FiDownload className="text-sm" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => {
                      setShowBulkActions(false);
                      // Add delete functionality here
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    <FiTrash2 className="text-sm" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="ml-auto relative" ref={dropdownRef}>
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-1"
              >
                <FiPlus />
                Add Parent
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-10 text-sm">
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
          </div>

          <table className="w-full border">
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
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        
      )}

      {/* Login Management Tab */}
      {activeTab === "login" && (() => {
        const filteredLoginParents = parents.filter(
          (p) =>
            ((p.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
              (p.parentId?.toLowerCase() || "").includes(search.toLowerCase()) ||
              (p.children?.map(c => c.personalInfo?.stdId || c.stdId).join(", ")?.toLowerCase() || "").includes(
                search.toLowerCase()
              ))
        );

        const loginIndexOfLast = loginPage * parentsPerPage;
        const loginIndexOfFirst = loginIndexOfLast - parentsPerPage;
        const currentLoginParents = filteredLoginParents.slice(loginIndexOfFirst, loginIndexOfLast);
        const loginTotalPages = Math.ceil(filteredLoginParents.length / parentsPerPage) || 1;

        return (
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Login Credentials</h3>
          <div className="flex items-center gap-3 mb-4 w-full">
            <div className="flex items-center border px-3 py-2 rounded-md bg-white w-1/3 min-w-[220px]">
              <FiSearch className="text-gray-500 mr-2 text-sm" />
              <input
                type="text"
                placeholder="Search parent name or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none "
              />
            </div>

            <div className="relative group" ref={statusDropdownRef}>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="border px-3 py-2 rounded-md  bg-white flex items-center gap-2 w-[120px] justify-between hover:border-blue-500"
              >
                <span>{filterStatus || "Status"}</span>
                <FiChevronDown className="text-xs" />
              </button>

              {showStatusDropdown && (
                <div 
                  className="absolute left-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10 text-sm max-h-60 overflow-y-auto"
                >
                  <button
                    onClick={() => {
                      setFilterStatus("");
                      setShowStatusDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus("active");
                      setShowStatusDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Active
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus("inactive");
                      setShowStatusDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Inactive
                  </button>
                </div>
              )}
            </div>
          </div>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">S. no.</th>
                <th className="p-2 border">Parent ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Password</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLoginParents.map((p, idx) => (
                <tr
                  key={p._id || idx}
                  className="text-center hover:bg-gray-50"
                >
                  <td className="p-2 border">{loginIndexOfFirst + idx + 1}</td>
                  <td className="p-2 border">
                    {p.parentId || "N/A"}
                  </td>
                  <td className="p-2 border text-left">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full">
                        {p.name ? p.name[0] : "?"}
                      </span>
                      <span>{p.name || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-2 border">
                    {p.email || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {p.parentId || "N/A"}
                  </td>
                  <td className="p-2 border">
                    <div className="flex items-center justify-center gap-2">
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
                  <td className="p-2 border">
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        setEditingPassword(p);
                        setShowPasswordModal(true);
                      }}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-500 ml-2"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this login?"
                          )
                        ) {
                          handleDelete(p._id);
                        }
                      }}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {currentLoginParents.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center text-gray-500 text-sm"
                  >
                    No login data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
            <p>
              Page {loginPage} of {loginTotalPages}
            </p>
            <div className="space-x-2">
              <button
                disabled={loginPage === 1}
                onClick={() => setLoginPage(loginPage - 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={loginPage === loginTotalPages}
                onClick={() => setLoginPage(loginPage + 1)}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        );
      })()}

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
