import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios'; // Make sure to import axios
import {storage} from '../../utils/storage';
import {API_URL} from '../../utils/ApiService';

// Define an initial state
const BASE_URL = API_URL;
const api = axios.create({
  baseURL: BASE_URL,
});

// Add a response interceptor to handle expired tokens
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      storage.clearAll();
      return Promise.reject({tokenExpired: true});
    }
    return Promise.reject(error);
  },
);

const initialState = {
  history: [],
  loading: false,
  error: null,
};

export const fetchInvoice = createAsyncThunk(
  'cart/fetchInvoice',
  async ({id}, {getState, rejectWithValue}) => {
    try {
      const token = storage.getString(StorageKeys.AUTH_TOKEN);
      const response = await api.get(`${BASE_URL}/order/invoice/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Create the slice
const orderHistorySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchInvoice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the async thunk
// export {fetchInvoice};

// Export the reducer
export default orderHistorySlice.reducer;
