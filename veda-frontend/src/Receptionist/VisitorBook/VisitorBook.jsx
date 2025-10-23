import React, { useState } from "react";
import { FiDownload, FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import * as XLSX from "xlsx";

export default function VisitorList() {
  const [visitorData, setVisitorData] = useState([
    {
      id: 1,
      purpose: "Principal Meeting",
      meetingWith: "Staff (William Abbot - 9003)",
      visitorName: "Charlie Barrett",
      phone: "789075764",
      idCard: "5673",
      numberOfPerson: 6,
      date: "10/22/2025",
      inTime: "12:30 PM",
      outTime: "01:30 PM",
      note: "",
    },
    {
      id: 2,
      purpose: "Staff Meeting",
      meetingWith: "Staff (Jason Sharlton - 90006)",
      visitorName: "David Wilson",
      phone: "980575667",
      idCard: "567323",
      numberOfPerson: 6,
      date: "10/16/2025",
      inTime: "10:30 AM",
      outTime: "11:45 AM",
      note: "",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    purpose: "",
    otherPurpose: "",
    meetingWith: "",
    visitorName: "",
    phone: "",
    idCard: "",
    numberOfPerson: "",
    date: "",
    inTime: "",
    outTime: "",
    note: "",
  });
  const [activeTab, setActiveTab] = useState("overview");

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(visitorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Visitors");
    XLSX.writeFile(wb, "VisitorList.xlsx");
  };

  const filteredData = visitorData.filter((v) =>
    v.visitorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVisitor = () => {
    if (!formData.purpose || !formData.meetingWith || !formData.visitorName) {
      return alert("Please fill all required fields (*)");
    }

    const finalPurpose =
      formData.purpose === "Others" ? formData.otherPurpose : formData.purpose;

    const newVisitor = {
      id: visitorData.length + 1,
      ...formData,
      purpose: finalPurpose,
    };

    setVisitorData((prev) => [...prev, newVisitor]);
    setShowModal(false);
    setFormData({
      purpose: "",
      otherPurpose: "",
      meetingWith: "",
      visitorName: "",
      phone: "",
      idCard: "",
      numberOfPerson: "",
      date: "",
      inTime: "",
      outTime: "",
      note: "",
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Receptionist &gt;</span>
        <span>Visitor Book</span>
      </div>

      {/* Page Title */}
      <h2 className="text-2xl font-bold mb-6">Visitor List</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("overview")}
          className={`capitalize pb-2 ${
            activeTab === "overview"
              ? "text-blue-600 font-semibold border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Overview
        </button>
      </div>

      {/* Outer gray box */}
      <div className="bg-gray-200 p-6 border border-gray-100">
        {/* Inner white box */}
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
                <th className="p-3 font-semibold">Purpose</th>
                <th className="p-3 font-semibold">Meeting With</th>
                <th className="p-3 font-semibold">Visitor Name</th>
                <th className="p-3 font-semibold">Phone</th>
                <th className="p-3 font-semibold">ID Card</th>
                <th className="p-3 font-semibold">No. of Person</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">In Time</th>
                <th className="p-3 font-semibold">Out Time</th>
                <th className="p-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((v) => (
                <tr key={v.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{v.purpose}</td>
                  <td className="p-3">{v.meetingWith}</td>
                  <td className="p-3">{v.visitorName}</td>
                  <td className="p-3">{v.phone}</td>
                  <td className="p-3">{v.idCard}</td>
                  <td className="p-3">{v.numberOfPerson}</td>
                  <td className="p-3">{v.date}</td>
                  <td className="p-3">{v.inTime}</td>
                  <td className="p-3">{v.outTime}</td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <FiEdit2 className="cursor-pointer text-blue-600" />
                    <FiTrash2
                      className="cursor-pointer text-red-600"
                      onClick={() =>
                        setVisitorData((prev) =>
                          prev.filter((item) => item.id !== v.id)
                        )
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[800px] relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Add Visitor
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block mb-1 font-semibold text-sm">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <select
                  className="border rounded-md px-3 py-2 w-full"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Student Meeting">Student Meeting</option>
                  <option value="Principal Meeting">Principal Meeting</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block mb-1 font-semibold text-sm">
                  Meeting With <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Staff (Jason - 9001)"
                  className="border rounded-md px-3 py-2 w-full"
                  value={formData.meetingWith}
                  onChange={(e) =>
                    setFormData({ ...formData, meetingWith: e.target.value })
                  }
                />
              </div>

              <div className="col-span-1">
                <label className="block mb-1 font-semibold text-sm">
                  Visitor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="border rounded-md px-3 py-2 w-full"
                  value={formData.visitorName}
                  onChange={(e) =>
                    setFormData({ ...formData, visitorName: e.target.value })
                  }
                />
              </div>

              {formData.purpose === "Others" && (
                <div className="col-span-3">
                  <label className="block mb-1 font-semibold text-sm">
                    Specify Purpose
                  </label>
                  <input
                    type="text"
                    placeholder="Enter custom purpose"
                    className="border rounded-md px-3 py-2 w-full"
                    value={formData.otherPurpose}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        otherPurpose: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <input
                placeholder="Phone"
                className="border rounded-md px-3 py-2"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                placeholder="ID Card"
                className="border rounded-md px-3 py-2"
                value={formData.idCard}
                onChange={(e) =>
                  setFormData({ ...formData, idCard: e.target.value })
                }
              />
              <input
                placeholder="Number Of Person"
                className="border rounded-md px-3 py-2"
                value={formData.numberOfPerson}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfPerson: e.target.value,
                  })
                }
              />
              <input
                type="date"
                className="border rounded-md px-3 py-2"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
              <input
                type="time"
                className="border rounded-md px-3 py-2"
                value={formData.inTime}
                onChange={(e) =>
                  setFormData({ ...formData, inTime: e.target.value })
                }
              />
              <input
                type="time"
                className="border rounded-md px-3 py-2"
                value={formData.outTime}
                onChange={(e) =>
                  setFormData({ ...formData, outTime: e.target.value })
                }
              />
              <textarea
                placeholder="Note"
                rows="3"
                className="border rounded-md px-3 py-2 col-span-3"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              ></textarea>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={handleAddVisitor}
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
