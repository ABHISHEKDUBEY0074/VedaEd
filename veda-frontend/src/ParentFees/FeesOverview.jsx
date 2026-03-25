import { useNavigate } from "react-router-dom";
import {
  FiCreditCard,
  FiFileText,
  FiDownload,
  FiAlertCircle,
  FiBell,
} from "react-icons/fi";

export default function FeesOverview() {
  const navigate = useNavigate();

  // Dummy Data
  const stats = [
    {
      label: "Total Annual Fees",
      value: "₹50,000",
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total Paid",
      value: "₹30,000",
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Outstanding",
      value: "₹20,000",
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Last Payment",
      value: "₹10,000",
      color: "bg-indigo-100 text-indigo-700",
    },
  ];

  const outstandingFees = [
    {
      title: "Term 1 Fees",
      desc: "Due on 10 Jan 2026",
      amount: "₹10,000",
    },
    {
      title: "Transport Fees",
      desc: "Due on 15 Jan 2026",
      amount: "₹5,000",
    },
    {
      title: "Exam Fees",
      desc: "Due on 20 Jan 2026",
      amount: "₹5,000",
    },
  ];

  const notices = [
    {
      title: "Fee Deadline",
      desc: "Last date for Term 1 fee is 10 Jan.",
    },
    {
      title: "Late Fee Alert",
      desc: "Late fee will be applied after due date.",
    },
  ];

  return (
    <div className="p-0 min-h-screen">
     
        
        {/* HEADER */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Fees Dashboard
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            Overview of fees, payments & dues
          </p>
        </div>

        {/* STATS (Fleet style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-4 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${item.color}`}
              >
                ₹
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

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">

          {/* LEFT - Outstanding Fees */}
          <div className="lg:col-span-2 bg-white border rounded-xl p-4">
            <h2 className="text-sm font-semibold mb-3">
              Outstanding Fees
            </h2>

            <div className="space-y-3">
              {outstandingFees.map((fee, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border rounded-lg p-3"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {fee.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {fee.desc}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-red-600">
                    {fee.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Quick Actions */}
          <div className="bg-white border rounded-xl p-4">
            <h2 className="text-sm font-semibold mb-3">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/parent/fees/pay")}
                className="w-full flex items-center justify-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                <FiCreditCard /> Pay Fees
              </button>

              <button
                onClick={() => navigate("/parent/fees/history")}
                className="w-full flex items-center justify-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                <FiFileText /> Fee Statement
              </button>

              <button
                onClick={() => navigate("/parent/fees/history")}
                className="w-full flex items-center justify-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                <FiDownload /> Download Receipt
              </button>

              <button
                onClick={() => navigate("/parent/communication/notices")}
                className="w-full flex items-center justify-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-50"
              >
                <FiBell /> View Notices
              </button>
            </div>
          </div>
        </div>

        {/* ALERTS + NOTICES (Fleet style reuse) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* ALERT */}
          <div className="bg-white border rounded-xl p-4">
            <h2 className="text-sm font-semibold mb-3">
              Alerts
            </h2>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
              <FiAlertCircle className="text-red-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-700">
                  Payment Pending
                </div>
                <div className="text-xs text-red-600">
                  You have ₹20,000 outstanding fees
                </div>
              </div>
            </div>
          </div>

          {/* NOTICES */}
          <div className="bg-white border rounded-xl p-4">
            <h2 className="text-sm font-semibold mb-3">
              Recent Notices
            </h2>

            <div className="space-y-3">
              {notices.map((n, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 text-sm"
                >
                  <div className="font-medium text-gray-700">
                    {n.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {n.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
   
  );
}