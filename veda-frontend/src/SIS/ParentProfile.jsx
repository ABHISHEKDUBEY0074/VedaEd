import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiInfo,
  FiUsers,
  FiFileText,
  FiMail,
  FiCalendar,
  FiEdit3,
  FiSave,
  FiX,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Input field component for editing
const InputField = ({ label, value, onChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-2 border-b border-gray-100 last:border-b-0">
    <p className="font-medium text-gray-500">{label}</p>
    <input
      type="text"
      className="col-span-2 border rounded-lg px-3 py-1 text-sm"
      value={value || ""}
      onChange={onChange}
    />
  </div>
);

// Info display component
const InfoDetail = ({ label, value }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-2 border-b border-gray-100 last:border-b-0">
    <p className="font-medium text-gray-500">{label}</p>
    <p className="col-span-2">{value || "N/A"}</p>
  </div>
);

// Tab button component
const TabButton = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow"
        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const ParentProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const parentId = location.state?.parentId || null;

  const [parent, setParent] = useState(null);
  const [engagement, setEngagement] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch parent data, engagement, documents, meetings
  useEffect(() => {
    if (!parentId) return;

    axios.get(`/api/parents/${parentId}`).then((res) => setParent(res.data));
    axios
      .get(`/api/parents/${parentId}/engagement`)
      .then((res) => setEngagement(res.data));
    axios
      .get(`/api/parents/${parentId}/documents`)
      .then((res) => setDocuments(res.data));
    axios
      .get(`/api/parents/${parentId}/meetings`)
      .then((res) => setMeetings(res.data));
  }, [parentId]);

  if (!parent) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Parent Profile Not Found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setParent({ ...parent, [field]: value });
  };

  const saveChanges = async () => {
    try {
      await axios.put(`/api/parents/${parentId}`, parent);
      setIsEditing(false);
      alert("Parent info updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update parent info.");
    }
  };

  // Overview Tab
  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* General Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiInfo className="text-indigo-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              General Information
            </h3>
          </div>
          {isEditing ? (
            <>
              <InputField
                label="Parent ID"
                value={parent.parentId}
                onChange={(e) => handleChange("parentId", e.target.value)}
              />
              <InputField
                label="Name"
                value={parent.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <InputField
                label="Occupation"
                value={parent.occupation}
                onChange={(e) => handleChange("occupation", e.target.value)}
              />
              <InputField
                label="Relation"
                value={parent.relation}
                onChange={(e) => handleChange("relation", e.target.value)}
              />
            </>
          ) : (
            <>
              <InfoDetail label="Parent ID" value={parent.parentId} />
              <InfoDetail label="Name" value={parent.name} />
              <InfoDetail label="Occupation" value={parent.occupation} />
              <InfoDetail label="Relation" value={parent.relation} />
            </>
          )}
        </div>

        {/* Student Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiUsers className="text-indigo-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              Student Information
            </h3>
          </div>
          {parent.children?.length > 0 ? (
            parent.children.map((child, i) => (
              <div
                key={i}
                className="py-2 border-b border-gray-200 last:border-b-0"
              >
                {isEditing ? (
                  <>
                    <InputField
                      label="Student Name"
                      value={child.name}
                      onChange={(e) => {
                        const updatedChildren = [...parent.children];
                        updatedChildren[i].name = e.target.value;
                        setParent({ ...parent, children: updatedChildren });
                      }}
                    />
                    <InputField
                      label="Grade"
                      value={child.grade}
                      onChange={(e) => {
                        const updatedChildren = [...parent.children];
                        updatedChildren[i].grade = e.target.value;
                        setParent({ ...parent, children: updatedChildren });
                      }}
                    />
                    <InputField
                      label="Section"
                      value={child.section}
                      onChange={(e) => {
                        const updatedChildren = [...parent.children];
                        updatedChildren[i].section = e.target.value;
                        setParent({ ...parent, children: updatedChildren });
                      }}
                    />
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-700">{child.name}</p>
                    <p className="text-sm text-gray-500">
                      Grade: {child.grade}, Section: {child.section}
                    </p>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No student linked.</p>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <FiMail className="text-indigo-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Contact</h3>
          </div>
          {isEditing ? (
            <>
              <InputField
                label="Email"
                value={parent.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <InputField
                label="Phone"
                value={parent.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <InputField
                label="Address"
                value={parent.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </>
          ) : (
            <>
              <InfoDetail label="Email" value={parent.email} />
              <InfoDetail label="Phone" value={parent.phone} />
              <InfoDetail label="Address" value={parent.address} />
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" /> Back to Parent Directory
          </button>

          {isEditing ? (
            <div className="space-x-2">
              <button
                onClick={saveChanges}
                className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                <FiSave className="mr-2" /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400"
              >
                <FiX className="mr-2" /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
            >
              <FiEdit3 className="mr-2" /> Edit
            </button>
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-200"
            src={parent.photo || "https://via.placeholder.com/150"}
            alt={parent.name}
          />
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{parent.name}</h1>
            <p className="text-lg text-indigo-600 font-medium">
              {parent.occupation || "Parent"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex space-x-2">
            <TabButton
              label="Overview"
              isActive={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={<FiInfo />}
            />
            <TabButton
              label="Engagement"
              isActive={activeTab === "engagement"}
              onClick={() => setActiveTab("engagement")}
              icon={<FiUsers />}
            />
            <TabButton
              label="Documents"
              isActive={activeTab === "documents"}
              onClick={() => setActiveTab("documents")}
              icon={<FiFileText />}
            />
            <TabButton
              label="Meetings"
              isActive={activeTab === "meetings"}
              onClick={() => setActiveTab("meetings")}
              icon={<FiCalendar />}
            />
          </div>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === "overview" && <OverviewTab />}

          {activeTab === "engagement" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="activity" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              {/* Upload Button */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Documents</h3>
                <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700">
                  Upload Document
                  <input
                    type="file"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append("document", file);

                      try {
                        const res = await axios.post(
                          `/api/parents/${parentId}/documents/upload`,
                          formData,
                          { headers: { "Content-Type": "multipart/form-data" } }
                        );
                        setDocuments((prev) => [...prev, res.data]);
                        alert("Document uploaded successfully ✅");
                      } catch (err) {
                        console.error("Upload failed:", err);
                        alert("Failed to upload document ❌");
                      }
                    }}
                  />
                </label>
              </div>

              {/* Documents List */}
              <ul className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{doc.name}</p>
                      <p className="text-gray-500">
                        {doc.date} - {doc.size}
                      </p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline font-semibold"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "meetings" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Topic</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Notes</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((meeting, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-3">{meeting.topic}</td>
                      <td className="px-4 py-3">{meeting.date}</td>
                      <td className="px-4 py-3">{meeting.notes}</td>
                      <td className="px-4 py-3">{meeting.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
