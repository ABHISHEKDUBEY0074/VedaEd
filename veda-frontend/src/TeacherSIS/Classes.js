// src/TeacherSIS/Classes.js
import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiFolder, FiKey, FiSearch, FiTrash2, FiEdit3 } from "react-icons/fi";
import axios from "axios";


const DUMMY_STUDENTS = [
  {
    id: 1,
    personalInfo: {
      stdId: "C001",
      name: "Rohan Sharma",
      rollNo: "12",
      class: "Grade 5",
      section: "A",
      password: "pass123",
      fees: "Paid",
    },
    attendance: "92%",
    address: "Delhi, India",
    photo: "https://via.placeholder.com/80",
  },
  {
    id: 2,
    personalInfo: {
      stdId: "C002",
      name: "Rohit Verma",        
      rollNo: "15",
      class: "Grade 5",
      section: "B",
      password: "pass456",
      fees: "Due",
    },
    attendance: "88%",
    address: "Mumbai, India",
    photo: "https://via.placeholder.com/80",
  },
];

export default function Classes() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);
  const studentsPerPage = 10;
  const navigate = useNavigate();

  // Fetch students from backend API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:5000/api/students");

        console.log("Fetched students:", res.data);

        if (res.data.success && Array.isArray(res.data.students)) {
          // Normalize student data for table
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
            attendance: s.attendance || "N/A",
            photo: s.photo || "https://via.placeholder.com/80",
            address: s.address || "",
          }));

          setStudents(normalized);
        } else {
          console.error("❌ Unexpected response format:", res.data);
          setError("Failed to load students data");
        }
      } catch (err) {
        console.error("❌ Error fetching students:", err.response?.data || err.message);
        setError("Failed to fetch students from server");
        // Fallback to dummy data if API fails
        setStudents(DUMMY_STUDENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch classes from backend API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/classes");
        console.log("Fetched classes:", res.data);
        
        if (res.data.success && Array.isArray(res.data.data)) {
          setClasses(res.data.data);
        } else if (res.data.success && Array.isArray(res.data.classes)) {
          setClasses(res.data.classes);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        // Keep empty array if API fails
        setClasses([]);
      }
    };

    fetchClasses();
  }, []);

  // Fetch sections from backend API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/sections");
        console.log("Fetched sections:", res.data);
        
        if (res.data.success && Array.isArray(res.data.data)) {
          setSections(res.data.data);
        } else if (res.data.success && Array.isArray(res.data.sections)) {
          setSections(res.data.sections);
        }
      } catch (err) {
        console.error("Error fetching sections:", err);
        // Keep empty array if API fails
        setSections([]);
      }
    };

    fetchSections();
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Import Excel
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
        id: students.length + idx + 1,
        personalInfo: {
          name: row["Name"] || "Unnamed",
          class: row["Class"] || "-",
          stdId: row["Student ID"] || `IMP${idx + 1}`,
          rollNo: row["Roll"] || "-",
          section: row["Section"] || "-",
          password: row["Password"] || "default123",
          fees: row["Fee"] || "Due",
        },
        attendance: row["Attendance"] || "-",
        address: row["Address"] || "-",
        photo: "https://via.placeholder.com/80",
      }));
      setStudents((prev) => [...imported, ...prev]);
      setSuccessMsg("Students imported successfully ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
    };
    reader.readAsBinaryString(file);
  };

  // Add manually
  const handleAddManually = async (e) => {
    e.preventDefault();
    const form = e.target;

    const studentData = {
      personalInfo: {
        name: form.name.value,
        class: form.cls.value,
        stdId: form.studentId.value,
        rollNo: form.roll.value,
        section: form.section.value,
        password: form.password.value || "default123",
        fees: form.fee.value,
        DOB: form.dob.value || "",
        gender: form.gender.value || "",
        age: form.age.value || "",
        address: form.address.value || "",
        bloodGroup: form.bloodGroup.value || "",
        contactDetails: {
          mobileNumber: form.contact.value || "",
          email: form.email.value || ""
        }
      },
      attendance: form.attendance.value || "N/A",
      photo: "https://via.placeholder.com/80",
    };

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/students", studentData);
      
      if (response.data.success) {
        // Add the new student to the list
        const newStudent = {
          id: response.data.student._id,
          _id: response.data.student._id,
          personalInfo: {
            name: response.data.student.personalInfo.name,
            class: response.data.student.personalInfo.class,
            stdId: response.data.student.personalInfo.stdId,
            rollNo: response.data.student.personalInfo.rollNo,
            section: response.data.student.personalInfo.section,
            password: response.data.student.personalInfo.password,
            fees: response.data.student.personalInfo.fees,
          },
          attendance: studentData.attendance,
          photo: studentData.photo,
          address: studentData.personalInfo.address,
        };

        setStudents([newStudent, ...students]);
        setShowForm(false);
        setSuccessMsg("Student added successfully ✅");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error adding student:", err.response?.data || err.message);
      setError("Failed to add student");
      setSuccessMsg("Failed to add student ❌");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Filters
  const filteredStudents = students.filter((s) =>
    (
      (s.personalInfo?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.personalInfo?.stdId?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.personalInfo?.class?.toLowerCase() || "").includes(search.toLowerCase())
    ) &&
    (filterClass ? s.personalInfo?.class === filterClass : true) &&
    (filterSection ? s.personalInfo?.section === filterSection : true)
  );

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const getFieldValue = (field) => "N/A";
  const getRemainingFields = () => [];

  return (
    <div className="p-6">
      {successMsg && (
        <div className="mb-4 text-green-600 font-semibold">{successMsg}</div>
      )}
      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}
      <div className="text-gray-500 text-sm mb-2">Teacher &gt; Classes</div>
      <h2 className="text-2xl font-bold mb-4">Classes</h2>

      {/* Search + Filters + Add */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col w-60">
          <label className="text-sm font-medium mb-1">Search Student</label>
          <input
            type="text"
            placeholder="Enter name, ID, or class"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        <div className="flex flex-col w-40">
          <label className="text-sm font-medium mb-1">Filter by Grade</label>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">All</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls.name}>{cls.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-32">
          <label className="text-sm font-medium mb-1">Filter Section</label>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">All</option>
            {sections.map((section) => (
              <option key={section._id} value={section.name}>{section.name}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto relative" ref={dropdownRef}>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-6"
          >
            Add Student
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
              <button
  onClick={() => { setShowForm(true); setShowOptions(false); }}
  className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
>
  <FiPlus className="mr-2" /> Add Manually
</button>
              <label className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
  <FiFolder className="mr-2" /> Import Excel
  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} className="hidden" />
</label>
            </div>
          )}
        </div>
      </div>

      {/* Student Table */}
      <h3 className="text-lg font-semibold mb-3">Student List</h3>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading students...</div>
        </div>
      ) : (
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
                <td className="p-2 border flex items-center space-x-2 justify-center">
                  <span className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full">
                    {s.personalInfo.name[0]}
                  </span>
                  <span>{s.personalInfo.name}</span>
                </td>
                <td className="p-2 border">{s.personalInfo.rollNo}</td>
                <td className="p-2 border">{s.personalInfo.class}</td>
                <td className="p-2 border">{s.personalInfo.section}</td>
                <td className="p-2 border">{s.attendance}</td>
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
                  >
                    🔍
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
              <input name="dob" type="date" placeholder="Date of Birth" className="border px-3 py-2 w-full rounded" />
              <input name="gender" placeholder="Gender" className="border px-3 py-2 w-full rounded" />
              <input name="age" placeholder="Age" className="border px-3 py-2 w-full rounded" />
              <input name="bloodGroup" placeholder="Blood Group" className="border px-3 py-2 w-full rounded" />
              <input name="contact" placeholder="Contact Number" className="border px-3 py-2 w-full rounded" />
              <input name="email" placeholder="Email" className="border px-3 py-2 w-full rounded" />
              <input name="attendance" placeholder="Attendance (e.g. 95%)" className="border px-3 py-2 w-full rounded" />
              <input name="address" placeholder="Address" className="border px-3 py-2 w-full rounded" />
              <select name="fee" className="border px-3 py-2 w-full rounded">
                <option value="Paid">Paid</option>
                <option value="Due">Due</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
                  {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*  Sidebar */}
      {selectedStudent && (
        <div className="fixed top-0 right-0 h-full w-[380px] bg-white border-l shadow-xl z-50 overflow-y-auto">
          <div className="flex justify-between items-start p-4 border-b">
            <div>
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">{selectedStudent.personalInfo.name}</h2>
                <button
                  onClick={() =>
                    navigate("/teacher/student-profile", {
                      state: {
                        id: selectedStudent.personalInfo.stdId,
                        name: selectedStudent.personalInfo.name,
                        grade: selectedStudent.personalInfo.class,
                        section: selectedStudent.personalInfo.section,
                        rollNo: selectedStudent.personalInfo.rollNo,
                        fee: selectedStudent.personalInfo.fees,
                        attendance: selectedStudent.attendance,
                        password: selectedStudent.personalInfo.password,
                        photo: selectedStudent.photo,
                        gender: getFieldValue("Gender"),
                        dob: getFieldValue("Date of Birth"),
                        age: getFieldValue("Age"),
                        address: selectedStudent.address,
                        fatherName: getFieldValue("Father"),
                        motherName: getFieldValue("Mother"),
                        contact: getFieldValue("Contact"),
                      },
                    })
                  }
                  className="text-sm bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  View Full Profile
                </button>
              </div>
              <p className="text-sm text-gray-500">Student ID : {selectedStudent.personalInfo.stdId}</p>
            </div>
            <button
              className="p-1 rounded hover:bg-gray-100 text-gray-500"
              onClick={() => setSelectedStudent(null)}
            >
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="p-4 space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">General Information</h3>
              <p>Gender : {getFieldValue("Gender")}</p>
              <p>Blood Group : {getFieldValue("Blood Group")}</p>
              <p>Address : {selectedStudent.address}</p>
              <p>Date of Birth : {getFieldValue("Date of Birth")}</p>
              <p>Age : {getFieldValue("Age")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Academic Information</h3>
              <p>Class : {selectedStudent.personalInfo.class}</p>
              <p>Section : {selectedStudent.personalInfo.section}</p>
              <p>House : {getFieldValue("House")}</p>
              <p>Academic Year : {getFieldValue("Academic Year")}</p>
              <p>Admission Type : {getFieldValue("Admission Type")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Parent / Guardian Info</h3>
              <p>Father : {getFieldValue("Father")}</p>
              <p>Mother : {getFieldValue("Mother")}</p>
              <p>Emergency Contact : {getFieldValue("Emergency Contact")}</p>
              <p>Contact : {getFieldValue("Contact")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Attendance Information</h3>
              <p>Present Days : {getFieldValue("Present Days")}</p>
              <p>Attendance % : {selectedStudent.attendance}</p>
              <p>Last Present : {getFieldValue("Last Present")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Fee Summary</h3>
              <p>Total Fee : {getFieldValue("Total Fee")}</p>
              <p>Paid : {selectedStudent.personalInfo.fees === "Paid" ? "Yes" : "No"}</p>
              <p>Due : {selectedStudent.personalInfo.fees === "Due" ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
