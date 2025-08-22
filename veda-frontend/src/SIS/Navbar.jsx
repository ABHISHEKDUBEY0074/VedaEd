export default function Navbar({ searchQuery, setSearchQuery }) {
  return (
    <div className="w-full h-14 bg-white border-b flex items-center px-6 justify-between shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-blue-700 font-extrabold text-lg">RA</span>
        <h1 className="text-lg font-bold text-gray-700">VedaSchool</h1>
      </div>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border px-3 py-1 rounded-lg w-1/3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">🔔</button>
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">⚙️</button>
        <img
          src="https://via.placeholder.com/40"
          alt="profile"
          className="w-9 h-9 rounded-full"
        />
      </div>
    </div>
  );
}
