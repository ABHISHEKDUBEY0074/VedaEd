import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './SIS/DashboardLayout';
import Student from './SIS/Student';
import Staff from './SIS/Staff';
import StudentProfile from "./SIS/StudentProfile";
import StaffProfile from './SIS/Staffprofile';  
import Parents from './SIS/Parents';
import ParentProfile from './SIS/ParentProfile';


import Attendance from "./SIS/Attendance/Attendance";

import Overview from "./SIS/Attendance/Overview";
import ByClass from "./SIS/Attendance/ByClass";
import ByStudent from "./SIS/Attendance/ByStudent";
import ClassDetail from "./SIS/Attendance/ClassDetail"; 
import StudentDetail from "./SIS/Attendance/StudentDetail"; 
import ClassManagement from "./SIS/ClassManagement/ClassManagement";




function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<h2 className="text-xl">Welcome to Dashboard</h2>} />
        <Route path="students" element={<Student />} />
        <Route path="staff" element={<Staff />} />
         <Route path="/student-profile" element={<StudentProfile />} />

         
         <Route path="/" element={<Navigate to="/class-management" replace />} />

        {/* Class Management routes */}
        <Route path="/classes/*" element={<ClassManagement />} />
       
        
        <Route path="staff-profile/:id" element={<StaffProfile />} />
        <Route path="/parents" element={<Parents />} />
        <Route path="/parent-profile/:parentId" element={<ParentProfile />} />
        <Route path="attendance" element={<Attendance />}>
          <Route index element={<Navigate to="overview" />} />
          <Route path="overview" element={<Overview />} />
          <Route path="by-class" element={<ByClass />} />
          <Route path="by-student" element={<ByStudent />} />
          <Route path="by-class/:id" element={<ClassDetail />} />
          <Route path="by-student/:id" element={<StudentDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
