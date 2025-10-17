import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import {hp, wp} from '../../utils/Responsive/responsive';

const BottomModal = ({visible, onClose}) => {
  useEffect(() => {
    console.log('hlo', visible);
    if (visible) {
      console.log('Modal is now visible');
    } else {
      console.log('Modal is now hidden');
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      {/* Overlay - closes modal when pressed */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          {/* Stop propagation when pressing inside modal */}
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView
                style={styles.content}
                contentContainerStyle={{paddingBottom: hp(4)}}
                showsVerticalScrollIndicator={false}>
                {Array.from({length: 20}).map((_, i) => (
                  <Text key={i} style={styles.contentText}>
                    Hello {i + 1}
                  </Text>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '50%', // safer than calculating from Dimensions
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#101924',
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
  },
  headerTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  contentText: {
    fontSize: wp(4),
    marginBottom: hp(2),
    color: '#333',
  },
});
