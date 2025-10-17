import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  activeProduct: null, // centralized object
};

const newCart = createSlice({
  name: 'productPreview',
  initialState,
  reducers: {
    setActiveProduct: (state, action) => {
      state.activeProduct = {
        ...action.payload,
        selectedVariant: null,
      };
    },
    setSelectedVariant: (state, action) => {
      if (state.activeProduct) {
        state.activeProduct.selectedVariant = action.payload;
      }
    },
    clearPreview: state => {
      state.activeProduct = null;
    },
  },
});

export const {setActiveProduct, setSelectedVariant, clearPreview} =
  newCart.actions;

export default newCart.reducer;
