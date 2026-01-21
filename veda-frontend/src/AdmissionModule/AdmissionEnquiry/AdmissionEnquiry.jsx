import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import * as XLSX from "xlsx";
import HelpInfo from "../../components/HelpInfo";
import { getEnquiries, createEnquiry, deleteEnquiry, updateEnquiry } from "../../services/admissionEnquiryAPI";

export default function AdmissionEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const totalEnquiries = enquiries.length;
const reviewedCount = enquiries.filter(e => e.status === "reviewed").length;
const pendingCount = enquiries.filter(e => e.status !== "reviewed").length;

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    guardianName: "",
    mobile: "",
    whatsapp: "",
    email: "",
    enquiryClass: "",
    date: "",
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

 const fetchEnquiries = async () => {
  try {
    const data = await getEnquiries();
    setEnquiries(
      data.map(e => ({ ...e, status: e.status || "pending" }))
    );
  } catch (error) {
    console.warn("API failed, loading dummy data");

    setEnquiries([
      {
        _id: "1",
        studentName: "Aarav Sharma",
        guardianName: "Rohit Sharma",
        mobile: "9876543210",
        whatsapp: "9876543210",
        email: "aarav@gmail.com",
        enquiryClass: "Class 5",
        date: "2026-01-10",
        status: "pending",
      },
      {
        _id: "2",
        studentName: "Ananya Verma",
        guardianName: "Suresh Verma",
        mobile: "9123456789",
        whatsapp: "9123456789",
        email: "ananya@gmail.com",
        enquiryClass: "Class 8",
        date: "2026-01-11",
        status: "reviewed",
      },
    ]);
  }
};


  // Excel export
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(enquiries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Admission Enquiry");
    XLSX.writeFile(wb, "AdmissionEnquiry.xlsx");
  };


  const [selectedIds, setSelectedIds] = useState([]);

    // Add Enquiry
  const handleAdd = async () => {
    if (
      !formData.studentName ||
      !formData.guardianName ||
      !formData.mobile ||
      !formData.enquiryClass
    ) {
      return alert("Please fill all required fields (*)");
    }

    try {
      const newEntry = await createEnquiry(formData);
      setEnquiries([newEntry, ...enquiries]);
      setShowModal(false);
      setFormData({
        studentName: "",
        guardianName: "",
        mobile: "",
        whatsapp: "",
        email: "",
        enquiryClass: "",
        date: "",
      });
      alert("Enquiry added successfully!");
    } catch (error) {
      console.error("Error adding enquiry:", error);
      alert("Failed to add enquiry");
    }
  };

  const filteredData = enquiries.filter((e) =>
    e.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission &gt;</span>
        <span>Admission Enquiry</span>
      </div>
<div className="flex items-center justify-between mb-4">
       <h2 className="text-2xl font-bold">Admission Enquiry</h2>
     
      <HelpInfo
  title="Admission Enquiry Help"
  description={`1.1 Overview

This page lists all admission enquiries received from prospective students. It helps the admissions team keep track of inquiries and follow up accordingly.

2. Table Columns Description

The table shows key information for each enquiry. 'Student Name' displays the name of the prospective student. 'Guardian Name' shows the parent or guardian's name, useful for contacting them. 'Mobile No.' and 'WhatsApp No.' provide phone numbers for direct and instant messaging communication respectively. 'Email' contains the guardian’s or student's email address for sending official correspondence. 'Class Enquired' indicates the grade level the student is interested in. 'Date' is the day the enquiry was submitted, helping prioritize follow-ups. The 'Action' column offers options to view, edit, or manage each enquiry.

3. Usage Tips

Regularly review this page to ensure timely responses to all enquiries. Use the contact details provided for smooth communication, and follow up with prospective students to increase admission chances.`}
  steps={[
    "Check the enquiry list daily for new entries.",
    "Use mobile or WhatsApp numbers for quick communication.",
    "Send relevant information via email to guardians.",
    "Follow up on enquiries promptly to maximize admissions."
  ]}
/>


     </div>

      {/* Tabs */}
      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>
      {/* SUMMARY BOXES */}
<div className="grid grid-cols-3 gap-4 mb-6 mt-4">
  <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gray-200" />
    <div>
      <p className="text-sm text-gray-500">Total Enquiries</p>
      <p className="text-xl font-bold">{totalEnquiries}</p>
    </div>
  </div>

  <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gray-200" />
    <div>
      <p className="text-sm text-gray-500">Reviewed</p>
      <p className="text-xl font-bold">{reviewedCount}</p>
    </div>
  </div>

  <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-gray-200" />
    <div>
      <p className="text-sm text-gray-500">Pending Follow-up</p>
      <p className="text-xl font-bold">{pendingCount}</p>
    </div>
  </div>
</div>


      {/* Main content box */}
      <div className=" p-0">
        <div className="bg-white p-4 rounded-lg shadow-sm">
           <h3 className="text-lg font-semibold mb-4">Admission Enquiry List</h3>
          {/* Top controls */}
         <div className="flex justify-between items-center mb-4">
  <div className="flex items-center">
    <input
      type="text"
      placeholder="Search..."
      className="border rounded-md px-2 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />

    {/* BULK ACTION – YAHAN ADD */}
    <select
      className="border px-3 py-2 rounded-md ml-3"
      onChange={async (e) => {
        if (e.target.value === "excel") exportToExcel();
        if (e.target.value === "reviewed") {
          try {
             await Promise.all(selectedIds.map(id => updateEnquiry(id, { status: "reviewed" })));
             setEnquiries((prev) =>
                prev.map((x) =>
                  selectedIds.includes(x._id)
                    ? { ...x, status: "reviewed" }
                    : x
                )
             );
             setSelectedIds([]);
             alert("Selected enquiries marked as reviewed!");
          } catch (error) {
              console.error("Error bulk updating:", error);
              alert("Failed to update some enquiries.");
          }
        }
      }}
    >
      <option>Bulk Action</option>
      
      <option value="excel">Export Excel</option>
    </select>
  </div>

  <div className="flex gap-3">
    <button
      onClick={exportToExcel}
      className="flex items-center gap-2 px-4 py-2 "
    >
     
    </button>

    <button
      onClick={() => setShowModal(true)}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      <FiPlus /> Add
    </button>
  </div>
</div>


          {/* Table */}
           <table className="w-full border ">
      <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">
  <input
    type="checkbox"
    onChange={(e) =>
      setSelectedIds(
        e.target.checked ? filteredData.map(x => x._id) : []
      )
    }
  />
</th>

                <th className="p-2 border">Student Name</th>
                <th className="p-2 border">Guardian Name</th>
                <th className="p-2 border">Mobile No.</th>
                <th className="p-2 border">WhatsApp No.</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Class Enquired</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>

                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((e) => (
                <tr key={e._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border text-center">
  <input
    type="checkbox"
    checked={selectedIds.includes(e._id)}
    onChange={() =>
      setSelectedIds(prev =>
        prev.includes(e._id)
          ? prev.filter(id => id !== e._id)
          : [...prev, e._id]
      )
    }
  />
</td>

                  <td className="p-2 border">{e.studentName}</td>
                  <td className="p-2 border">{e.guardianName}</td>
                  <td className="p-2 border">{e.mobile}</td>
                  <td className="p-2 border">{e.whatsapp}</td>
                  <td className="p-2 border">{e.email}</td>
                  <td className="p-2 border">{e.enquiryClass}</td>
                  <td className="p-2 border">{e.date}</td>
                  <td className="p-2 border text-center">
  <span
    className={`px-2 py-1 rounded-full text-xs ${
      e.status === "reviewed"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {e.status}
  </span>
</td>

                 <td className="p-2 border text-center flex justify-center gap-2">
  <FiEdit2 className="cursor-pointer text-blue-600" />

  {e.status !== "reviewed" && (
      <button
        onClick={async () => {
          try {
            await updateEnquiry(e._id, { status: "reviewed" });
            setEnquiries((prev) =>
              prev.map((x) =>
                x._id === e._id ? { ...x, status: "reviewed" } : x
              )
            );
          } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
          }
        }}
        className="text-xs text-green-600 border px-2 py-1 rounded"
      >
        Mark Reviewed
      </button>
  )}

  <FiTrash2
    className="cursor-pointer text-red-600"
    onClick={async () => {
      if (window.confirm("Are you sure you want to delete this enquiry?")) {
        try {
          await deleteEnquiry(e._id);
          setEnquiries(enquiries.filter((x) => x._id !== e._id));
        } catch (error) {
          console.error("Error deleting enquiry:", error);
          alert("Failed to delete enquiry");
        }
      }
    }}
  />
</td>

                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <p className="text-center text-gray-500 py-4">No records found</p>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[700px] relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Add Admission Enquiry
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold ">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 w-full"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold ">
                  Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 w-full"
                  value={formData.guardianName}
                  onChange={(e) =>
                    setFormData({ ...formData, guardianName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold ">
                  Mobile No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 w-full"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold ">
                  WhatsApp No.
                </label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 w-full"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold ">
                  Email
                </label>
                <input
                  type="email"
                  className="border rounded-md px-3 py-2 w-full"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">
                  Enquiry For Class <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class 5"
                  className="border rounded-md px-3 py-2 w-full"
                  value={formData.enquiryClass}
                  onChange={(e) =>
                    setFormData({ ...formData, enquiryClass: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold ">Date</label>
                <input
                  type="date"
                  className="border rounded-md px-3 py-2 w-full"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
