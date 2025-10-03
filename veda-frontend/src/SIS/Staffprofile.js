import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiInfo,
  FiBarChart,
  FiFileText,
  FiCalendar,
  FiEdit2,
  FiCheck,
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

const mockDocuments = [
  { name: "Employment Contract.pdf", date: "2020-07-01", size: "2.3 MB" },
  {
    name: "Annual Performance Review 2023.docx",
    date: "2023-12-15",
    size: "450 KB",
  },
  { name: "Updated CV.pdf", date: "2022-05-20", size: "1.1 MB" },
];

const mockLeaveHistory = [
  {
    type: "Annual Leave",
    from: "2023-08-10",
    to: "2023-08-15",
    days: 5,
    status: "Approved",
  },
  {
    type: "Sick Leave",
    from: "2023-10-02",
    to: "2023-10-02",
    days: 1,
    status: "Approved",
  },
  {
    type: "Unpaid Leave",
    from: "2024-01-20",
    to: "2024-01-22",
    days: 2,
    status: "Pending",
  },
];

const ProfileCard = ({ label, children, icon, action }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="text-indigo-500 mr-3">{icon}</div>
          <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        </div>
        {action}
      </div>
      <div className="space-y-3 text-sm text-gray-600">{children}</div>
    </div>
  </div>
);

const InfoDetail = ({ label, value }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-2 border-b border-gray-100 last:border-b-0">
    <p className="font-medium text-gray-500">{label}</p>
    <p className="col-span-2">{value || "N/A"}</p>
  </div>
);

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

const StaffProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const staffData = location.state || null;
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [staff, setStaff] = useState(staffData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch staff data from backend if ID is provided
  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) {
        console.log("No ID provided in URL params");
        return;
      }
      
      console.log("Fetching staff with ID:", id);
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:5000/api/staff/${id}`);
        if (!response.ok) {
          throw new Error('Staff not found');
        }
        
        const data = await response.json();
        if (data.success && data.staff) {
          // Map backend data to frontend structure
          const mappedStaff = {
            id: data.staff._id,
            staffId: data.staff.personalInfo?.staffId,
            name: data.staff.personalInfo?.name,
            role: data.staff.personalInfo?.role,
            department: data.staff.personalInfo?.department,
            status: data.staff.status,
            address: data.staff.personalInfo?.address,
            phone: data.staff.personalInfo?.mobileNumber,
            contact: data.staff.personalInfo?.email,
            emergencyContact: data.staff.personalInfo?.emergencyContact,
            assignedClasses: data.staff.classesAssigned?.join(", "),
            experience: data.staff.experience,
            qualification: data.staff.qualification,
            salary: data.staff.salaryDetails?.salary,
            lastPayment: data.staff.salaryDetails?.lastPayment,
            username: data.staff.personalInfo?.username,
            password: data.staff.personalInfo?.password,
            photo: data.staff.personalInfo?.image,
            performance: data.staff.performance || [],
            documents: data.staff.documents || []
          };
          
          setStaff(mappedStaff);
          console.log("Staff data loaded:", mappedStaff);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  // Fetch documents for the staff
  const [documents, setDocuments] = useState([]);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/staff/documents/${id}`);
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

  // Local editable state
  const [formData, setFormData] = useState(staff || {});

  // Update formData when staff data changes
  useEffect(() => {
    if (staff) {
      setFormData(staff);
    }
  }, [staff]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Loading Staff Profile...
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
            Error Loading Staff Profile
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

  if (!staff) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Staff Member Not Found
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(staff);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!staff.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Map frontend data back to backend structure
      const updateData = {
        personalInfo: {
          name: formData.name,
          staffId: formData.staffId,
          role: formData.role,
          department: formData.department,
          email: formData.contact,
          mobileNumber: formData.phone,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          username: formData.username,
          password: formData.password
        },
        status: formData.status,
        qualification: formData.qualification,
        experience: formData.experience,
        classesAssigned: formData.assignedClasses ? formData.assignedClasses.split(",").map(c => c.trim()) : [],
        salaryDetails: {
          salary: formData.salary,
          lastPayment: formData.lastPayment
        }
      };

      console.log("Sending update data:", updateData);
      console.log("Staff ID:", id);

      const response = await fetch(`http://localhost:5000/api/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.message || 'Failed to update staff');
      }

      const data = await response.json();
      if (data.success) {
        setStaff(formData); // Update local data
        setIsEditing(false);
        // Optionally show success message
        console.log('Staff updated successfully');
      }
    } catch (err) {
      console.error("Error updating staff:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const statusBadgeClasses = (status) => {
    const base =
      "px-3 py-1 text-sm font-medium rounded-full inline-flex items-center";
    if (status === "Active") return `${base} bg-green-100 text-green-800`;
    if (status === "On Leave") return `${base} bg-yellow-100 text-yellow-800`;
    return `${base} bg-gray-100 text-gray-800`;
  };

  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <ProfileCard label="General Information" icon={<FiInfo />}>
          {!isEditing ? (
            <>
              <InfoDetail label="Staff ID" value={staff.staffId} />
              <InfoDetail label="Name" value={staff.name} />
              <InfoDetail label="Role" value={staff.role} />
              <InfoDetail label="Department" value={staff.department} />
              <InfoDetail label="Status" value={staff.status} />
              <InfoDetail label="Address" value={staff.address} />
              <InfoDetail label="Phone" value={staff.phone} />
            </>
          ) : (
            <>
              <input type="text" name="staffId" value={formData.staffId} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Staff ID" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Name" />
              <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Role" />
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Department" />
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-lg p-2">
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Address" />
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Phone" />
            </>
          )}
        </ProfileCard>

        <ProfileCard label="Academic / Assignment" icon={<FiInfo />}>
          {!isEditing ? (
            <>
              <InfoDetail label="Assigned Classes" value={staff.assignedClasses} />
              <InfoDetail label="Experience" value={staff.experience} />
              <InfoDetail label="Qualification" value={staff.qualification} />
            </>
          ) : (
            <>
              <input type="text" name="assignedClasses" value={formData.assignedClasses} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Assigned Classes" />
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Experience" />
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Qualification" />
            </>
          )}
        </ProfileCard>
      </div>

      <div className="space-y-8">
        <ProfileCard label="Contact" icon={<FiInfo />}>
          {!isEditing ? (
            <>
              <InfoDetail label="Email" value={staff.contact} />
              <InfoDetail label="Emergency Contact" value={staff.emergencyContact} />
            </>
          ) : (
            <>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Email" />
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Emergency Contact" />
            </>
          )}
        </ProfileCard>

        <ProfileCard label="Payroll" icon={<FiInfo />}>
          {!isEditing ? (
            <>
              <InfoDetail label="Salary" value={staff.salary} />
              <InfoDetail label="Last Payment" value={staff.lastPayment} />
            </>
          ) : (
            <>
              <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Salary" />
              <input type="text" name="lastPayment" value={formData.lastPayment} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Last Payment" />
            </>
          )}
        </ProfileCard>

        <ProfileCard label="Credentials" icon={<FiInfo />}>
          {!isEditing ? (
            <>
              <InfoDetail label="Username" value={staff.username} />
              <InfoDetail label="Password" value={staff.password} />
            </>
          ) : (
            <>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Username" />
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border rounded-lg p-2" placeholder="Password" />
            </>
          )}
        </ProfileCard>
      </div>
    </div>
  );

  const PerformanceTab = () => (
    <ProfileCard label="Performance" icon={<FiBarChart />}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={staff.performance || []}
            margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="score"
              fill="#4f46e5"
              name="Performance Score"
              barSize={40}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ProfileCard>
  );

  const DocumentsTab = () => (
    <ProfileCard label="Documents" icon={<FiFileText />}>
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
              formData.append("staffId", id);

              try {
                const res = await fetch(
                  `http://localhost:5000/api/staff/upload`,
                  {
                    method: 'POST',
                    body: formData,
                  }
                );
                
                const result = await res.json();
                if (res.ok && result.success) {
                  alert("Document uploaded successfully ✅");
                  // Refresh documents list
                  const response = await fetch(`http://localhost:5000/api/staff/documents/${id}`);
                  if (response.ok) {
                    const docs = await response.json();
                    setDocuments(docs);
                  }
                } else {
                  throw new Error(result.message || 'Upload failed');
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
            <li key={index} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{doc.name}</p>
                <p className="text-gray-500">
                  {new Date(doc.uploadedAt).toLocaleDateString()} - {(doc.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Preview functionality
                    const filename = doc.path.split('/').pop();
                    window.open(`http://localhost:5000/api/staff/preview/${filename}`, '_blank');
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Preview
                </button>
                <button
                  onClick={() => {
                    // Download functionality
                    const filename = doc.path.split('/').pop();
                    window.open(`http://localhost:5000/api/staff/download/${filename}`, '_blank');
                  }}
                  className="text-indigo-600 hover:underline font-semibold"
                >
                  Download
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="py-3 text-gray-500">No documents uploaded yet.</li>
        )}
      </ul>
    </ProfileCard>
  );

  const LeaveTab = () => {
    const statusClass = (status) => {
      if (status === "Approved") return "bg-green-100 text-green-800";
      if (status === "Pending") return "bg-yellow-100 text-yellow-800";
      return "bg-red-100 text-red-800";
    };

    return (
      <ProfileCard label="Leave History" icon={<FiCalendar />}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">From</th>
                <th className="px-4 py-2">To</th>
                <th className="px-4 py-2">Days</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaveHistory.map((leave, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-3">{leave.type}</td>
                  <td className="px-4 py-3">{leave.from}</td>
                  <td className="px-4 py-3">{leave.to}</td>
                  <td className="px-4 py-3">{leave.days}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProfileCard>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" /> Back to Staff Directory
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-200"
            src={staff.photo || "https://via.placeholder.com/150"}
            alt={staff.name}
          />
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{staff.name}</h1>
            <p className="text-lg text-indigo-600 font-medium">{staff.role}</p>
            <div className="mt-3">
              <span className={statusBadgeClasses(staff.status)}>
                {staff.status}
              </span>
            </div>
          </div>

          {/* Edit / Save / Cancel Buttons */}
          <div className="flex space-x-2 mt-4 sm:mt-0">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700"
              >
                <FiEdit2 /> <span>Edit</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
                >
                  <FiCheck /> <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-400"
                >
                  <FiX /> <span>Cancel</span>
                </button>
              </>
            )}
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
              label="Performance"
              isActive={activeTab === "performance"}
              onClick={() => setActiveTab("performance")}
              icon={<FiBarChart />}
            />
            <TabButton
              label="Documents"
              isActive={activeTab === "documents"}
              onClick={() => setActiveTab("documents")}
              icon={<FiFileText />}
            />
            <TabButton
              label="Leave History"
              isActive={activeTab === "leave"}
              onClick={() => setActiveTab("leave")}
              icon={<FiCalendar />}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "performance" && <PerformanceTab />}
          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "leave" && <LeaveTab />}
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
