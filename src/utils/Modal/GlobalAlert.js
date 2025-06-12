import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GlobalAlert = ({
  visible,
  onClose,
  title = 'Do you want to accept?',
  message = "Accepting it will open a pandora's box.",
  onReject,
  onAccept,
  rejectText = 'Cancel',
  acceptText = 'Confirm',
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      // Start animations when modal becomes visible
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reverse animations when modal is hidden
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  // Handle outside press
  const handleBackdropPress = () => {
    setIsVisible(false);
    onClose();
  };

  // Prevent inner content press from closing
  const handleContentPress = e => {
    e.stopPropagation();
  };

  return (
    <>
      {isVisible && (
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: fadeAnim,
              },
            ]}>
            <TouchableWithoutFeedback onPress={handleContentPress}>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{scale: scaleAnim}],
                  },
                ]}>
                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>

                {/* Modal Content */}
                <View style={styles.contentContainer}>
                  {/* Title */}
                  <Text style={styles.title}>{title}</Text>

                  {/* Message */}
                  <Text style={styles.message}>{message}</Text>

                  {/* Action Buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={onReject || onClose}>
                      <Text style={styles.rejectButtonText}>{rejectText}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.acceptButton}
                      //   onPress={onAccept || onClose}
                      onPress={() => {
                        console.log('Confirm button pressed');
                        if (onAccept) {
                          console.log('onAccept function exists');
                          onAccept();
                        } else {
                          console.log('onAccept not provided, calling onClose');
                          onClose();
                        }
                      }}>
                      <Text style={styles.acceptButtonText}>{acceptText}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default GlobalAlert;

const {width} = Dimensions.get('window');
const modalWidth = width > 500 ? 420 : width * 0.85;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: modalWidth,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  rejectButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 8,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  acceptButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#3C5D87',
    marginLeft: 8,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
