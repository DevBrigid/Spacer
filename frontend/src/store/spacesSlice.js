import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//Thunk 1: fetch all spaces (Browser page)
export const fetchSpaces = createAsyncThunk(
    'spaces/fetchAll',
    async () => {
        const res = await fetch('http://localhost:3001/spaces');
        const data = await res.json();
        return data.map((s) => ({
            id: s.id,
            name: s.name,
            location: s.location,
            pricePerHour: s.price_per_hour,
            capacity: s.capacity,
            description: s.description,
            status: s.status.charAt(0).toUpperCase() + s.status.slice(1), // "available" → "Available"
        }))
    }
);

//Thunk 2: fetch one space by id (Space Details page)
export const fetchSpaceById = createAsyncThunk(
    'spaces/fetchOne',
    async (id) => {
        const res = await fetch(`http://localhost:3001/spaces/${id}`);
        return res.json();
    }
);


const spaceSlice = createSlice({
    name: 'spaces',
    initialState: {
        spaces: [],
        selectedSpace: null,
        status: 'idle', 
        error: null,
    },
    reducers: {
        addSpace: (state, action) => {
            state.spaces.push({ id: Date.now(), ...action.payload });
        },
        updateSpace: (state, action) => {
            const { id, ...updates } = action.payload;
            const space = state.spaces.find((s) => s.id === id);
            if (space) Object.assign(space, updates);
        },
        deleteSpace: (state, action) => {
            state.spaces = state.spaces.filter((s) => s.id !== action.payload);
        },
    },
    
    extraReducers: (builder) => {
       builder
       //fetchSpaces lifecycle
       .addCase(fetchSpaces.pending, (state) => {
        state.status = 'loading';
       }) 
       .addCase(fetchSpaces.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.spaces = action.payload;
       })
       .addCase(fetchSpaces.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
       })
       //fetchSpaceById lifecycle
       .addCase(fetchSpaceById.fulfilled, (state, action) => {
        state.selectedSpace = action.payload;
       });
    },
});

export const { addSpace,updateSpace, deleteSpace } = spaceSlice.actions;
export default spaceSlice.reducer;