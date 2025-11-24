import React, { useState, useEffect } from "react";
import { FiDownload, FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import HelpInfo from "../../components/HelpInfo";

export default function VisitorList() {
  const [visitorData, setVisitorData] = useState([]);
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

  const location = useLocation();

  // Prefill modal if navigated from student
  useEffect(() => {
    if (location.state?.meetingWith) {
      setShowModal(true);
      setFormData((prev) => ({
        ...prev,
        meetingWith: location.state.meetingWith,
      }));
    }
  }, [location.state]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(visitorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Visitors");
    XLSX.writeFile(wb, "VisitorList.xlsx");
  };

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

  const filteredData = visitorData.filter((v) =>
    v.visitorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Receptionist &gt;</span>
        <span>Visitor Book</span>
      </div><div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Visitor Book</h2>
      
        <HelpInfo
          title="Communication Module Help"
          description="This module allows you to manage all Parents records, login access, roles, and other information."
          steps={[
            "Use All Staff tab to view and manage Parents details.",
            "Use Manage Login tab to update login credentials.",
            "Use Others tab for additional Parents-related tools."
          ]}
        />
      </div>

      <div className="flex gap-4 border-b border-gray-300 mb-4">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      <div className="bg-gray-200 p-6 border border-gray-100">
        <div className="bg-white p-4 rounded-lg shadow-sm">
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
                  placeholder="e.g. Staff / Student"
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
