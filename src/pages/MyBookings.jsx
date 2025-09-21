import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings, cancelBooking } from "../redux/bookingsSlice";

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserBookings(user.email));
    }
  }, [dispatch, user]);

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      dispatch(cancelBooking(id));
    }
  };

  const isUpcoming = (checkInDate) => {
    const today = new Date();
    return new Date(checkInDate) >= today;
  };

  if (loading) return <p className="text-center mt-6 text-gray-700">Loading your bookings...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (bookings.length === 0) return <p className="text-center mt-6 text-gray-700">No bookings yet.</p>;

  return (
    <div className="px-4 md:px-10 py-6 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-6 text-teal-600 text-center">🌟 My Bookings</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {/* Hotel Image */}
            <div className="h-48 w-full overflow-hidden rounded-t-3xl">
              <img
                src={b.hotelImg?.[0] || "https://via.placeholder.com/400x250"}
                alt={b.hotelName}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="p-5 flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-teal-600 mb-1">🏨 {b.hotelName}</h3>
              <p className="text-gray-700 text-sm">👤 Guest: {b.name}</p>
              <p className="text-gray-700 text-sm">📧 Email: {b.userEmail}</p>
              <p className="text-gray-700 text-sm">📅 Check-in: {b.checkIn}</p>
              <p className="text-gray-700 text-sm">📅 Check-out: {b.checkOut}</p>
              <p className="text-gray-700 text-sm">👥 People: {b.people}</p>

              <div className="flex flex-wrap gap-2 items-center mt-2">
                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    b.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : b.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {b.status.toUpperCase()}
                </span>

                {/* Upcoming/Past Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isUpcoming(b.checkIn)
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isUpcoming(b.checkIn) ? "Upcoming" : "Past"}
                </span>

                {/* Cancel Button */}
                {(b.status === "pending" || (b.status === "approved" && isUpcoming(b.checkIn))) && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md transition-all transform hover:-translate-y-1 mt-2 w-full"
                  >
                    ❌ Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
