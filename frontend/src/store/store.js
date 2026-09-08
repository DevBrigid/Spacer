import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import spacesReducer from './spacesSlice';
import bookingsReducer from './bookingsSlice';
import paymentsReducer from './paymentsSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    spaces: spacesReducer,
    bookings: bookingsReducer,
    payments: paymentsReducer,
    admin: adminReducer,
  },
});

export default store;
