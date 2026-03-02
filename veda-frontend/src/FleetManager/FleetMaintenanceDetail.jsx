import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiLock,
  FiUnlock,
} from "react-icons/fi";

export default function FleetMaintenanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ================= VEHICLE ================= */
  const [vehicle, setVehicle] = useState({
    vehicleNo: "UP32 AB 4589",
    model: "Tata Bus 42 Seater",
    currentKm: 43200,
    nextDueKm: 45000,
    lastServiceDate: "10 Feb 2026",
    status: "UNDER_MAINTENANCE", // ACTIVE | UNDER_MAINTENANCE
    locked: true,
  });

  /* ================= WORKS ================= */
  const [works, setWorks] = useState([
    {
      id: 1,
      part: "Engine Oil",
      action: "Replaced",
      mechanic: "Ramesh Motors",
      cost: 3200,
      date: "10 Feb 2026",
    },
  ]);

  /* ================= ADD WORK ================= */
  const [newWork, setNewWork] = useState({
    part: "",
    action: "",
    mechanic: "",
    cost: "",
  });

  const addWork = () => {
    if (!newWork.part || !newWork.action) return;

    setWorks([
      ...works,
      {
        ...newWork,
        id: Date.now(),
        cost: Number(newWork.cost || 0),
        date: new Date().toLocaleDateString(),
      },
    ]);

    setNewWork({ part: "", action: "", mechanic: "", cost: "" });
  };

  const deleteWork = (id) => {
    setWorks(works.filter((w) => w.id !== id));
  };

  /* ================= BILLS ================= */
  const [bills, setBills] = useState([]);

  const addBill = (file) => {
    if (!file) return;
    setBills([
      ...bills,
      {
        id: Date.now(),
        name: file.name,
        uploadedOn: new Date().toLocaleDateString(),
      },
    ]);
  };

  const deleteBill = (id) => {
    setBills(bills.filter((b) => b.id !== id));
  };

  /* ================= COMPLETE ================= */
  const completeMaintenance = () => {
    setVehicle({
      ...vehicle,
      status: "ACTIVE",
      locked: false,
      lastServiceDate: new Date().toLocaleDateString(),
    });
  };

  /* ================= CALCULATIONS ================= */
  const totalCost = useMemo(
    () => works.reduce((s, w) => s + w.cost, 0),
    [works]
  );

  const kmRemaining = vehicle.nextDueKm - vehicle.currentKm;

  const vendorExpenses = useMemo(() => {
    const map = {};
    works.forEach((w) => {
      map[w.mechanic] = (map[w.mechanic] || 0) + w.cost;
    });
    return map;
  }, [works]);

  const monthlyCosts = [
    { month: "Jan", cost: 12000 },
    { month: "Feb", cost: 8000 },
    { month: "Mar", cost: totalCost },
  ];

  /* ================= UI ================= */
  return (
    <div className="space-y-6">

      {/* BACK */}
      <button
        onClick={() => navigate("/fleet/maintenance")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
      >
        <FiArrowLeft /> Back to Maintenance List
      </button>

      {/* SUMMARY CARD */}
      <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-6 gap-4">
        <div>
          <div className="text-sm text-gray-500">Vehicle No</div>
          <div className="text-xl font-bold">{vehicle.vehicleNo}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Model</div>
          <div>{vehicle.model}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Current KM</div>
          <div>{vehicle.currentKm}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Next Due</div>
          <div className="font-semibold">{vehicle.nextDueKm} km</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Status</div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              vehicle.status === "UNDER_MAINTENANCE"
                ? "bg-orange-100 text-orange-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {vehicle.status.replace("_", " ")}
          </span>
        </div>
        <div>
          <div className="text-sm text-gray-500">Vehicle Lock</div>
          <div className="flex items-center gap-2 font-semibold">
            {vehicle.locked ? <FiLock /> : <FiUnlock />}
            {vehicle.locked ? "Locked" : "Active"}
          </div>
        </div>
      </div>

      {/* ALERT */}
      {kmRemaining <= 500 && (
        <div className="bg-red-50 border border-red-200 rounded p-4 flex gap-3">
          <FiAlertCircle className="text-red-600 mt-1" />
          <div>
            <div className="font-semibold text-red-700">
              Service Due Alert
            </div>
            <div className="text-sm text-red-600">
              Only {kmRemaining} km remaining for next service
            </div>
          </div>
        </div>
      )}

      {/* WORK TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Part</th>
              <th className="p-3">Action</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Cost</th>
              <th className="p-3 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {works.map((w) => (
              <tr key={w.id} className="border-t">
                <td className="p-3">{w.part}</td>
                <td className="p-3">{w.action}</td>
                <td className="p-3">{w.mechanic}</td>
                <td className="p-3">₹ {w.cost}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteWork(w.id)}
                    className="text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD WORK */}
      {vehicle.status === "UNDER_MAINTENANCE" && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FiPlus /> Add Maintenance Work
          </h3>

          <div className="grid md:grid-cols-4 gap-4">
            {["part", "action", "mechanic", "cost"].map((f) => (
              <input
                key={f}
                placeholder={f.toUpperCase()}
                className="border px-3 py-2 rounded"
                value={newWork[f]}
                onChange={(e) =>
                  setNewWork({ ...newWork, [f]: e.target.value })
                }
              />
            ))}
          </div>

          <button
            onClick={addWork}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Add Work
          </button>
        </div>
      )}

      {/* BILLS */}
      <div className="bg-white rounded-xl shadow p-6 space-y-3">
        <h3 className="font-semibold">Bills & Invoices</h3>
        <input type="file" onChange={(e) => addBill(e.target.files[0])} />

        {bills.map((b) => (
          <div key={b.id} className="flex justify-between text-sm">
            <span>{b.name}</span>
            <button
              onClick={() => deleteBill(b.id)}
              className="text-red-600"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      {/* MONTHLY COST */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-4">Monthly Maintenance Cost</h3>
        {monthlyCosts.map((m) => (
          <div key={m.month} className="mb-3">
            <div className="flex justify-between text-sm">
              <span>{m.month}</span>
              <span>₹ {m.cost}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-600 rounded"
                style={{ width: `${m.cost / 200}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* VENDOR REPORT */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-3">Vendor Wise Expense</h3>
        {Object.entries(vendorExpenses).map(([v, c]) => (
          <div key={v} className="flex justify-between border-t py-2 text-sm">
            <span>{v}</span>
            <span className="font-medium">₹ {c}</span>
          </div>
        ))}
      </div>

      {/* COMPLETE */}
      {vehicle.status === "UNDER_MAINTENANCE" && (
        <button
          onClick={completeMaintenance}
          className="bg-green-600 text-white px-6 py-3 rounded flex items-center gap-2"
        >
          <FiCheckCircle /> Mark Maintenance Complete & Unlock Vehicle
        </button>
      )}
    </div>
  );
}