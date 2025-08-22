import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Student() {
  const [activeTab, setActiveTab] = useState("all");
  const [students, setStudents] = useState([
    { id: 1, studentId: "001", name: "Student 1", roll: "1001", cls: "Grade 10", section: "A", attendance: "95%", fee: "Paid" },
    { id: 2, studentId: "002", name: "Student 2", roll: "1002", cls: "Grade 10", section: "B", attendance: "98%", fee: "Paid" },
    { id: 3, studentId: "003", name: "Student 3", roll: "1003", cls: "Grade 10", section: "C", attendance: "92%", fee: "Paid" },
    { id: 4, studentId: "004", name: "Student 4", roll: "1004", cls: "Grade 10", section: "D", attendance: "97%", fee: "Due" },
  ]);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null); // sidebar state

  const dropdownRef = useRef(null);
  const studentsPerPage = 10;
  const navigate = useNavigate();

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
        id: students.length + idx + 1,
        studentId: row["Student ID"] || `IMP${idx + 1}`,
        name: row["Name"] || "Unnamed",
        roll: row["Roll"] || "-",
        cls: row["Class"] || "-",
        section: row["Section"] || "-",
        attendance: row["Attendance"] || "-",
        fee: row["Fee"] || "Due",
      }));
      setStudents((prev) => [...imported, ...prev]);
      setSuccessMsg("Students imported successfully ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
    };
    reader.readAsBinaryString(file);
  };

  const handleAddManually = (e) => {
    e.preventDefault();
    const form = e.target;
    const newStudent = {
      id: students.length + 1,
      studentId: form.studentId.value,
      name: form.name.value,
      roll: form.roll.value,
      cls: form.cls.value,
      section: form.section.value,
      attendance: form.attendance.value,
      fee: form.fee.value,
    };
    setStudents([newStudent, ...students]);
    setShowForm(false);
    setSuccessMsg("Student added successfully ✅");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase()) ||
        s.cls.toLowerCase().includes(search.toLowerCase())) &&
      (filterClass ? s.cls === filterClass : true)
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
      <div className="text-gray-500 text-sm mb-2">Student &gt;</div>
      <h2 className="text-2xl font-bold mb-2">Student</h2>

      {/* Tabs */}
      <div className="flex space-x-4 text-sm mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`${activeTab === "all" ? "text-blue-600 font-semibold" : "text-gray-500"}`}
        >
          All Student
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
          Others
        </button>
      </div>

      {activeTab === "all" && (
        <div className="bg-white shadow rounded-lg p-6">
          {/* Search + Filter + Add */}
          <div className="flex items-end mb-6 w-full">
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
            <div className="flex flex-col w-1/3 mr-4">
              <label className="text-sm font-medium mb-1">Filter by Grade</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="">All Grades</option>
                {[
                  "Nursery","KG","Grade 1","Grade 2","Grade 3","Grade 4",
                  "Grade 5","Grade 6","Grade 7","Grade 8","Grade 9",
                  "Grade 10","Grade 11","Grade 12"
                ].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
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
                    ➕ Add Manually
                  </button>
                  <label className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    📂 Import Excel
                    <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              )}
            </div>
          </div>

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
                  <td className="p-2 border">{s.studentId}</td>
                  <td className="p-2 border flex items-center space-x-2 justify-center">
                    <span className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full">
                      {s.name[0]}
                    </span>
                    <span>{s.name}</span>
                  </td>
                  <td className="p-2 border">ID: {s.roll}</td>
                  <td className="p-2 border">{s.cls}</td>
                  <td className="p-2 border">{s.section}</td>
                  <td className="p-2 border">{s.attendance}</td>
                  <td className="p-2 border">
                    {s.fee === "Paid" ? (
                      <span className="text-green-600 font-semibold">● Paid</span>
                    ) : (
                      <span className="text-red-600 font-semibold">● Due</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <button className="text-blue-500" onClick={() => setSelectedStudent(s)}>🔍</button>
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
                <h2 className="text-xl font-semibold">{selectedStudent.name || 'N/A'}</h2>
                <button
  onClick={() =>
    navigate("/student-profile", {
      state: {
        // Map fields from Student.js to what StudentProfile expects
        id: selectedStudent.studentId,
        name: selectedStudent.name,
        grade: selectedStudent.cls,
        section: selectedStudent.section,
        gender: selectedStudent.gender,
        dob: getFieldValue("Date of Birth"),
        age: getFieldValue("Age"),
        address: selectedStudent.address,
        fee: selectedStudent.fee,
        attendance: selectedStudent.attendance,
        fatherName: selectedStudent["Father Name"],
        motherName: selectedStudent["Mother Name"],
        photo: selectedStudent.photo || "https://via.placeholder.com/80",
        
      },
    })
  }
  className="text-sm bg-yellow-500 text-white px-8 py-1 rounded"
>
  View Full Profile
</button>

              </div>
              <p className="text-sm text-gray-500">Student ID : {selectedStudent.studentId || 'N/A'}</p>
            </div>
            <button className="p-1 rounded hover:bg-gray-100 text-gray-500" onClick={() => setSelectedStudent(null)}>
              <FiX className="text-xl" />
            </button>
          </div>

          <div className="p-4 space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">General Information</h3>
              <p>Gender : {getFieldValue('Gender')}</p>
              <p>Blood Group : {getFieldValue('Blood Group')}</p>
              <p>Address : {selectedStudent.address || 'N/A'}</p>
              <p>Date of Birth : {getFieldValue('Date of Birth')}</p>
              <p>Age : {getFieldValue('Age')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Academic Information</h3>
              <p>Class : {selectedStudent.cls || 'N/A'}</p>
              <p>Section : {selectedStudent.section || 'N/A'}</p>
              <p>House : {getFieldValue('House')}</p>
              <p>Academic Year : {getFieldValue('Academic Year')}</p>
              <p>Admission Type : {getFieldValue('Admission Type')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Parent / Guardian Info</h3>
              <p>Father : {getFieldValue('Father')}</p>
              <p>Mother : {getFieldValue('Mother')}</p>
              <p>Emergency Contact : {getFieldValue('Emergency Contact')}</p>
              <p>Contact : {getFieldValue('Contact')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Attendance Information</h3>
              <p>Present Days : {getFieldValue('Present Days')}</p>
              <p>Attendance % : {selectedStudent.attendance || 'N/A'}</p>
              <p>Last Present : {getFieldValue('Last Present')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Fee Summary</h3>
              <p>Total Fee : {getFieldValue('Total Fee')}</p>
              <p>Paid : {getFieldValue('Paid')}</p>
              <p>Due : {getFieldValue('Due')}</p>
              <p>Last Payment : {getFieldValue('Last Payment')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Other Info</h3>
              {getRemainingFields().length > 0 ? (
                getRemainingFields().map((f, i) => (
                  <p key={i}>{f.label} : {f.value || 'N/A'}</p>
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
