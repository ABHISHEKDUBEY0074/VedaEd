import { useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

const ROUTES = [
  { id: 1, route: "City Center → School", vehicle: "UP32 AB 4589" },
  { id: 2, route: "Civil Lines → School", vehicle: "UP32 CD 1123" },
  { id: 3, route: "Railway Station → School", vehicle: "UP32 EF 7788" },
];

const DRIVERS = [
  { id: 1, name: "Ramesh Yadav", phone: "9876543210" },
  { id: 2, name: "Mahesh Kumar", phone: "9876501234" },
];

const CONDUCTORS = [
  { id: 1, name: "Sanjay Kumar", phone: "9898989898" },
  { id: 2, name: "Mukesh Singh", phone: "9870011223" },
];

export default function DriverAllocation() {

  const [allocations, setAllocations] = useState([
    {
      id: 1,
      routeId: 1,
      driverId: 1,
      conductorId: 1,
      date: "2026-03-01",
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    routeId: "",
    driverId: "",
    conductorId: "",
    date: "",
  });

  /* ================= SAVE ================= */

  const saveAllocation = () => {

    if (!form.routeId || !form.driverId || !form.conductorId) return;

    if (editId) {

      setAllocations(
        allocations.map(a =>
          a.id === editId ? { ...a, ...form } : a
        )
      );

    } else {

      setAllocations([
        ...allocations,
        {
          id: Date.now(),
          ...form,
        },
      ]);

    }

    setForm({
      routeId: "",
      driverId: "",
      conductorId: "",
      date: "",
    });

    setEditId(null);
    setOpenModal(false);
  };

  const deleteAllocation = (id) => {
    setAllocations(allocations.filter(a => a.id !== id));
  };

  const editAllocation = (a) => {
    setForm(a);
    setEditId(a.id);
    setOpenModal(true);
  };

  return (

    <div className="p-0 m-0 min-h-screen">

      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Fleet &gt;</span>
        <span>Driver Allocation</span>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Driver & Conductor Allocation</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 text-sm mb-3 text-gray-600 border-b">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      <div className="space-y-4">

        {/* TABLE */}

        <div className="bg-white p-4 rounded shadow">

          {/* TABLE HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Route Allocations</h3>

            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              <FiPlus /> Allocate Driver
            </button>
          </div>

          <table className="w-full text-sm border">

            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Route</th>
                <th className="border p-2">Vehicle</th>
                <th className="border p-2">Driver</th>
                <th className="border p-2">Driver Phone</th>
                <th className="border p-2">Conductor</th>
                <th className="border p-2">Conductor Phone</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>

              {allocations.map(a => {

                const route = ROUTES.find(r => r.id == a.routeId);
                const driver = DRIVERS.find(d => d.id == a.driverId);
                const conductor = CONDUCTORS.find(c => c.id == a.conductorId);

                return (

                  <tr key={a.id} className="text-center">

                    <td className="border p-2">{route?.route}</td>

                    <td className="border p-2 font-medium">
                      {route?.vehicle}
                    </td>

                    <td className="border p-2">{driver?.name}</td>

                    <td className="border p-2">{driver?.phone}</td>

                    <td className="border p-2">{conductor?.name}</td>

                    <td className="border p-2">{conductor?.phone}</td>

                    <td className="border p-2">{a.date}</td>

                    <td className="border p-2 flex justify-center gap-3">

                      <button
                        onClick={() => editAllocation(a)}
                        className="text-blue-600"
                      >
                        <FiEdit />
                      </button>

                      <button
                        onClick={() => deleteAllocation(a.id)}
                        className="text-red-600"
                      >
                        <FiTrash2 />
                      </button>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      {openModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[420px] space-y-4">

            <h3 className="text-lg font-semibold">
              {editId ? "Edit Allocation" : "Allocate Driver"}
            </h3>

            <select
              className="border w-full p-2 rounded"
              value={form.routeId}
              onChange={(e) =>
                setForm({ ...form, routeId: e.target.value })
              }
            >
              <option value="">Select Route</option>

              {ROUTES.map(r => (
                <option key={r.id} value={r.id}>
                  {r.route} ({r.vehicle})
                </option>
              ))}

            </select>

            <select
              className="border w-full p-2 rounded"
              value={form.driverId}
              onChange={(e) =>
                setForm({ ...form, driverId: e.target.value })
              }
            >
              <option value="">Select Driver</option>

              {DRIVERS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}

            </select>

            <select
              className="border w-full p-2 rounded"
              value={form.conductorId}
              onChange={(e) =>
                setForm({ ...form, conductorId: e.target.value })
              }
            >
              <option value="">Select Conductor</option>

              {CONDUCTORS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}

            </select>

            <input
              type="date"
              className="border w-full p-2 rounded"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveAllocation}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}