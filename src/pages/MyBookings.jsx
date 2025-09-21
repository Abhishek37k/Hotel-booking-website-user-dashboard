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

  if (loading) return <p className="text-center">Loading your bookings...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (bookings.length === 0)
    return <p className="text-center">No bookings yet.</p>;

  return (
    <div className="px-4 md:px-10 py-6">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="p-4 bg-white rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{b.hotelName}</h3>
              <p className="text-sm text-gray-500">
                🛎️ Check-in: {b.checkIn} | Check-out: {b.checkOut}
              </p>
              <p className="text-sm text-gray-500">
                👤 {b.name}, {b.people} {b.people > 1 ? "people" : "person"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  b.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : b.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {b.status.toUpperCase()}
              </span>

              {(b.status === "pending" || b.status === "approved") && (
                <button
                  onClick={() => handleCancel(b.id)}
                  className="mt-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
