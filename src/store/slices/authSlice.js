import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { encryptData, decryptData } from "../../utils/cryptoUtils";


const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

// Register: get CSRF token first, then POST register with header
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const csrfRes = await api.get("/api/csrf-token");
      const csrfToken = csrfRes.data && csrfRes.data.csrfToken;

      const config = {
        headers: { "csrf-token": csrfToken || "" },
      };

      const res = await api.post("/api/users/register", userData, config);
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
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/users/login", credentials);
      const { token, user } = res.data;

      // Persist encrypted token and user safely
      try {
        if (token) {
          localStorage.setItem("token", encryptData(token));
        }
        if (user) {
          // store user as JSON string encrypted
          localStorage.setItem("user", encryptData(JSON.stringify(user)));
        }
      } catch  {
        // storage could fail (quota, private mode) — don't break login flow
        // keep flow silent in production; optionally log in dev
        // console.warn('Failed to persist auth to localStorage', storageErr);
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

const safeReadEncrypted = (key) => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    const dec = decryptData(encrypted, SECRET_KEY);

    if (dec === null || dec === undefined) return null;

    // if decryptData already returned an object, return it
    if (typeof dec === "object") return dec;

    // if decryptData returned a string, it may be a JSON string; try to parse, otherwise return string
    if (typeof dec === "string") {
      try {
        return JSON.parse(dec);
      } catch {
        return dec;
      }
    }

    return dec;
  } catch  {
    return null;
  }
};

const tokenFromStorage = (() => {
  const v = safeReadEncrypted("token");
  return typeof v === "string" ? v : null;
})();

const userFromStorage = (() => {
  const v = safeReadEncrypted("user");
  if (!v) return null;
  return typeof v === "object" ? v : v;
})();

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  loading: false,
  error: null,
  registerMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); 
      } catch {
        // ignore storage errors
      }
    },

    clearError(state) {
      state.error = null;
    },

    clearRegisterMessage(state) {
      state.registerMessage = null;
    },

    setUser(state, action) {
      state.user = action.payload;
      try {
        localStorage.setItem(
          "user",
          encryptData(JSON.stringify(action.payload))
        );
      } catch {
        // ignore storage errors
      }
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

      state.registerMessage = action.payload.message || "Registered";

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
      // UPDATED: Ensure role is always set with fallback to 'user'
      state.user = {
        ...action.payload.user,
        role: action.payload.user.role || 'user'
      };
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
  },
});

export const { logout, clearError, clearRegisterMessage, setUser } =
  authSlice.actions;

export default authSlice.reducer;
