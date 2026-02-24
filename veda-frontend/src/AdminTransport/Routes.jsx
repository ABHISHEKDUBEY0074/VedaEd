import { useState, useMemo } from "react";

export default function Routes() {
  const [routes, setRoutes] = useState([
    { id: 1, title: "Brooklyn Central" },
    { id: 2, title: "Brooklyn East" },
    { id: 3, title: "Brooklyn West" },
  ]);

  const [routeTitle, setRouteTitle] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc",
  });

  // Sorting
  const sortedRoutes = useMemo(() => {
    let sortable = [...routes];
    sortable.sort((a, b) => {
      if (a.title < b.title)
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a.title > b.title)
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortable;
  }, [routes, sortConfig]);

  // Filter
  const filteredRoutes = sortedRoutes.filter((route) =>
    route.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSort = () => {
    setSortConfig((prev) => ({
      key: "title",
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Save / Update
  const handleSave = () => {
    if (!routeTitle.trim()) {
      alert("Route Title is required");
      return;
    }

    // Restriction: Only letters + space
    if (!/^[a-zA-Z\s]+$/.test(routeTitle)) {
      alert("Only letters allowed");
      return;
    }

    if (editId) {
      setRoutes((prev) =>
        prev.map((route) =>
          route.id === editId ? { ...route, title: routeTitle } : route
        )
      );
      setEditId(null);
    } else {
      setRoutes([
        ...routes,
        { id: Date.now(), title: routeTitle },
      ]);
    }

    setRouteTitle("");
  };

  const handleEdit = (route) => {
    setRouteTitle(route.title);
    setEditId(route.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      setRoutes(routes.filter((route) => route.id !== id));
    }
  };

  return (
    <div className="p-0 m-0 min-h-screen">
          {/* Breadcrumb */}
          <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
            <span>Transport &gt;</span>
            <span>Routes</span>
          </div>
    <div className="flex items-center justify-between mb-2">
           <h2 className="text-2xl font-bold">Routes </h2>
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
        <h2 className="text-lg font-semibold mb-4">Create Route</h2>

        <div>
          <label className="block font-medium mb-1">
            Route Title <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            maxLength={30}
            value={routeTitle}
            onChange={(e) => setRouteTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter route title"
          />
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
        <h2 className="text-lg font-semibold mb-4">Route List</h2>

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
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={handleSort}
                >
                  Route Title
                </th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="border-t">
                  <td className="p-3">{route.title}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(route)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRoutes.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center p-4">
                    No Routes Found
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