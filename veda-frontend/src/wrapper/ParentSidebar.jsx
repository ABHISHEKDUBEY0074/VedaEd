import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiClipboard,
  FiMessageCircle,
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";

const MODULES = [
  {
    name: "Child Overview",
    icon: <FiUser />,
    subs: [
      { label: "Dashboard", path: "/parent" },
      { label: "Attendance", path: "/parent/attendance" },
      { label: "Assignments", path: "/parent/assignments" },
      { label: "Results", path: "/parent/results" },
      { label: "Fees", path: "/parent/fees" },
      { label: "Profile", path: "/parent/profile" },
    ],
  },
  {
    name: "Communication",
    icon: <FiMessageCircle />,
    subs: [
      { label: "Notices", path: "/parent-communication/notices" },
      { label: "Messages", path: "/parent-communication/messages" },
      { label: "Complaints", path: "/parent-communication/complaints" },
    ],
  },
  {
    name: "Calendar",
    icon: <FiCalendar />,
    subs: [
      { label: "School Calendar", path: "/parent/calendar" },
    ],
  },
];

export default function ParentSidebar() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white shadow-md overflow-y-auto pt-16">
      <div className="p-4 text-xl font-bold text-indigo-600">
        Parent Panel
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
