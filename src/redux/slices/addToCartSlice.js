// addToCartSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {StorageKeys, storage} from '../../utils/storage';
import api from '../api';

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({productId, variant, quantity}, {rejectWithValue}) => {
    try {
      const response = await api.post('/cart/add', {
        productId,
        variant,
        quantity,
      });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {message: 'Unexpected error'},
      );
    }
  },
);

// export const getCart = createAsyncThunk(
//   'cart/getCart',
//   async (_, {rejectWithValue}) => {
//     try {
//       const response = await api.get('/cart');
//       console.log(response.data, 'respon');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || {message: 'Unexpected error'},
//       );
//     }
//   },
// );
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.get('/cart');
      console.log(response.data, 'respon');
      // Ensure we always return items array, even if empty
      return {
        items: response.data.items || [],
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {message: 'Unexpected error'},
      );
    }
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({productId, variant, quantity}, {rejectWithValue}) => {
    try {
      const response = await api.put('/cart/update', {
        productId,
        variant,
        quantity,
      });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {message: 'Unexpected error'},
      );
    }
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({productId, variant}, {rejectWithValue, dispatch}) => {
    try {
      const response = await api.delete('/cart/remove', {
        data: {productId, variant},
      });

      // If cart is empty and deleted, backend returns message without cart
      if (response.data.message && response.data.message.includes('empty')) {
        // Dispatch getCart to confirm empty state or manually set empty array
        await dispatch(getCart());
        return {items: []}; // Return empty items
      }

      return response.data.cart || {items: []};
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {message: 'Unexpected error'},
      );
    }
  },
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, {rejectWithValue}) => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {message: 'Unexpected error'},
      );
    }
  },
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    operationLoading: false, // NEW: Separate loading state for operations
  },
  reducers: {
    // NEW: Add local action to update items immediately
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, state => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.items = action.payload.items || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload?.message || 'Failed to add to cart';
      })

      // Get Cart
      .addCase(getCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch cart';
      })

      // Update Cart Item
      .addCase(updateCartItem.pending, state => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.items = action.payload.items || [];
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload?.message || 'Failed to update cart';
      })

      // Remove from Cart - KEY FIX: Don't show loading, update immediately
      .addCase(removeFromCart.pending, state => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.operationLoading = false;
        if (action.payload.items === undefined) return;
        // CRITICAL: Properly handle the response
        state.items = action.payload.items || [];
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload?.message || 'Failed to remove item';
      })

      // Clear Cart
      .addCase(clearCart.pending, state => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, state => {
        state.operationLoading = false;
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload?.message || 'Failed to clear cart';
      });
  },
});

export const {setCartItems} = cartSlice.actions;
export default cartSlice.reducer;
