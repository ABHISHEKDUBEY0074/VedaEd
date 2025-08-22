// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// //import DashboardLayout from "../DashboardLayout";
// //import DocumentsTab from './Tabs/DocumentsTab';
// //import AttendanceTab from './Tabs/AttendanceTab';
// //import PerformanceTab from './Tabs/PerformanceTab';
// //import FeesTab from './Tabs/FeesTab';
// //import TransportTab from './Tabs/TransportTab';
// //import HostelTab from './Tabs/HostelTab';
// //import FutureItemTab from './Tabs/FutureItemTab';

// const Row = ({ label, value, editable, onChange }) => (
//   <div className="flex justify-between border-b py-2 text-sm items-center">
//     <span className="font-medium text-gray-700 w-1/2">{label} :</span>
//     <span className="w-1/2 text-gray-800">
//       {editable ? (
//         <input
//           className="w-full border p-1 rounded"
//           value={value || ""}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       ) : (
//         value || "N/A"
//       )}
//     </span>
//   </div>
// );

// const StudentProfile = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const initialData = location.state || {};
//   const [activeTab, setActiveTab] = useState("Profile");
//   const [editMode, setEditMode] = useState(false);
//   const [studentData, setStudentData] = useState({ ...initialData });

//   const handleChange = (key, value) => {
//     setStudentData((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSave = () => {
//     // TODO: Save to backend or local storage if needed
//     setEditMode(false);
//   };

//   const handleCancel = () => {
//     setStudentData({ ...initialData });
//     setEditMode(false);
//   };

//   const tabs = [
//     "Profile",
//     "Documents",
//     "Attendance",
//     "Performance",
//     "Fees",
//     "Transport",
//     "Hostel",
//     "Future Item",
//   ];

  

//   return (
//     <DashboardLayout>
//       <div className="p-6">
//         {/* Breadcrumbs */}
//         <div className="text-sm text-gray-500 mb-2">
//           <span
//             className="hover:underline cursor-pointer text-blue-600"
//             onClick={() => navigate("/students")}
//           >
//             Student
//           </span>
//           <span className="mx-2"> &gt; </span>
//           <span className="text-gray-700 font-medium">Profile</span>
//         </div>

//         <h1 className="text-2xl font-bold mb-4">Student</h1>

