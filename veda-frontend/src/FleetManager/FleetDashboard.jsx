import {
  FiTruck,
  FiTool,
  FiDroplet,
  FiUsers,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";

export default function FleetDashboard() {
  const stats = [
    {
      label: "Total Vehicles",
      value: 24,
      icon: <FiTruck />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Active Vehicles",
      value: 20,
      icon: <FiTruck />,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "In Maintenance",
      value: 4,
      icon: <FiTool />,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Drivers Assigned",
      value: 18,
      icon: <FiUsers />,
      color: "bg-purple-100 text-purple-700",
    },
    {
      label: "Monthly Fuel Cost",
      value: "₹ 42,500",
      icon: <FiDroplet />,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Pending Documents",
      value: 6,
      icon: <FiFileText />,
      color: "bg-red-100 text-red-700",
    },
  ];

  const alerts = [
    {
      title: "Insurance Expiring",
      description: "3 vehicles insurance expires within 7 days",
    },
    {
      title: "Service Due",
      description: "2 vehicles pending scheduled maintenance",
    },
  ];

  const recentActivities = [
    {
      activity: "Fuel entry added",
      detail: "UP32 AB 2345 • ₹2,300",
      time: "2 hours ago",
    },
    {
      activity: "Vehicle serviced",
      detail: "UP32 CD 9981 • Engine maintenance",
      time: "Yesterday",
    },
    {
      activity: "Driver assigned",
      detail: "Amit Kumar → UP32 AB 2345",
      time: "2 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Fleet Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Overview of vehicles, maintenance, fuel & drivers
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border p-4 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg ${item.color}`}
            >
              {item.icon}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">
                {item.value}
              </div>
              <div className="text-sm text-gray-500">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ALERTS + ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ALERTS */}
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Alerts
          </h2>

          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-red-50 mb-2"
            >
              <FiAlertCircle className="text-red-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-700">
                  {alert.title}
                </div>
                <div className="text-xs text-red-600">
                  {alert.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-xl border p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Recent Activity
          </h2>

          <ul className="space-y-3">
            {recentActivities.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-start text-sm"
              >
                <div>
                  <div className="font-medium text-gray-700">
                    {item.activity}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.detail}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {item.time}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}