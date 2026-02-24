import { useState, useMemo } from "react";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      vehicleNumber: "VH4584",
      model: "Ford CAB",
      year: "2015",
      registration: "FFG-76575676787",
      chasis: "523422",
      capacity: "50",
      driverName: "Jasper",
      licence: "258714545",
      contact: "8521479630",
      note: "",
      photo: null,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const emptyForm = {
    vehicleNumber: "",
    model: "",
    year: "",
    registration: "",
    chasis: "",
    capacity: "",
    driverName: "",
    licence: "",
    contact: "",
    note: "",
    photo: null,
  };

  const [formData, setFormData] = useState(emptyForm);

  // Filter
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) =>
      v.vehicleNumber.toLowerCase().includes(search.toLowerCase())
    );
  }, [vehicles, search]);

  // Handle Change with Restrictions
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "capacity" || name === "year" || name === "contact") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        photo: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = () => {
    if (!formData.vehicleNumber || !formData.model) {
      alert("Vehicle Number and Model are required");
      return;
    }

    if (editId) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === editId ? { ...v, ...formData } : v
        )
      );
      setEditId(null);
    } else {
      setVehicles([
        ...vehicles,
        { id: Date.now(), ...formData },
      ]);
    }

    setFormData(emptyForm);
    setShowModal(false);
  };

  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setEditId(vehicle.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this vehicle?")) {
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
  };

  return (
     <div className="p-0 m-0 min-h-screen">
          {/* Breadcrumb */}
          <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
            <span>Transport &gt;</span>
            <span>Vehicles List</span>
          </div>
    <div className="flex items-center justify-between mb-2">
           <h2 className="text-2xl font-bold">Vehicles List </h2>
         </div>
    
          {/* Tabs */}
          <div className="flex gap-3 text-sm mb-3 text-gray-600 border-b">
            <button className="capitalize pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
              Overview
            </button>
          </div>
    <div className="bg-white rounded-xl shadow p-5">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Vehicle List</h2>
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
        placeholder="Search"
        className="border px-3 py-2 rounded mb-4 w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Vehicle No</th>
              <th className="p-2">Model</th>
              <th className="p-2">Year</th>
              <th className="p-2">Reg No</th>
              <th className="p-2">Chasis</th>
              <th className="p-2">Capacity</th>
              <th className="p-2">Driver</th>
              <th className="p-2">Licence</th>
              <th className="p-2">Contact</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-2">{v.vehicleNumber}</td>
                <td className="p-2">{v.model}</td>
                <td className="p-2">{v.year}</td>
                <td className="p-2">{v.registration}</td>
                <td className="p-2">{v.chasis}</td>
                <td className="p-2">{v.capacity}</td>
                <td className="p-2">{v.driverName}</td>
                <td className="p-2">{v.licence}</td>
                <td className="p-2">{v.contact}</td>
                <td className="p-2 text-center space-x-1">
                  <button
                    onClick={() => handleEdit(v)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-4/5 max-w-5xl rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="bg-blue-600 text-white p-4 flex justify-between">
              <h3 className="font-semibold">
                {editId ? "Edit Vehicle" : "Add Vehicle"}
              </h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(emptyForm).map((key) =>
                key !== "photo" && key !== "note" ? (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    placeholder={key}
                    className="border px-3 py-2 rounded"
                  />
                ) : null
              )}

              <div className="col-span-3">
                <label className="block mb-1">Vehicle Photo</label>
                <input type="file" onChange={handleFileChange} />
                {formData.photo && (
                  <img
                    src={formData.photo}
                    alt="preview"
                    className="mt-2 h-24"
                  />
                )}
              </div>

              <div className="col-span-3">
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Note"
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
            </div>

            <div className="p-4 text-right">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
     </div>
  );
}