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
// import api from '../api';

// const searchCache = new Map();
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// export const searchProducts = createAsyncThunk(
//   'search/searchProducts',
//   async (query, {rejectWithValue}) => {
//     console.log(query, 'search query');

//     try {
//       // Check cache first
//       const cacheKey = query || 'all-products';
//       const cachedResult = searchCache.get(cacheKey);

//       if (
//         cachedResult &&
//         Date.now() - cachedResult.timestamp < CACHE_DURATION
//       ) {
//         console.log('Returning cached result for:', cacheKey);
//         return cachedResult.data;
//       }

//       const url = query
//         ? `/product/search?query=${encodeURIComponent(query)}`
//         : `/product`;

//       const response = await api.get(url);

//       // Cache the result
//       searchCache.set(cacheKey, {
//         data: response.data,
//         timestamp: Date.now(),
//       });

//       // Clean up old cache entries (keep only last 20 entries)
//       if (searchCache.size > 20) {
//         const firstKey = searchCache.keys().next().value;
//         searchCache.delete(firstKey);
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Search error:', error);
//       return rejectWithValue(
//         error.response?.data || error.message || 'Something went wrong',
//       );
//     }
//   },
// );

// // Optimized search with debouncing (for potential future use)
// export const searchProductsDebounced = createAsyncThunk(
//   'search/searchProductsDebounced',
//   async (query, {rejectWithValue, dispatch}) => {
//     // This will be handled by the component's debouncing logic
//     return dispatch(searchProducts(query));
//   },
// );

// const searchSlice = createSlice({
//   name: 'search',
//   initialState: {
//     results: [],
//     loading: false,
//     error: null,
//     query: '',
//     lastSearchTime: null,
//   },
//   reducers: {
//     clearSearchResults: state => {
//       state.results = [];
//       state.query = '';
//       state.error = null;
//     },
//     setSearchQuery: (state, action) => {
//       state.query = action.payload;
//     },
//     clearError: state => {
//       state.error = null;
//     },
//     // Add action to clear cache if needed
//     clearCache: state => {
//       searchCache.clear();
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
//         state.lastSearchTime = Date.now();
//       })
//       .addCase(searchProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const {clearSearchResults, setSearchQuery, clearError, clearCache} =
//   searchSlice.actions;

// export default searchSlice.reducer;
// new code

// import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import api from '../api';

// // Enhanced cache with size limits and TTL
// const searchCache = new Map();
// const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes (reduced)
// const MAX_CACHE_SIZE = 15; // Reduced cache size

// // Cache cleanup function
// const cleanupCache = () => {
//   if (searchCache.size > MAX_CACHE_SIZE) {
//     const keys = Array.from(searchCache.keys());
//     // Remove oldest entries
//     for (let i = 0; i < keys.length - MAX_CACHE_SIZE; i++) {
//       searchCache.delete(keys[i]);
//     }
//   }
// };

// // Debounce utility
// const createDebouncedAsyncThunk = (type, payloadCreator, delay = 300) => {
//   let timeoutId;
//   let lastInvokedTime = 0;

//   return createAsyncThunk(type, async (arg, thunkAPI) => {
//     return new Promise((resolve, reject) => {
//       const now = Date.now();
//       const timeSinceLastCall = now - lastInvokedTime;

//       // Clear previous timeout
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }

//       // If enough time has passed since last call, execute immediately
//       if (timeSinceLastCall > delay) {
//         lastInvokedTime = now;
//         payloadCreator(arg, thunkAPI).then(resolve).catch(reject);
//       } else {
//         // Otherwise, debounce
//         timeoutId = setTimeout(() => {
//           lastInvokedTime = Date.now();
//           payloadCreator(arg, thunkAPI).then(resolve).catch(reject);
//         }, delay - timeSinceLastCall);
//       }
//     });
//   });
// };

// export const searchProducts = createAsyncThunk(
//   'search/searchProducts',
//   async (query, {rejectWithValue, signal}) => {
//     try {
//       const cacheKey = query?.trim() || 'all-products';
//       const cachedResult = searchCache.get(cacheKey);

//       // Return cached result if valid
//       if (
//         cachedResult &&
//         Date.now() - cachedResult.timestamp < CACHE_DURATION
//       ) {
//         console.log('Returning cached result for:', cacheKey);
//         return cachedResult.data;
//       }

//       const url = query?.trim()
//         ? `/product/search?query=${encodeURIComponent(query.trim())}`
//         : `/product`;

//       const response = await api.get(url, {signal});

//       // Cache the result with timestamp
//       searchCache.set(cacheKey, {
//         data: response.data,
//         timestamp: Date.now(),
//       });

//       cleanupCache();

