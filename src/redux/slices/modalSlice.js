import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isOpen: false, // Changed to false by default
  modalType: null,
  modalProps: {
    title: '',
    message: '',
  },
  callbackId: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.modalProps = action.payload.modalProps || {};
      state.callbackId = action.payload.callbackId;
    },
    closeModal: state => {
      state.isOpen = false;
      state.modalType = null;
      state.modalProps = {};
      state.callbackId = null;
    },
  },
});

export const {openModal, closeModal} = modalSlice.actions;
export default modalSlice.reducer;
