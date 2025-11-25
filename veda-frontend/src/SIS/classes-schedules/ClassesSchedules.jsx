import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import HelpInfo from "../../components/HelpInfo";
const ClassesSchedules = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("classes");

  // Update activeTab based on current route
  useEffect(() => {
    if (location.pathname.includes("subject-group")) setActiveTab("subject-group");
    else if (location.pathname.includes("assign-teacher")) setActiveTab("assign-teacher");
    else if (location.pathname.includes("timetable")) setActiveTab("timetable");
    else setActiveTab("classes");
  }, [location.pathname]);

  return (
    <div className="p-6 ">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button
          onClick={() => {
            setActiveTab("classes");
            navigate("/classes-schedules/classes"); // navigate to default tab
          }}
          className="hover:underline"
        >
          Classes & Schedules
        </button>
        <span>&gt;</span>
        <span>
          {activeTab === "classes" && "Classes"}
          {activeTab === "subject-group" && "Subject Group"}
          {activeTab === "assign-teacher" && "Assign Teacher"}
          {activeTab === "timetable" && "Timetable"}
        </span>
      </div>

     <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Classes and Schedule</h2>

  <HelpInfo
    title="Classes & Schedules Help"
    description={`Page Description: Manage classes, subject groups, teacher assignments, and timetables across the school.

13. Classes (/classes-schedules/classes)
Description: Manage all classes and sections. View class lists, student counts, assigned teachers, and schedules. Add or edit class information.
Sections:
- Classes List: Display all classes with sections, student counts, and class teachers.
- Class Information Cards: Visual cards showing key information for each class.
- Search and Filter: Find classes by name, section, or class teacher.
- Action Buttons: Add new class, edit existing classes, view class details.
- Class Statistics: Total classes, total students, and average class size.
- Quick Access: Direct links to class timetables, student lists, and attendance.

14. Subject Groups (/classes-schedules/subject-group)
Description: Organize subjects into groups for better curriculum management. Assign subjects to classes and manage subject combinations.
Sections:
- Subject Groups List: Display all subject groups with associated classes.
- Group Management: Create, edit, or delete subject groups.
- Subject Assignment: Assign subjects to specific groups and classes.
- Class-Subject Mapping: View which subjects are assigned to which classes.
- Subject Information: Display subject details, codes, and requirements.
- Bulk Operations: Assign multiple subjects to multiple classes at once.

15. Assign Teacher (/classes-schedules/assign-teacher)
Description: Assign teachers to classes and subjects. Manage teacher-class relationships, view current assignments, and modify allocations.
Sections:
- Current Assignments Table: View all current teacher-class-subject assignments.
- Teacher Selection: Select teacher from staff directory.
- Class and Subject Selection: Choose class and subject for assignment.
- Assignment Management: Add new assignments, modify existing ones, or remove assignments.
- Workload View: See each teacher's current workload and assigned classes.
- Conflict Detection: Identify scheduling conflicts or overloaded teachers.
- Bulk Assignment: Assign one teacher to multiple classes or subjects.

16. Timetable (/classes-schedules/timetable)
Description: View and manage school timetables. Create class schedules, assign periods, and ensure proper time allocation for all subjects.
Sections:
- Timetable Overview: View all class timetables in a grid format.
- Class Selection: Select specific class to view or edit its timetable.
- Period Management: Define periods, time slots, and breaks.
- Subject Assignment: Assign subjects to specific periods and days.
- Teacher Assignment: Assign teachers to periods and classes.
- Conflict Resolution: Identify and resolve scheduling conflicts.
- Print and Export: Generate timetable reports and printable versions.`}
  />
</div>


      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        <NavLink
          to="classes"
          className={({ isActive }) =>
            `pb-2 ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`
          }
        >
          Classes
        </NavLink>

        <NavLink
          to="subject-group"
          className={({ isActive }) =>
            `pb-2 ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`
          }
        >
          Subject Group
        </NavLink>

        <NavLink
          to="assign-teacher"
          className={({ isActive }) =>
            `pb-2 ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`
          }
        >
          Assign Teacher
        </NavLink>

        <NavLink
          to="timetable"
          className={({ isActive }) =>
            `pb-2 ${isActive ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500"}`
          }
        >
          Timetable
        </NavLink>
      </div>

      {/* Tab Content */}
      <div>
        <Outlet /> {/* Tab content will render here */}
      </div>
    </div>
  );
};

export default ClassesSchedules;
