import React, { useState } from "react";
import { FiDownload, FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import * as XLSX from "xlsx";
import HelpInfo from "../../components/HelpInfo";

export default function AdmissionEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
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

  // Excel export
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(enquiries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Admission Enquiry");
    XLSX.writeFile(wb, "AdmissionEnquiry.xlsx");
  };

  // Add Enquiry
  const handleAdd = () => {
    if (
      !formData.studentName ||
      !formData.guardianName ||
      !formData.mobile ||
      !formData.enquiryClass
    ) {
      return alert("Please fill all required fields (*)");
    }

    const newEntry = {
      id: enquiries.length + 1,
      ...formData,
    };

    setEnquiries([...enquiries, newEntry]);
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
  };

  const filteredData = enquiries.filter((e) =>
    e.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission &gt;</span>
        <span>Admission Enquiry</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Admission Enquiry</h2>

        <HelpInfo
          title="Admission Enquiry Help"
          description={`Page Description: Manage every admission enquiry collected at the reception desk. Capture guardian information, follow-up details, and export the register for reporting.


11.1 Enquiry Register

Monitor all enquiries, search by student name, and review key contact details.

Sections:
- Search Bar: Quickly filter enquiries by student or guardian name
- Action Buttons: Add new enquiry or export the entire register to Excel
- Enquiry Table: Columns for student info, guardian contact, class of interest, date, and row-level actions


11.2 Add Enquiry Modal

Use the modal to log a new enquiry in detail.

Sections:
- Required Fields: Student Name, Guardian Name, Contact numbers, Class, Date
- Additional Fields: Email, WhatsApp number for follow-ups
- Save Button: Validates inputs and inserts the new enquiry into the register
- Reset Logic: Modal clears after saving so the next walk-in can be recorded immediately


11.3 Row Actions & Export

Manage the register without leaving the page.

Sections:
- Edit/Delete Icons: Update or remove an enquiry entry directly from the table
- Excel Export: Generates a spreadsheet snapshot of current enquiries for counselors`}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      {/* Main content box */}
      <div className="bg-gray-200 p-6 border border-gray-100">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Top controls */}
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FiPlus /> Add
              </button>

              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <FiDownload /> Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 font-semibold">Student Name</th>
                <th className="p-3 font-semibold">Guardian Name</th>
                <th className="p-3 font-semibold">Mobile No.</th>
                <th className="p-3 font-semibold">WhatsApp No.</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Class Enquired</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((e) => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{e.studentName}</td>
                  <td className="p-3">{e.guardianName}</td>
                  <td className="p-3">{e.mobile}</td>
                  <td className="p-3">{e.whatsapp}</td>
                  <td className="p-3">{e.email}</td>
                  <td className="p-3">{e.enquiryClass}</td>
                  <td className="p-3">{e.date}</td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <FiEdit2 className="cursor-pointer text-blue-600" />
                    <FiTrash2
                      className="cursor-pointer text-red-600"
                      onClick={() =>
                        setEnquiries(enquiries.filter((x) => x.id !== e.id))
                      }
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
                <label className="block mb-1 font-semibold text-sm">
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
                <label className="block mb-1 font-semibold text-sm">
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
                <label className="block mb-1 font-semibold text-sm">
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
                <label className="block mb-1 font-semibold text-sm">
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
                <label className="block mb-1 font-semibold text-sm">
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
                <label className="block mb-1 font-semibold text-sm">
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
                <label className="block mb-1 font-semibold text-sm">Date</label>
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
