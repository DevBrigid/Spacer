import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import spacesReducer from './spacesSlice';
import bookingsReducer from './bookingsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        spaces: spacesReducer,
        bookings: bookingsReducer,
    },
});