import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../utils/api';

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name || user.full_name || user.fullName || 'Unnamed user',
  email: user.email,
  phone_number: user.phone_number || user.phoneNumber || '',
  role: String(user.role || 'client').toLowerCase(),
  status: user.status || (user.is_active === false ? 'Inactive' : 'Active'),
});

export const fetchAdminSummary = createAsyncThunk('admin/fetchSummary', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    return await apiFetch('/admin/dashboard', {}, token);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const data = await apiFetch('/admin/users', {}, token);
    return Array.isArray(data) ? data.map(normalizeUser) : [];
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addUser = createAsyncThunk('admin/addUser', async (userData, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const payload = {
      name: userData.name || userData.full_name,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phone_number || userData.phoneNumber || '',
      role: String(userData.role || 'client').toLowerCase(),
    };
    const user = await apiFetch('/admin/users', { method: 'POST', body: JSON.stringify(payload) }, token);
    return normalizeUser(user);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' }, token);
    return userId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateUserDetails = createAsyncThunk('admin/updateUserDetails', async ({ userId, userData }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const payload = {
      name: userData.name,
      email: userData.email,
      phone_number: userData.phone_number || '',
      role: String(userData.role || 'client').toLowerCase(),
    };

    const updatedUser = await apiFetch(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, token);

    return updatedUser.user || updatedUser;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    summary: { users: 0, spaces: 0, bookings: 0 },
    status: 'idle',
    error: null,
  },
  reducers: { clearAdminErrors: (state) => { state.error = null; } },
  extraReducers: (builder) => builder
    .addCase(fetchAdminSummary.fulfilled, (state, action) => {
      state.summary = {
        users: Number(action.payload?.users || 0),
        spaces: Number(action.payload?.spaces || 0),
        bookings: Number(action.payload?.bookings || 0),
      };
    })
    .addCase(fetchUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.users = action.payload; })
    .addCase(addUser.fulfilled, (state, action) => { state.users.unshift(action.payload); state.summary.users = Number(state.summary.users || 0) + 1; })
    .addCase(deleteUser.fulfilled, (state, action) => { state.users = state.users.filter((user) => user.id !== action.payload); state.summary.users = Math.max(0, Number(state.summary.users || 0) - 1); })
    .addCase(updateUserDetails.fulfilled, (state, action) => {
      const targetUserId = action.payload?.id;
      const index = state.users.findIndex((user) => user.id === targetUserId);
      if (index !== -1) state.users[index] = normalizeUser(action.payload);
    }),
});

export const { clearAdminErrors } = adminSlice.actions;
export default adminSlice.reducer;
