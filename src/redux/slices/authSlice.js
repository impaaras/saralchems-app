import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {
  storage,
  StorageKeys,
  setItem,
  getItem,
  setBoolItem,
} from '../../utils/storage';
import {API_URL} from '../../utils/ApiService'; // Assuming this exports BASE_URL or similar
import api from '../api';

// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async ({email, password}, {rejectWithValue}) => {
//     try {
//       const response = await api.post('/auth/login', {email, password});
//       const {user, token} = response.data;

//       setItem(StorageKeys.AUTH_TOKEN, token);
//       setItem(StorageKeys.USER_DATA, user);
//       setBoolItem(StorageKeys.IS_AUTHENTICATED, true);

//       return {user, token};
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Login failed');
//     }
//   },
// );

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({email, password}, {rejectWithValue}) => {
    try {
      const response = await api.post('/auth/login', {email, password});
      const {user, accessToken, refreshToken} = response.data;

      // Save tokens & user data
      setItem(StorageKeys.AUTH_TOKEN, accessToken); // Access token
      setItem(StorageKeys.REFRESH_TOKEN, refreshToken); // Refresh token
      setItem(StorageKeys.USER_DATA, user);
      setBoolItem(StorageKeys.IS_AUTHENTICATED, true);

      return {user, accessToken, refreshToken};
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    {
      personName,
      companyName,
      businessType,
      gstNumber,
      phone,
      email,
      companyAddress,
      password,
    },
    {rejectWithValue},
  ) => {
    try {
      const response = await api.post('/auth/signup', {
        personName,
        companyName,
        businessType,
        gstNumber,
        phone,
        email,
        companyAddress,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  },
);

export const requestOTP = createAsyncThunk(
  'auth/requestOTP',
  async ({email}, {rejectWithValue}) => {
    try {
      const response = await api.post('/auth/request-otp', {email});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to send OTP');
    }
  },
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({email, otp}, {rejectWithValue}) => {
    try {
      const response = await api.post('/auth/verify-otp', {email, otp});
      const {user, token} = response.data;

      setItem(StorageKeys.AUTH_TOKEN, token);
      setItem(StorageKeys.USER_DATA, user);
      setBoolItem(StorageKeys.IS_AUTHENTICATED, true);

      return {user, token};
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Invalid OTP');
    }
  },
);

export const fetchAuthState = createAsyncThunk(
  'auth/fetchAuthState',
  async (_, {dispatch}) => {
    const token = storage.getString(StorageKeys.AUTH_TOKEN);
    const userData = storage.getString(StorageKeys.USER_DATA);
    const isAuthenticated = storage.getBoolean(StorageKeys.IS_AUTHENTICATED);

    if (token) {
      try {
        await api.get('/auth/me');
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch(logout());
          return {
            token: null,
            user: null,
            isAuthenticated: false,
          };
        }
      }
    }

    return {
      token,
      user: userData ? JSON.parse(userData) : null,
      isAuthenticated: !!isAuthenticated,
    };
  },
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async ({token}, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to fetch user profile',
      );
    }
  },
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async ({email}, {rejectWithValue}) => {
    try {
      const response = await api.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to send password reset OTP',
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({email, otp, newPassword}, {rejectWithValue}) => {
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to reset password',
      );
    }
  },
);

// Auth Slice

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    error: null,
    user: getItem(StorageKeys.USER_DATA),
    token: getItem(StorageKeys.AUTH_TOKEN),
    isAuthenticated: getItem(StorageKeys.IS_AUTHENTICATED) === 'true',
    otpSent: false,
    otpVerified: false,
    passwordResetRequested: false,
    passwordResetSuccess: false,
    showVariants: false,
    showSearchVariants: false,
  },
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerified = false;
      storage.clearAll();
    },
    toggleShowVariants: state => {
      state.showVariants = !state.showVariants;
    },
    toggleShowSearchVariants: state => {
      state.showSearchVariants = !state.showSearchVariants;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      .addCase(requestOTP.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOTP.fulfilled, state => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send OTP';
      })

      .addCase(verifyOTP.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, state => {
        state.loading = false;
        state.otpVerified = true;
        state.isAuthenticated = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Invalid OTP';
      })

      .addCase(fetchAuthState.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.loading = false;
      })

      .addCase(fetchUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user profile';
      })

      .addCase(requestPasswordReset.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, state => {
        state.loading = false;
        state.passwordResetRequested = true;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.loading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reset password';
      });
  },
});

export const {logout, toggleShowVariants, toggleShowSearchVariants} =
  authSlice.actions;

export default authSlice.reducer;
