import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {X} from 'lucide-react-native';
import ZoomableImage from './ImageZoom';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const ImageViewerModal = ({visible, imageUrl, onClose}) => {
  console.log(visible);
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X color="white" size={24} />
        </TouchableOpacity>
        <ZoomableImage
          uri={imageUrl}
          style={styles.image}
          maxZoom={5}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

export default ImageViewerModal;
