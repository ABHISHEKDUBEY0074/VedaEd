import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "./SIS/DashboardLayout";
import TeacherDashboardLayout from "./TeacherSIS/DashboardLayout";
import TeacherCommunicationLayout from "./TeacherCommunication/TeacherCommunicationLayout";

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

// ===== Teacher SIS =====
import TeacherClassesPage from "./TeacherSIS/Classes"; 
import TeacherStudentProfile from "./TeacherSIS/TeacherStudentProfile";
import TeacherAttendance from "./TeacherSIS/TeacherAttendance";
import AssignmentDashboardUI from "./TeacherSIS/Assingment/Dashboard"
import TTimetable from "./TeacherSIS/Timetable/TTimetable";
import TeacherMyTimetable from "./TeacherSIS/Timetable/MyTimetable";  
import TClassTimetable from "./TeacherSIS/Timetable/TClassTimetable";
import CreateAssignment from "./TeacherSIS/Assingment/CreateAssignment";
import TeacherHome from "./TeacherSIS/Dashboard";
import TeacherProfile from "./TeacherSIS/Profile"; 
import TeacherExams from "./TeacherSIS/Exams";
import TeacherDiscipline from "./TeacherSIS/Discipline";
import TeacherCommunicationPage from "./TeacherSIS/Communication";
import TeacherGradebook from "./TeacherSIS/Gradebook";
import TeacherStudentHealth from "./TeacherSIS/StudentHealth";



// ===== Student SIS =====
import StudentDashboardLayout from "./StudentSIS/DashboardLayout";
import StudentDashboard from "./StudentSIS/Dashboard";
import MyClasses from "./StudentSIS/Classes";
import StudentMyTimetable from "./StudentSIS/Timetable"; 
import Assignments from "./StudentSIS/Assignments";
import Exams from "./StudentSIS/Exams";
import StudentProfilePage from "./StudentSIS/Profile";   
import StudentAttendance from "./StudentSIS/Attendance";
import Curriculum from "./StudentSIS/Curriculum";

// ===== Parent SIS =====
import ParentDashboardLayout from "./ParentSIS/DashboardLayout";
import ParentDashboard from "./ParentSIS/Dashboard";
import ParentClasses from "./ParentSIS/Classes";
import ParentCurriculum from "./ParentSIS/Curriculum";
import ParentTimetable from "./ParentSIS/Timetable";
import ParentAttendance from "./ParentSIS/Attendance";
import ParentAssignments from "./ParentSIS/Assignments";
import ParentExams from "./ParentSIS/Exams";
import ParentProfilePage from "./ParentSIS/Profile";
import ParentFees from "./ParentSIS/Fees";
import ParentCommunication from "./ParentSIS/Communication";

// ===== Communication Modules =====
import CommunicationAdminLayout from "./CommunicationModuleadmin/CommunicationAdminLayout";
import Logs from "./CommunicationModuleadmin/Logs/Logs";
import AllLogs from "./CommunicationModuleadmin/Logs/AllLogs";
import ScheduleLogs from "./CommunicationModuleadmin/Logs/ScheduleLogs";
import OthersLogs from "./CommunicationModuleadmin/Logs/Others";
import Notices from "./CommunicationModuleadmin/Notices/Notices";
import PostNotices from "./CommunicationModuleadmin/Notices/PostNotices";
import NoticeTemplates from "./CommunicationModuleadmin/Notices/NoticeTemplates";
import OthersNotices from "./CommunicationModuleadmin/Notices/OthersNotices";
import Messages from "./CommunicationModuleadmin/Messages/Messages";
import Group from "./CommunicationModuleadmin/Messages/Group";
import Individual from "./CommunicationModuleadmin/Messages/Individual";
import ClassMsg from "./CommunicationModuleadmin/Messages/Class";  
import Templates from "./CommunicationModuleadmin/Messages/Templates";

import CommunicationStudentLayout from "./CommunicationModuleStudent/CommunicationStudentLayout";
import StudentLogs from "./CommunicationModuleStudent/Logs";
import StudentNotices from "./CommunicationModuleStudent/Notices";
import StudentMessages from "./CommunicationModuleStudent/Messages";
import StudentComplaints from "./CommunicationModuleStudent/Complaints";

import TeacherLogs from "./TeacherCommunication/Logs/Logs";
import TeacherNotices from "./TeacherCommunication/Notices/Notices";
import TeacherMessages from "./TeacherCommunication/Messages/Messages";
import TeacherComplaints from "./TeacherCommunication/Complaints/Complaints";

import CommunicationParentLayout from "./CommunicationModuleParents/CommunicationParentLayout";
import ParentLogs from "./CommunicationModuleParents/Logs";
import ParentNotices from "./CommunicationModuleParents/Notices";
import ParentMessages from "./CommunicationModuleParents/Messages";
import AdminComplaints from "./CommunicationModuleadmin/Complaints";
import ParentComplaints from "./CommunicationModuleParents/Complaints";

