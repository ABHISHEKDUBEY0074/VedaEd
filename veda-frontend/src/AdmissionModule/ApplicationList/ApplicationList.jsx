import React, { useMemo, useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import * as XLSX from "xlsx";
import HelpInfo from "../../components/HelpInfo";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function ApplicationList() {
  /* ================= STATE ================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10; // jitne rows per page chahiye

  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admission/application");
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return applications.filter(
      (a) =>
        (a.personalInfo?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.applicationId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a._id || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [applications, searchQuery]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

const paginatedData = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredData.slice(startIndex, endIndex);
}, [filteredData, currentPage]);


  /* ================= SUMMARY ================= */
  const totalApplications = applications.length;

  /* ================= EXPORT ================= */
  const exportToExcel = () => {
    const dataToExport = filteredData.map(app => ({
        "Application ID": app.applicationId || app._id,
        "Student Name": app.personalInfo?.name,
        "Father Name": app.parents?.father?.name,
        "Mobile": app.contactInfo?.phone,
        "Class Applied": app.earlierAcademic?.lastClass,
        "Form Date": new Date(app.createdAt).toLocaleDateString(),
        "Status": app.applicationStatus
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
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
      <div className="grid grid-cols-3 gap-4 mb-3">
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
                        ? paginatedData.map((x) => x._id)
                        : []
                    )
                  }
                />
              </th>
              <th className="p-2 border text-left">Application ID</th>
              <th className="p-2 border text-left">Student Name</th>
              <th className="p-2 border text-left">Father Name</th>
              <th className="p-2 border text-left">Mobile</th>
              <th className="p-2 border text-left">Class Applied</th>
              <th className="p-2 border text-left">Form Date</th>
              <th className="p-2 border text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
                <tr>
                    <td colSpan="8" className="p-6 text-center text-gray-500">
                        Loading...
                    </td>
                </tr>
            ) : paginatedData.map((a) => (
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

                <td className="p-2 border font-medium">{a.applicationId || a._id}</td>
                <td className="p-2 border">{a.personalInfo?.name}</td>
                <td className="p-2 border">{a.parents?.father?.name}</td>
                <td className="p-2 border">{a.contactInfo?.phone}</td>
                <td className="p-2 border">{a.earlierAcademic?.lastClass}</td>
                <td className="p-2 border">{new Date(a.createdAt).toLocaleDateString()}</td>

                <td className="p-2 border text-center">
                  <button
  onClick={() =>
    navigate(`/admission/application/${a._id}/review`, { state: a })
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
        {/* ================= PAGINATION ================= */}
{totalPages > 1 && (
  <div className="flex justify-between items-center mt-4">
    <p className="text-sm text-gray-600">
      Page {currentPage} of {totalPages}
    </p>

    <div className="flex gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 border rounded ${
            currentPage === i + 1
              ? "bg-blue-600 text-white"
              : ""
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
)}


        {filteredData.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-6">
            No applications found
          </p>
        )}
      </div>
    </div>
  );
}
