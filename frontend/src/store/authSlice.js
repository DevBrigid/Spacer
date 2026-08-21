import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const readStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('spacerUser') || 'null'); } catch { return null; }
};
const createToken = (email) => `local-${email}-${Date.now()}`;

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  if (!userData.name || !userData.email || !userData.password) return rejectWithValue('Please complete all fields.');
  return { user: { id: Date.now(), name: userData.name, email: userData.email, role: 'Client' }, token: createToken(userData.email) };
});
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  if (!credentials.email || !credentials.password) return rejectWithValue('Email and password are required.');
  const user = readStoredUser() || { id: Date.now(), name: credentials.email.split('@')[0], email: credentials.email, role: 'Client' };
  return { user: { ...user, email: credentials.email }, token: createToken(credentials.email) };
});
export const requestPasswordReset = createAsyncThunk('auth/requestPasswordReset', async (email, { rejectWithValue }) => email ? email : rejectWithValue('Enter your email address.'));
export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => readStoredUser());
export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData) => ({ ...readStoredUser(), ...profileData }));
export const changePassword = createAsyncThunk('auth/changePassword', async () => ({ success: true }));

const savedUser = readStoredUser();
const authSlice = createSlice({
  name: 'auth',
  initialState: { currentUser: savedUser, token: localStorage.getItem('token') || null, isAuthenticated: Boolean(savedUser || localStorage.getItem('token')), authChecked: false, status: 'idle', error: null },
  reducers: {
    logout: (state) => { state.currentUser = null; state.token = null; state.isAuthenticated = false; state.authChecked = true; state.error = null; localStorage.removeItem('token'); localStorage.removeItem('spacerUser'); },
    loadUserFromStorage: (state) => { state.currentUser = readStoredUser(); state.token = localStorage.getItem('token'); state.isAuthenticated = Boolean(state.currentUser || state.token); state.authChecked = true; },
    clearAuthError: (state) => { state.error = null; },
    clearAuthMessages: (state) => { state.error = null; },
  },
  extraReducers: (builder) => builder
    .addCase(registerUser.pending, (state) => { state.status = 'loading'; state.error = null; })
    .addCase(registerUser.fulfilled, (state, action) => { state.status = 'succeeded'; state.currentUser = action.payload.user; state.token = action.payload.token; state.isAuthenticated = true; state.authChecked = true; localStorage.setItem('token', action.payload.token); localStorage.setItem('spacerUser', JSON.stringify(action.payload.user)); })
    .addCase(registerUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
    .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
    .addCase(loginUser.fulfilled, (state, action) => { state.status = 'succeeded'; state.currentUser = action.payload.user; state.token = action.payload.token; state.isAuthenticated = true; state.authChecked = true; localStorage.setItem('token', action.payload.token); localStorage.setItem('spacerUser', JSON.stringify(action.payload.user)); })
    .addCase(loginUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
    .addCase(fetchCurrentUser.fulfilled, (state, action) => { state.currentUser = action.payload; state.isAuthenticated = Boolean(action.payload); state.authChecked = true; })
    .addCase(updateProfile.fulfilled, (state, action) => { state.currentUser = action.payload; localStorage.setItem('spacerUser', JSON.stringify(action.payload)); state.status = 'succeeded'; })
    .addCase(changePassword.fulfilled, (state) => { state.status = 'succeeded'; }),
});

export const { logout, loadUserFromStorage, clearAuthError, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
