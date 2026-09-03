import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../utils/api';

const DEFAULT_SPACE_IMAGE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80';

const normalizeSpace = (space) => {
  const rawImages = Array.isArray(space.images)
    ? space.images
    : (space.image_url || space.imageUrl)
      ? [space.image_url || space.imageUrl]
      : (typeof space.images === 'string' ? [space.images] : []);

  const available = typeof space.is_available === 'boolean'
    ? space.is_available
    : (typeof space.status === 'string'
      ? ['available', 'active', 'open'].includes(space.status.toLowerCase())
      : true);

  return {
    id: space.id,
    name: space.name || space.title,
    location: space.location,
    latitude: space.latitude ?? space.coordinates?.latitude ?? null,
    longitude: space.longitude ?? space.coordinates?.longitude ?? null,
    images: rawImages.length ? rawImages : [DEFAULT_SPACE_IMAGE],
    pricePerHour: Number(space.pricePerHour ?? space.price_per_hour ?? 0),
    capacity: Number(space.capacity ?? 0),
    description: space.description || '',
    is_available: available,
    status: available ? 'Available' : 'Booked',
  };
};

const toApiSpace = ({ pricePerHour, status, imageUrl, images, latitude, longitude, ...space }) => {
  const normalizedLatitude = latitude != null && latitude !== '' ? Number(latitude) : null;
  const normalizedLongitude = longitude != null && longitude !== '' ? Number(longitude) : null;

  return {
    ...space,
    pricePerHour: Number(pricePerHour),
    status: status ? status.toLowerCase() : 'active',
    images: imageUrl ? [imageUrl] : images || [],
    latitude: normalizedLatitude,
    longitude: normalizedLongitude,
    coordinates: normalizedLatitude != null && normalizedLongitude != null
      ? { latitude: normalizedLatitude, longitude: normalizedLongitude }
      : null,
  };
};

export const fetchSpaces = createAsyncThunk('spaces/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await apiFetch('/spaces/');
    return (Array.isArray(data) ? data : []).map(normalizeSpace);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchSpaceById = createAsyncThunk('spaces/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const space = await apiFetch(`/spaces/${id}`);
    return normalizeSpace(space);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createSpace = createAsyncThunk('spaces/create', async (space, { rejectWithValue }) => {
  try {
    const data = await apiFetch('/spaces/', {
      method: 'POST',
      body: JSON.stringify(toApiSpace(space)),
    });
    return normalizeSpace(data);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const saveSpace = createAsyncThunk('spaces/save', async ({ id, ...space }, { rejectWithValue }) => {
  try {
    const data = await apiFetch(`/spaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toApiSpace(space)),
    });
    return normalizeSpace(data);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeSpace = createAsyncThunk('spaces/remove', async (id, { rejectWithValue }) => {
  try {
    await apiFetch(`/spaces/${id}`, { method: 'DELETE' });
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const spaceSlice = createSlice({
  name: 'spaces',
  initialState: { spaces: [], selectedSpace: null, status: 'idle', error: null },
  reducers: { clearSelectedSpace: (state) => { state.selectedSpace = null; } },
  extraReducers: (builder) => builder
    .addCase(fetchSpaces.pending, (state) => { state.status = 'loading'; state.error = null; })
    .addCase(fetchSpaces.fulfilled, (state, action) => { state.status = 'succeeded'; state.spaces = action.payload; })
    .addCase(fetchSpaces.rejected, (state, action) => { state.status = 'rejected'; state.error = action.payload || action.error.message; })
    .addCase(fetchSpaceById.fulfilled, (state, action) => { state.status = 'succeeded'; state.selectedSpace = action.payload; })
    .addCase(createSpace.fulfilled, (state, action) => { state.spaces.push(action.payload); })
    .addCase(saveSpace.fulfilled, (state, action) => { const index = state.spaces.findIndex((space) => String(space.id) === String(action.payload.id)); if (index >= 0) state.spaces[index] = action.payload; })
    .addCase(removeSpace.fulfilled, (state, action) => { state.spaces = state.spaces.filter((space) => String(space.id) !== String(action.payload)); })
    .addMatcher((action) => action.type.startsWith('spaces/') && action.type.endsWith('/rejected'), (state, action) => { state.error = action.payload || action.error.message; }),
});

export const { clearSelectedSpace } = spaceSlice.actions;
export default spaceSlice.reducer;
