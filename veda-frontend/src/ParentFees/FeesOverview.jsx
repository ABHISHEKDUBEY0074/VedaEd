export default function FeesOverview() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h1 className="text-xl font-semibold mb-2">Fees Overview</h1>
      <p className="text-gray-600">
        Yahan student ki total fees, paid fees aur due fees dikhai jayegi.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-blue-50 rounded">
          <div className="text-sm text-gray-500">Total Fees</div>
          <div className="text-xl font-bold">₹50,000</div>
        </div>
        <div className="p-4 bg-green-50 rounded">
          <div className="text-sm text-gray-500">Paid</div>
          <div className="text-xl font-bold text-green-600">₹30,000</div>
        </div>
        <div className="p-4 bg-red-50 rounded">
          <div className="text-sm text-gray-500">Due</div>
          <div className="text-xl font-bold text-red-600">₹20,000</div>
        </div>
      </div>
    </div>
  );
}