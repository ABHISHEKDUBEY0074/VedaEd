import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiEye, FiTrash2 } from "react-icons/fi";

const FinalStudentList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [students, setStudents] = useState([
    {
      id: 1,
      studentId: "STD-101",
      name: "Aarav Sharma",
      admittedClass: "Class 5",
      parentName: "Rajesh Sharma",
      phone: "9876543210",
      email: "rajesh@gmail.com",
      feeStatus: "Paid",
    },
    {
      id: 2,
      studentId: "STD-102",
      name: "Diya Verma",
      admittedClass: "Class 3",
      parentName: "Suresh Verma",
      phone: "9876541234",
      email: "suresh@gmail.com",
      feeStatus: "Paid",
    },
  ]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-0 m-0 min-h-screen">
         <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission &gt;</span>
        <span>Final List</span>
      </div>
       <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Final list</h2>
              
            </div>
      
            {/* Tabs */}
            <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
              <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
                Overview
              </button>
            </div>
      <div className="bg-white shadow rounded-xl p-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Final Student List</h2>
        </div>

        {/* Search */}
        <div className="flex items-center mb-4 gap-4">
          <div className="relative w-96">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search student name or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">S.No</th>
                <th className="p-3 border">Student ID</th>
                <th className="p-3 border">Student Name</th>
                <th className="p-3 border">Admitted Class</th>
                <th className="p-3 border">Parent Name</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Fees</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-3 border text-center">
                      {index + 1}
                    </td>

                    <td className="p-3 border text-center">
                      {student.studentId}
                    </td>

                    <td className="p-3 border font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm">
                          {student.name.charAt(0)}
                        </div>
                        {student.name}
                      </div>
                    </td>

                    <td className="p-3 border text-center">
                      {student.admittedClass}
                    </td>

                    <td className="p-3 border text-center">
                      {student.parentName}
                    </td>

                    <td className="p-3 border text-center">
                      {student.phone}
                    </td>

                    <td className="p-3 border text-center">
                      {student.email}
                    </td>

                    <td className="p-3 border text-center">
                      <span className="text-green-600 font-medium">
                        ● {student.feeStatus}
                      </span>
                    </td>

                    <td className="p-3 border">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() =>
                            navigate(`/admission/student/${student.id}`, {
                              state: student,
                            })
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEye size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center p-6 text-gray-500"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default FinalStudentList;