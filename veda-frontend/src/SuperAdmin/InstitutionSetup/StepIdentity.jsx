import { useRef } from "react";

export default function StepIdentity({ data, setData }) {
  const identity = data.identity || {};
  const branding = data.branding || {};
  const contact = data.contact || {};

  return (
    <section className=" bg-gray space-y-10">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Institution Identity</h2>
        <p className="text-sm text-gray-500">
          This information will be visible across the platform
        </p>
      </div>

      {/* BRAND ASSETS */}
      <div>
        <h3 className="text-lg font-medium mb-4">Brand Assets</h3>

        <div className="grid grid-cols-3 gap-6">
          {/* PRIMARY LOGO */}
          <ImageUpload
            title="Primary Logo"
            desc="School Logo"
            preview={branding.logoPreview}
            onUpload={(file, preview) =>
              setData({
                ...data,
                branding: {
                  ...branding,
                  logo: file,
                  logoPreview: preview,
                },
              })
            }
          />

          

          {/* SCHOOL BUILDING / COVER */}
          <ImageUpload
            title="School Building"
            desc="Login page background"
            preview={branding.coverImagePreview}
            onUpload={(file, preview) =>
              setData({
                ...data,
                branding: {
                  ...branding,
                  coverImage: file,
                  coverImagePreview: preview,
                },
              })
            }
          />
        </div>
      </div>

      {/* BASIC DETAILS */}
      <div>
        <h3 className="text-lg font-medium mb-4">Basic Details</h3>

        <div className="grid grid-cols-2 gap-5">
          <Field
            label="Institution Name"
            placeholder="Veda International School"
            value={identity.schoolName || ""}
            onChange={(v) =>
              setData({
                ...data,
                identity: { ...identity, schoolName: v },
              })
            }
          />

          <Field
            label="Short Name"
            placeholder="VEDA"
            value={identity.shortName || ""}
            onChange={(v) =>
              setData({
                ...data,
                identity: { ...identity, shortName: v },
              })
            }
          />

          <Field
            label="Registration / Affiliation No."
            placeholder="CBSE / ICSE / State Board ID"
            value={identity.registrationNo || ""}
            onChange={(v) =>
              setData({
                ...data,
                identity: { ...identity, registrationNo: v },
              })
            }
          />

          <Field
            label="Support Email"
            placeholder="support@school.edu.in"
            value={identity.supportEmail || ""}
            onChange={(v) =>
              setData({
                ...data,
                identity: { ...identity, supportEmail: v },
              })
            }
          />
          <Field
  label="School Description / Tagline"
  placeholder="A complete digital ecosystem for modern schools"
  value={identity.tagline || ""}
  onChange={(v) =>
    setData({
      ...data,
      identity: { ...identity, tagline: v },
    })
  }
/>
        </div>
      </div>

      {/* CONTACT */}
      <div>
        <h3 className="text-lg font-medium mb-4">Contact</h3>

        <div className="grid grid-cols-3 gap-5">
          <Field
            label="Phone Number"
            placeholder="+91 9XXXXXXXXX"
            value={contact.phone || ""}
            onChange={(v) =>
              setData({
                ...data,
                contact: { ...contact, phone: v },
              })
            }
          />

          <Field
            label="City"
            placeholder="Lucknow"
            value={contact.city || ""}
            onChange={(v) =>
              setData({
                ...data,
                contact: { ...contact, city: v },
              })
            }
          />

          <Field
            label="State"
            placeholder="Uttar Pradesh"
            value={contact.state || ""}
            onChange={(v) =>
              setData({
                ...data,
                contact: { ...contact, state: v },
              })
            }
          />
        </div>
      </div>
    </section>
  );
}

/* ======================= */
/* IMAGE UPLOAD COMPONENT */
/* ======================= */

function ImageUpload({ title, desc, preview, onUpload }) {
  const inputRef = useRef();

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="h-40 bg-gray-50 flex items-center justify-center relative">
        {preview ? (
          <img
            src={preview}
            alt={title}
            className="object-contain h-full w-full"
          />
        ) : (
          <div className="text-center text-gray-400 text-sm px-4">
            Upload {title}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => onUpload?.(file, reader.result);
            reader.readAsDataURL(file);
          }}
        />
      </div>

      <div className="p-4 flex justify-between items-start">
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="text-xs px-3 py-1 border rounded hover:bg-gray-50"
        >
          {preview ? "Replace" : "Upload"}
        </button>
      </div>
    </div>
  );
}

/* ================= */
/* INPUT COMPONENT */
/* ================= */

function Field({ label, placeholder, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}