//         {/* Profile Header */}
//         <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow">
//           <div className="flex items-center gap-4">
//             <img
//               src={studentData.photo || "https://via.placeholder.com/80"}
//               alt="student"
//               className="w-20 h-20 object-cover rounded-full"
//             />
//             <div>
//               <h2 className="text-xl font-semibold">{studentData.name}</h2>
//               <p className="text-gray-600">Student ID: {studentData.id}</p>
//               <p className="text-gray-600">Class: {studentData.grade}</p>
//             </div>
//           </div>
//           {!editMode ? (
//             <button
//               className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
//               onClick={() => setEditMode(true)}
//             >
//               Edit
//             </button>
//           ) : (
//             <div className="flex gap-2">
//               <button
//                 onClick={handleSave}
//                 className="bg-orange-500 hover:bg-orange-500 text-white px-4 py-2 rounded shadow"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={handleCancel}
//                 className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow"
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Tabs */}
//         <div className="border-b mb-4 text-sm font-medium text-gray-500 overflow-x-auto flex gap-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               className={`py-2 ${
//                 activeTab === tab ? "border-b-2 border-black text-black" : ""
//               }`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         {activeTab === "Profile" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Left Column */}
//             <div className="bg-white p-6 rounded shadow">
//               <h3 className="text-lg font-semibold mb-4 text-gray-700">
//                 Student Information
//               </h3>
//               <Row
//                 label="Full name"
//                 value={studentData.name}
//                 editable={editMode}
//                 onChange={(val) => handleChange("name", val)}
//               />
//               <Row
//                 label="Gender"
//                 value={studentData.gender}
//                 editable={editMode}
//                 onChange={(val) => handleChange("gender", val)}
//               />
//               <Row
//                 label="Date of Birth"
//                 value={studentData.dob}
//                 editable={editMode}
//                 onChange={(val) => handleChange("dob", val)}
//               />
//               <Row
//                 label="Age"
//                 value={studentData.age}
//                 editable={editMode}
//                 onChange={(val) => handleChange("age", val)}
//               />
//               <Row
//                 label="Nationality"
//                 value={studentData.nationality}
//                 editable={editMode}
//                 onChange={(val) => handleChange("nationality", val)}
//               />
//               <Row
//                 label="Religion"
//                 value={studentData.religion}
//                 editable={editMode}
//                 onChange={(val) => handleChange("religion", val)}
//               />
//               <Row
//                 label="Caste"
//                 value={studentData.caste}
//                 editable={editMode}
//                 onChange={(val) => handleChange("caste", val)}
//               />
//               <Row
//                 label="Blood Group"
//                 value={studentData["Blood Group"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Blood Group", val)}
//               />
//               <h3 className="text-lg font-semibold mt-6 mb-4 text-gray-700">
//                 Parent/Guardian Information
//               </h3>
//               <Row
//                 label="Father"
//                 value={studentData["Father Name"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Father Name", val)}
//               />
//               <Row
//                 label="Mother"
//                 value={studentData["Mother Name"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Mother Name", val)}
//               />
//               <Row
//                 label="Occupation"
//                 value={studentData.occupation}
//                 editable={editMode}
//                 onChange={(val) => handleChange("occupation", val)}
//               />
//               <Row
//                 label="Primary Contact Number"
//                 value={studentData["Primary Contact Number"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Primary Contact Number", val)}
//               />
//               <Row
//                 label="Emergency Contact"
//                 value={studentData["Emergency Contact"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Emergency Contact", val)}
//               />
//             </div>

//             {/* Right Column */}
//             <div className="bg-white p-6 rounded shadow">
//               <h3 className="text-lg font-semibold mb-4 text-gray-700">
//                 Academic Information
//               </h3>
//               <Row label="Student ID" value={studentData.id} />
//               <Row
//                 label="Class"
//                 value={studentData.grade}
//                 editable={editMode}
//                 onChange={(val) => handleChange("grade", val)}
//               />
//               <Row
//                 label="Section"
//                 value={studentData.section}
//                 editable={editMode}
//                 onChange={(val) => handleChange("section", val)}
//               />
//               <Row
//                 label="Roll Number"
//                 value={studentData["Roll Number"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Roll Number", val)}
//               />
//               <Row
//                 label="Admission Number"
//                 value={studentData["Admission Number"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Admission Number", val)}
//               />
//               <Row
//                 label="Date of Admission"
//                 value={studentData["Admission Date"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Admission Date", val)}
//               />
//               <Row
//                 label="Academic Year"
//                 value={studentData["Academic Year"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Academic Year", val)}
//               />
//               <Row
//                 label="Previous School"
//                 value={studentData["Previous School"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Previous School", val)}
//               />
//               <Row
//                 label="Admission Type"
//                 value={studentData["Admission Type"]}
//                 editable={editMode}
//                 onChange={(val) => handleChange("Admission Type", val)}
//               />
//               <Row label="Empty Fields" value="" />
//             </div>
//           </div>
//         )}
//         {/* {activeTab === "Documents" && <DocumentsTab student={studentData} />}
// {activeTab === "Attendance" && <AttendanceTab student={studentData} />}
// {activeTab === "Performance" && <PerformanceTab student={studentData} />}
// {activeTab === "Fees" && <FeesTab student={studentData} />}
// {activeTab === "Transport" && <TransportTab student={studentData} />}
// {activeTab === "Hostel" && <HostelTab student={studentData} />}
// {activeTab === "Future Item" && <FutureItemTab student={studentData} />} */}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default StudentProfile;