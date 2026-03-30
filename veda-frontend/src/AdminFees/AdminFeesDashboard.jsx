import React from "react";
import {
  FiDollarSign,
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminFeesDashboard() {
  // ===== DUMMY DATA =====
  const monthlyData = [
    { month: "Jan", collection: 200000 },
    { month: "Feb", collection: 300000 },
    { month: "Mar", collection: 250000 },
    { month: "Apr", collection: 400000 },
    { month: "May", collection: 350000 },
  ];

  const feeStatus = [
    { name: "Paid", value: 70 },
    { name: "Pending", value: 30 },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="p-0 min-h-screen">

      {/* ===== TITLE ===== */}
      <h1 className="text-xl font-semibold mb-3">Fees Dashboard</h1>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-5 gap-3 mb-3">
        <Card title="Total Collection" value="₹12,50,000" icon={<FiDollarSign />} color="blue" />
        <Card title="Collected Today" value="₹45,000" icon={<FiTrendingUp />} color="green" />
        <Card title="Pending Fees" value="₹3,20,000" icon={<FiClock />} color="yellow" />
        <Card title="Overdue" value="₹1,10,000" icon={<FiAlertCircle />} color="red" />
        <Card title="Total Students" value="1,250" icon={<FiUsers />} color="purple" />
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
        <h2 className="text-md font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-4 gap-4">
          <ActionBtn text="Collect Fees" color="blue" />
          <ActionBtn text="Search Payment" color="green" />
          <ActionBtn text="View Due Fees" color="yellow" />
          <ActionBtn text="Send Reminder" color="purple" />
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-2 gap-6 mb-3">

        {/* BAR CHART */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-md font-semibold mb-4">Monthly Collection</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="collection" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-md font-semibold mb-4">Fees Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={feeStatus}
                dataKey="value"
                outerRadius={90}
                label
              >
                {feeStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== RECENT TRANSACTIONS ===== */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-md font-semibold mb-4">Recent Transactions</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3">Student</th>
                <th>Class</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {[
                { name: "Aman Verma", cls: "10-A", amt: "₹5,000", date: "12 Feb", status: "Paid" },
                { name: "Riya Sharma", cls: "9-B", amt: "₹3,200", date: "11 Feb", status: "Paid" },
                { name: "Rahul Singh", cls: "8-C", amt: "₹6,500", date: "10 Feb", status: "Pending" },
                { name: "Neha Gupta", cls: "7-A", amt: "₹4,200", date: "09 Feb", status: "Paid" },
              ].map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3">{row.name}</td>
                  <td>{row.cls}</td>
                  <td>{row.amt}</td>
                  <td>{row.date}</td>
                  <td
                    className={
                      row.status === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

const Card = ({ title, value, icon, color }) => {
  const colors = {
    blue: "border-blue-500 text-blue-500",
    green: "border-green-500 text-green-500",
    yellow: "border-yellow-500 text-yellow-500",
    red: "border-red-500 text-red-500",
    purple: "border-purple-500 text-purple-500",
  };

  return (
    <div className={`bg-white p-3 rounded-xl shadow-sm border-l-4 ${colors[color]}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-lg font-semibold mt-1">{value}</h2>
        </div>
        <div className={colors[color]}>{icon}</div>
      </div>
    </div>
  );
};

const ActionBtn = ({ text, color }) => {
  const styles = {
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-700",
    green: "bg-green-50 hover:bg-green-100 text-green-700",
    yellow: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700",
    purple: "bg-purple-50 hover:bg-purple-100 text-purple-700",
  };

  return (
    <button className={`${styles[color]} p-4 rounded-lg text-sm font-medium`}>
      {text}
    </button>
  );
};