import React, { useState } from "react";
import { FiEdit2, FiPlus, FiDownload } from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";
export default function RegistrationFees() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      class: "Class 5",
      admissionFee: 5000,
      tuitionFee: 12000,
      transportFee: 3000,
      term: "First Quarter",
      status: "Paid",
      paymentMode: "Online",
      receiptNo: "R2025-101",
    },
    {
      id: 2,
      name: "Priya Patel",
      class: "Class 8",
      admissionFee: 5000,
      tuitionFee: 15000,
      transportFee: 3500,
      term: "First Quarter",
      status: "Pending",
      paymentMode: "Manual",
      receiptNo: "-",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState("");

  const handleOpenModal = (student = null) => {
    setEditMode(!!student);
    setSelectedStudent(
      student || {
        id: Date.now(),
        name: "",
        class: "",
        admissionFee: "",
        tuitionFee: "",
        transportFee: "",
        term: "",
        paymentMode: "",
        receiptNo: "",
        status: "Pending",
      }
    );
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent({ ...selectedStudent, [name]: value });
  };

  const handleSave = () => {
    if (editMode) {
      setStudents((prev) =>
        prev.map((s) => (s.id === selectedStudent.id ? selectedStudent : s))
      );
    } else {
      setStudents((prev) => [...prev, selectedStudent]);
    }
    setShowModal(false);
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission</span>
        <span>&gt;</span>
        <span>Fees Confirmation</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Registration Fees</h2>
        <HelpInfo
          title="Fees Confirmation Help"
          description={`1.1 Overview

This page allows you to manage and confirm student fee payments, including various fee types and payment statuses.

2.1 Table Columns Description

- Student Name: Name of the student who has made or is due for payment.
- Class: The class or grade of the student.
- Admission Fee: One-time fee paid during admission.
- Tuition Fee: Regular fee for academic tuition.
- Transport Fee: Charges for transportation services if opted.
- Term: The academic term or quarter the fees apply to (e.g., First Quarter).
- Payment Mode: Mode of payment used by the student (e.g., Online, Manual).
- Receipt No.: Receipt number generated for the payment; may be blank if pending.
- Status: Payment status indicating if the fee is 'Paid' or 'Pending'.
- Actions: Options to add new payments, edit or confirm existing payments.

3.1 Usage Tips

Use the search feature to quickly find student fee records. Add new payments as necessary and export payment data in CSV format for reporting or record keeping.`}
        />
      </div>

      <div className="bg-white p-3 rounded-lg shadow-sm border">
        {/* Search + actions row */}
        <div className="flex items-center justify-between mb-4">
          {/* Left: Search box */}
          <input
            type="text"
            placeholder="Search student..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-300 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Right: Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
            >
              <FiPlus className="mr-2" /> Add New Payment
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700">
              <FiDownload className="mr-2" /> Export CSV
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border text-left">Student Name</th>
                <th className="p-3 border text-left">Class</th>
                <th className="p-3 border text-left">Admission Fee</th>
                <th className="p-3 border text-left">Tuition Fee</th>
                <th className="p-3 border text-left">Transport Fee</th>
                <th className="p-3 border text-left">Term</th>
                <th className="p-3 border text-left">Payment Mode</th>
                <th className="p-3 border text-left">Receipt No.</th>
                <th className="p-3 border text-left">Status</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((stu) => (
                  <tr key={stu.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{stu.name}</td>
                    <td className="p-3 border">{stu.class}</td>
                    <td className="p-3 border">₹{stu.admissionFee}</td>
                    <td className="p-3 border">₹{stu.tuitionFee}</td>
                    <td className="p-3 border">₹{stu.transportFee}</td>
                    <td className="p-3 border">{stu.term}</td>
                    <td className="p-3 border">{stu.paymentMode}</td>
                    <td className="p-3 border">{stu.receiptNo}</td>
                    <td
                      className={`p-3 border font-semibold ${
                        stu.status === "Paid"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {stu.status}
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleOpenModal(stu)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center p-4 text-gray-500 border"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                {editMode ? "Edit Payment Details" : "Add New Payment"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={selectedStudent.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Class</label>
                  <input
                    type="text"
                    name="class"
                    value={selectedStudent.class}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Admission Fee
                  </label>
                  <input
                    type="number"
                    name="admissionFee"
                    value={selectedStudent.admissionFee}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Tuition Fee
                  </label>
                  <input
                    type="number"
                    name="tuitionFee"
                    value={selectedStudent.tuitionFee}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Transport Fee
                  </label>
                  <input
                    type="number"
                    name="transportFee"
                    value={selectedStudent.transportFee}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Term</label>
                  <select
                    name="term"
                    value={selectedStudent.term}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="">Select Term</option>
                    <option>First Quarter</option>
                    <option>Second Quarter</option>
                    <option>Third Quarter</option>
                    <option>Annual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Payment Mode
                  </label>
                  <select
                    name="paymentMode"
                    value={selectedStudent.paymentMode}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="">Select Mode</option>
                    <option>Online</option>
                    <option>Manual</option>
                    <option>Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Receipt No.
                  </label>
                  <input
                    type="text"
                    name="receiptNo"
                    value={selectedStudent.receiptNo}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={selectedStudent.status}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    <option>Paid</option>
                    <option>Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
