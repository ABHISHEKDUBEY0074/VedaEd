
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import config from "../config";

export default function RoutePickupPoint() {
  const [routes, setRoutes] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [routeStops, setRouteStops] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedStop, setSelectedStop] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rRes, pRes, sRes] = await Promise.all([
        axios.get(`${config.API_BASE_URL}/transport/routes`),
        axios.get(`${config.API_BASE_URL}/transport/pickup-points`),
        axios.get(`${config.API_BASE_URL}/transport/route-stops`)
      ]);
      setRoutes(rRes.data);
      setPickupPoints(pRes.data);
      setRouteStops(sRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedRoute || !selectedStop) {
      alert("Please select both Route and Pickup Point");
      return;
    }

    try {
      await axios.post(`${config.API_BASE_URL}/transport/route-stops`, {
        route: selectedRoute,
        stop: selectedStop
      });
      fetchData();
      setSelectedStop("");
    } catch (error) {
      console.error("Error assigning stop:", error);
      alert("Failed to assign stop");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this stop from route?")) {
      try {
        await axios.delete(`${config.API_BASE_URL}/transport/route-stops/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting stop mapping:", error);
      }
    }
  };

  const filteredStops = useMemo(() => {
    return routeStops.filter(s => 
      s.route?.title.toLowerCase().includes(search.toLowerCase()) ||
      s.stop?.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [routeStops, search]);

  return (
    <div className="p-0 m-0 min-h-screen">
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
            <span>Transport &gt;</span>
            <span>Route Pickup Point </span>
          </div>
    <div className="flex items-center justify-between mb-4">
           <h2 className="text-2xl font-bold">Route Pickup Point</h2>
         </div>
    
          {/* Tabs */}
          <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
            <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
              Overview
            </button>
          </div>
      {/* Header */}
       <div className="bg-white p-3 rounded-xl shadow mb-3">
      <div className="flex justify-between mb-4">
        
       
      

      {/* Search */}
      <input
        className="border px-3 py-2 rounded mb-3 w-64"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-5 py-0.5 rounded"
        >
          Add
        </button>
</div>
      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => setSortAsc(!sortAsc)}
              >
                Route
              </th>
              <th className="p-3">Pickup Point</th>
              <th className="p-3">Monthly Fees</th>
              <th className="p-3">Distance</th>
              <th className="p-3">Pickup Time</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-3">{row.route}</td>
                <td className="p-3">
                  {row.pickups.map((p, i) => (
                    <div key={i}>{p.point}</div>
                  ))}
                </td>
                <td className="p-3">
                  {row.pickups.map((p, i) => (
                    <div key={i}>{p.fee}</div>
                  ))}
                </td>
                <td className="p-3">
                  {row.pickups.map((p, i) => (
                    <div key={i}>{p.distance}</div>
                  ))}
                </td>
                <td className="p-3">
                  {row.pickups.map((p, i) => (
                    <div key={i}>{p.time}</div>
                  ))}
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => openEdit(row)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleDelete(row.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
  <p>
    Page {page} of {totalPages}
  </p>

  <div className="space-x-2">
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="px-3 py-1 border rounded text-sm
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>

    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className="px-3 py-1 border rounded text-sm
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</div>
</div>
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-5xl rounded shadow">
            <div className="bg-purple-600 text-white px-4 py-2 flex justify-between">
              <span>{editId ? "Edit" : "Add"}</span>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="p-4">
              <label className="block font-medium mb-1">
                Route <span className="text-red-500">*</span>
              </label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="border w-full px-3 py-2 rounded mb-4"
              >
                <option value="">Select</option>
                {routes.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>

              {pickups.map((p, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 gap-3 mb-3 items-end"
                >
                  <select
                    className="border px-3 py-2 rounded"
                    value={p.point}
                    onChange={(e) =>
                      handlePickupChange(i, "point", e.target.value)
                    }
                  >
                    <option value="">Pickup Point</option>
                    {pickupPointList.map((pt) => (
                      <option key={pt}>{pt}</option>
                    ))}
                  </select>

                  <input
                    className="border px-3 py-2 rounded"
                    placeholder="Distance"
                    value={p.distance}
                    onChange={(e) =>
                      handlePickupChange(i, "distance", e.target.value)
                    }
                  />

                  <input
                    className="border px-3 py-2 rounded"
                    placeholder="Pickup Time"
                    value={p.time}
                    onChange={(e) =>
                      handlePickupChange(i, "time", e.target.value)
                    }
                  />

                  <input
                    className="border px-3 py-2 rounded"
                    placeholder="Fees"
                    value={p.fee}
                    onChange={(e) =>
                      handlePickupChange(i, "fee", e.target.value)
                    }
                  />

                  <button
                    onClick={() => removeRow(i)}
                    className="bg-red-500 text-white px-3 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={addMoreRow}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add More
              </button>
            </div>

            <div className="p-4 text-right">
              <button
                onClick={handleSave}
                className="bg-purple-600 text-white px-6 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ASSIGN FORM */}
        <div className="bg-white rounded-xl shadow p-5 h-fit">
          <h3 className="text-lg font-semibold mb-4">Assign Stop to Route</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Route</label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Route</option>
                {routes.map(r => (
                  <option key={r._id} value={r._id}>{r.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Select Pickup Point</label>
              <select
                value={selectedStop}
                onChange={(e) => setSelectedStop(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Stop</option>
                {pickupPoints.map(p => (
                  <option key={p._id} value={p._id}>{p.name} ({p.time})</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAssign}
              className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
            >
              Assign Stop
            </button>
          </div>
        </div>

        {/* LIST TABLE */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Assigned Stops</h3>
            <input
              type="text"
              placeholder="Search..."
              className="border rounded px-3 py-1 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Route</th>
                  <th className="p-3">Pickup Point</th>
                  <th className="p-3">Time</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStops.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="p-3 font-medium">{item.route?.title}</td>
                    <td className="p-3">{item.stop?.name}</td>
                    <td className="p-3 text-gray-600">{item.stop?.time}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStops.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">No stop assignments found</td>
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