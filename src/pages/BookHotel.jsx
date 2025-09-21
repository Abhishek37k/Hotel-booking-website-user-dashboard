import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createBooking } from "../redux/bookingsSlice";

const BookHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hotels = useSelector((state) => state.hotels.hotels);
  const user = useSelector((state) => state.auth.user);

  const hotel = hotels.find((h) => h.id === id);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: "",
    people: 1,
    address: "",
    checkIn: "",
    checkOut: "",
  });

  if (!hotel)
    return <p className="text-center mt-20 text-gray-600">Hotel not found!</p>;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingPayload = {
      ...formData,
      hotelId: hotel.id,
      hotelName: hotel.name,
      status: "pending",
      userEmail: user.email,
      createdAt: new Date().toISOString(),
      hotelImg: hotel.images,
    };

    dispatch(createBooking(bookingPayload));
    alert("Booking request sent! Waiting for admin approval.");
    navigate("/dashboard/mybookings");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl mt-10">
      {/* Hotel Image */}
      <img
        src={hotel.images?.[0] || "https://via.placeholder.com/600x300"}
        alt={hotel.name}
        className="w-full h-64 object-cover rounded-2xl mb-6 shadow-lg"
      />

      {/* Hotel Details */}
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-teal-600 mb-2">
          {hotel.name}
        </h2>
        <p className="text-gray-700">📍 {hotel.address}</p>
        <p className="text-gray-700">
          🏙️ {hotel.city} - {hotel.pincode}
        </p>
        <p className="text-gray-700">💰 ₹{hotel.price} per night</p>
        <p className="text-gray-700">🛌 Category: {hotel.category}</p>
      </div>

      {/* Booking Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
        />
        <input
          type="number"
          name="people"
          value={formData.people}
          onChange={handleChange}
          placeholder="Number of People"
          min={1}
          required
          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Your Address"
          required
          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
        />
        <input
          type="date"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
        />
        <input
          type="date"
          name="checkOut"
          value={formData.checkOut}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-3 rounded-2xl font-semibold shadow-lg hover:from-blue-500 hover:to-teal-400 transition-all transform hover:-translate-y-1"
        >
          Book Now 🛎️
        </button>
      </form>
    </div>
  );
};

export default BookHotel;