// ===== HR Module =====
import HRDashboardLayout from "./HR/HRDashboardLayout";
import StaffDirectory from "./HR/StaffDirectory/StaffDirectory";
import HRStaffProfile from "./HR/StaffDirectory/HRStaffProfile";
import StaffAttendance from "./HR/StaffAttendance/StaffAttendance";
import Payroll from "./HR/Payroll/Payroll";
import ApproveLeave from "./HR/ApproveLeave/ApproveLeave";

// ===== Receptionist Module =====
import ReceptionistDashboardLayout from "./Receptionist/DashboardLayout";
import ReceptionistAdmissionEnquiry from "./Receptionist/AdmissionEnquiry/AdmissionEnquiry";
import VisitorBook from "./Receptionist/VisitorBook/VisitorBook";
import SetupFrontOffice from "./Receptionist/SetupFrontOffice/SetupFrontOffice";
import StudentDetails from "./Receptionist/StudentDetails/StudentDetails";
import ReceptionistStaffDirectory from "./Receptionist/StaffDirectory/StaffDirectory";
import ZoomLiveClasses from "./Receptionist/ZoomLiveClasses/ZoomLiveClasses";

// ===== Admission Module =====
import AdmissionDashboardLayout from "./AdmissionModule/DashboardLayout";
import AdmissionDashboard from "./AdmissionModule/Dashboard";
import AdmissionEnquiry from "./AdmissionModule/AdmissionEnquiry/AdmissionEnquiry";
import EntranceList from "./AdmissionModule/EntranceList/EntranceList";
import InterviewList from "./AdmissionModule/InterviewList/InterviewList";
import AdmissionForm from "./AdmissionModule/AdmissionForm/AdmissionForm";
import DocumentVerification from "./AdmissionModule/DocumentVerification/DocumentVerification";
import RegistrationFees from "./AdmissionModule/RegistrationFees/RegistrationFees";
import ApplicationApproval from "./AdmissionModule/ApplicationApproval/ApplicationApproval.jsx";
import ApplicationOffer from "./AdmissionModule/ApplicationOffer/ApplicationOffer.jsx";


import AdminCalendarLayout from "./AdminCalendar/DashboardLayout";
import AnnualCalendar from "./AdminCalendar/AnnualCalendar";
import EventType from "./AdminCalendar/EventType";
import TimetableSetup from "./AdminCalendar/TimetableSetup";


import TeacherAnnualCalendar from "./TeacherCalendar/TeacherAnnualCalendar";
import StudentAnnualCalendar from "./StudentCalendar/StudentAnnualCalendar";



const TeacherAssignment = () => <AssignmentDashboardUI />;

