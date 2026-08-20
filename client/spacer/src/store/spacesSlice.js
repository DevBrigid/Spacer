import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//Thunk 1: fetch all spaces (Browser page)
export const fetchSpaces = createAsyncThunk(
    'spaces/fetchAll',
    async () => {
        const res = await fetch('http://localhost:3001/spaces');
        return res.json();
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
    intialState: {
        list: [],
        selectedSpace: null,
        status: 'idle', 
        error: null,
    },
    reducers: {}, //no manual reducers needed - thunks handle everything below
    extraReducers: (builder) => {
       builder
       //fetchSpaces lifecycle
       .addCase(fetchSpaces.pending, (state) => {
        state.status = 'loading';
       }) 
       .addCase(fetchSpaces.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
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

export default spaceSlice.reducer;