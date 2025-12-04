import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  FiPlus, FiUpload, FiSearch, FiTrash2, FiEdit } from "react-icons/fi";
import HelpInfo from "../components/HelpInfo";



export default function Student() {
  const [activeTab, setActiveTab] = useState("all");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null); 

  const dropdownRef = useRef(null);
  const studentsPerPage = 10;
  const navigate = useNavigate();

  // 🔹 Fetch students and classes from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/students");

        console.log("Fetched students:", res.data);

        if (res.data.success && Array.isArray(res.data.students)) {
          // ✅ normalize student data for table
          const normalized = res.data.students.map((s, idx) => ({
            id: s._id || idx + 1,
            _id: s._id, // Keep the original MongoDB _id
            personalInfo: {
              name: s.personalInfo?.name || "Unnamed",
              class: s.personalInfo?.class || "-",
              stdId: s.personalInfo?.stdId || `STD${idx + 1}`,
              rollNo: s.personalInfo?.rollNo || "-",
              section: s.personalInfo?.section || "-",
              password: s.personalInfo?.password || "default123",
              fees: s.personalInfo?.fees || "Due",
            },
            photo: s.photo || "https://via.placeholder.com/80",
            address: s.address || "",
          }));

          setStudents(normalized);
        } else {
          console.error("❌ Unexpected response format:", res.data);
        }
      } catch (err) {
        console.error("❌ Error fetching students:", err.response?.data || err.message);
      }
    };

    const fetchClasses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/classes");
        if (res.data.success && Array.isArray(res.data.data)) {
          setClasses(res.data.data);
        }
      } catch (err) {
        console.error("❌ Error fetching classes:", err.response?.data || err.message);
      }
    };

    fetchStudents();
    fetchClasses();
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

  // const handleImport = async(e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = (evt) => {
  //     const bstr = evt.target.result;
  //     const workbook = XLSX.read(bstr, { type: "binary" });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const data = XLSX.utils.sheet_to_json(worksheet);
  //     const imported = data.map((row, idx) => ({
  //       id: students.length + idx + 1,
  //       personalInfo: {
  //         name: row["Name"] || "Unnamed",
  //         class: row["Class"] || "-",
  //         stdId: row["Student ID"] || `IMP${idx + 1}`,
  //         rollNo: row["Roll"] || "-",
  //         section: row["Section"] || "-",
  //         password: row["Password"] || "default123",
  //         fees: row["Fee"] || "Due"
  //       },
  //       attendance: row["Attendance"] || "-"
  //     }));
  //     setStudents((prev) => [...imported, ...prev]);
  //     setSuccessMsg("Students imported successfully ✅");
  //     setTimeout(() => setSuccessMsg(""), 3000);
  //   };
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5000/api/students/import",
  //       { students: imported }
  //     );

  //     if (res.data.success) {
  //       setStudents((prev) => [...imported, ...prev]);
  //       setSuccessMsg("Students imported successfully ✅");
  //       setTimeout(() => setSuccessMsg(""), 3000);
  //     } else {
  //       alert("Import failed ❌: " + res.data.message);
  //     }
  //   } catch (err) {
  //     console.error("Error importing:", err);
  //     alert("Error connecting to server ❌");
  //   }
  //   reader.readAsBinaryString(file);
  // };

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

    const imported = data.map((row, idx) => ({
      id: students.length + idx + 1,
      personalInfo: {
        name: row["Name"] || "Unnamed",
        class: row["Class"] || "-",
        stdId: row["Student ID"] || `IMP${idx + 1}`,
        rollNo: row["Roll"] || "-",
        section: row["Section"] || "-",
        password: row["Password"] || "default123",
        fees: row["Fee"] || "Due"
      },
      attendance: row["Attendance"] || "-"
    }));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/students/import",
        { students: imported }
      );

      if (res.data.success) {
        setStudents((prev) => [...imported, ...prev]);
        setSuccessMsg("Students imported successfully ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert("Import failed ❌: " + res.data.message);
      }
    } catch (err) {
      console.error("Error importing:", err);
      alert("Error connecting to server ❌");
    }
  };

  reader.readAsBinaryString(file);
};

