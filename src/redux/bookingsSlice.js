import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

// Thunk to add booking
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${DB_URL}/bookings.json?auth=${API_KEY}`, {
        method: "POST",
        body: JSON.stringify(bookingData),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("✅ Booking created:", data);
      return { id: data.name, ...bookingData }; // Firebase returns generated id in `name`
    } catch (err) {
      console.error("❌ Booking failed:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (userEmail, { rejectWithValue }) => {
    try {
      const res = await fetch(`${DB_URL}/bookings.json?auth=${API_KEY}`);
      const data = await res.json();
      if (!data) return [];

      const bookingsArray = Object.entries(data).map(([id, b]) => ({
        id,
        ...b,
      }));
      const userBookings = bookingsArray.filter(
        (b) => b.userEmail === userEmail
      );
      return userBookings;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      await fetch(`${DB_URL}/bookings/${id}.json?auth=${token}`, {
        method: "DELETE",
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      });
  },
});

export default bookingsSlice.reducer;
