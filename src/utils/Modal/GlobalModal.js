import React from 'react';
import {Modal, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {closeModal} from '../../redux/slices/modalSlice';

const GlobalModal = () => {
  const dispatch = useDispatch();
  const {isOpen, modalType, modalProps} = useSelector(state => state.modal);

  const handleClose = () => {
    console.log('hloe');
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

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>{renderModalContent()}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    // width: '100%',
    // height: '100%',
    left: 100,
    top: 400,
  },
  modalContainer: {
    // width: '80%',
    // minHeight: 150,
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
