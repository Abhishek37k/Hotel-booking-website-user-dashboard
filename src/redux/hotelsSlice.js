import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const DB_URL = import.meta.env.VITE_FIREBASE_DB_URL;

// Thunk to fetch hotels
export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${DB_URL}/hotels.json?auth=${API_KEY}`);
      if (!res.ok) throw new Error("Failed to fetch hotels");

      const data = await res.json();
      if (!data) return [];

      // Firebase returns object → convert to array
      const hotels = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      console.log("✅ Hotels fetched successfully:", hotels);
      return hotels;
    } catch (err) {
      console.error("❌ Error fetching hotels:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

const hotelsSlice = createSlice({
  name: "hotels",
  initialState: {
    hotels: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("⏳ Fetching hotels...");
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hotelsSlice.reducer;
