import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../utils/api";
import { assertSupabaseConfigured, getSupabaseSession, supabase } from '../lib/supabase';

const CURRENT_USER_KEY = 'spacer-current-user';

const publicUser = (user) => {
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    delete sanitizedUser.hashed_password;
    return sanitizedUser;
};

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiFetch('/auth/supabase/register', {
                method: 'POST',
                body: JSON.stringify({
                    email: userData.email,
                    password: userData.password,
                    name: userData.name || userData.full_name,
                    phone_number: userData.phone_number || userData.phoneNumber || '',
                }),
            });

            if (!response?.access_token) {
                throw new Error('Registration succeeded but no access token was returned.');
            }

            return { user: publicUser(response.user), token: response.access_token };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            assertSupabaseConfigured();
            if (!credentials?.email || !credentials?.password) {
                return rejectWithValue('Email and password are required.');
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });
            if (error) throw error;
            if (!data.session) throw new Error('Authentication failed: no Supabase session was returned.');
            const response = await apiFetch('/auth/supabase/session', {
                method: 'POST',
                body: JSON.stringify({ access_token: data.session.access_token }),
            });
            return { user: publicUser(response.user), token: response.access_token };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiFetch('/auth/password-reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await apiFetch('/auth/password-reset-confirm', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeInviteSignup = createAsyncThunk(
  'auth/completeInviteSignup',
  async ({ token, password, phone_number }, { rejectWithValue }) => {
    try {
      const response = await apiFetch('/auth/invite/accept', {
        method: 'POST',
        body: JSON.stringify({ token, password, phone_number }),
      });
      const tokenValue = response?.access_token;
      if (!tokenValue) {
        throw new Error('Invite setup failed: no access token returned.');
      }
      return { user: publicUser(response.user || response), token: tokenValue };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeGoogleLogin = createAsyncThunk(
  'auth/completeGoogleLogin',
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSupabaseSession();
      if (!session?.access_token) {
        throw new Error('Google sign-in did not return a Supabase session.');
      }
      const response = await apiFetch('/auth/supabase/session', {
        method: 'POST',
        body: JSON.stringify({ access_token: session.access_token }),
      });
      const token = response?.access_token;
      if (!token) {
        throw new Error('Google sign-in failed: no access token returned.');
      }
      return { user: publicUser(response.user), token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const payload = { full_name: profileData.name || profileData.full_name, phone_number: profileData.phone_number || profileData.phoneNumber };
      const user = await apiFetch('/spacer/profile', { method: 'PUT', body: JSON.stringify(payload) }, token);
      return publicUser(user);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (token, { getState, rejectWithValue}) => {
        try {
            const activeToken = token || getState().auth.token;
            if (!activeToken) throw new Error('Session Expired');
            const user = await apiFetch('/spacer/profile', {}, activeToken);
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
      const token = getState().auth.token;
      const response = await apiFetch('/spacer/profile/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      }, token);
      return response;
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
            supabase.auth.signOut();
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
        .addCase(confirmPasswordReset.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(confirmPasswordReset.fulfilled, (state) => {
            state.status = 'succeeded';
            state.error = null;
        })
        .addCase(confirmPasswordReset.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(completeInviteSignup.pending, (state) => {
            state.status = 'pending';
            state.error = null;
        })
        .addCase(completeInviteSignup.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.authChecked = true;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(action.payload.user));
        })
        .addCase(completeInviteSignup.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(completeGoogleLogin.pending, (state) => {
            state.status = 'pending';
            state.error = null;
        })
        .addCase(completeGoogleLogin.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.authChecked = true;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(action.payload.user));
        })
        .addCase(completeGoogleLogin.rejected, (state, action) => {
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
