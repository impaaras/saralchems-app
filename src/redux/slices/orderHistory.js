import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {storage, StorageKeys} from '../../utils/storage';
import api from '../api'; // ✅ Use the shared axios instance

// Initial state
const initialState = {
  history: [],
  loading: false,
  error: null,
};

// Async thunk to fetch invoice
export const fetchInvoice = createAsyncThunk(
  'cart/fetchInvoice',
  async ({id}, {rejectWithValue}) => {
    try {
      const response = await api.get(`/order/invoice/${id}`);
      return response.data;
    } catch (error) {
      console.log('Invoice fetch error:', error);
      return rejectWithValue(
        error?.response?.data || 'Unable to fetch invoice.',
      );
    }
  },
);

// Create slice
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
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default orderHistorySlice.reducer;
