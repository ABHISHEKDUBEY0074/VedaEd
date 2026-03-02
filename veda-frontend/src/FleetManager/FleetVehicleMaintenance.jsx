import { useNavigate } from "react-router-dom";
import { useState } from "react";

const INITIAL_DATA = [
  {
    id: 1,
    vehicleNo: "UP32 AB 1234",
    lastService: "2026-02-10",
    nextDue: "2026-03-15",
    status: "Under Maintenance",
    locked: true,
    kmLeft: 120,
  },
  {
    id: 2,
    vehicleNo: "UP32 CD 5678",
    lastService: "2026-01-05",
    nextDue: "2026-04-05",
    status: "Active",
    locked: false,
    kmLeft: 480,
  },
];

export default function FleetMaintenance() {
  const navigate = useNavigate();
  const [rows] = useState(INITIAL_DATA);

  const alertVehicles = rows.filter(r => r.kmLeft <= 200);

  return (
    <div className="p-0 m-0 min-h-screen">
          {/* Breadcrumb */}
          <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
            <span>Fleet &gt;</span>
            <span>Maintenance List</span>
          </div>
    <div className="flex items-center justify-between mb-2">
           <h2 className="text-2xl font-bold">Maintenance List </h2>
         </div>
    
          {/* Tabs */}
          <div className="flex gap-3 text-sm mb-3 text-gray-600 border-b">
            <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
              Overview
            </button>
          </div>
    <div className="space-y-4">

      {/* ALERT CARDS */}
      {alertVehicles.length > 0 && (
        <div className="bg-red-50 border border-red-300 p-4 rounded">
          <h3 className="font-semibold text-red-700 mb-2">
            🔔 Maintenance Alerts
          </h3>
          {alertVehicles.map(v => (
            <div key={v.id} className="text-sm text-red-600">
              {v.vehicleNo} → Only <b>{v.kmLeft} km</b> left for service
            </div>
          ))}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Vehicle Maintenance</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Vehicle</th>
              <th className="border p-2">Last Service</th>
              <th className="border p-2">Next Due</th>
              <th className="border p-2">KM Left</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Lock</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="text-center">
                <td className="border p-2 font-medium">{r.vehicleNo}</td>
                <td className="border p-2">{r.lastService}</td>
                <td className="border p-2">{r.nextDue}</td>
                <td className="border p-2">
                  <span className={r.kmLeft <= 200 ? "text-red-600" : ""}>
                    {r.kmLeft} km
                  </span>
                </td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    r.status === "Under Maintenance"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="border p-2">
                  {r.locked ? "🔒 Locked" : "🟢 Active"}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => navigate(`/fleet/maintenance/${r.id}`)}
                    className="text-indigo-600 underline"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}