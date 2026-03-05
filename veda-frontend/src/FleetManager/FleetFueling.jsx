import { useState } from "react";

/**
 * ===============================
 * DUMMY DATA
 * ===============================
 */
const INITIAL_DATA = [
  {
    id: 1,
    vehicleNo: "UP32 AB 4589",
    model: "Tata Bus – 42 Seater",
    fuelLogs: [],
  },
  {
    id: 2,
    vehicleNo: "UP32 CD 1123",
    model: "Ashok Leyland – 35 Seater",
    fuelLogs: [],
  },
];

export default function FleetFueling() {
  const [vehicles, setVehicles] = useState(INITIAL_DATA);
  const [openVehicle, setOpenVehicle] = useState(null);

  const [form, setForm] = useState({
    date: "",
    litres: "",
    rate: "",
    invoiceFile: null,
  });

  const [previewInvoice, setPreviewInvoice] = useState(null);

  /**
   * ===============================
   * ADD FUEL ENTRY
   * ===============================
   */
  const addFuelEntry = (vehicleId) => {
    if (!form.date || !form.litres || !form.rate || !form.invoiceFile) return;

    const invoiceUrl = URL.createObjectURL(form.invoiceFile);
    const amount = Number(form.litres) * Number(form.rate);

    setVehicles((prev) =>
      prev.map((v) =>
        v.id !== vehicleId
          ? v
          : {
              ...v,
              fuelLogs: [
                ...v.fuelLogs,
                {
                  id: Date.now(),
                  date: form.date,
                  litres: Number(form.litres),
                  rate: Number(form.rate),
                  amount,
                  invoiceUrl,
                  invoiceType: form.invoiceFile.type,
                },
              ],
            }
      )
    );

    setForm({ date: "", litres: "", rate: "", invoiceFile: null });
  };

  /**
   * ===============================
   * DELETE FUEL ENTRY
   * ===============================
   */
  const deleteFuelEntry = (vehicleId, fuelId) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id !== vehicleId
          ? v
          : { ...v, fuelLogs: v.fuelLogs.filter((f) => f.id !== fuelId) }
      )
    );
  };

  return (
    <div className="min-h-screen">
     {/* Breadcrumb */}
          <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
            <span>Fleet &gt;</span>
            <span>Fueling Records</span>
          </div>
    <div className="flex items-center justify-between mb-2">
           <h2 className="text-2xl font-bold">Fueling Records </h2>
         </div>
    
          {/* Tabs */}
          <div className="flex gap-3 text-sm mb-3 text-gray-600 border-b">
            <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
              Overview
            </button>
          </div>

      {vehicles.map((v) => {
        const totalLitres = v.fuelLogs.reduce((s, f) => s + f.litres, 0);
        const totalAmount = v.fuelLogs.reduce((s, f) => s + f.amount, 0);

        return (
          <div key={v.id} className="bg-white rounded-xl shadow border mb-6">
            {/* HEADER */}
            <div className="p-4 flex justify-between border-b">
              <div>
                <h3 className="font-semibold">{v.vehicleNo}</h3>
                <p className="text-sm text-gray-500">{v.model}</p>
              </div>
              <div className="text-sm text-right">
                <div>Total Fuel: <b>{totalLitres} L</b></div>
                <div className="font-semibold text-indigo-600">₹ {totalAmount}</div>
              </div>
            </div>

            {/* ACTION */}
            <div className="p-4">
              <button
                className="text-indigo-600 text-sm"
                onClick={() => setOpenVehicle(openVehicle === v.id ? null : v.id)}
              >
                {openVehicle === v.id ? "Hide Records ▲" : "View / Add Records ▼"}
              </button>

              {openVehicle === v.id && (
                <div className="mt-4 space-y-4">
                  {/* ADD FORM */}
                  <div className="grid grid-cols-5 gap-3">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="border p-2 rounded text-sm"
                    />

                    <input
                      type="number"
                      placeholder="Litres"
                      value={form.litres}
                      onChange={(e) => setForm({ ...form, litres: e.target.value })}
                      className="border p-2 rounded text-sm"
                    />

                    <input
                      type="number"
                      placeholder="Rate ₹"
                      value={form.rate}
                      onChange={(e) => setForm({ ...form, rate: e.target.value })}
                      className="border p-2 rounded text-sm"
                    />

                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) =>
                        setForm({ ...form, invoiceFile: e.target.files[0] })
                      }
                      className="border p-2 rounded text-sm"
                    />

                    <button
                      onClick={() => addFuelEntry(v.id)}
                      className="bg-indigo-600 text-white rounded text-sm"
                    >
                      + Add
                    </button>
                  </div>

                  {/* TABLE */}
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Litres</th>
                        <th className="border p-2">Rate</th>
                        <th className="border p-2">Amount</th>
                        <th className="border p-2">Invoice</th>
                        <th className="border p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {v.fuelLogs.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-4 text-center text-gray-400">
                            No records
                          </td>
                        </tr>
                      ) : (
                        v.fuelLogs.map((f) => (
                          <tr key={f.id} className="text-center">
                            <td className="border p-2">{f.date}</td>
                            <td className="border p-2">{f.litres} L</td>
                            <td className="border p-2">₹ {f.rate}</td>
                            <td className="border p-2 font-semibold">₹ {f.amount}</td>
                            <td
                              className="border p-2 text-indigo-600 cursor-pointer"
                              onClick={() => setPreviewInvoice(f)}
                            >
                              Preview
                            </td>
                            <td className="border p-2">
                              <button
                                onClick={() => deleteFuelEntry(v.id, f.id)}
                                className="text-red-500 text-xs"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ================= PREVIEW MODAL ================= */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[80%] h-[80%] p-4 relative">
            <button
              onClick={() => setPreviewInvoice(null)}
              className="absolute top-2 right-3 text-xl"
            >
              ✕
            </button>

            {previewInvoice.invoiceType.includes("pdf") ? (
              <iframe
                src={previewInvoice.invoiceUrl}
                className="w-full h-full"
                title="Invoice PDF"
              />
            ) : (
              <img
                src={previewInvoice.invoiceUrl}
                alt="Invoice"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}