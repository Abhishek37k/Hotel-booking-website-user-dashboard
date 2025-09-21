import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchHotels } from "../redux/hotelsSlice";

const Explore = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { hotels, loading, error } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const filtered = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 md:px-10 py-6">
      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-center text-gray-700">Loading hotels...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Hotels Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="relative">
              <img
                src={hotel.images?.[0] || "https://via.placeholder.com/400x250"}
                alt={hotel.name}
                className="w-full h-52 object-cover"
              />
              <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full capitalize">
                {hotel.category}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-2">
              <h3 className="font-bold text-xl">{hotel.name}</h3>

              <p className="text-gray-600 text-sm flex items-center gap-2">
                📍 {hotel.address}
              </p>
              <p className="text-gray-600 text-sm flex items-center gap-2">
                🏙️ {hotel.city} - {hotel.pincode}
              </p>
              <p className="text-gray-600 text-sm flex items-center gap-2">
                💰 ₹{hotel.price} / night
              </p>

              <button
                onClick={() => navigate(`/dashboard/book/${hotel.id}`)}
                className="mt-3 bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
              >
                Book 🛎️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
