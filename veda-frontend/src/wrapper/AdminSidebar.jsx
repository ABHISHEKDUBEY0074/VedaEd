import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiMessageCircle,
  FiCalendar,
  FiBriefcase,
  FiClipboard,
  FiBookOpen,
  FiChevronDown,
} from "react-icons/fi";

const MODULES = [
  {
    name: "Admin SIS",
    icon: <FiUsers />,
    subs: [
      { label: "Students", path: "/admin/students" },
      { label: "Staff", path: "/admin/staff" },
      { label: "Parents", path: "/admin/parents" },
      { label: "Attendance", path: "/admin/attendance" },
      { label: "Reports", path: "/admin/reports" },
    ],
  },
  {
    name: "Communication",
    icon: <FiMessageCircle />,
    subs: [
      { label: "Logs", path: "/communication/logs" },
      { label: "Notices", path: "/communication/notices" },
      { label: "Messages", path: "/communication/messages" },
      { label: "Complaints", path: "/communication/complaints" },
    ],
  },
  {
    name: "Admin Calendar",
    icon: <FiCalendar />,
    subs: [
      { label: "Annual Calendar", path: "/admincalendar/annualcalendar" },
      { label: "Event Types", path: "/admincalendar/eventtype" },
      { label: "Timetable Setup", path: "/admincalendar/timetablesetup" },
    ],
  },
  {
    name: "HR Module",
    icon: <FiBriefcase />,
    subs: [
      { label: "Staff Directory", path: "/hr/staff-directory" },
      { label: "Attendance", path: "/hr/staff-attendance" },
      { label: "Payroll", path: "/hr/payroll" },
      { label: "Approve Leave", path: "/hr/approve-leave" },
    ],
  },
  {
    name: "Receptionist",
    icon: <FiClipboard />,
    subs: [
      { label: "Admission Enquiry", path: "/receptionist/admission-enquiry" },
      { label: "Visitor Book", path: "/receptionist/visitor-book" },
      { label: "Student Details", path: "/receptionist/student-details" },
    ],
  },
  {
    name: "Admission",
    icon: <FiBookOpen />,
    subs: [
      { label: "Dashboard", path: "/admission" },
      { label: "Applications", path: "/admission/application-list" },
      { label: "Status Tracking", path: "/admission/status-tracking" },
      { label: "Vacancy Setup", path: "/admission/vacancy-setup" },
    ],
  },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white shadow-md overflow-y-auto">
      <div className="p-4 text-xl font-bold text-indigo-600">
        Admin Panel
      </div>

      {MODULES.map((mod) => (
        <div key={mod.name}>
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-indigo-50"
            onClick={() => setOpen(open === mod.name ? null : mod.name)}
          >
            <div className="flex items-center gap-3">
              {mod.icon}
              <span className="font-medium">{mod.name}</span>
            </div>
            <FiChevronDown
              className={`transition ${
                open === mod.name ? "rotate-180" : ""
              }`}
            />
          </div>

          {open === mod.name && (
            <div className="ml-8">
              {mod.subs.map((s) => (
                <div
                  key={s.path}
                  onClick={() => navigate(s.path)}
                  className="py-2 text-sm cursor-pointer text-gray-600 hover:text-indigo-600"
                >
                  {s.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
