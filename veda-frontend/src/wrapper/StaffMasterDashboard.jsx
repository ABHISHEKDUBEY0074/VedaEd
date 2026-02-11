import {
  FiUsers,
  FiBookOpen,
  FiClipboard,
  FiCalendar,
  FiMessageCircle,
  FiAward,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function StaffMasterDashboard() {
  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl font-bold text-gray-700">
          Teacher Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of your academic activities
        </p>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Classes" value="6" icon={<FiUsers />} />
        <StatCard title="Students" value="180" icon={<FiBookOpen />} />
        <StatCard title="Assignments" value="12" icon={<FiClipboard />} />
        <StatCard title="Exams" value="3" icon={<FiAward />} />
        <StatCard title="Messages" value="9" icon={<FiMessageCircle />} />
        <StatCard title="Events" value="4" icon={<FiCalendar />} />
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickCard title="My Classes" to="/teacher/classes" />
        <QuickCard title="Attendance" to="/teacher/attendance" />
        <QuickCard title="Assignments" to="/teacher/assignment" />
        <QuickCard title="Gradebook" to="/teacher/gradebook" />
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== TODAY TIMETABLE ===== */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">Today's Timetable</h2>
          <ul className="space-y-3 text-sm">
            <TimetableRow time="09:00 - 09:45" subject="Maths" className="8-A" />
            <TimetableRow time="10:00 - 10:45" subject="Science" className="8-B" />
            <TimetableRow time="11:00 - 11:45" subject="Maths" className="9-A" />
            <TimetableRow time="12:30 - 01:15" subject="Science" className="9-B" />
          </ul>
        </div>

        {/* ===== RECENT ASSIGNMENTS ===== */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">Recent Assignments</h2>
          <ul className="space-y-3 text-sm">
            <ListRow title="Algebra Worksheet" meta="Class 8-A • Due Tomorrow" />
            <ListRow title="Physics Lab Report" meta="Class 9-B • Due in 2 days" />
            <ListRow title="Chapter Test Prep" meta="Class 8-B • Due Friday" />
          </ul>
        </div>

        {/* ===== ANNOUNCEMENTS ===== */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-3">Announcements</h2>
          <ul className="space-y-3 text-sm">
            <ListRow title="Staff Meeting" meta="Tomorrow at 2 PM" />
            <ListRow title="Exam Schedule Released" meta="Check exam module" />
            <ListRow title="Annual Day Practice" meta="Starts Monday" />
          </ul>
        </div>
      </div>

      {/* ===== COMMUNICATION + CALENDAR ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <DashboardLink
          title="Teacher Communication"
          desc="Messages, Notices & Complaints"
          to="/teacher-communication/logs"
        />

        <DashboardLink
          title="Academic Calendar"
          desc="View events & schedules"
          to="/teacher/calendar"
        />

      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
    <div className="text-indigo-600 text-xl">{icon}</div>
    <div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  </div>
);

const QuickCard = ({ title, to }) => (
  <Link
    to={to}
    className="bg-indigo-50 rounded-xl p-4 text-center font-medium text-indigo-600 hover:bg-indigo-100"
  >
    {title}
  </Link>
);

const TimetableRow = ({ time, subject, className }) => (
  <li className="flex justify-between">
    <span className="text-gray-500">{time}</span>
    <span className="font-medium">{subject}</span>
    <span className="text-gray-400">{className}</span>
  </li>
);

const ListRow = ({ title, meta }) => (
  <li>
    <div className="font-medium">{title}</div>
    <div className="text-xs text-gray-400">{meta}</div>
  </li>
);

const DashboardLink = ({ title, desc, to }) => (
  <Link
    to={to}
    className="bg-white rounded-xl shadow p-6 hover:shadow-md"
  >
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </Link>
);
