import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: null,
        isAuthenticated: false,
        status: 'idle', //idle | loading | failed
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            state.status = 'idle';
        },
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            state.status = 'idle';
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;