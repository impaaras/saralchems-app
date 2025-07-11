// const response = await axios.get(`${API_URL}/category`, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//   });

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios'; // Make sure to import axios
import {StorageKeys, storage} from '../../utils/storage';
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
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, {getState, rejectWithValue}) => {
    try {
      const token = storage.getString(StorageKeys.AUTH_TOKEN);
      console.log(token);
      const response = await api.get(`${BASE_URL}/category`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response);
    }
  },
);

const categoriesSlice = createSlice({
  name: 'category',
  initialState,
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
