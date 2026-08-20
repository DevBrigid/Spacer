import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = 'http://localhost:8000'; //to be swapped with with real flassk URL later

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(userData), //{ name, email, phone, password }
            });
            if (!res.ok) throw new Error('Registration Failed');
            const data = await res.json();
            return data;  //expected: { user, token }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials , { rejectWithValue }) => {
        try{
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(credentials), //{ email, password }
            });
            if (!res.ok) throw new Error('Invalid email or password');
            const data = await res.json();
            return data; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { getState, rejectWithValue}) => {
        try{
            const token = getState().auth.token;
            const res = await fetch(`${API_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(!res.ok) throw new Error('Session Expired');
            const user = await res.json;
            return user;
        } catch(error) {
            return rejectWithValue(error.message);
        }
    }
)


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
        },
        loadUserFromStorage: (state) => {
            const token = localStorage.getItem('token');
            if (token) {
                state.token = token;
                state.isAuthenticated = true;
                //currentUser will still be null until you decode the token
                // or fetch /me - fine for now, fill in once FastAPI exists
            }
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
            localStorage.setItem('token', action.payload.token);
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
            localStorage.setItem('token', action.payload.token);
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
            state.status = 'succeeded';
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            state.authChecked = true;
        })
        .addCase(fetchCurrentUser.rejected, (state) => {
        // token was invalid/expired — clear everything
            state.status = 'failed';
            state.currentUser = null;
            state.token = null;
            state.isAuthenticated = false;
            state.authChecked = true;
            localStorage.removeItem('token');
        });
    },
});

export const { logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;