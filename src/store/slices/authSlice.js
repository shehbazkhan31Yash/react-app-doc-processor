import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Register: get CSRF token first (server sets csurf cookie), then POST register with header
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const csrfRes = await api.get('/api/csrf-token');
      const csrfToken = csrfRes.data && csrfRes.data.csrfToken;

      const config = {
        headers: {
          'csrf-token': csrfToken || '',
        },
      };

      const res = await api.post('/api/users/register', userData, config);
      return res.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message || err.response.data);
      }
      return rejectWithValue(err.message);
    }
  }
);

// Login: posts creds, backend returns { token, user }
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/users/login', credentials);
      const { token, user } = res.data;

      if (token) {
        localStorage.setItem('token', token);
      }
      return { token, user };
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message || err.response.data);
      }
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  registerMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    },
    clearRegisterMessage(state) {
      state.registerMessage = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.registerMessage = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.registerMessage = action.payload.message || 'Registered';
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
  },
});

export const { logout, clearError, clearRegisterMessage, setUser } = authSlice.actions;
export default authSlice.reducer;