import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const dropdownRef = useRef(null);
  const parentsPerPage = 10;
  const navigate = useNavigate();

  // Fetch parents from backend for shivam 
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/parents");
        setParents(res.data);
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
        const res = await axios.post("http://localhost:5000/api/parents/import", data);
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
      linkedStudentId: form.studentId.value,
      role: form.role.value,
      status: "Active",
      password: form.password.value || "default123",
    };

    try {
      const res = await axios.post("http://localhost:5000/api/parents", newParent);
      setParents([res.data, ...parents]);
      setShowForm(false);
      setSuccessMsg("Parent added successfully ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error adding parent:", err);
    }
  };

  //  Delete Parent for backend points
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/parents/${id}`);
      setParents(parents.filter((p) => p.parentInfo.parentId !== id));
      setSuccessMsg("Parent deleted ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error deleting parent:", err);
    }
  };
  const filteredParents = parents.filter((p) =>
    (
      (p.parentInfo?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.parentInfo?.parentId?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.parentInfo?.linkedStudentId?.toLowerCase() || "").includes(search.toLowerCase())
    ) &&
    (filterRole ? p.parentInfo?.role === filterRole : true)
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
          className={`${activeTab === "all" ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        > All Parents
        </button>
        <button
          onClick={() => setActiveTab("login")}
          className={`${activeTab === "login" ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          Manage Login
        </button>
        <button
          onClick={() => setActiveTab("others")}
          className={`${activeTab === "others" ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          Reports & Permissions
        </button>
      </div> {activeTab === "all" && (
        <div className="bg-white shadow rounded-lg p-6">  <div className="flex items-end mb-6 w-full">
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
                    onClick={() => { setShowForm(true); setShowOptions(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    ➕ Add Manually
                  </button>
                  <label className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    📂 Import Excel
                    <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              )}
            </div>
          </div> <h3 className="text-lg font-semibold mb-3">Parent List</h3>
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
                <tr key={p.parentInfo.parentId} className="text-center hover:bg-gray-50">
                  <td className="p-2 border">{indexOfFirst + idx + 1}</td>
                  <td className="p-2 border">{p.parentInfo.parentId}</td>
                  <td className="p-2 border flex items-center space-x-2 justify-center">
                    <span className="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full">
                      {p.parentInfo.name[0]}
                    </span>
                    <span>{p.parentInfo.name}</span>
                  </td>
                  <td className="p-2 border">{p.parentInfo.email}</td>
                  <td className="p-2 border">{p.parentInfo.phone}</td>
                  <td className="p-2 border">{p.parentInfo.linkedStudentId}</td>
                  <td className="p-2 border">{p.parentInfo.role}</td>
                  <td className="p-2 border">{p.parentInfo.status}</td>
                  <td className="p-2 border">
                    <button
                      className="text-blue-500"
                      onClick={() => setSelectedParent(p)}
                    >
                      🔍
                    </button>
                    <button
                      className="text-red-500 ml-2"
                      onClick={() => handleDelete(p.parentInfo.parentId)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
            <p>Page {currentPage} of {totalPages}</p>
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
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Add Parent Manually</h3>
            <form onSubmit={handleAddManually} className="space-y-3">
              <input name="parentId" placeholder="Parent ID" className="border px-3 py-2 w-full rounded" required />
              <input name="name" placeholder="Name" className="border px-3 py-2 w-full rounded" required />
              <input name="email" placeholder="Email" className="border px-3 py-2 w-full rounded" />
              <input name="phone" placeholder="Phone" className="border px-3 py-2 w-full rounded" />
              <input name="studentId" placeholder="Linked Student ID" className="border px-3 py-2 w-full rounded" required />
              <select name="role" className="border px-3 py-2 w-full rounded">
                <option value="Primary Guardian">Primary Guardian</option>
                <option value="Secondary Guardian">Secondary Guardian</option>
              </select>
              <input name="password" placeholder="Password" className="border px-3 py-2 w-full rounded" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
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
                <h2 className="text-xl font-semibold">{selectedParent.parentInfo.name}</h2>
                <button
                  onClick={() =>
                    navigate(`/parent-profile/${selectedParent.parentInfo.parentId}`, {
                      state: { ...selectedParent.parentInfo, activity: selectedParent.activity },
                    })
                  }
                  className="text-sm bg-yellow-500 text-white px-8 py-1 rounded"
                >
                  View Full Profile
                </button>
              </div>
              <p className="text-sm text-gray-500">Parent ID : {selectedParent.parentInfo.parentId}</p>
            </div>
            <button className="p-1 rounded hover:bg-gray-100 text-gray-500" onClick={() => setSelectedParent(null)}>
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="p-4 space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">General Information</h3>
              <p>Email : {selectedParent.parentInfo.email}</p>
              <p>Phone : {selectedParent.parentInfo.phone}</p>
              <p>Linked Student ID : {selectedParent.parentInfo.linkedStudentId}</p>
              <p>Role : {selectedParent.parentInfo.role}</p>
              <p>Status : {selectedParent.parentInfo.status}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Account</h3>
              <p>Password : {selectedParent.parentInfo.password}</p>
              <p>Last Login : {selectedParent.activity}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Permissions</h3>
              <p>Can View Grades : {getFieldValue("Grades")}</p>
              <p>Can View Attendance : {getFieldValue("Attendance")}</p>
              <p>Can View Fees : {getFieldValue("Fees")}</p>
              <p>Can View Timetable : {getFieldValue("Timetable")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Reports</h3>
              <p>Feedback Given : {getFieldValue("Feedback")}</p>
              <p>Requests Submitted : {getFieldValue("Requests")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
