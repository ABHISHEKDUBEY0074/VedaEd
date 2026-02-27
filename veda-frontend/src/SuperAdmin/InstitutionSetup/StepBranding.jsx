import React from "react";

/* ================================================= */
/* STEP BRANDING */
/* ================================================= */

export default function StepBranding({ data, setData }) {
  const branding = data.branding || {};

  /* ================= PRESETS ================= */

  const presets = {
    school: {
      label: "School Classic",
      themeType: "school",
      primaryColor: "#2563eb",
      secondaryColor: "#22c55e",
      accentColor: "#e0f2fe",
      backgroundStyle: "gradient",
      backgroundPreset: "school",
      font: "Inter",
      buttonStyle: "rounded",
      darkMode: false,
      backgroundTextColor: "#ffffff",
    },
    robotics: {
      label: "Robotics / Tech",
      themeType: "robotics",
      primaryColor: "#0f172a",
      secondaryColor: "#38bdf8",
      accentColor: "#020617",
      backgroundStyle: "illustration",
      backgroundPreset: "robotics",
      font: "Poppins",
      buttonStyle: "pill",
      darkMode: true,
      backgroundTextColor: "#e5e7eb",
    },
    kinder: {
      label: "Kinder / Kids",
      themeType: "kinder",
      primaryColor: "#ec4899",
      secondaryColor: "#facc15",
      accentColor: "#fef3c7",
      backgroundStyle: "illustration",
      backgroundPreset: "kids",
      font: "Comic Sans MS",
      buttonStyle: "pill",
      darkMode: false,
      backgroundTextColor: "#ffffff",
    },
    corporate: {
      label: "Corporate / Modern",
      themeType: "corporate",
      primaryColor: "#0ea5e9",
      secondaryColor: "#6366f1",
      accentColor: "#e0e7ff",
      backgroundStyle: "gradient",
      backgroundPreset: "corporate",
      font: "Roboto",
      buttonStyle: "rounded",
      darkMode: false,
      backgroundTextColor: "#ffffff",
    },
  };

  const applyPreset = (key) => {
    setData({
      ...data,
      branding: {
        ...branding,
        ...presets[key],
      },
    });
  };

  /* ================= UI ================= */

  return (
    <section className="space-y-10">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Branding & Theme</h2>
        <p className="text-sm text-gray-500">
          Control how your login screen & public pages will look
        </p>
      </div>

      {/* THEME PRESETS */}
      <div>
        <h3 className="text-lg font-medium mb-3">Theme Presets</h3>

        <div className="grid grid-cols-4 gap-4">
          {Object.entries(presets).map(([key, p]) => (
            <ThemeCard
              key={key}
              title={p.label}
              primary={p.primaryColor}
              secondary={p.secondaryColor}
              dark={p.darkMode}
              onClick={() => applyPreset(key)}
            />
          ))}
        </div>
      </div>

      {/* MANUAL CUSTOMIZATION */}
      <div>
        <h3 className="text-lg font-medium mb-4">Fine Tune</h3>

        <div className="grid grid-cols-5 gap-5">
          <ColorField
            label="Primary Color (Buttons)"
            value={branding.primaryColor || "#2563eb"}
            onChange={(v) =>
              setData({
                ...data,
                branding: { ...branding, primaryColor: v },
              })
            }
          />

          <ColorField
            label="Secondary Color"
            value={branding.secondaryColor || "#22c55e"}
            onChange={(v) =>
              setData({
                ...data,
                branding: { ...branding, secondaryColor: v },
              })
            }
          />

          <ColorField
            label="Background Text Color"
            value={branding.backgroundTextColor || "#ffffff"}
            onChange={(v) =>
              setData({
                ...data,
                branding: { ...branding, backgroundTextColor: v },
              })
            }
          />

          <div>
            <label className="text-sm font-medium">Font</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={branding.font || "Inter"}
              onChange={(e) =>
                setData({
                  ...data,
                  branding: { ...branding, font: e.target.value },
                })
              }
            >
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Button Style</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={branding.buttonStyle || "rounded"}
              onChange={(e) =>
                setData({
                  ...data,
                  branding: { ...branding, buttonStyle: e.target.value },
                })
              }
            >
              <option value="rounded">Rounded</option>
              <option value="pill">Pill</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================= */
/* THEME PREVIEW CARD */
/* ================================================= */

function ThemeCard({ title, primary, secondary, dark, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border rounded-xl p-3 text-left hover:shadow-md transition bg-white"
    >
      <div
        className="h-24 rounded-lg mb-3 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        }}
      >
        <div
          className={`px-4 py-1 text-xs font-medium rounded-full ${
            dark ? "bg-black/60 text-white" : "bg-white/80 text-gray-800"
          }`}
        >
          Login Button
        </div>
      </div>
      <p className="text-sm font-medium">{title}</p>
    </button>
  );
}

/* ================================================= */
/* COLOR FIELD */
/* ================================================= */

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="color"
        className="w-full h-10 rounded cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}