import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createBooking } from "../redux/bookingsSlice";

const BookHotel = () => {
  const { id } = useParams(); // hotel id from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hotels = useSelector((state) => state.hotels.hotels);
  const user = useSelector((state) => state.auth.user);

  const hotel = hotels.find((h) => h.id === id);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: "",
    people: 1,
    checkIn: "",
    checkOut: "",
  });

  if (!hotel) return <p className="text-center mt-20">Hotel not found!</p>;

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
    <div className="max-w-4xl mx-auto p-6">
      {/* Hotel Details */}
      <div className="bg-white rounded-2xl shadow overflow-hidden mb-6">
        <img
          src={hotel.images?.[0] || "https://via.placeholder.com/600x300"}
          alt={hotel.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6 flex flex-col gap-2">
          <h2 className="text-2xl font-bold">{hotel.name}</h2>
          <p>📍 {hotel.address}</p>
          <p>🏙️ {hotel.city} - {hotel.pincode}</p>
          <p>💰 ₹{hotel.price} per night</p>
          <p>🛌 Category: {hotel.category}</p>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <h3 className="text-xl font-semibold mb-2">Your Details</h3>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="people"
          value={formData.people}
          onChange={handleChange}
          placeholder="Number of People"
          min={1}
          required
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="checkOut"
          value={formData.checkOut}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Book Now 🛎️
        </button>
      </form>
    </div>
  );
};

export default BookHotel;
