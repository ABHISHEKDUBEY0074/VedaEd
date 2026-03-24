export default function PaymentHistory() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h1 className="text-xl font-semibold mb-4">Payment History</h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left border">Date</th>
              <th className="p-2 text-left border">Amount</th>
              <th className="p-2 text-left border">Mode</th>
              <th className="p-2 text-left border">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">20-03-2026</td>
              <td className="p-2 border">₹10,000</td>
              <td className="p-2 border">UPI</td>
              <td className="p-2 border text-green-600">Success</td>
            </tr>
            <tr>
              <td className="p-2 border">05-02-2026</td>
              <td className="p-2 border">₹5,000</td>
              <td className="p-2 border">Cash</td>
              <td className="p-2 border text-green-600">Success</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}