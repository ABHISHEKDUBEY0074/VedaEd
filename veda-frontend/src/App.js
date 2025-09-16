import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "./SIS/DashboardLayout";
import TeacherDashboardLayout from "./TeacherSIS/DashboardLayout";

// Admin Dashboard Page
import Dashboard from "./SIS/Dashboard";

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

// Teacher SIS Pages
import TeacherClassesPage from "./TeacherSIS/Classes"; 
import TeacherStudentProfile from "./TeacherSIS/TeacherStudentProfile";
import TeacherAttendance from "./TeacherSIS/TeacherAttendance";
import AssignmentDashboardUI from "./TeacherSIS/Assingment/Dashboard"



const TeacherHome = () => <h2 className="text-xl">Welcome Teacher</h2>;

const TeacherAssignment = () => <AssignmentDashboardUI />;
const TeacherExams = () => <h2>Teacher Exams</h2>;
const TeacherTimetablePage = () => <h2>Teacher Timetable</h2>;
const TeacherGradebook = () => <h2>Teacher Gradebook</h2>;
const TeacherDiscipline = () => <h2>Disciplinary & Activity Records</h2>;
const TeacherCommunication = () => <h2>Communication</h2>;
const TeacherProfile = () => <h2>Teacher Profile</h2>;

function App() {
  return (
    <Routes>
      {/* SIS Dashboard */}
      <Route path="/" element={<DashboardLayout />}>
        {/* Default Dashboard Page */}
        <Route index element={<Dashboard />} />

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

        {/* Classes & Schedules */}
        <Route path="classes-schedules" element={<ClassesSchedules />}>
          <Route index element={<Navigate to="classes" />} />
          <Route path="classes" element={<Classes />} />
          <Route path="subject-group" element={<SubjectGroup />} />
          <Route path="assign-teacher" element={<AssignTeacher />} />
          <Route path="timetable" element={<Timetable />} />
        </Route>

        {/* Extra Pages */}
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

      {/* Teacher SIS Dashboard */}
      <Route path="/teacher" element={<TeacherDashboardLayout />}>
        <Route index element={<TeacherHome />} />
        <Route path="classes" element={<TeacherClassesPage />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="assignment" element={<TeacherAssignment />} />
        <Route path="exams" element={<TeacherExams />} />
        <Route path="timetable" element={<TeacherTimetablePage />} />
        <Route path="gradebook" element={<TeacherGradebook />} />
        <Route path="discipline" element={<TeacherDiscipline />} />
        <Route path="communication" element={<TeacherCommunication />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="student-profile" element={<TeacherStudentProfile />} />
        <Route path="assignment" element={<TeacherAssignment />} />
        


      </Route>
    </Routes>
  );
}

export default App;
