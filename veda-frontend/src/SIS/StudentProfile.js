import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiInfo, FiFileText, FiCalendar, FiDollarSign, FiBarChart } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockPerformance = [
  { term: "Term 1", score: 78 },
  { term: "Term 2", score: 82 },
  { term: "Term 3", score: 91 },
];

const mockDocuments = [
  { name: "Report Card.pdf", date: "2024-03-15", size: "1.2 MB" },
  { name: "Transfer Certificate.pdf", date: "2023-06-10", size: "800 KB" },
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

const StudentProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state || null;
  const [activeTab, setActiveTab] = useState("overview");

  if (!student) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Student Not Found</h2>
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
  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <ProfileCard label="General Information" icon={<FiInfo />}>
          <InfoDetail label="Student ID" value={student.id} />
          <InfoDetail label="Name" value={student.name} />
          <InfoDetail label="Class" value={student.grade} />
          <InfoDetail label="Section" value={student.section} />
          <InfoDetail label="Gender" value={student.gender} />
          <InfoDetail label="DOB" value={student.dob} />
          <InfoDetail label="Age" value={student.age} />
          <InfoDetail label="Address" value={student.address} />
        </ProfileCard>
      </div>
      <div className="space-y-8">
        <ProfileCard label="Parent Info" icon={<FiInfo />}>
          <InfoDetail label="Father" value={student.fatherName} />
          <InfoDetail label="Mother" value={student.motherName} />
          <InfoDetail label="Contact" value={student.contact} />
        </ProfileCard>
      </div>
    </div>
  );

  const PerformanceTab = () => (
    <ProfileCard label="Performance" icon={<FiBarChart />}>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={mockPerformance} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="term" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="score" fill="#4f46e5" name="Score" barSize={40} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ProfileCard>
  );

  const AttendanceTab = () => (
    <ProfileCard label="Attendance" icon={<FiCalendar />}>
      <InfoDetail label="Attendance %" value={student.attendance} />
      <InfoDetail label="Last Present" value="2024-08-05" />
    </ProfileCard>
  );

  const FeeTab = () => (
    <ProfileCard label="Fee Details" icon={<FiDollarSign />}>
      <InfoDetail label="Total Fee" value="₹50,000" />
      <InfoDetail label="Paid" value={student.fee === "Paid" ? "₹50,000" : "₹25,000"} />
      <InfoDetail label="Due" value={student.fee === "Paid" ? "₹0" : "₹25,000"} />
      <InfoDetail label="Status" value={student.fee} />
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
            <FiArrowLeft className="w-5 h-5 mr-2" /> Back to Student Directory
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <img className="w-32 h-32 rounded-full object-cover ring-4 ring-indigo-200" src={student.photo || "https://via.placeholder.com/150"} alt={student.name} />
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-lg text-indigo-600 font-medium">{student.grade} - {student.section}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex space-x-2">
            <TabButton label="Overview" isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<FiInfo />} />
            <TabButton label="Performance" isActive={activeTab === "performance"} onClick={() => setActiveTab("performance")} icon={<FiBarChart />} />
            <TabButton label="Attendance" isActive={activeTab === "attendance"} onClick={() => setActiveTab("attendance")} icon={<FiCalendar />} />
            <TabButton label="Fee" isActive={activeTab === "fee"} onClick={() => setActiveTab("fee")} icon={<FiDollarSign />} />
            <TabButton label="Documents" isActive={activeTab === "documents"} onClick={() => setActiveTab("documents")} icon={<FiFileText />} />
          </div>
        </div>
        <div>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "performance" && <PerformanceTab />}
          {activeTab === "attendance" && <AttendanceTab />}
          {activeTab === "fee" && <FeeTab />}
          {activeTab === "documents" && <DocumentsTab />}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
