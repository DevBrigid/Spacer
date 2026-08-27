import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import mockDatabase from '../database/db.json';

const API_URL = 'http://localhost:3001';
const normalizeSpace = (space) => ({ id: space.id, name: space.name, location: space.location, latitude: space.latitude, longitude: space.longitude, images: space.images, pricePerHour: space.price_per_hour, capacity: space.capacity, description: space.description, status: space.status ? space.status.charAt(0).toUpperCase() + space.status.slice(1) : 'Available' });
const toApiSpace = ({ pricePerHour, status, imageUrl, images, ...space }) => ({
  ...space,
  price_per_hour: Number(pricePerHour),
  status: status.toLowerCase(),
  images: imageUrl ? [imageUrl] : images || ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'],
});
const localSpaces = () => mockDatabase.spaces.map(normalizeSpace);
export const fetchSpaces = createAsyncThunk('spaces/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/spaces`);
    if (!response.ok) throw new Error('Unable to load spaces.');
    return (await response.json()).map(normalizeSpace);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
export const fetchSpaceById = createAsyncThunk('spaces/fetchOne', async (id) => localSpaces().find((space) => String(space.id) === String(id)) || null);

export const createSpace = createAsyncThunk('spaces/create', async (space, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/spaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toApiSpace(space)),
    });
    if (!response.ok) throw new Error('The space could not be saved.');
    return normalizeSpace(await response.json());
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const saveSpace = createAsyncThunk('spaces/save', async ({ id, ...space }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/spaces/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toApiSpace(space)),
    });
    if (!response.ok) throw new Error('The space could not be updated.');
    return normalizeSpace(await response.json());
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeSpace = createAsyncThunk('spaces/remove', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/spaces/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('The space could not be deleted.');
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const spaceSlice = createSlice({
  name: 'spaces',
  initialState: { spaces: localSpaces(), selectedSpace: null, status: 'succeeded', error: null },
  reducers: { clearSelectedSpace: (state) => { state.selectedSpace = null; } },
  extraReducers: (builder) => builder
    .addCase(fetchSpaces.pending, (state) => { state.status = 'loading'; state.error = null; })
    .addCase(fetchSpaces.fulfilled, (state, action) => { state.status = 'succeeded'; state.spaces = action.payload; })
    .addCase(fetchSpaces.rejected, (state, action) => { state.status = 'rejected'; state.error = action.error.message; })
    .addCase(fetchSpaceById.fulfilled, (state, action) => { state.status = 'succeeded'; state.selectedSpace = action.payload; })
    .addCase(createSpace.fulfilled, (state, action) => { state.spaces.push(action.payload); })
    .addCase(saveSpace.fulfilled, (state, action) => { const index = state.spaces.findIndex((space) => String(space.id) === String(action.payload.id)); if (index >= 0) state.spaces[index] = action.payload; })
    .addCase(removeSpace.fulfilled, (state, action) => { state.spaces = state.spaces.filter((space) => String(space.id) !== String(action.payload)); })
    .addMatcher((action) => action.type.startsWith('spaces/') && action.type.endsWith('/rejected'), (state, action) => { state.error = action.payload || action.error.message; }),
});

export const { clearSelectedSpace } = spaceSlice.actions;
export default spaceSlice.reducer;
