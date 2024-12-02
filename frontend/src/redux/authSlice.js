import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { postRequest, Endpoint } from '../helpers/Network';

// const isAuthenticated = () => {
//   const cookies = document.cookie.split('; ');
//   const hasAccessToken = cookies.some((cookie) => cookie.startsWith('accessToken='));
//   return hasAccessToken; // accessToken varsa kullanıcı authenticated
// };

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await postRequest(Endpoint.LOGIN, { email, password });
      const role = response.role || 'patient';
      const userId = response.id || null; 
      return { role, userId, isAuthenticated: true };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    const response = await postRequest(Endpoint.LOGOUT);
    dispatch(logout());
  } catch (error) {
    console.error('Logout failed:', error.response ? error.response.data : error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    role: null,
    userId: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;
      state.userId = null;
    },
    clearError: (state) => {
      state.error = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

const persistConfig = {
  key: "auth",
  storage,
};

export const { logout, clearError } = authSlice.actions;

export default persistReducer(persistConfig, authSlice.reducer);