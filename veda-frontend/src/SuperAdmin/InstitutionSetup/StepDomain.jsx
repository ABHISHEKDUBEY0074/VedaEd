export default function StepDomain({ data, setData }) {
  const domain = data.domain || {};

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Domain Configuration</h2>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Primary (Head) Domain"
          placeholder="school.edu.in"
          value={domain.headDomain || ""}
          onChange={(v) =>
            setData({ ...data, domain: { ...domain, headDomain: v } })
          }
        />
        <Field
          label="App Sub Domain"
          placeholder="app.school.edu.in"
        />
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" defaultChecked />
        Enable SSL (HTTPS)
      </label>

      <div className="text-sm text-gray-500">
        DNS & SSL will be configured after publish.
      </div>
    </section>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input className="w-full border p-2 rounded" {...props} />
    </div>
  );
}