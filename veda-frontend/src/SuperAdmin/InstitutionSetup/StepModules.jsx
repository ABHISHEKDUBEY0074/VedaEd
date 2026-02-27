export default function StepModules({ data, setData }) {
  const modules = {
    sis: {
      name: "Student Information System",
      desc: "Classes, students, sections, academics",
    },
    transport: {
      name: "Transport",
      desc: "Routes, vehicles, pickup points",
    },
    fees: {
      name: "Fees & Billing",
      desc: "Invoices, collections, receipts",
    },
    exams: {
      name: "Examinations",
      desc: "Marks, results, report cards",
    },
    hr: {
      name: "HR & Staff",
      desc: "Teachers, payroll, attendance",
    },
    communication: {
      name: "Communication",
      desc: "Notices, SMS, email, app alerts",
    },
  };

  const enabled = data.modules || {};

  const toggle = (key) => {
    setData({
      ...data,
      modules: {
        ...enabled,
        [key]: !enabled[key],
      },
    });
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Module Configuration</h2>
      <p className="text-sm text-gray-500">
        Enable or disable system modules for this institution.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(modules).map(([key, m]) => (
          <div
            key={key}
            className="border rounded p-4 flex justify-between items-start"
          >
            <div>
              <h3 className="font-medium">{m.name}</h3>
              <p className="text-xs text-gray-500">{m.desc}</p>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={enabled[key] ?? true}
                onChange={() => toggle(key)}
              />
              <span className="text-sm">
                {enabled[key] ?? true ? "On" : "Off"}
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-700">
        Disabled modules will be completely hidden from Admin, Teacher and
        Student dashboards.
      </div>
    </section>
  );
}