import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import mockDatabase from '../database/db.json';

const copyUsers = () => mockDatabase.users.map((user) => ({ ...user }));
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => copyUsers());
export const addUser = createAsyncThunk('admin/addUser', async (userData) => ({ id: Date.now(), status: 'Active', ...userData }));
export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId) => userId);
export const toggleUserStatus = createAsyncThunk('admin/toggleUserStatus', async (userId, { getState }) => {
  const user = getState().admin.users.find((item) => item.id === userId);
  return { ...user, status: user?.status === 'Active' ? 'Inactive' : 'Active' };
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: { users: copyUsers(), status: 'idle', error: null },
  reducers: { clearAdminErrors: (state) => { state.error = null; } },
  extraReducers: (builder) => builder
    .addCase(fetchUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.users = action.payload; })
    .addCase(addUser.fulfilled, (state, action) => { state.users.push(action.payload); })
    .addCase(deleteUser.fulfilled, (state, action) => { state.users = state.users.filter((user) => user.id !== action.payload); })
    .addCase(toggleUserStatus.fulfilled, (state, action) => { const index = state.users.findIndex((user) => user.id === action.payload.id); if (index !== -1) state.users[index] = action.payload; }),
});

export const { clearAdminErrors } = adminSlice.actions;
export default adminSlice.reducer;
