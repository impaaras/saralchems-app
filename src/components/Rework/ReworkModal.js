import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styles from './ReworkModal.styles';
import {hp, wp} from '../../utils/Responsive/responsive';
import {useAlert} from '../../context/CustomAlertContext';

const ReworkModal = ({
  visible,
  onClose,
  selectedOrderId,
  updateOrderStatus,
  processing,
}) => {
  const [reworkReason, setReworkReason] = useState('');
  const {showAlert} = useAlert();

  const submitReworkRequest = () => {
    if (!reworkReason.trim()) {
      showAlert({
        title: 'Required',
        message: 'Please provide a reason for the rework request.',
        acceptText: 'OK',
        rejectText: '', // Hide cancel button
      });
      return;
    }
    updateOrderStatus(selectedOrderId, 'Rework', reworkReason);
  };

  const handleClose = () => {
    setReworkReason('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}>
      <View style={[styles.modalContainer, {padding: wp(5)}]}>
        <View style={[styles.modalContent]}>
          <Text style={[styles.modalTitle]}>Request Rework</Text>
          <Text style={[styles.modalSubtitle]}>
            Please provide a reason for your rework request:
          </Text>
          <TextInput
            style={[styles.reasonInput]}
            placeholder="Enter reason for rework"
            multiline={true}
            numberOfLines={4}
            value={reworkReason}
            onChangeText={setReworkReason}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleClose}>
              <Text style={[styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>

            <LinearGradient
              colors={['#101924', '#38587F']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.confirmButton]}>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={submitReworkRequest}
                disabled={processing}>
                <Text style={[styles.submitButtonText]}>
                  {processing ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReworkModal;
