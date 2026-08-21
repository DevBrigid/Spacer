import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import mockDatabase from '../database/db.json';

const normalizeSpace = (space) => ({ id: space.id, name: space.name, location: space.location, pricePerHour: space.price_per_hour, capacity: space.capacity, description: space.description, status: space.status ? space.status.charAt(0).toUpperCase() + space.status.slice(1) : 'Available' });
const localSpaces = () => mockDatabase.spaces.map(normalizeSpace);
export const fetchSpaces = createAsyncThunk('spaces/fetchAll', async () => localSpaces());
export const fetchSpaceById = createAsyncThunk('spaces/fetchOne', async (id) => localSpaces().find((space) => String(space.id) === String(id)) || null);

const spaceSlice = createSlice({
  name: 'spaces',
  initialState: { spaces: localSpaces(), selectedSpace: null, status: 'succeeded', error: null },
  reducers: {
    addSpace: (state, action) => { state.spaces.push({ id: Date.now(), ...action.payload }); },
    updateSpace: (state, action) => { const { id, ...updates } = action.payload; const space = state.spaces.find((item) => item.id === id); if (space) Object.assign(space, updates); },
    deleteSpace: (state, action) => { state.spaces = state.spaces.filter((space) => space.id !== action.payload); },
    clearSelectedSpace: (state) => { state.selectedSpace = null; },
  },
  extraReducers: (builder) => builder
    .addCase(fetchSpaces.pending, (state) => { state.status = 'loading'; state.error = null; })
    .addCase(fetchSpaces.fulfilled, (state, action) => { state.status = 'succeeded'; state.spaces = action.payload; })
    .addCase(fetchSpaces.rejected, (state, action) => { state.status = 'rejected'; state.error = action.error.message; })
    .addCase(fetchSpaceById.fulfilled, (state, action) => { state.status = 'succeeded'; state.selectedSpace = action.payload; }),
});

export const { addSpace, updateSpace, deleteSpace, clearSelectedSpace } = spaceSlice.actions;
export default spaceSlice.reducer;
