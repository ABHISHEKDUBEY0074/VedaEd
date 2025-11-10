import React, { useEffect, useMemo, useState } from "react";
import {
  FiDollarSign,
  FiCheckCircle,
  FiAlertTriangle,
  FiCalendar,
  FiDownload,
  FiCreditCard,
} from "react-icons/fi";

const feeSummaryDummy = {
  academicYear: "2025-26",
  totalPayable: 48000,
  totalPaid: 36000,
  totalPending: 12000,
  lastPaymentDate: "2025-08-10",
};

const transactionsDummy = [
  {
    id: "txn-001",
    title: "Quarter 1 Tuition Fee",
    amount: 12000,
    dueDate: "2025-08-15",
    paidOn: "2025-08-10",
    status: "Paid",
    mode: "UPI",
    receipt: "Q1_Tuition_Receipt.pdf",
  },
  {
    id: "txn-002",
    title: "Quarter 2 Tuition Fee",
    amount: 12000,
    dueDate: "2025-11-15",
    paidOn: null,
    status: "Pending",
    mode: null,
    receipt: null,
  },
  {
    id: "txn-003",
    title: "Transportation Fee",
    amount: 6000,
    dueDate: "2025-09-10",
    paidOn: "2025-09-08",
    status: "Paid",
    mode: "Net Banking",
    receipt: "Transport_Receipt.pdf",
  },
  {
    id: "txn-004",
    title: "Laboratory Fee",
    amount: 3000,
    dueDate: "2025-10-05",
    paidOn: null,
    status: "Upcoming",
    mode: null,
    receipt: null,
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const statusStyles = {
  Paid: {
    label: "Paid",
    className: "text-green-600 bg-green-100",
    icon: <FiCheckCircle className="w-4 h-4" />,
  },
  Pending: {
    label: "Pending",
    className: "text-yellow-600 bg-yellow-100",
    icon: <FiAlertTriangle className="w-4 h-4" />,
  },
  Upcoming: {
    label: "Upcoming",
    className: "text-blue-600 bg-blue-100",
    icon: <FiCalendar className="w-4 h-4" />,
  },
};

export default function ParentFees() {
  const [summary, setSummary] = useState(feeSummaryDummy);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFees = async () => {
      try {
        setLoading(true);
        // Mimic API load with dummy data
        setSummary(feeSummaryDummy);
        setTransactions(transactionsDummy);
      } finally {
        setLoading(false);
      }
    };

    loadFees();
  }, []);

  const totals = useMemo(() => {
    const totalPending = transactions
      .filter((txn) => txn.status === "Pending")
      .reduce((sum, txn) => sum + txn.amount, 0);

    return {
      pending: totalPending,
      paid: transactions
        .filter((txn) => txn.status === "Paid")
        .reduce((sum, txn) => sum + txn.amount, 0),
      upcomingCount: transactions.filter((txn) => txn.status === "Upcoming")
        .length,
    };
  }, [transactions]);

  const handleDownload = (fileName) => {
    if (!fileName) {
      alert("No receipt available yet.");
      return;
    }
    alert(`⬇️ Downloading ${fileName} (demo mode)`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500 text-sm mb-2">Fees &gt;</p>
        <div className="bg-gray-200 p-10 rounded-lg border flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto mb-4" />
            <p className="text-gray-600 text-sm">
              Loading child’s fee summary...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <p className="text-gray-500 text-sm mb-2">Fees &gt;</p>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-700">
        <FiDollarSign /> Child’s Fee Overview
      </h2>

      <div className="bg-gray-200 p-6 rounded-lg shadow-sm border">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Academic Year</p>
              <p className="text-lg font-semibold text-gray-800">
                {summary.academicYear}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Last payment on {summary.lastPaymentDate}
              </p>
            </div>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-700 font-medium mb-1">Total Payable</p>
              <p className="text-xl font-bold text-blue-900">
                {formatCurrency(summary.totalPayable)}
              </p>
            </div>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <p className="text-sm text-green-700 font-medium mb-1">
                Total Paid
              </p>
              <p className="text-xl font-bold text-green-900">
                {formatCurrency(summary.totalPaid || totals.paid)}
              </p>
            </div>
            <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
              <p className="text-sm text-yellow-700 font-medium mb-1">
                Pending Amount
              </p>
              <p className="text-xl font-bold text-yellow-900">
                {formatCurrency(summary.totalPending || totals.pending)}
              </p>
            </div>
          </div>

          {/* Upcoming Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiAlertTriangle /> Pending & Upcoming Fees
            </h3>
            {transactions.filter((txn) => txn.status !== "Paid").length === 0 ? (
              <div className="border border-dashed border-green-200 rounded-lg p-6 text-center text-green-700">
                All fees are settled. 🎉
              </div>
            ) : (
              <div className="space-y-3">
                {transactions
                  .filter((txn) => txn.status !== "Paid")
                  .map((txn) => {
                    const style = statusStyles[txn.status];
                    return (
                      <div
                        key={txn.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        <div>
                          <p className="text-base font-medium text-gray-800">
                            {txn.title}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <FiCalendar /> Due {txn.dueDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-800">
                            {formatCurrency(txn.amount)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${style.className}`}
                          >
                            {style.icon}
                            {style.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Transactions List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FiCreditCard /> Payment History
            </h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3 font-medium">Fee Item</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Due Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Paid On</th>
                    <th className="px-4 py-3 font-medium">Mode</th>
                    <th className="px-4 py-3 font-medium text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((txn) => {
                    const style = statusStyles[txn.status];
                    return (
                      <tr key={txn.id} className="text-gray-700">
                        <td className="px-4 py-3">{txn.title}</td>
                        <td className="px-4 py-3 font-medium">
                          {formatCurrency(txn.amount)}
                        </td>
                        <td className="px-4 py-3">{txn.dueDate}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${style.className}`}
                          >
                            {style.icon}
                            {style.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {txn.paidOn ? txn.paidOn : "---"}
                        </td>
                        <td className="px-4 py-3">{txn.mode ?? "---"}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDownload(txn.receipt)}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <FiDownload />
                            Receipt
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

