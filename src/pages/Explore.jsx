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
    <div className="px-4 md:px-10 py-6 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 min-h-screen">
      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl p-4 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400 transition"
        />
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-center text-gray-700">Loading hotels...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Hotels Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
          >
            <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
              <img
                src={hotel.images?.[0] || "https://via.placeholder.com/400x250"}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs px-3 py-1 rounded-full capitalize shadow-md">
                {hotel.category}
              </span>
            </div>

            <div className="p-6 flex flex-col gap-3">
              <h3 className="font-bold text-2xl text-teal-600">{hotel.name}</h3>

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
                className="mt-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:from-blue-500 hover:to-teal-400 transition-all transform hover:-translate-y-1"
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
