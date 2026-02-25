import { useState, useMemo } from "react";

export default function RoutePickupPoint() {
  /* -------------------- MASTER DATA -------------------- */
  const routes = [
    "Brooklyn Central",
    "Brooklyn East",
    "Brooklyn South",
    "Brooklyn North",
    "Brooklyn West",
  ];

  const pickupPointList = [
    "Brooklyn North",
    "Brooklyn South",
    "Brooklyn East",
    "Brooklyn West",
    "High Court",
    "Railway Station",
    "Ranital Chowk",
  ];

  /* -------------------- TABLE DATA -------------------- */
  const [rows, setRows] = useState([
    {
      id: 1,
      route: "Brooklyn Central",
      pickups: [
        { point: "Brooklyn North", fee: 50, distance: 20, time: "9:00 AM" },
        { point: "Brooklyn South", fee: 60, distance: 15, time: "9:30 AM" },
      ],
    },
  ]);

  /* -------------------- UI STATE -------------------- */
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  /* -------------------- MODAL STATE -------------------- */
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [route, setRoute] = useState("");
  const [pickups, setPickups] = useState([
    { point: "", distance: "", time: "", fee: "0.00" },
  ]);

  /* -------------------- FILTER + SORT -------------------- */
  const filtered = useMemo(() => {
    let data = rows.filter((r) =>
      r.route.toLowerCase().includes(search.toLowerCase())
    );
    data.sort((a, b) =>
      sortAsc
        ? a.route.localeCompare(b.route)
        : b.route.localeCompare(a.route)
    );
    return data;
  }, [rows, search, sortAsc]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* -------------------- HANDLERS -------------------- */
  const openAdd = () => {
    setEditId(null);
    setRoute("");
    setPickups([{ point: "", distance: "", time: "", fee: "0.00" }]);
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditId(row.id);
    setRoute(row.route);
    setPickups(row.pickups);
    setShowModal(true);
  };

  const handlePickupChange = (index, key, value) => {
    const updated = [...pickups];
    updated[index][key] = value;
    setPickups(updated);
  };

  const addMoreRow = () => {
    setPickups([
      ...pickups,
      { point: "", distance: "", time: "", fee: "0.00" },
    ]);
  };

  const removeRow = (index) => {
    setPickups(pickups.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!route) {
      alert("Route is required");
      return;
    }

    if (editId) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editId ? { ...r, route, pickups } : r
        )
      );
    } else {
      setRows([
        ...rows,
        {
          id: Date.now(),
          route,
          pickups,
        },
      ]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this record?")) {
      setRows(rows.filter((r) => r.id !== id));
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-0 min-h-screen">
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
    </div>
  );
}