const handleAddManually = async (e) => {
  e.preventDefault();
  const form = e.target;

  const newStudent = {
    personalInfo: {
      name: form.name.value,
      class: form.cls.value,
      stdId: form.studentId.value,
      rollNo: form.roll.value,
      section: form.section.value,
      password: form.password.value || "default123",
      fees: form.fee.value,
    }
  };

  try {
    // ✅ send student to backend
    const res = await axios.post("http://localhost:5000/api/students", newStudent);

    // ✅ backend responds with created student
    const createdStudent = res.data.student;

    // ✅ update local state with new student from DB (not raw form)
    setStudents([createdStudent, ...students]);

    setShowForm(false);
    setSuccessMsg("Student added successfully ✅");
    setTimeout(() => setSuccessMsg(""), 3000);
  } catch (err) {
    console.error("❌ Error creating student:", err.response?.data || err.message);
    setSuccessMsg("Failed to add student ❌"); 
    setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  // Update Student Password function
  const handleUpdatePassword = async (id, newPassword) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/students/${id}`, {
        personalInfo: {
          password: newPassword
        }
      });
      if (res.data.success) {
        setStudents(students.map(s => 
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

  // Delete Student function
const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/students/${id}`);
    setStudents(students.filter((s) => s._id !== id));
    setSuccessMsg("Student deleted ✅");
    setTimeout(() => setSuccessMsg(""), 3000);
  } catch (err) {
    console.error("Error deleting student:", err);
  }
};

  // 🔹 FIX: search & filter using personalInfo
  const filteredStudents = students.filter((s) =>
    (
      (s.personalInfo?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.personalInfo?.stdId?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.personalInfo?.class?.toLowerCase() || "").includes(search.toLowerCase())
    ) &&
    (filterClass ? s.personalInfo?.class === filterClass : true)
  );                    

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const getFieldValue = (field) => "N/A";
  const getRemainingFields = () => [];

  return (
   <div className="p-6 bg-gray-100 min-h-screen ">
      {successMsg && (
        <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>
      )}
     <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
  <button
    onClick={() => setActiveTab("all")}
    className="hover:underline"
  >
    Students
  </button>
  <span>&gt;</span>
  <span>
    {activeTab === "all" && "All Students"}
    {activeTab === "login" && "Manage Login"}
    {activeTab === "others" && "Others"}
  </span>
</div>

{/* HEADING + HELP ICON */}
<div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold">Students</h2>

  <HelpInfo
    title="Students Page Help"
      description={`2.1 All Students Tab

View and manage complete list of all enrolled students.
Display student information including name, student ID, class, section, roll number, photo, and status.
Search and filter students by class, section, or name.
Access quick actions like view profile, edit details, or delete student records.
Import students from Excel files or add new students manually.
Export student data for reporting purposes.

Sections:
- Search and Filter Bar: Search students by name, ID, or class. Filter by class, section, or status.
- Student Table: Comprehensive table showing student details with sorting and pagination.
- Action Buttons: Add new student, import from Excel, export data.
- Student Cards/List: Visual representation of students with photos and key information.


2.2 Manage Login Tab

Manage student login credentials and account access.
View login information including usernames, passwords, and account status.
Reset passwords, activate or deactivate accounts, and manage login permissions.
Search and filter students by login status (active/inactive).
Generate login credentials for new students or bulk reset passwords.

Sections:
- Login Credentials Table: Displays student ID, name, username, password status, and account status.
- Search and Filter: Find students by name, ID, or login status.
- Password Management: Reset individual or bulk passwords.
- Account Status Management: Activate, deactivate, or suspend accounts.
- Security Settings: Configure password policies and access controls.


2.3 Others Tab

Additional student management tools and utilities.
Access reports, generate ID cards, manage categories, and perform bulk operations.
View student statistics and export/import data.

Sections:
- Reports & Analytics: Generate reports, attendance summaries, and performance analytics.
- Bulk Operations: Perform bulk updates, transfers, or status changes.
- ID Card Generation: Create and print student ID cards.
- Student Categories: Manage groups and classifications.
- Export & Import Tools: Advanced export options and import templates.
`}
    steps={[
      "Use Search to find students",
      "Filter by class using dropdown",
      "Click Add Student to register new student",
      "Use action buttons for profile, attendance and fees"
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
    All Student
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
{activeTab === "all" && (
  <div className="bg-gray-200 p-6 shadow-sm border border-gray-200">
    <div className="bg-white p-6 rounded-lg shadow-sm">

      <h2 className="text-xl font-semibold mb-3">All Students Page</h2>

      {/* SEARCH + FILTER + ADD BUTTON */}
      <div className="flex items-end mb-6 w-full">

        {/* SEARCH */}
        <div className="flex flex-col w-1/3 mr-4">
          <label className="text-sm font-medium mb-1">Search Student</label>
          <input
            type="text"
            placeholder="Enter name, ID, or class"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        {/* FILTER */}
        <div className="flex flex-col w-1/3 mr-4">
          <label className="text-sm font-medium mb-1">Filter by Class</label>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* ⭐ ADD STUDENT RIGHT SIDE ⭐ */}
        <div className="ml-auto relative" ref={dropdownRef}>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Student
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
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

      </div> {/* ⭐ yahan close hona chahiye */}


      {/* Table Starts Here... */}

          {/* Student Table */}
          <h3 className="text-lg font-semibold mb-3">Student List</h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">S. no.</th>
                <th className="p-2 border">Student ID</th>
                <th className="p-2 border">Student Name</th>
                <th className="p-2 border">Roll num</th>
                <th className="p-2 border">Class</th>
                <th className="p-2 border">Section</th>
                <th className="p-2 border">Attendance</th>
                <th className="p-2 border">Fees</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
  {currentStudents.map((s, idx) => (
  <tr key={s.id} className="text-center hover:bg-gray-50">
    <td className="p-2 border">{indexOfFirst + idx + 1}</td>
    <td className="p-2 border">{s.personalInfo.stdId}</td>
  <td className="p-2 border text-left">
  <div className="flex items-center gap-2 ">
      <span className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full">
        {s.personalInfo.name[0]}
      </span>
      <span>{s.personalInfo.name}</span></div>
    </td>
    <td className="p-2 border">{s.personalInfo.rollNo}</td> 
    <td className="p-2 border">{s.personalInfo.class}</td>
    <td className="p-2 border">{s.personalInfo.section}</td>
    <td className="p-2 border">{s.attendance || "-"}</td>
    <td className="p-2 border">
      {s.personalInfo.fees === "Paid" ? (
        <span className="text-green-600 font-semibold">● Paid</span>
      ) : (
        <span className="text-red-600 font-semibold">● Due</span>
      )}
      </td>
      <td className="p-2 border">
       <button
  className="text-blue-500"
  onClick={() => setSelectedStudent(s)}
  title="View"
>
  <FiSearch />
</button>
<button
  className="text-red-500 ml-2"
  onClick={() => {
    if (window.confirm("Are you sure you want to delete this student?")) {
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
</tbody>

          </table>

          {/* Pagination */}
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
         </div>
          
      )}

      {/* Login Management Tab */}
      {activeTab === "login" && (
         <div className="bg-gray-200 p-6  shadow-sm border border-gray-200">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Manage Student Login</h3>
          </div>
          
          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, student ID, or class..."
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
          <h3 className="text-lg font-semibold mb-3">Login Credentials</h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">S. no.</th>
                <th className="p-2 border">Student ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Class</th>
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Password</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map((s, idx) => (
                <tr key={s.id || idx} className="text-center hover:bg-gray-50">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{s.personalInfo?.stdId || "N/A"}</td>
                  <td className="p-2 border text-left">{s.personalInfo?.name || "N/A"}</td>
                  <td className="p-2 border">{s.personalInfo?.class || "N/A"}</td>
                  <td className="p-2 border">{s.personalInfo?.username || s.personalInfo?.stdId || "N/A"}</td>
                  <td className="p-2 border">
                    <div className="flex items-center justify-center gap-2">
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
                  <td className="p-2 border">
                    <button 
                      className="text-blue-500"
                      onClick={() => {
                        setEditingPassword(s);
                        setShowPasswordModal(true);
                      }}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className="text-red-500 ml-2"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this login?")) {
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
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
            <p>Page 1 of {Math.ceil(students.length / 5) || 1}</p>
            <div className="space-x-2">
              <button
                disabled={true}
                onClick={() => {}}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={students.length <= 5}
                onClick={() => {}}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        
</div>
      )}

      {/* Add Manually Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Add Student Manually</h3>
            <form onSubmit={handleAddManually} className="space-y-3">
              <input name="studentId" placeholder="Student ID" className="border px-3 py-2 w-full rounded" required />
              <input name="name" placeholder="Name" className="border px-3 py-2 w-full rounded" required />
              <input name="roll" placeholder="Roll Number" className="border px-3 py-2 w-full rounded" required />
              <input name="cls" placeholder="Class" className="border px-3 py-2 w-full rounded" required />
              <input name="section" placeholder="Section" className="border px-3 py-2 w-full rounded" required />
              <input name="password" placeholder="Password" className="border px-3 py-2 w-full rounded" required />
              <input name="attendance" placeholder="Attendance (e.g. 95%)" className="border px-3 py-2 w-full rounded" />
              <select name="fee" className="border px-3 py-2 w-full rounded">
                <option value="Paid">Paid</option>
                <option value="Due">Due</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
{selectedStudent && (
  <div className="fixed top-0 right-0 h-full w-[380px] bg-white border-l shadow-xl z-50 overflow-y-auto">
    <div className="flex justify-between items-start p-4 border-b">
      <div className="flex-3">
        <div className="flex items-center gap-7">
          <h2 className="text-xl font-semibold">
            {selectedStudent.personalInfo?.name || "N/A"}
          </h2>

          <button
            onClick={() => {
              console.log("Selected student:", selectedStudent);
              console.log("Student _id:", selectedStudent._id);
              navigate(`/student-profile/${selectedStudent._id}`)
            }}
            className="text-sm bg-yellow-500 text-white px-8 py-1 rounded"
          >
            View Full Profile
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Student ID : {selectedStudent.personalInfo?.stdId || "N/A"}
        </p>
      </div>

      <button
        className="p-1 rounded hover:bg-gray-100 text-gray-500"
        onClick={() => setSelectedStudent(null)}
      >
        <FiX className="text-xl" />
      </button>
    </div>

    <div className="p-4 space-y-6 text-sm">
      {/* General Info */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">General Information</h3>
        <p>Gender : {getFieldValue("Gender")}</p>
        <p>Blood Group : {getFieldValue("Blood Group")}</p>
        <p>Address : {selectedStudent.address || "N/A"}</p>
        <p>Date of Birth : {getFieldValue("Date of Birth")}</p>
        <p>Age : {getFieldValue("Age")}</p>
      </div>

      {/* Academic Info */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Academic Information</h3>
        <p>Class : {selectedStudent.personalInfo?.class || "N/A"}</p>
        <p>Section : {selectedStudent.personalInfo?.section || "N/A"}</p>
        <p>House : {getFieldValue("House")}</p>
        <p>Academic Year : {getFieldValue("Academic Year")}</p>
        <p>Admission Type : {getFieldValue("Admission Type")}</p>
      </div>

      {/* Parent / Guardian */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Parent / Guardian Info</h3>
        <p>Father : {getFieldValue("Father")}</p>
        <p>Mother : {getFieldValue("Mother")}</p>
        <p>Emergency Contact : {getFieldValue("Emergency Contact")}</p>
        <p>Contact : {getFieldValue("Contact")}</p>
      </div>

      {/* Attendance */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Attendance Information</h3>
        <p>Present Days : {getFieldValue("Present Days")}</p>
        <p>Attendance % : {selectedStudent.attendance || "N/A"}</p>
        <p>Last Present : {getFieldValue("Last Present")}</p>
      </div>

      {/* Fees */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Fee Summary</h3>
        <p>Total Fee : {getFieldValue("Total Fee")}</p>
        <p>Paid : {getFieldValue("Paid")}</p>
        <p>Due : {getFieldValue("Due")}</p>
        <p>Last Payment : {getFieldValue("Last Payment")}</p>
      </div>

      {/* Other Info */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Other Info</h3>
        {getRemainingFields().length > 0 ? (
          getRemainingFields().map((f, i) => (
            <p key={i}>
              {f.label} : {f.value || "N/A"}
            </p>
          ))
        ) : (
          <p className="text-gray-500 italic">No extra data</p>
        )}
      </div>
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

    </div>
  );
}


