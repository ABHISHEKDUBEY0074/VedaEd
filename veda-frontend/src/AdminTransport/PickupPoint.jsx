import { useState, useMemo } from "react";


export default function PickupPoint() {
  const [pickupPoints, setPickupPoints] = useState([
    { id: 1, name: "Thailand", time: "07:30 AM", type: "Morning" },
    { id: 2, name: "Goa", time: "01:30 PM", type: "Afternoon" },
    { id: 3, name: "Colardo", time: "07:45 AM", type: "Morning" },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    time: "",
    type: "Morning",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // Sorting Logic
  const sortedData = useMemo(() => {
    let sortable = [...pickupPoints];
    sortable.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortable;
  }, [pickupPoints, sortConfig]);

  // Filter
  const filteredData = sortedData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restriction: name only letters + space
    if (name === "name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.time) {
      alert("All fields are required");
      return;
    }

    if (editData) {
      setPickupPoints((prev) =>
        prev.map((item) =>
          item.id === editData.id ? { ...item, ...formData } : item
        )
      );
    } else {
      setPickupPoints([
        ...pickupPoints,
        { id: Date.now(), ...formData },
      ]);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditData(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      setPickupPoints(pickupPoints.filter((item) => item.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: "", time: "", type: "Morning" });
    setEditData(null);
    setShowModal(false);
  };

  return (
     <div className="p-0 m-0 min-h-screen">
          {/* Breadcrumb */}
          <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
            <span>Transport &gt;</span>
            <span>Pickup Point List</span>
          </div>
    <div className="flex items-center justify-between mb-4">
           <h2 className="text-2xl font-bold">Pickup Point List</h2>
         </div>
    
          {/* Tabs */}
          <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
            <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
              Overview
            </button>
          </div>
    <div className="bg-white rounded-xl shadow p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pickup Point List</h2>
        <button
  onClick={() => setShowModal(true)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
>
  + Add
</button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="border px-3 py-2 rounded mb-4 w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Name
              </th>
              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => requestSort("time")}
              >
                Time
              </th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.time}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3 flex justify-center gap-2">
                 <button
  onClick={() => handleEdit(item)}
  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
>
  Edit
</button>
                  <button
  onClick={() => handleDelete(item.id)}
  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
>
  Delete
</button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-xl shadow-lg">
            <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between">
              <h3>{editData ? "Edit Pickup Point" : "Add Pickup Point"}</h3>
              <button onClick={resetForm}>✕</button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block mb-1 font-medium">
                  Pickup Point *
                </label>
                <input
                  type="text"
                  name="name"
                  maxLength={30}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter pickup point"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Time Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end p-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {editData ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}