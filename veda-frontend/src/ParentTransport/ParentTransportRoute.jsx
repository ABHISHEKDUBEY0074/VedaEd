import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

/* ===== FIX LEAFLET ICON ===== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===== DUMMY ROUTE DATA ===== */
const DUMMY_ROUTE = {
  routeName: "Gomti Nagar – Alambagh",
  vehicleNumber: "UP32 AB 1234",
  driverName: "Ramesh Kumar",
  driverContact: "9876543210",
  pickupPoints: [
    {
      name: "Gomti Nagar Extension",
      time: "07:10 AM",
      latitude: 26.8467,
      longitude: 80.9462,
      isStudentPickup: false,
    },
    {
      name: "Indira Nagar",
      time: "07:25 AM",
      latitude: 26.8655,
      longitude: 80.9796,
      isStudentPickup: true,
    },
    {
      name: "Alambagh",
      time: "07:45 AM",
      latitude: 26.8005,
      longitude: 80.9042,
      isStudentPickup: false,
    },
  ],
};

export default function ParentTransportRoute() {
  const [route] = useState(DUMMY_ROUTE);

  const mapCenter = [
    route.pickupPoints[0].latitude,
    route.pickupPoints[0].longitude,
  ];

  const polylinePoints = route.pickupPoints.map((p) => [
    p.latitude,
    p.longitude,
  ]);

  return (
    <div className="bg-white rounded-xl shadow p-4">

      {/* ===== HEADER ===== */}
      <h2 className="text-xl font-semibold mb-4">
        Transport Route
      </h2>

      {/* ===== ROUTE INFO ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
        <div>
          <p className="font-semibold">Route</p>
          <p>{route.routeName}</p>
        </div>
        <div>
          <p className="font-semibold">Vehicle No</p>
          <p>{route.vehicleNumber}</p>
        </div>
        <div>
          <p className="font-semibold">Driver</p>
          <p>{route.driverName}</p>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <p>{route.driverContact}</p>
        </div>
      </div>

      {/* ===== MAP + LIST ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* ===== PICKUP LIST ===== */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">
            Pickup / Drop Points
          </h3>

          {route.pickupPoints.map((p, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border ${
                p.isStudentPickup
                  ? "bg-lime-100 border-lime-400"
                  : "bg-gray-50"
              }`}
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-600">
                Time: {p.time}
              </p>
              {p.isStudentPickup && (
                <p className="text-xs text-green-700 font-semibold">
                  ★ Your Child Pickup Point
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ===== MAP ===== */}
        <div className="md:col-span-2 h-[450px] rounded-lg overflow-hidden border">
          <MapContainer
            center={mapCenter}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <Polyline positions={polylinePoints} weight={4} />

            {route.pickupPoints.map((p, i) => (
              <Marker
                key={i}
                position={[p.latitude, p.longitude]}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}