import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiClipboard,
  FiMessageCircle,
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";

const MODULES = [
  {
    name: "Teacher SIS",
    icon: <FiBookOpen />,
    subs: [
      { label: "Dashboard", path: "/teacher" },
      { label: "Classes", path: "/teacher/classes" },
      { label: "Attendance", path: "/teacher/attendance" },
      { label: "Assignments", path: "/teacher/assignment" },
      { label: "Exams", path: "/teacher/exams" },
      { label: "Gradebook", path: "/teacher/gradebook" },
      { label: "Activities", path: "/teacher/activities" },
      { label: "Profile", path: "/teacher/profile" },
    ],
  },
  {
    name: "Communication",
    icon: <FiMessageCircle />,
    subs: [
      { label: "Logs", path: "/teacher-communication/logs" },
      { label: "Notices", path: "/teacher-communication/notices" },
      { label: "Messages", path: "/teacher-communication/messages" },
      { label: "Complaints", path: "/teacher-communication/complaints" },
    ],
  },
  {
    name: "Calendar",
    icon: <FiCalendar />,
    subs: [
      { label: "My Calendar", path: "/teacher/calendar" },
    ],
  },
];

export default function StaffSidebar() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white shadow-md overflow-y-auto pt-16">
      <div className="p-4 text-xl font-bold text-indigo-600">
        Staff Panel
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
              className={`transition ${open === mod.name ? "rotate-180" : ""}`}
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
