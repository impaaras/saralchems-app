import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../redux/slices/modalSlice';

const GlobalModal = () => {
  const dispatch = useDispatch();
  const { isOpen, modalType, modalProps } = useSelector(state => state.modal);

  const handleClose = () => {
    dispatch(closeModal());
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'CONFIRM_MODAL':
        return (
          <>
            <Text style={styles.title}>
              {modalProps?.title || 'Default Title'}
            </Text>
            <Text style={styles.message}>
              {modalProps?.message || 'Default Message'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Closes</Text>
            </TouchableOpacity>
          </>
        );
      // Add other modal types here
      default:
        return (
          <>
            <Text style={styles.title}>
              {modalProps?.title || 'Default Title'}
            </Text>
            <Text style={styles.message}>
              {modalProps?.message || 'Default Message'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  if (isOpen) {
    return (
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {renderModalContent()}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    zIndex: 9999,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  modalContainer: {
    width: '80%',
    minHeight: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GlobalModal;
