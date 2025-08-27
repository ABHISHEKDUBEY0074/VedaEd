import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function SmallModal({
  open,
  title,
  fields,
  editRow,
  onSave,
  onImport,
  onClose,
}) {
  const [form, setForm] = useState({});
  useEffect(() => {
    if (editRow) {
      setForm(editRow); 
    } else {
      setForm({}); 
    }
  }, [editRow, open]);

  if (!open) return null;

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      onImport(json);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {f}
              </label>
              <input
                type={
                  f.toLowerCase().includes("day") ||
                  f.toLowerCase().includes("present") ||
                  f.toLowerCase().includes("marks")
                    ? "number"
                    : "text"
                }
                value={form[f] || ""}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1">Import</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImport}
              className="w-full border px-3 py-2 rounded-md file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => {
              onSave(form);
              setForm({});
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            onClick={() => {
              setForm({});
              onClose();
            }}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