//       return response.data;
//     } catch (error) {
//       if (error.name === 'AbortError') {
//         console.log('Search request cancelled');
//         return rejectWithValue('Search cancelled');
//       }

//       console.error('Search error:', error);
//       return rejectWithValue(
//         error.response?.data || error.message || 'Something went wrong',
//       );
//     }
//   },
// );

// // Debounced version for real-time search
// export const searchProductsDebounced = createDebouncedAsyncThunk(
//   'search/searchProductsDebounced',
//   async (query, {dispatch}) => {
//     if (!query?.trim()) {
//       return {products: []};
//     }
//     const result = await dispatch(searchProducts(query));
//     return result.payload;
//   },
//   200, // 200ms debounce
// );

// const searchSlice = createSlice({
//   name: 'search',
//   initialState: {
//     results: [],
//     loading: false,
//     error: null,
//     query: '',
//     lastSearchTime: null,
//     hasMore: false,
//   },
//   reducers: {
//     clearSearchResults: state => {
//       state.results = [];
//       state.query = '';
//       state.error = null;
//       state.hasMore = false;
//     },
//     setSearchQuery: (state, action) => {
//       state.query = action.payload;
//     },
//     clearError: state => {
//       state.error = null;
//     },
//     clearCache: () => {
//       searchCache.clear();
//     },
//     cancelPreviousSearch: state => {
//       // This can be used to cancel ongoing requests
//       state.loading = false;
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(searchProducts.pending, (state, action) => {
//         state.loading = true;
//         state.error = null;
//         state.query = action.meta.arg || '';
//       })
//       .addCase(searchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.results = action.payload;
//         state.lastSearchTime = Date.now();

//         // Calculate if there are more products (for future pagination)
//         if (action.payload.products) {
//           state.hasMore =
//             action.payload.totalProducts > action.payload.products.length;
//         } else {
//           state.hasMore = false;
//         }
//       })
//       .addCase(searchProducts.rejected, (state, action) => {
//         state.loading = false;
//         // Don't set error if it was a cancellation
//         if (action.payload !== 'Search cancelled') {
//           state.error = action.payload;
//         }
//       })
//       .addCase(searchProductsDebounced.pending, (state, action) => {
//         state.loading = true;
//         state.error = null;
//         state.query = action.meta.arg || '';
//       })
//       .addCase(searchProductsDebounced.fulfilled, (state, action) => {
//         state.loading = false;
//         state.results = action.payload;
//         state.lastSearchTime = Date.now();
//       })
//       .addCase(searchProductsDebounced.rejected, (state, action) => {
//         state.loading = false;
//         if (action.payload !== 'Search cancelled') {
//           state.error = action.payload;
//         }
//       });
//   },
// });

// export const {
//   clearSearchResults,
//   setSearchQuery,
//   clearError,
//   clearCache,
//   cancelPreviousSearch,
// } = searchSlice.actions;

// export default searchSlice.reducer;

// old code

// import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import api from '../api';

// // Enhanced cache with size limits and TTL
// const searchCache = new Map();
// const CACHE_DURATION = 3 * 60 * 1000;
// const MAX_CACHE_SIZE = 15;

// // Cache cleanup function
// const cleanupCache = () => {
//   if (searchCache.size > MAX_CACHE_SIZE) {
//     const keys = Array.from(searchCache.keys());
//     console.log(
//       `🧹 [CACHE] Cleaning up cache, current size: ${searchCache.size}`,
//     );
//     for (let i = 0; i < keys.length - MAX_CACHE_SIZE; i++) {
//       searchCache.delete(keys[i]);
//     }
//     console.log(`🧹 [CACHE] New cache size: ${searchCache.size}`);
//   }
// };

// export const searchProducts = createAsyncThunk(
//   'search/searchProducts',
//   async (query, {rejectWithValue, signal}) => {
//     const startTime = Date.now();
//     const cacheKey = query?.trim() || 'all-products';

//     console.log(`🔍 [API] Starting search for: "${cacheKey}"`);

//     try {
//       const cachedResult = searchCache.get(cacheKey);

//       // Return cached result if valid
//       if (
//         cachedResult &&
//         Date.now() - cachedResult.timestamp < CACHE_DURATION
//       ) {
//         const cacheDuration = Date.now() - startTime;
//         console.log(
//           `⚡ [CACHE] Cache hit for "${cacheKey}", took ${cacheDuration}ms`,
//         );
//         return cachedResult.data;
//       }

//       console.log(`🔄 [API] Cache miss for "${cacheKey}", making API call`);

//       const url = query?.trim()
//         ? `/product/search?query=${encodeURIComponent(query.trim())}`
//         : `/product`; // This should fetch all products when query is empty

//       const response = await api.get(url, {signal});
//       const apiDuration = Date.now() - startTime;

//       console.log(
//         `✅ [API] Search successful for "${cacheKey}", took ${apiDuration}ms`,
//       );
//       console.log(
//         `📦 [API] Received ${
//           response.data.products?.length || response.data.length
//         } products`,
//       );

//       // Cache the result with timestamp
//       searchCache.set(cacheKey, {
//         data: response.data,
//         timestamp: Date.now(),
//       });

//       cleanupCache();

//       return response.data;
//     } catch (error) {
//       const errorDuration = Date.now() - startTime;

//       if (error.name === 'AbortError') {
//         console.log(
//           `⏹️ [API] Search request cancelled for "${cacheKey}", took ${errorDuration}ms`,
//         );
//         return rejectWithValue('Search cancelled');
//       }

//       console.error(`❌ [API] Search error for "${cacheKey}":`, error);
//       console.log(`⏱️ [API] Failed after ${errorDuration}ms`);

//       return rejectWithValue(
//         error.response?.data || error.message || 'Something went wrong',
//       );
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
//     lastSearchTime: null,
//     hasMore: false,
//   },
//   reducers: {
//     clearSearchResults: state => {
//       console.log('🗑️ [REDUX] Clearing search results');
//       state.results = [];
//       state.query = '';
//       state.error = null;
//       state.hasMore = false;
//     },
//     setSearchQuery: (state, action) => {
//       console.log(`📝 [REDUX] Setting search query: "${action.payload}"`);
//       state.query = action.payload;
//     },
//     clearError: state => {
//       console.log('❌ [REDUX] Clearing error');
//       state.error = null;
//     },
//     clearCache: () => {
//       console.log('🧹 [REDUX] Clearing entire search cache');
//       searchCache.clear();
//     },
//     cancelPreviousSearch: state => {
//       console.log('⏹️ [REDUX] Cancelling previous search');
//       state.loading = false;
//     },
//   },
//   extraReducers: builder => {
//     builder
//       .addCase(searchProducts.pending, (state, action) => {
//         console.log(`⏳ [REDUX] Search pending: "${action.meta.arg}"`);
//         state.loading = true;
//         state.error = null;
//         state.query = action.meta.arg || '';
//       })
//       .addCase(searchProducts.fulfilled, (state, action) => {
//         console.log(
//           `✅ [REDUX] Search fulfilled, setting ${
//             action.payload.products?.length || action.payload.length
//           } results`,
//         );
//         state.loading = false;
//         state.results = action.payload;
//         state.lastSearchTime = Date.now();

//         if (action.payload.products) {
//           state.hasMore =
//             action.payload.totalProducts > action.payload.products.length;
//           console.log(`📊 [REDUX] Has more products: ${state.hasMore}`);
//         } else {
//           state.hasMore = false;
//         }
//       })
//       .addCase(searchProducts.rejected, (state, action) => {
//         console.log(`❌ [REDUX] Search rejected:`, action.payload);
//         state.loading = false;
//         if (action.payload !== 'Search cancelled') {
//           state.error = action.payload;
//         }
//       });
//   },
// });

// export const {
//   clearSearchResults,
//   setSearchQuery,
//   clearError,
//   clearCache,
//   cancelPreviousSearch,
// } = searchSlice.actions;

// export default searchSlice.reducer;
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../api';

// Enhanced cache with better memory management
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 20;

const cleanupCache = () => {
  if (searchCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(searchCache.entries());

    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest entries
    const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => searchCache.delete(key));
  }
};

let abortController = null;

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (query, {rejectWithValue, getState}) => {
    const cacheKey = query?.trim() || 'all-products';

    try {
      // Cancel previous request
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();

      const cachedResult = searchCache.get(cacheKey);

      // Return cached result if valid
      if (
        cachedResult &&
        Date.now() - cachedResult.timestamp < CACHE_DURATION
      ) {
        return cachedResult.data;
      }

      const url = query?.trim()
        ? `/product/search?query=${encodeURIComponent(query.trim())}`
        : `/product`;

      const response = await api.get(url, {
        signal: abortController.signal,
        timeout: 10000, // 10 second timeout
      });

      // Cache the result
      searchCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });

      cleanupCache();

      return response.data;
    } catch (error) {
      if (error.name === 'AbortError') {
        return rejectWithValue('Search cancelled');
      }

      return rejectWithValue(
        error.response?.data?.message || error.message || 'Search failed',
      );
    }
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
    cancelSearch: () => {
      if (abortController) {
        abortController.abort();
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchProducts.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.query = action.meta.arg || '';
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.lastSearchTime = Date.now();
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== 'Search cancelled') {
          state.error = action.payload;
        }
      });
  },
});

export const {clearSearchResults, setSearchQuery, clearError, cancelSearch} =
  searchSlice.actions;

export default searchSlice.reducer;
