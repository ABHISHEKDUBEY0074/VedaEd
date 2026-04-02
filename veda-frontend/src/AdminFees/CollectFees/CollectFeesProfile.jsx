import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CollectFeesProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const student = state || {
    name: "Steven Taylor",
    class: "Class 1",
    section: "A",
    father: "Jason Taylor",
    mobile: "890567345",
    admission: "10024",
    roll: "20026",
    category: "General",
  };

  const feesData = [
    {
      id: 1,
      name: "Previous Session Balance",
      due: "03/22/2026",
      status: "Paid",
      amount: "0.00",
      balance: "0.00",
    },
    {
      id: 2,
      name: "April Month Fees",
      due: "04/10/2025",
      status: "Unpaid",
      amount: "350.00",
      balance: "350.00",
    },
    {
      id: 3,
      name: "Admission Fees",
      due: "04/10/2025",
      status: "Unpaid",
      amount: "2500.00",
      balance: "2500.00",
    },
  ];

  const [selected, setSelected] = useState([]);

  // Back Fix
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/admin/collect-fees");
    }
  };

  // Select All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(feesData.map((f) => f.id));
    } else {
      setSelected([]);
    }
  };

  // Single Select
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-4 min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Student Fees</h2>

        <button
          onClick={handleBack}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          ← Back
        </button>
      </div>

      {/* Student Info */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-6">
        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
          No Image
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <p><b>Name:</b> {student.name}</p>
          <p><b>Class:</b> {student.class} ({student.section})</p>
          <p><b>Father:</b> {student.father}</p>
          <p><b>Admission No:</b> {student.admission}</p>
          <p><b>Mobile:</b> {student.mobile}</p>
          <p><b>Roll:</b> {student.roll}</p>
          <p><b>Category:</b> {student.category}</p>
          <p><b>RTE:</b> <span className="text-red-500">No</span></p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => alert(`Print: ${selected.length} selected`)}
        >
          Print Selected
        </button>

        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => alert(`Collect: ${selected.length} selected`)}
        >
          Collect Selected
        </button>
      </div>

      <p className="text-center font-semibold mb-4">
        Session : 2025-26
      </p>

      {/* Fees Table */}
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selected.length === feesData.length}
                />
              </th>
              <th className="p-2">Fees</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Balance</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {feesData.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(f.id)}
                    onChange={() => handleSelect(f.id)}
                  />
                </td>

                <td className="p-2">{f.name}</td>
                <td className="p-2">{f.due}</td>

                <td className="p-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      f.status === "Paid"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {f.status}
                  </span>
                </td>

                <td className="p-2">₹{f.amount}</td>
                <td className="p-2">₹{f.balance}</td>

                <td className="p-2 text-center">
                  {f.status === "Unpaid" && (
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">
                      +
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectFeesProfile;