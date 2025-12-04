import { FiBell, FiSettings } from "react-icons/fi";

export default function Navbar({ searchQuery, setSearchQuery }) {
  return (
    <div
      className="
        fixed top-0 left-0 right-0
        h-16 bg-white border-b shadow-sm z-50
        flex items-center
        px-4
      "
    >
      {/* LEFT SECTION WIDTH MATCHES SIDEBAR */}
      <div className="flex items-center gap-2  pl-6 w-64">
        <span className="text-blue-700 font-extrabold text-xl tracking-wide">RA</span>
        <h1 className="text-xl font-bold text-gray-800">VedaSchool</h1>
      </div>

      {/* SEARCH BAR STARTS EXACT WHERE SIDEBAR ENDS */}
      <div className="flex items-center flex-1 pl-0">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            w-[55%] h-11
            bg-gray-100 border border-gray-200
            rounded-xl px-4 text-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
        />
      </div>

      {/* RIGHT ICONS + 4px RIGHT GAP */}
      <div className="flex items-center gap-3 pr-6">
        <button className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
          <FiBell className="w-5 h-5 text-gray-700" />
        </button>

        <button className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
          <FiSettings className="w-5 h-5 text-gray-700" />
        </button>

        <img
          src="https://via.placeholder.com/40"
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  );
}
