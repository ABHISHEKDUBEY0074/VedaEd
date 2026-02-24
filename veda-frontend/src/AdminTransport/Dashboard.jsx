import {
  FiTruck,
  FiMapPin,
  FiUsers,
  FiCreditCard,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function TransportDashboard() {
  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Transport Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of transport management system
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <StatCard
          title="Total Vehicles"
          value="24"
          icon={<FiTruck size={22} />}
          color="bg-blue-500"
        />

        <StatCard
          title="Total Routes"
          value="12"
          icon={<FiMapPin size={22} />}
          color="bg-green-500"
        />

        <StatCard
          title="Pickup Points"
          value="38"
          icon={<FiMapPin size={22} />}
          color="bg-purple-500"
        />

        <StatCard
          title="Assigned Vehicles"
          value="20"
          icon={<FiCheckCircle size={22} />}
          color="bg-emerald-500"
        />

        <StatCard
          title="Pending Assignments"
          value="4"
          icon={<FiAlertCircle size={22} />}
          color="bg-red-500"
        />

        <StatCard
          title="Transport Fee Collected"
          value="₹4,85,000"
          icon={<FiCreditCard size={22} />}
          color="bg-indigo-500"
        />

      </div>

      {/* QUICK ACCESS SECTION */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <QuickCard title="Fees Master" />
          <QuickCard title="Pickup Point" />
          <QuickCard title="Routes" />
          <QuickCard title="Vehicles" />
          <QuickCard title="Assign Vehicle" />
          <QuickCard title="Route Pickup Point" />
          <QuickCard title="Student Transport Fees" />

        </div>
      </div>

    </div>
  );
}

/* ================= STAT CARD COMPONENT ================= */

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-full text-white ${color}`}>
        {icon}
      </div>
    </div>
  );
}

/* ================= QUICK CARD ================= */

function QuickCard({ title }) {
  return (
    <div className="bg-gray-100 hover:bg-purple-100 transition p-4 rounded-lg cursor-pointer text-center text-sm font-medium">
      {title}
    </div>
  );
}