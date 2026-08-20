import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import spacesReducer from './spacesSlice';
import bookingsReducer from './bookingsSlice';
import paymentsReducer from './paymentsSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        spaces: spacesReducer,
        bookings: bookingsReducer,
        payments: paymentsReducer,
    },
});