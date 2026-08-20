import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice ({
    name: 'admin',
    initialState: {
        mySpaces: [],
        users: [],
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        addUser: (state, action) => {
            state.users.push(action.payload);
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter((u) => u.id !== action.payload);
            },
        toggleUserStatus: (state, action) => {
        const user = state.users.find((u) => u.id === action.payload);
        if (user) user.status = user.status === 'Active' ? 'Inactive' : 'Active';
        }
    },
});

export const { addUser, deleteUser,toggleUserStatus, setUsers } = adminSlice.actions;
export default adminSlice.reducer;