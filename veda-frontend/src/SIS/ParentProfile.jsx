import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const { id } = useParams();
  const parentData = location.state || null;

  const [parent, setParent] = useState(
    parentData
      ? {
          ...parentData,
          id: parentData._id, // Ensure id field is set from _id
        }
      : null
  );
  const [engagement, setEngagement] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch parent data from backend if ID is provided
  useEffect(() => {
    const fetchParent = async () => {
      console.log("useEffect triggered - ID:", id);
      console.log("Current parent state:", parent);

      if (!id) {
        console.log("No ID provided in URL params");
        return;
      }

      console.log("Fetching parent with ID:", id);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:5000/api/parents/${id}`);
        if (!response.ok) {
          throw new Error("Parent not found");
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.success && data.parent) {
          console.log("Parent data from API:", data.parent);
          // Map backend data to frontend structure
          const mappedParent = {
            id: data.parent._id,
            parentId: data.parent.parentId,
            name: data.parent.name,
            email: data.parent.email,
            phone: data.parent.phone,
            status: data.parent.status,
            password: data.parent.password,
            occupation: data.parent.occupation || "Parent",
            relation: data.parent.relation || "Parent",
            address: data.parent.address || "",
            photo: data.parent.photo || "https://via.placeholder.com/150",
            children:
              data.parent.children?.map((child) => ({
                name: child.personalInfo?.name || child.name,
                grade: child.personalInfo?.class || child.grade,
                section: child.personalInfo?.section || child.section,
              })) || [],
            documents: data.parent.documents || [],
          };

          setParent(mappedParent);
          console.log("Parent data loaded:", mappedParent);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching parent:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParent();
  }, [id]);

  // Mock data for engagement, meetings (can be replaced with real API calls later)
  useEffect(() => {
    // Set mock data for now
    setEngagement([
      { activity: "PTA Meeting", count: 3 },
      { activity: "School Events", count: 5 },
      { activity: "Volunteer Work", count: 2 },
    ]);

    setMeetings([
      {
        topic: "Academic Progress",
        date: "2023-10-15",
        notes: "Discussed student performance",
        status: "Completed",
      },
      {
        topic: "Behavioral Issues",
        date: "2023-11-20",
        notes: "Addressing classroom behavior",
        status: "Scheduled",
      },
    ]);
  }, []);

  // Fetch documents for the parent
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/parents/documents/${id}`
        );
        if (response.ok) {
          const docs = await response.json();
          setDocuments(docs);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };

    fetchDocuments();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Loading Parent Profile...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">
            Error Loading Parent Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
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
    console.log("Save button clicked!");
    console.log("Parent data:", parent);
    console.log("Parent ID:", parent?.id);
    console.log("URL ID:", id);

    // Use URL id as fallback if parent.id is not available
    const parentId = parent?.id || id;

    if (!parentId) {
      console.error("No parent ID found!");
      alert("No parent ID found. Cannot save.");
      return;
    }

    console.log("Using parent ID:", parentId);

    setLoading(true);
    setError(null);

    try {
      // Check if parent data exists
      if (!parent) {
        console.error("No parent data available!");
        alert("No parent data available. Cannot save.");
        return;
      }

      // Map frontend data back to backend structure
      const updateData = {
        name: parent.name,
        email: parent.email,
        phone: parent.phone,
        parentId: parent.parentId,
        status: parent.status,
        password: parent.password,
        occupation: parent.occupation,
        relation: parent.relation,
        address: parent.address,
      };

      console.log("Sending update data:", updateData);
      console.log("Parent ID:", parentId);
      console.log("API URL:", `http://localhost:5000/api/parents/${parentId}`);

      const response = await fetch(
        `http://localhost:5000/api/parents/${parentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.message || "Failed to update parent");
      }

      const data = await response.json();
      if (data.success) {
        setIsEditing(false);
        // Optionally show success message
        console.log("Parent updated successfully");
        alert("Parent info updated successfully!");
      }
    } catch (err) {
      console.error("Error updating parent:", err);
      setError(err.message);
      alert("Failed to update parent info.");
    } finally {
      setLoading(false);
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
                <h3 className="text-lg font-semibold text-gray-800">
                  Documents
                </h3>
                <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700">
                  Upload Document
                  <input
                    type="file"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("parentId", id);

                      try {
                        const res = await fetch(
                          `http://localhost:5000/api/parents/upload`,
                          {
                            method: "POST",
                            body: formData,
                          }
                        );
                        if (res.ok) {
                          alert("Document uploaded successfully ✅");
                          // Refresh documents list
                          const response = await fetch(
                            `http://localhost:5000/api/parents/documents/${id}`
                          );
                          if (response.ok) {
                            const docs = await response.json();
                            setDocuments(docs);
                          }
                        } else {
                          throw new Error("Upload failed");
                        }
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
                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <li
                      key={index}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{doc.name}</p>
                        <p className="text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleDateString()} -{" "}
                          {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Preview functionality
                            const filename = doc.path.split("/").pop();
                            window.open(
                              `http://localhost:5000/api/parents/preview/${filename}`,
                              "_blank"
                            );
                          }}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => {
                            // Download functionality
                            const filename = doc.path.split("/").pop();
                            window.open(
                              `http://localhost:5000/api/parents/download/${filename}`,
                              "_blank"
                            );
                          }}
                          className="text-indigo-600 hover:underline font-semibold"
                        >
                          Download
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-3 text-gray-500">
                    No documents uploaded yet.
                  </li>
                )}
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
