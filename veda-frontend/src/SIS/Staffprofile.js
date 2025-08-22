import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiInfo, FiBarChart, FiMail, FiEdit, FiFileText, FiCalendar } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const mockDocuments = [
  { name: "Employment Contract.pdf", date: "2020-07-01", size: "2.3 MB" },
  { name: "Annual Performance Review 2023.docx", date: "2023-12-15", size: "450 KB" },
  { name: "Updated CV.pdf", date: "2022-05-20", size: "1.1 MB" },
];

const mockLeaveHistory = [
  { type: "Annual Leave", from: "2023-08-10", to: "2023-08-15", days: 5, status: "Approved" },
  { type: "Sick Leave", from: "2023-10-02", to: "2023-10-02", days: 1, status: "Approved" },
  { type: "Unpaid Leave", from: "2024-01-20", to: "2024-01-22", days: 2, status: "Pending" },
];

const ProfileCard = ({ label, children, icon }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="text-indigo-500 mr-3">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
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
      isActive ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StaffProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const staff = location.state || null;
  const [activeTab, setActiveTab] = useState("overview");

  if (!staff) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Staff Member Not Found</h2>
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

  const statusBadgeClasses = (status) => {
    const base = "px-3 py-1 text-sm font-medium rounded-full inline-flex items-center";
    if (status === "Active") return `${base} bg-green-100 text-green-800`;
    if (status === "On Leave") return `${base} bg-yellow-100 text-yellow-800`;
    return `${base} bg-gray-100 text-gray-800`;
  };

  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <ProfileCard label="General Information" icon={<FiInfo />}>
          <InfoDetail label="Staff ID" value={staff.staffId} />
          <InfoDetail label="Name" value={staff.name} />
          <InfoDetail label="Role" value={staff.role} />
          <InfoDetail label="Department" value={staff.department} />
          <InfoDetail label="Status" value={staff.status} />
        </ProfileCard>
        <ProfileCard label="Academic / Assignment" icon={<FiInfo />}>
          <InfoDetail label="Assigned Classes" value={staff.assignedClasses} />
        </ProfileCard>
      </div>
      <div className="space-y-8">
        <ProfileCard label="Contact" icon={<FiInfo />}>
          <InfoDetail label="Email" value={staff.contact} />
        </ProfileCard>
      </div>
    </div>
  );

  const PerformanceTab = () => (
    <ProfileCard label="Performance" icon={<FiBarChart />}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={staff.performance || []} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#4f46e5" name="Performance Score" barSize={40} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ProfileCard>
  );

  const DocumentsTab = () => (
    <ProfileCard label="Documents" icon={<FiFileText />}>
      <ul className="divide-y divide-gray-200">
        {mockDocuments.map((doc) => (
          <li key={doc.name} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{doc.name}</p>
              <p className="text-gray-500">{doc.date} - {doc.size}</p>
            </div>
            <a href="#" className="text-indigo-600 hover:underline font-semibold">Download</a>
          </li>
        ))}
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
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass(leave.status)}`}>
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
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
            <FiArrowLeft className="w-5 h-5 mr-2" /> Back to Staff Directory
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-200" src={staff.photo || "https://via.placeholder.com/150"} alt={staff.name} />
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{staff.name}</h1>
            <p className="text-lg text-indigo-600 font-medium">{staff.role}</p>
            <div className="mt-3">
              <span className={statusBadgeClasses(staff.status)}>{staff.status}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex space-x-2">
            <TabButton label="Overview" isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<FiInfo />} />
            <TabButton label="Performance" isActive={activeTab === "performance"} onClick={() => setActiveTab("performance")} icon={<FiBarChart />} />
            <TabButton label="Documents" isActive={activeTab === "documents"} onClick={() => setActiveTab("documents")} icon={<FiFileText />} />
            <TabButton label="Leave History" isActive={activeTab === "leave"} onClick={() => setActiveTab("leave")} icon={<FiCalendar />} />
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
