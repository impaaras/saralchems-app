// // src/redux/slices/searchSlice.js
// import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import axios from 'axios';
// import {
//   storage,
//   StorageKeys,
//   setItem,
//   getItem,
//   setBoolItem,
// } from '../../utils/storage';
// import {API_URL} from '../../utils/ApiService';
// import {useLoader} from '../../context/LoaderContext';

// export const searchProducts = createAsyncThunk(
//   'search/searchProducts',
//   async (query, {rejectWithValue}) => {
//     const token = storage.getString(StorageKeys.AUTH_TOKEN);

//     console.log(query, 'search query');
//     try {
//       const url = query
//         ? `${API_URL}/product/search?query=${query}`
//         : `${API_URL}/product`;

//       const response = await axios.get(url, {
//         headers: {Authorization: `Bearer ${token}`},
//       });

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Something went wrong');
//     }
//   },
// );

// const searchSlice = createSlice({
//   name: 'search',
//   initialState: {
//     results: [],
//     loading: false,
//     error: null,
//     query: '',
//   },
//   reducers: {
//     clearSearchResults: state => {
//       state.results = [];
//       state.query = '';
//     },
//     setSearchQuery: (state, action) => {
//       state.query = action.payload;
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(searchProducts.pending, state => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(searchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.results = action.payload;
//       })
//       .addCase(searchProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const {clearSearchResults, setSearchQuery} = searchSlice.actions;
// export default searchSlice.reducer;

// src/redux/slices/searchSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {
  storage,
  StorageKeys,
  setItem,
  getItem,
  setBoolItem,
} from '../../utils/storage';
import {API_URL} from '../../utils/ApiService';

// Cache for search results
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Create axios instance with optimizations
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = storage.getString(StorageKeys.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout'));
    }
    return Promise.reject(error);
  },
);

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (query, {rejectWithValue}) => {
    console.log(query, 'search query');

    try {
      // Check cache first
      const cacheKey = query || 'all-products';
      const cachedResult = searchCache.get(cacheKey);

      if (
        cachedResult &&
        Date.now() - cachedResult.timestamp < CACHE_DURATION
      ) {
        console.log('Returning cached result for:', cacheKey);
        return cachedResult.data;
      }

      const url = query
        ? `/product/search?query=${encodeURIComponent(query)}`
        : `/product`;

      const response = await axiosInstance.get(url);

      // Cache the result
      searchCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });

      // Clean up old cache entries (keep only last 20 entries)
      if (searchCache.size > 20) {
        const firstKey = searchCache.keys().next().value;
        searchCache.delete(firstKey);
      }

      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      return rejectWithValue(
        error.response?.data || error.message || 'Something went wrong',
      );
    }
  },
);

// Optimized search with debouncing (for potential future use)
export const searchProductsDebounced = createAsyncThunk(
  'search/searchProductsDebounced',
  async (query, {rejectWithValue, dispatch}) => {
    // This will be handled by the component's debouncing logic
    return dispatch(searchProducts(query));
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    loading: false,
    error: null,
    query: '',
    lastSearchTime: null,
  },
  reducers: {
    clearSearchResults: state => {
      state.results = [];
      state.query = '';
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    // Add action to clear cache if needed
    clearCache: state => {
      searchCache.clear();
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.lastSearchTime = Date.now();
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {clearSearchResults, setSearchQuery, clearError, clearCache} =
  searchSlice.actions;

export default searchSlice.reducer;
