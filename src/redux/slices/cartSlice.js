import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isDrawerOpen: false,
  selectedVariants: [],
  selectedProduct: null, // Store selected product globally
  isProductModalOpen: true, // Track modal visibility
  isSearchModal: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setVariants: (state, action) => {
      state.selectedVariants = action.payload;
    },
    openScreen: (state, action) => {
      state.selectedProduct = action.payload;
    },
    addItem: (state, action) => {
      state.selectedProduct = action.payload; // Store the selected product
      state.isProductModalOpen = true; // Open the modal
    },
    closeModal: state => {
      state.isProductModalOpen = !state.isProductModalOpen; // Close modal
      state.selectedProduct = null;
    },
    closeSearchModal: state => {
      state.isSearchModal = !state.isSearchModal; // Close modal
      state.selectedProduct = null;
    },
  },
});

export const {
  setVariants,
  addItem,
  closeModal,
  openScreen,
  closeSearchModal,
  selectedProduct,
} = cartSlice.actions;
export default cartSlice.reducer;
