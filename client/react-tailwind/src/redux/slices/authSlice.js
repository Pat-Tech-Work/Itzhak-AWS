// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Thunk להתחברות לדשבורד
export const loginDashboardThunk = createAsyncThunk(
  'auth/loginDashboard',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login error. Please check your details.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk לאימות טוקן
export const verifyTokenThunk = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.get('/dashboard');
      return true;
    } catch (error) {
      return rejectWithValue('Unauthorized');
    }
  }
);

// Thunk להתנתקות
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/login/logout');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return rejectWithValue('Logout failed. Please try again.');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isTokenVerificationAttempted: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Dashboard Thunk
      .addCase(loginDashboardThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginDashboardThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || action.payload;
        state.error = null;
      })
      .addCase(loginDashboardThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // Verify Token Thunk
      .addCase(verifyTokenThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyTokenThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isTokenVerificationAttempted = true;
        state.error = null;
      })
      .addCase(verifyTokenThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isTokenVerificationAttempted = true;
      })

      // Logout Thunk
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;