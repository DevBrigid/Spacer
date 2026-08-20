import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice ({
    name: 'admin',
    initialState: {
        mySpaces: [],
        users: [],
    },
    reducers: {
        addSpace: (state, action) => {
            state.mySpaces.push(action.payload);
        },
        updateSpaceStatus: (state, action) => {
            const { spaceId, status } = action.payload;
            const space = state.mySpaces.find((s) => s.id === spaceId);
            if (space) {
                space.status = status;
            }
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        addUser: (state, action) => {
            state.users.push(action.payload);
        }
    },
});

export const { addSpace, updateSpaceStatus, setUsers } = adminSlice.actions;
export default adminSlice.reducer;