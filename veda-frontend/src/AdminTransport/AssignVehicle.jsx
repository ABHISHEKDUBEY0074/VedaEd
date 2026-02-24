import { useState, useMemo } from "react";

export default function AssignVehicle() {
  // dummy routes
  const [routes] = useState([
    { id: 1, title: "Brooklyn Central" },
    { id: 2, title: "Brooklyn East" },
    { id: 3, title: "Brooklyn West" },
    { id: 4, title: "Brooklyn North" },
    { id: 5, title: "Brooklyn South" },
  ]);

  // dummy vehicles
  const vehicles = ["VH4584", "VH5645", "VH1001"];

  const [assignments, setAssignments] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // checkbox handler
  const toggleVehicle = (v) => {
    setSelectedVehicles((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  // save / update
  const handleSave = () => {
    if (!selectedRoute || selectedVehicles.length === 0) {
      alert("Route and Vehicle required");
      return;
    }

    if (editId) {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === editId
            ? { ...a, route: selectedRoute, vehicles: selectedVehicles }
            : a
        )
      );
      setEditId(null);
    } else {
      setAssignments([
        ...assignments,
        {
          id: Date.now(),
          route: selectedRoute,
          vehicles: selectedVehicles,
        },
      ]);
    }

    setSelectedRoute("");
    setSelectedVehicles([]);
  };

  const handleEdit = (row) => {
    setSelectedRoute(row.route);
    setSelectedVehicles(row.vehicles);
    setEditId(row.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      setAssignments(assignments.filter((a) => a.id !== id));
    }
  };

  // search filter
  const filteredData = useMemo(() => {
    return assignments.filter((a) =>
      a.route.toLowerCase().includes(search.toLowerCase())
    );
  }, [assignments, search]);

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Transport &gt;</span>
        <span>Assign Vehicle</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Assign Vehicle</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 text-sm mb-3 text-gray-600 border-b">
        <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* LEFT FORM */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Assign Vehicle On Route
          </h2>

          {/* Route */}
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Route <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select</option>
              {routes.map((r) => (
                <option key={r.id} value={r.title}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicles */}
          <div>
            <label className="block font-medium mb-1">
              Vehicle <span className="text-red-500">*</span>
            </label>

            {vehicles.map((v) => (
              <div key={v} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={selectedVehicles.includes(v)}
                  onChange={() => toggleVehicle(v)}
                />
                <span>{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
            >
              {editId ? "Update" : "Save"}
            </button>
          </div>
        </div>

        {/* RIGHT TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">
            Vehicle Route List
          </h2>

          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search"
              className="border px-3 py-2 rounded w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Route</th>
                  <th className="p-3 text-left">Vehicle</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-3">{row.route}</td>
                    <td className="p-3">
                      {row.vehicles.map((v) => (
                        <div key={v}>{v}</div>
                      ))}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center p-4">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}