function App() {
  return (
    <Routes>
      {/* ================= ADMIN SIS ================= */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Student />} />
        <Route path="student-profile/:id" element={<StudentProfile />} />
        <Route path="staff" element={<Staff />} />
        <Route path="staff-profile/:id" element={<StaffProfile />} />
        <Route path="parents" element={<Parents />} />
        <Route path="parent-profile/:parentId" element={<ParentProfile />} />
        <Route path="reports" element={<Reports />} />

        {/* Attendance */}
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
        <Route path="classes-schedules/add-class" element={<AddClass />} />
        <Route path="classes-schedules/add-subject" element={<AddSubject />} />
        <Route path="classes-schedules/class-detail/:classId/:sectionId" element={<ClassDetailPage />} />
        <Route path="classes-schedules/class-timetable/:classId" element={<ClassTimetable />} />
        <Route path="classes-schedules/teacher-timetable/:teacherId" element={<TeacherTimetable />} />
      </Route>

      {/* ================= TEACHER SIS ================= */}
      <Route path="/teacher" element={<TeacherDashboardLayout />}>
        <Route index element={<TeacherHome />} />
        <Route path="classes" element={<TeacherClassesPage />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="assignment" element={<TeacherAssignment />} />
        <Route path="assignment/create" element={<CreateAssignment />} />
        <Route path="exams" element={<TeacherExams />} />
        <Route path="timetable" element={<TTimetable />}>
          <Route index element={<Navigate to="my" replace />} />
          <Route path="my" element={<TeacherMyTimetable />} />
          <Route path="class" element={<TClassTimetable />} />
        </Route>
     <Route path="gradebook" element={<TeacherGradebook />} />
        <Route path="discipline" element={<TeacherDiscipline />} />
        <Route path="communication" element={<TeacherCommunicationPage />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="student-profile" element={<TeacherStudentProfile />} />
          <Route path="student-health" element={<TeacherStudentHealth />} />
      </Route>

      {/* ================= STUDENT SIS ================= */}
      <Route path="/student" element={<StudentDashboardLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="classes" element={<MyClasses />} />
        <Route path="curriculum" element={<Curriculum />} />
        <Route path="timetable" element={<StudentMyTimetable />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="exams" element={<Exams />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="attendance" element={<StudentAttendance />} />
      </Route>

      {/* ================= PARENT SIS ================= */}
     <Route path="/parent" element={<ParentDashboardLayout />}>
  <Route index element={<ParentDashboard />} />
  <Route path="classes" element={<ParentClasses />} />
  <Route path="curriculum" element={<ParentCurriculum />} />
  <Route path="timetable" element={<ParentTimetable />} />
  <Route path="attendance" element={<ParentAttendance />} />
  <Route path="assignments" element={<ParentAssignments />} />
  <Route path="exams" element={<ParentExams />} />
  <Route path="profile" element={<ParentProfilePage />} />
  <Route path="fees" element={<ParentFees />} />
  <Route path="communication" element={<ParentCommunication />} />
</Route>

      {/* ================= COMMUNICATION ================= */}
      <Route path="/communication/*" element={<CommunicationAdminLayout />}>
        <Route path="logs" element={<Logs />}>
          <Route index element={<AllLogs />} />
          <Route path="schedule" element={<ScheduleLogs />} />
          <Route path="others" element={<OthersLogs />} />
        </Route>
        <Route path="notices" element={<Notices />}>
          <Route index element={<PostNotices />} />
          <Route path="templates" element={<NoticeTemplates />} />
          <Route path="others" element={<OthersNotices />} />
        </Route>
        <Route path="messages" element={<Messages />}>
          <Route index element={<Group />} />
          <Route path="individual" element={<Individual />} />
          <Route path="class" element={<ClassMsg />} />
          <Route path="templates" element={<Templates />} />
        </Route>
        <Route path="complaints" element={<AdminComplaints />} />
      </Route>

      <Route path="/student/communication" element={<CommunicationStudentLayout />}>
        <Route path="logs" element={<StudentLogs />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="complaints" element={<StudentComplaints />} />
      </Route>

      <Route path="/teacher-communication" element={<TeacherCommunicationLayout />}>
        <Route index element={<Navigate to="logs" replace />} />
        <Route path="logs" element={<TeacherLogs />} />
        <Route path="notices" element={<TeacherNotices />} />
        <Route path="messages" element={<TeacherMessages />} />
        <Route path="complaints" element={<TeacherComplaints />} />
      </Route>

      <Route path="/parent/communication" element={<CommunicationParentLayout />}>
        <Route index element={<ParentLogs />} />
        <Route path="logs" element={<ParentLogs />} />
        <Route path="notices/*" element={<ParentNotices />} />
        <Route path="messages/*" element={<ParentMessages />} />
        <Route path="complaints" element={<ParentComplaints />} />
      </Route>

      {/* ================= HR, RECEPTIONIST, ADMISSION remain unchanged ================= */}
      <Route path="/hr" element={<HRDashboardLayout />}>
        <Route path="staff-directory" element={<StaffDirectory />} />
        <Route path="staff-profile/:id" element={<HRStaffProfile />} />
        <Route path="staff-attendance" element={<StaffAttendance />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="approve-leave" element={<ApproveLeave />} />
      </Route>

      <Route path="/receptionist" element={<ReceptionistDashboardLayout />}>
        <Route path="admission-enquiry" element={<ReceptionistAdmissionEnquiry />} />
        <Route path="visitor-book" element={<VisitorBook />} />
        <Route path="setup-front-office" element={<SetupFrontOffice />} />
        <Route path="student-details" element={<StudentDetails />} />
        <Route path="staff-directory" element={<ReceptionistStaffDirectory />} />
        <Route path="zoom-live-classes" element={<ZoomLiveClasses />} />
      </Route>

      <Route path="/admission" element={<AdmissionDashboardLayout />}>
        <Route index element={<AdmissionDashboard />} />
        <Route path="admission-enquiry" element={<AdmissionEnquiry />} />
        <Route path="admission-form" element={<AdmissionForm />} />
        <Route path="application-approval" element={<ApplicationApproval />} />
        <Route path="entrance-list" element={<EntranceList />} />
        <Route path="interview-list" element={<InterviewList />} />
        <Route path="document-verification" element={<DocumentVerification />} />
        <Route path="application-offer" element={<ApplicationOffer />} />
        <Route path="registration-fees" element={<RegistrationFees />} />
      </Route>
      {/* Admin Calendar Layout Routes */}
        <Route path="/admincalendar" element={<AdminCalendarLayout />}>
          <Route path="annualcalendar" element={<AnnualCalendar />} />
          <Route path="eventtype" element={<EventType />} />
          <Route path="timetablesetup" element={<TimetableSetup />} />
        </Route>


          {/* ==== TEACHER ==== */}
  <Route path="/teacher/calendar" element={<TeacherAnnualCalendar />} />
  <Route path="/teacher/calendar/:id" element={<TeacherAnnualCalendar />} />

  {/* ==== STUDENT ==== */}
  <Route path="/student/calendar" element={<StudentAnnualCalendar />} />
  <Route path="/student/calendar/:id" element={<StudentAnnualCalendar />} />
    </Routes>
  );
}

export default App;