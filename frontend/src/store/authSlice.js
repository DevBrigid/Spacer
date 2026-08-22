import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import mockDatabase from "../database/db.json";

const API_URL = 'http://localhost:3001';
const LOCAL_USERS_KEY = 'spacer-local-users';
const CURRENT_USER_KEY = 'spacer-current-user';

const createMockToken = (userId) => `mock-token-${userId}`;
const getUserIdFromToken = (token) => Number(token?.replace('mock-token-', ''));
const publicUser = (user) => {
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    return sanitizedUser;
};
const readLocalUsers = () => {
    try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]'); } catch { return []; }
};
const saveLocalUser = (user) => localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify([...readLocalUsers(), user]));
const fallbackUsers = () => [...mockDatabase.users, ...readLocalUsers()];

async function findUsersByEmail(email) {
    try {
        const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error('Mock API unavailable');
        return await response.json();
    } catch {
        return fallbackUsers().filter((user) => user.email.toLowerCase() === email.toLowerCase());
    }
}

async function findUserById(id) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`);
        if (!response.ok) throw new Error('Mock API unavailable');
        return await response.json();
    } catch {
        return fallbackUsers().find((user) => String(user.id) === String(id)) || null;
    }
}

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            if ((await findUsersByEmail(userData.email)).length) throw new Error('An account already exists with this email');

            const newUser = { id: Date.now(), ...userData, role: 'Client', status: 'Active' };
            let user = newUser;
            try {
                const res = await fetch(`${API_URL}/users`, {
                    method: 'POST', headers: {'Content-Type': 'application/json' }, body: JSON.stringify(newUser),
                });
                if (!res.ok) throw new Error('Mock API unavailable');
                user = await res.json();
            } catch {
                saveLocalUser(newUser);
            }
            return { user: publicUser(user), token: createMockToken(user.id) };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials , { rejectWithValue }) => {
        try{
            const [user] = await findUsersByEmail(credentials.email);
            if (!user) return rejectWithValue('ACCOUNT_NOT_FOUND');
            if (user.password !== credentials.password) throw new Error('Invalid email or password');
            return { user: publicUser(user), token: createMockToken(user.id) };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Unable to reach the mock API');
      if (!(await res.json()).length) throw new Error('No account found with this email');
      return email;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const userId = getUserIdFromToken(getState().auth.token);
      if (!userId) throw new Error('Session Expired');
      try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
        });
        if (!res.ok) throw new Error('Failed to update profile');
        return publicUser(await res.json());
      } catch {
        const currentUser = await findUserById(userId);
        if (!currentUser) throw new Error('Failed to update profile');
        return publicUser({ ...currentUser, ...profileData });
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (token, { getState, rejectWithValue}) => {
        try{
            const userId = getUserIdFromToken(token || getState().auth.token);
            if (!userId) throw new Error('Session Expired');
            const user = await findUserById(userId);
            if (!user) throw new Error('Session Expired');
            return publicUser(user);
        } catch(error) {
            return rejectWithValue(error.message);
        }
    }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { getState, rejectWithValue }) => {
    try {
      const userId = getUserIdFromToken(getState().auth.token);
      if (!userId) throw new Error('Session Expired');
      const userResponse = await fetch(`${API_URL}/users/${userId}`);
      if (!userResponse.ok) throw new Error('Session Expired');
      const user = await userResponse.json();
      if (user.password !== currentPassword) throw new Error('Current password is incorrect');
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error('Failed to update password');
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: null,
        token: null,
        isAuthenticated: false,
        authChecked: false, //tracks whether we've finished checking for a saved session
        status: 'idle', //idle | loading | failed
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.currentUser = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token')
            localStorage.removeItem(CURRENT_USER_KEY)
        },
        loadUserFromStorage: (state) => {
            const token = localStorage.getItem('token');
            if (token) {
                state.token = token;
                state.isAuthenticated = true;
                try {
                    state.currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
                } catch {
                    state.currentUser = null;
                }
            }
            state.authChecked = true;
        },
        clearAuthError: (state) => {
            state.error = null;
        },
        clearAuthMessages: (state) => {
            state.error = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
        //registerUser
        .addCase(registerUser.pending, (state) => {
            state.status = 'pending';
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.authChecked = true;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(action.payload.user));
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.status = 'rejected';
            state.error = action.payload;
        })
        //loginUser
        .addCase(loginUser.pending, (state) => {
            state.status = 'pending';
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.authChecked = true;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(action.payload.user));
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        //fetchCurrentUser
        .addCase(fetchCurrentUser.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchCurrentUser.fulfilled, (state, action) => {
            if (state.token !== action.meta.arg) return;
            state.status = 'succeeded';
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            state.authChecked = true;
        })
        .addCase(fetchCurrentUser.rejected, (state, action) => {
        // Ignore an older session request that completed after a new login or registration.
            if (state.token !== action.meta.arg) return;
        // token was invalid/expired — clear everything
            state.status = 'failed';
            state.currentUser = null;
            state.token = null;
            state.isAuthenticated = false;
            state.authChecked = true;
            localStorage.removeItem('token');
        })
        //update Profile
        .addCase(updateProfile.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.currentUser = action.payload;
            state.status = 'succeeded';
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(action.payload));
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        //Request password reset
        .addCase(requestPasswordReset.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(requestPasswordReset.fulfilled, (state) => {
            state.status = 'succeeded';
        })
        .addCase(requestPasswordReset.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        //changePassword when logged in
        .addCase(changePassword.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(changePassword.fulfilled, (state) => {
            state.status = 'succeeded';
        })
        .addCase(changePassword.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    },
});

export const { logout, loadUserFromStorage, clearAuthError, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
