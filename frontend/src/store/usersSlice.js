import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock Login
export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (credentials, { rejectWithValue }) => {
    // Simulate a 1-second network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Basic mock validation
    if (!credentials.email || !credentials.password) {
      return rejectWithValue("Email and password are required.");
    }

    // Return mock authenticated user payload
    return {
      id: "usr_101",
      name: credentials.email.split("@")[0],
      email: credentials.email,
      token: "mock-jwt-token-xyz123",
    };
  }
);

// Mock Registration
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!userData.email || !userData.name) {
      return rejectWithValue("Please complete all registration fields.");
    }

    return {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
    };
  }
);

// Mock Social Login
export const socialLoginUser = createAsyncThunk(
  "users/socialLoginUser",
  async (provider) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      id: `usr_${provider}_${Date.now()}`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `user@${provider}-auth.com`,
      provider: provider,
      token: `mock-${provider}-token`,
    };
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("mockUser");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Social Login
      .addCase(socialLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(socialLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(socialLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = usersSlice.actions;
export default usersSlice.reducer;