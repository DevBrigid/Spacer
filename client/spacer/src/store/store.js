import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import spacesReducer from './spacesSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        spaces: spacesReducer,
    },
});