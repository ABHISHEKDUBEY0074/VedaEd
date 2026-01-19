import React, { useMemo, useState } from "react";
import { FiDownload, FiEye } from "react-icons/fi";
import * as XLSX from "xlsx";
import HelpInfo from "../../components/HelpInfo";
import { useNavigate } from "react-router-dom";


export default function ApplicationList() {
  /* ================= STATE ================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
  /* ================= DUMMY DATA ================= */
  const applications = [
    {
      _id: "APP-1001",
      studentName: "Aarav Sharma",
      fatherName: "Rohit Sharma",
      mobile: "9876543210",
      classApplied: "Class 5",
      formDate: "2026-01-10",
    },
    {
      _id: "APP-1002",
      studentName: "Ananya Verma",
      fatherName: "Suresh Verma",
      mobile: "9123456789",
      classApplied: "Class 8",
      formDate: "2026-01-12",
    },
    {
      _id: "APP-1003",
      studentName: "Kabir Singh",
      fatherName: "Manoj Singh",
      mobile: "9988776655",
      classApplied: "Class 6",
      formDate: "2026-01-15",
    },
  ];

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return applications.filter(
      (a) =>
        a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  /* ================= SUMMARY ================= */
  const totalApplications = applications.length;

  /* ================= EXPORT ================= */
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(applications);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Application List");
    XLSX.writeFile(wb, "ApplicationList.xlsx");
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* ================= BREADCRUMB ================= */}
     <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission &gt;</span>
        <span>Admission List</span>
      </div>
<div className="flex items-center justify-between mb-4">
       <h2 className="text-2xl font-bold">Admission List</h2>

        <HelpInfo
          title="Application List"
          description="This page shows all students who have filled the admission form. These applications will move to approval after review."
          steps={[
            "Review submitted admission forms",
            "Verify student details",
            "Move application to approval stage",
          ]}
        />
      </div>
      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Admission Forms Filled</p>
          <p className="text-2xl font-bold">{totalApplications}</p>
        </div>
      </div>

      {/* ================= LIST CARD ================= */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Applications</h3>

        {/* TOP CONTROLS */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by Application ID / Name"
              className="border rounded-md px-3 py-2 w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="border px-3 py-2 rounded-md ml-3"
              onChange={(e) => {
                if (e.target.value === "excel") exportToExcel();
              }}
            >
              <option>Bulk Action</option>
              <option value="excel">Export Excel</option>
            </select>
          </div>

         
        </div>

        {/* ================= TABLE ================= */}
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedIds(
                      e.target.checked
                        ? filteredData.map((x) => x._id)
                        : []
                    )
                  }
                />
              </th>
              <th className="p-2 border">Application ID</th>
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">Father Name</th>
              <th className="p-2 border">Mobile</th>
              <th className="p-2 border">Class Applied</th>
              <th className="p-2 border">Form Date</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(a._id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(a._id)
                          ? prev.filter((id) => id !== a._id)
                          : [...prev, a._id]
                      )
                    }
                  />
                </td>

                <td className="p-2 border font-medium">{a._id}</td>
                <td className="p-2 border">{a.studentName}</td>
                <td className="p-2 border">{a.fatherName}</td>
                <td className="p-2 border">{a.mobile}</td>
                <td className="p-2 border">{a.classApplied}</td>
                <td className="p-2 border">{a.formDate}</td>

                <td className="p-2 border text-center">
                  <button
  onClick={() =>
    navigate(`/admission/application/${a._id}/review`)
  }
  className="text-blue-600 text-sm flex items-center gap-1 justify-center hover:underline"
>
  <FiEye /> View
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No applications found
          </p>
        )}
      </div>
    </div>
  );
}
