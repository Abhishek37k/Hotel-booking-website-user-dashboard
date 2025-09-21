import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import hotelsReducer from './hotelsSlice';
import bookingsReducer from './bookingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelsReducer,
        bookings: bookingsReducer,
  },
});

export default store;