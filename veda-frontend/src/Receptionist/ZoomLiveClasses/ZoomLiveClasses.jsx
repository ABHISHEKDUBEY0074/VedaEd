import React, { useState } from "react";
import { FiPlus, FiDownload, FiVideo, FiTrash2, FiEdit2, FiX, FiLink } from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";
export default function ZoomLiveClasses() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    teacher: "",
    date: "",
    time: "",
    meetingId: "",
    passcode: "",
    joinLink: "",
  });

  // ✅ Dummy Data Added Here
  const [classes, setClasses] = useState([
    {
      id: 1,
      title: "Maths – Algebra Basics",
      teacher: "Rohit Sharma",
      date: "2025-11-22",
      time: "10:00 AM",
      meetingId: "982 123 883",
      passcode: "math2025",
      joinLink: "https://zoom.us/j/982123883",
    },
    {
      id: 2,
      title: "Science – States of Matter",
      teacher: "Priya Mehta",
      date: "2025-11-21",
      time: "12:00 PM",
      meetingId: "771 983 221",
      passcode: "sci2025",
      joinLink: "https://zoom.us/j/771983221",
    },
    {
      id: 3,
      title: "English – Reading Skills",
      teacher: "Aman Verma",
      date: "2025-11-20",
      time: "9:00 AM",
      meetingId: "663 982 322",
      passcode: "eng2025",
      joinLink: "https://zoom.us/j/663982322",
    },
  ]);

  const handleAddClass = () => {
    if (!formData.title || !formData.teacher || !formData.date) {
      return alert("Please fill all required fields (*)");
    }

    const newClass = {
      id: classes.length + 1,
      ...formData,
    };

    setClasses((prev) => [...prev, newClass]);
    setShowModal(false);

    setFormData({
      title: "",
      teacher: "",
      date: "",
      time: "",
      meetingId: "",
      passcode: "",
      joinLink: "",
    });
  };

  const filtered = classes.filter((cls) =>
    cls.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Online Classes &gt;</span>
        <span>Zoom Live</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
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

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      {/* Card Wrapper */}
      <div className="bg-gray-200 p-6 border border-gray-100">
        <div className="bg-white p-4 rounded-lg shadow-sm">

          {/* Search + Action Buttons */}
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
                <FiPlus /> Add Live Class
              </button>

              <button
                onClick={() => alert("Excel Export Coming Soon")}
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
                <th className="p-3 font-semibold">Title</th>
                <th className="p-3 font-semibold">Teacher</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Time</th>
                <th className="p-3 font-semibold">Meeting ID</th>
                <th className="p-3 font-semibold">Passcode</th>
                <th className="p-3 font-semibold">Join Link</th>
                <th className="p-3 font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((cls) => (
                <tr key={cls.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{cls.title}</td>
                  <td className="p-3">{cls.teacher}</td>
                  <td className="p-3">{cls.date}</td>
                  <td className="p-3">{cls.time}</td>
                  <td className="p-3">{cls.meetingId}</td>
                  <td className="p-3">{cls.passcode}</td>

                  <td className="p-3 text-blue-600 underline cursor-pointer">
                    <a href={cls.joinLink} target="_blank" rel="noreferrer">
                      <FiLink className="inline" /> Join
                    </a>
                  </td>

                  <td className="p-3 flex justify-center gap-2">
                    <FiEdit2 className="cursor-pointer text-blue-600" />
                    <FiTrash2
                      className="cursor-pointer text-red-600"
                      onClick={() =>
                        setClasses((prev) => prev.filter((c) => c.id !== cls.id))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No live classes found
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[800px] relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-lg font-bold mb-4">Add Zoom Class</h3>

            <div className="grid grid-cols-3 gap-4">

              <input
                placeholder="Class Title *"
                className="border rounded-md px-3 py-2 col-span-1"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <input
                placeholder="Teacher Name *"
                className="border rounded-md px-3 py-2 col-span-1"
                value={formData.teacher}
                onChange={(e) =>
                  setFormData({ ...formData, teacher: e.target.value })
                }
              />

              <input
                type="date"
                className="border rounded-md px-3 py-2 col-span-1"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />

              <input
                type="time"
                className="border rounded-md px-3 py-2 col-span-1"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />

              <input
                placeholder="Zoom Meeting ID"
                className="border rounded-md px-3 py-2 col-span-1"
                value={formData.meetingId}
                onChange={(e) =>
                  setFormData({ ...formData, meetingId: e.target.value })
                }
              />

              <input
                placeholder="Passcode"
                className="border rounded-md px-3 py-2 col-span-1"
                value={formData.passcode}
                onChange={(e) =>
                  setFormData({ ...formData, passcode: e.target.value })
                }
              />

              <input
                placeholder="Join Link"
                className="border rounded-md px-3 py-2 col-span-3"
                value={formData.joinLink}
                onChange={(e) =>
                  setFormData({ ...formData, joinLink: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={handleAddClass}
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
