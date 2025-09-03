import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import DashboardLayout from "./SIS/DashboardLayout";

// Student & Staff
import Student from "./SIS/Student";
import Staff from "./SIS/Staff";
import StudentProfile from "./SIS/StudentProfile";
import StaffProfile from "./SIS/Staffprofile";

// Parents
import Parents from "./SIS/Parents";
import ParentProfile from "./SIS/ParentProfile";

// Attendance
import Attendance from "./SIS/Attendance/Attendance";
import Overview from "./SIS/Attendance/Overview";
import ByClass from "./SIS/Attendance/ByClass";
import ByStudent from "./SIS/Attendance/ByStudent";
import ClassDetail from "./SIS/Attendance/ClassDetail";
import StudentDetail from "./SIS/Attendance/StudentDetail";

// Reports
import Reports from "./SIS/Reports/Reports";

// Classes & Schedules
import ClassesSchedules from "./SIS/classes-schedules/ClassesSchedules";
import Classes from "./SIS/classes-schedules/Classes";
import SubjectGroup from "./SIS/classes-schedules/SubjectGroup";
import AssignTeacher from "./SIS/classes-schedules/AssignTeacher";
import Timetable from "./SIS/classes-schedules/Timetable";
import AddClass from "./SIS/classes-schedules/AddClass";
import AddSubject from "./SIS/classes-schedules/AddSubject";
import ClassDetailPage from "./SIS/classes-schedules/ClassDetailPage";
import ClassTimetable from "./SIS/classes-schedules/ClassTimetable";
import TeacherTimetable from "./SIS/classes-schedules/TeacherTimetable";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Dashboard Default */}
        <Route
          index
          element={<h2 className="text-xl">Welcome to Dashboard</h2>}
        />

        {/* Students & Staff */}
        <Route path="students" element={<Student />} />
        <Route path="student-profile" element={<StudentProfile />} />
        <Route path="staff" element={<Staff />} />
        <Route path="staff-profile/:id" element={<StaffProfile />} />

        {/* Parents */}
        <Route path="parents" element={<Parents />} />
        <Route path="parent-profile/:parentId" element={<ParentProfile />} />

        {/* Reports */}
        <Route path="reports" element={<Reports />} />

        {/* Attendance Module */}
        <Route path="attendance" element={<Attendance />}>
          <Route index element={<Navigate to="overview" />} />
          <Route path="overview" element={<Overview />} />
          <Route path="by-class" element={<ByClass />} />
          <Route path="by-student" element={<ByStudent />} />
          <Route path="by-class/:id" element={<ClassDetail />} />
          <Route path="by-student/:id" element={<StudentDetail />} />
        </Route>

        {/* Classes & Schedules (Tab Based with Nested Routes) */}
        <Route path="classes-schedules" element={<ClassesSchedules />}>
          <Route index element={<Navigate to="classes" />} />
          <Route path="classes" element={<Classes />} />
          <Route path="subject-group" element={<SubjectGroup />} />
          <Route path="assign-teacher" element={<AssignTeacher />} />
          <Route path="timetable" element={<Timetable />} />
        </Route>

        {/* Extra Pages (Direct Routes) */}
        <Route path="classes-schedules/add-class" element={<AddClass />} />
        <Route path="classes-schedules/add-subject" element={<AddSubject />} />
        <Route
          path="classes-schedules/class-detail/:classId/:sectionId"
          element={<ClassDetailPage />}
        />
        <Route
          path="classes-schedules/class-timetable/:classId"
          element={<ClassTimetable />}
        />
        <Route
          path="classes-schedules/teacher-timetable/:teacherId"
          element={<TeacherTimetable />}
        />
      </Route>
    </Routes>
  );
}

export default App;
