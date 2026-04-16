import React, { useState } from "react";

/* ================== REUSABLE UI ================== */
const Section = ({ title, children }) => (
  <div className="bg-white border rounded-lg p-6 mb-6">
    <h3 className="font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const Input = ({
  label,
  name,
  required,
  type = "text",
  value,
  onChange,
  disabled,
  error,
}) => (
  <div>
    <label className="text-xs text-gray-500 uppercase">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full mt-1 px-3 py-2 border rounded ${
        error ? "border-red-500" : ""
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Select = ({ label, name, options, value, onChange, disabled, required }) => (
  <div>
    <label className="text-xs text-gray-500 uppercase">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full mt-1 px-3 py-2 border rounded"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

const MultiSelect = ({ label, options, value, onChange, disabled }) => (
  <div>
    <label className="text-xs text-gray-500 uppercase">{label}</label>
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt)}
          className={`px-3 py-1 rounded border text-sm ${
            value.includes(opt)
              ? "bg-blue-100 text-blue-600 border-blue-400"
              : "bg-gray-100"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

/* ================== MAIN ================== */
export default function SchoolInfo() {
  const [isEdit, setIsEdit] = useState(false);
  const [toast, setToast] = useState("");
  const [logo, setLogo] = useState(null);

  const [form, setForm] = useState({
    /* General */
    schoolName: "",
    shortName: "",
    schoolType: "Private",
    board: "CBSE",
    affiliationNumber: "",
    udise: "",
    establishmentYear: "",
    schoolLevel: [],
    medium: [],
    genderType: "Co-ed",
    status: "Active",

    /* Academic */
    sessionStart: "",
    sessionEnd: "",
    gradingSystem: "Percentage",
    startTime: "",
    endTime: "",

    /* Address */
    street: "",
    area: "",
    country: "India",
    state: "",
    district: "",
    city: "",
    pin: "",

    /* Contact */
    principalName: "",
    principalEmail: "",
    principalPhone: "",
    schoolPhone: "",
    altPhone: "",
    email: "",
    website: "",

    /* Admin */
    management: "Trust",
    recognition: "Recognized",
    authority: "",

    /* System */
    motto: "",
    subdomain: "",
    timezone: "Asia/Kolkata",
    language: "English",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleMulti = (field, val) =>
    setForm({
      ...form,
      [field]: form[field].includes(val)
        ? form[field].filter((v) => v !== val)
        : [...form[field], val],
    });

  const validate = () => {
    let e = {};
    if (!form.schoolName) e.schoolName = "Required";
    if (!form.udise) e.udise = "Required";
    if (!form.sessionStart) e.sessionStart = "Required";
    if (!form.sessionEnd) e.sessionEnd = "Required";
    if (!form.street) e.street = "Required";
    if (!form.state) e.state = "Required";
    if (!form.city) e.city = "Required";
    if (!form.pin) e.pin = "Required";
    return e;
  };

  const handleUpdate = () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);

    setErrors({});
    setIsEdit(false);
    setToast("School Information Updated Successfully");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="p-0 min-h-screen">
      {toast && (
        <div className="fixed top-20 right-5 bg-green-600 text-white px-4 py-2 rounded">
          {toast}
        </div>
      )}

      {/* HEADER */}
     <div className="flex justify-between mb-6">
  <h2 className="text-xl font-semibold">School Information</h2>

  {!isEdit && (
    <button
      onClick={() => setIsEdit(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Edit
    </button>
  )}
</div>

      {/* ================= GENERAL ================= */}
      <Section title="General Information">
        <div className="grid grid-cols-2 gap-4">
          <Input label="School Name" name="schoolName" required value={form.schoolName} onChange={handleChange} disabled={!isEdit} error={errors.schoolName} />
          <Input label="Short Name / Code" name="shortName" value={form.shortName} onChange={handleChange} disabled={!isEdit} />
          <Select label="School Type" name="schoolType" options={["Private","Government","Semi-Government","International"]} value={form.schoolType} onChange={handleChange} disabled={!isEdit}/>
          <Select label="Board / Affiliation" name="board" options={["CBSE","ICSE","State Board","IB","Cambridge","Other"]} value={form.board} onChange={handleChange} disabled={!isEdit}/>
          <Input label="Affiliation Number" name="affiliationNumber" value={form.affiliationNumber} onChange={handleChange} disabled={!isEdit}/>
          <Input label="UDISE Code" name="udise" required value={form.udise} onChange={handleChange} disabled={!isEdit} error={errors.udise}/>
          <Input label="Establishment Year" type="number" name="establishmentYear" value={form.establishmentYear} onChange={handleChange} disabled={!isEdit}/>
          <MultiSelect label="School Level" options={["Pre-Primary","Primary","Middle","Secondary","Senior Secondary"]} value={form.schoolLevel} onChange={(v)=>handleMulti("schoolLevel",v)} disabled={!isEdit}/>
          <MultiSelect label="Medium of Instruction" options={["English","Hindi","Regional"]} value={form.medium} onChange={(v)=>handleMulti("medium",v)} disabled={!isEdit}/>
          <Select label="Gender Type" name="genderType" options={["Co-ed","Boys","Girls"]} value={form.genderType} onChange={handleChange} disabled={!isEdit}/>
          <Select label="Status" name="status" options={["Active","Inactive"]} value={form.status} onChange={handleChange} disabled={!isEdit}/>
        </div>
      </Section>

      {/* ================= ACADEMIC ================= */}
      <Section title="Academic Information">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Session Start Date" type="date" name="sessionStart" required value={form.sessionStart} onChange={handleChange} disabled={!isEdit} error={errors.sessionStart}/>
          <Input label="Session End Date" type="date" name="sessionEnd" required value={form.sessionEnd} onChange={handleChange} disabled={!isEdit} error={errors.sessionEnd}/>
          <Select label="Grading System" name="gradingSystem" options={["Percentage","CGPA","Grade"]} value={form.gradingSystem} onChange={handleChange} disabled={!isEdit}/>
          <Input label="School Start Time" type="time" name="startTime" value={form.startTime} onChange={handleChange} disabled={!isEdit}/>
          <Input label="School End Time" type="time" name="endTime" value={form.endTime} onChange={handleChange} disabled={!isEdit}/>
        </div>
      </Section>

      {/* ================= ADDRESS ================= */}
      <Section title="Address & Location">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Street Address" name="street" required value={form.street} onChange={handleChange} disabled={!isEdit} error={errors.street}/>
          <Input label="Area / Locality" name="area" value={form.area} onChange={handleChange} disabled={!isEdit}/>
          <Input label="Country" name="country" value={form.country} disabled />
          <Input label="State" name="state" required value={form.state} onChange={handleChange} disabled={!isEdit} error={errors.state}/>
          <Input label="District" name="district" value={form.district} onChange={handleChange} disabled={!isEdit}/>
          <Input label="City" name="city" required value={form.city} onChange={handleChange} disabled={!isEdit} error={errors.city}/>
          <Input label="Pin Code" name="pin" required value={form.pin} onChange={handleChange} disabled={!isEdit} error={errors.pin}/>
        </div>
      </Section>

      {/* ================= CONTACT ================= */}
      <Section title="Contact Information">
        <h4 className="font-medium mb-2">Principal Details</h4>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input label="Principal Name" name="principalName" value={form.principalName} onChange={handleChange} disabled={!isEdit}/>
          <Input label="Principal Email" type="email" name="principalEmail" value={form.principalEmail} onChange={handleChange} disabled={!isEdit}/>
          <Input label="Principal Phone" name="principalPhone" value={form.principalPhone} onChange={handleChange} disabled={!isEdit}/>
        </div>

        <h4 className="font-medium mb-2">School Contact</h4>
        <div className="grid grid-cols-2 gap-4">
          <Input label="School Phone" name="schoolPhone" value={form.schoolPhone} onChange={handleChange} disabled={!isEdit}/>
          <Input label="Alternate Phone" name="altPhone" value={form.altPhone} onChange={handleChange} disabled={!isEdit}/>
          <Input label="Official Email" type="email" name="email" value={form.email} onChange={handleChange} disabled={!isEdit}/>
          <Input label="Website" name="website" value={form.website} onChange={handleChange} disabled={!isEdit}/>
        </div>
      </Section>

      {/* ================= ADMIN ================= */}
      <Section title="Administrative Details">
        <div className="grid grid-cols-3 gap-4">
          <Select label="Management Type" name="management" options={["Trust","Society","Private","Government"]} value={form.management} onChange={handleChange} disabled={!isEdit}/>
          <Select label="Recognition Status" name="recognition" options={["Recognized","Provisional","Unrecognized"]} value={form.recognition} onChange={handleChange} disabled={!isEdit}/>
          <Input label="Recognition Authority" name="authority" value={form.authority} onChange={handleChange} disabled={!isEdit}/>
        </div>
      </Section>

      {/* ================= BRANDING ================= */}
    {/* ================= BRANDING ================= */}
<Section title="Branding">
  <div className="flex items-start gap-6">
    {/* LOGO PREVIEW */}
    <div className="w-32 h-32 border rounded flex items-center justify-center bg-gray-50">
      {logo ? (
        <img
          src={URL.createObjectURL(logo)}
          alt="School Logo"
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <span className="text-xs text-gray-400 text-center">
          No Logo<br />Uploaded
        </span>
      )}
    </div>

    {/* ACTIONS */}
    {isEdit && (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">School Logo</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files[0])}
          className="text-sm"
        />

        {logo && (
          <button
            type="button"
            onClick={() => setLogo(null)}
            className="text-red-600 text-sm underline w-fit"
          >
            Delete Logo
          </button>
        )}
      </div>
    )}
  </div>

  <div className="mt-4">
    <Input
      label="School Motto / Tagline"
      name="motto"
      value={form.motto}
      onChange={handleChange}
      disabled={!isEdit}
    />
  </div>
</Section>

      {/* ================= SYSTEM ================= */}
      <Section title="System Settings">
        <div className="grid grid-cols-3 gap-4">
          <Input label="Subdomain" name="subdomain" value={form.subdomain} onChange={handleChange} disabled={!isEdit}/>
          <Select label="Time Zone" name="timezone" options={["Asia/Kolkata"]} value={form.timezone} onChange={handleChange} disabled={!isEdit}/>
          <Select label="Default Language" name="language" options={["English","Hindi"]} value={form.language} onChange={handleChange} disabled={!isEdit}/>
        </div>
      </Section>
      {/* ================= PAGE ACTIONS ================= */}
{isEdit && (
  <div className="flex justify-end gap-3 mt-8 border-t pt-6">
    <button
      onClick={() => {
        setIsEdit(false);
        setErrors({});
      }}
      className="px-6 py-2 rounded border"
    >
      Cancel
    </button>

    <button
      onClick={handleUpdate}
      className="px-6 py-2 rounded bg-green-600 text-white"
    >
      Update
    </button>
  </div>
)}
    </div>
  );
}