import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {StorageKeys, storage} from '../../utils/storage';
import api from '../api';

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, {rejectWithValue}) => {
    try {
      // You don’t need to manually set headers here; interceptor handles it
      const response = await api.get('/category');
      return response.data;
    } catch (error) {
      console.log('Fetch Categories Error:', error);
      return rejectWithValue(error?.response?.data || 'Something went wrong');
    }
  },
);

// Slice definition
const categoriesSlice = createSlice({
  name: 'category',
  initialState: {
    loading: false,
    error: null,
    categories: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
