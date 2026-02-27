// 🔹 background decide karega (login cover)
const getCoverBackground = (branding) => {
  if (branding.coverImagePreview) return null;

  switch (branding.backgroundPreset) {
    case "robotics":
      return "bg-gradient-to-br from-slate-900 via-indigo-900 to-black";
    case "kids":
      return "bg-gradient-to-br from-pink-300 via-yellow-200 to-blue-300";
    case "corporate":
      return "bg-gradient-to-br from-slate-200 to-slate-400";
    default:
      return "bg-gradient-to-br from-blue-200 to-indigo-300";
  }
};

// 🔹 login button radius
const getButtonRadius = (branding) =>
  branding.buttonStyle === "pill" ? "999px" : "0.375rem";

export default function Preview({ data }) {
  const {
    branding = {},
    identity = {},
    contact = {},
  } = data;

  const textColor = branding.backgroundTextColor || "#ffffff";

  return (
    <aside
      className="w-[38%] border-l bg-gray-100 h-full overflow-y-auto"
      style={{ fontFamily: branding.font || "Inter" }}
    >
      {/* ===== LOGIN PAGE PREVIEW ===== */}
      <div className="p-5">
        <div className="rounded-2xl overflow-hidden shadow-xl bg-white h-[520px] flex">

          {/* ================= LEFT : IDENTITY / BRANDING ================= */}
          <div className="w-1/2 relative p-8">
            {/* background */}
            {branding.coverImagePreview ? (
              <img
                src={branding.coverImagePreview}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className={`absolute inset-0 ${getCoverBackground(branding)}`}
              />
            )}

            {/* overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* content */}
            <div
              className="relative z-10 h-full flex flex-col justify-between"
              style={{ color: textColor }}
            >
              <div>
                {branding.logoPreview && (
                  <img
                    src={branding.logoPreview}
                    className="h-14 mb-6 object-contain"
                  />
                )}

                <h1 className="text-3xl font-bold mb-2">
                  {identity.schoolName || "Your School Name"}
                </h1>

                {identity.registrationNo && (
                  <p className="text-xs opacity-80 mb-3">
                    Affiliation / Reg. No: {identity.registrationNo}
                  </p>
                )}

                <p className="text-sm opacity-90 max-w-sm">
                  {identity.tagline ||
                    "A complete digital ecosystem for modern schools — administration, academics & communication."}
                </p>

                <ul className="mt-6 space-y-2 text-sm opacity-90">
                  <li>✔ Admin, Teacher & Student Dashboards</li>
                  <li>✔ Attendance, Fees & Communication</li>
                  <li>✔ Secure & Cloud Ready</li>
                </ul>
              </div>

              <div className="text-xs opacity-80 space-y-1">
                {(contact.city || contact.state) && (
                  <div>
                    {contact.city}
                    {contact.city && contact.state && ", "}
                    {contact.state}
                  </div>
                )}

                <div>
                  © {new Date().getFullYear()}{" "}
                  {identity.shortName ||
                    identity.schoolName ||
                    "School"}
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT : LOGIN ================= */}
          <div className="w-1/2 flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
              <h2
                className="text-2xl font-bold text-center mb-1"
                style={{ color: branding.primaryColor || "#2563eb" }}
              >
                Welcome Back
              </h2>
              <p className="text-center text-sm text-gray-500 mb-6">
                Login to your dashboard
              </p>

              {/* fake inputs */}
              <div className="space-y-3">
                <div className="h-10 rounded bg-gray-100" />
                <div className="h-10 rounded bg-gray-100" />

                <button
                  className="w-full h-10 text-white text-sm"
                  style={{
                    backgroundColor:
                      branding.primaryColor || "#2563eb",
                    borderRadius: getButtonRadius(branding),
                  }}
                >
                  Login
                </button>
              </div>

              {/* contact */}
              <div className="mt-5 text-center text-[11px] text-gray-500 space-y-1">
                {contact.phone && <div>📞 {contact.phone}</div>}
                {identity.supportEmail && (
                  <div>✉ {identity.supportEmail}</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
}