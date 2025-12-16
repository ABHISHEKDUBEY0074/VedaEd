## SIS UI Layout & Style Guide

This file standardizes layout, spacing, and style for **Admin SIS**, **Teacher SIS**, and **Student SIS** screens.

---

### 1. Common Layout Patterns

- **Page wrapper**

  - Use: `className="p-0 m-0 min-h-screen"`
  - Used in: most SIS pages (Teacher, Student, Admin modules) where the main white card is centered on gray background is **not** required.

- **Main white container**

  - Use: `className="bg-white p-3 rounded-lg shadow-sm border mb-4"`
  - This is the primary content card which holds header, filters, and tables/cards.

- **Header card inside main container**

  - Use: `className="bg-white p-3 rounded-lg shadow-sm border mb-4 flex items-center gap-4"`
  - Used for profile headers, summary headers, etc.

- **Section cards (reusable)**
  - Use: `className="bg-white p-3 rounded-lg shadow-sm border mb-4"`
  - For grouped information blocks like Profile cards, Information panels, etc.

---

### 2. Breadcrumbs & Page Title

- **Breadcrumb line** (top of each SIS page)

  - Structure:
    - Container: `className="text-gray-500 text-sm mb-2 flex items-center gap-1"`
    - Example content:
      - Admin: `Admin > Communication > Complaints`
      - Teacher: `Teacher > Profile`
      - Student: `Students > Profile`
  - Example JSX:
    ```jsx
    <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
      <span>Teacher</span>
      <span>&gt;</span>
      <span>Profile</span>
    </div>
    ```

- **Title + HelpInfo row**
  - Container: `className="flex items-center justify-between mb-4"`
  - Left: `h2` with `className="text-2xl font-bold"`
  - Right: `HelpInfo` component.

---

### 3. Filters / Toolbar Containers

- **Filter bar (top of list pages like tables, logs, assignments, exams, etc.)**
  - Use **inside** main white container.
  - Container: `className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4"`
  - Filter controls group: `className="flex flex-col gap-3 md:flex-row md:items-center"`
  - Buttons: rounded pills
    - `className="px-3 py-2 rounded-xl text-sm font-medium border ..."`
  - Inputs:
    - Text input: `className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"`
    - Select: `className="border p-2 rounded"` or `className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"` (form sections).

---

### 4. Cards & Tables

- **List / card wrapper**

  - `className="space-y-4"` for vertical lists.
  - Each card:
    - `className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition"`

- **Status & priority pills** (used in complaints, logs, etc.)

  - Status pill: `className="px-3 py-1 rounded-full text-xs font-semibold ${statusPillClasses[status]}`
  - Priority pill: `className="px-3 py-1 rounded-full text-xs font-semibold ${priorityClasses[priority]}`
  - Common colors:
    - Pending: yellow (`bg-yellow-100 text-yellow-700`)
    - In Progress: blue (`bg-blue-100 text-blue-700`)
    - Resolved: green (`bg-emerald-100 text-emerald-700`)
    - High: red (`bg-red-100 text-red-700`)
    - Medium: orange (`bg-orange-100 text-orange-700`)
    - Low: gray (`bg-gray-100 text-gray-700`)

- **Tables**
  - Table wrapper: `className="w-full text-sm border"`
  - Header row: `className="bg-gray-100 text-left"`
  - Header cells: `className="p-2 border"`
  - Body cells: `className="p-2 border"`

---

### 5. Font Sizes & Text Colors

- **Titles / headings**

  - Page title: `text-2xl font-bold text-gray-800`
  - Section card title: `text-sm font-semibold` or `text-lg font-semibold`.

- **Body text**

  - Default inside cards: `text-sm text-gray-700`
  - Muted/help text: `text-sm text-gray-500`
  - Metadata (IDs, timestamps): `text-xs text-gray-500`

- **Links / actions**
  - Primary action link: `text-blue-600 hover:text-blue-700` or `hover:underline`.
  - Destructive actions: `text-red-600 hover:text-red-800`.

---

### 6. Colors (Tailwind)

- **Primary accent**: `indigo-600` / `indigo-500` (headers, active tabs, avatars).
- **Buttons**

  - Primary: `bg-blue-600 text-white hover:bg-blue-700`.
  - Secondary: `border border-gray-200 text-gray-700 hover:bg-gray-50`.
  - Disabled: `bg-gray-400 cursor-not-allowed`.

- **Backgrounds**
  - Page background when needed: `bg-gray-100` (only for full-page calendars/dashboards).
  - Card backgrounds: `bg-white`.

---

### 7. Tabs (Teacher/Student/Admin SIS)

- **Tab bar**
  - Container: `className="mb-4 flex flex-wrap gap-2"` or `"flex gap-4 border-b border-gray-300"`.
  - Tab button:
    - Active: `"px-4 py-2 rounded-lg bg-indigo-600 text-white"`.
    - Inactive: `"px-4 py-2 rounded-lg bg-white border"`.

---

### 8. Role-Specific Notes

- **Teacher SIS**

  - Follow `TeacherProfile.jsx` pattern for layout:
    - Page wrapper: `p-0 m-0 min-h-screen`.
    - Breadcrumb + header row as above.
    - Single main white container with header card + tabs + content.

- **Student SIS**

  - Use the same pattern as updated `Student Profile`, `Assignments`, and `Exams`:
    - Page wrapper: `p-0 m-0 min-h-screen`.
    - Single white container `bg-white p-3 rounded-lg shadow-sm border`.

- **Admin SIS (Communication, etc.)**
  - For communication sub-pages (Messages, Notices, Complaints, Logs):
    - Outer wrapper: `className="p-6"` when inside a layout shell.
    - Within that, follow the same card, filter, and pill patterns as defined here.

---

### 9. How to Use This File

- When creating a new page for **Admin/Teacher/Student SIS**:
  - Copy breadcrumb + title row structure.
  - Wrap core content in `bg-white p-3 rounded-lg shadow-sm border mb-4`.
  - Use the filter and card patterns for any lists/tables.
- Keep all new colors within the Tailwind gray/blue/indigo palette defined above unless there is a strong UX reason.
