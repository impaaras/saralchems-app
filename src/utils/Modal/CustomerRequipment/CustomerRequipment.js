import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Easing,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HapticFeedback from 'react-native-haptic-feedback';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, scale} from '../../Responsive/responsive';
import CustomGradientButton from '../../../components/Buttons/Gradient/CustomGradientButton';
import Colors from '../../../assets/color';

const {width} = Dimensions.get('window');
const modalWidth = width > 500 ? 420 : width * 0.85;

const CustomerRequipment = ({
  visible,
  onClose,
  title = 'Do you want to accept?',
  message = "Accepting it will open a pandora's box.",
  onReject,
  onAccept,
  rejectText = 'Cancel',
  acceptText = 'Confirm',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(100)).current;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start(() => {
        HapticFeedback.trigger('impactLight');
      });
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsVisible(false);
      });
    }
  }, [visible]);

  const handleClose = () => {
    HapticFeedback.trigger('impactLight');
    onClose?.();
  };

  const handleReject = () => {
    HapticFeedback.trigger('impactLight');
    onReject?.() || onClose?.();
  };

  const handleAccept = () => {
    HapticFeedback.trigger('impactMedium');
    onAccept?.() || onClose?.();
  };
  return (
    <>
      {isVisible && (
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={[styles.overlay, {opacity: fadeAnim}]}>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{scale: scaleAnim}, {translateY: translateYAnim}],
                  opacity: fadeAnim,
                },
              ]}>
              {/* Close Button */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Customer Request</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
                  <Ionicons
                    name="close"
                    size={moderateScale(20)}
                    color={Colors.PRIMARY}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.reqBody}>
                <TextInput placeholder="Message..." style={styles.msgBody} />
                <View style={styles.submitBtn}>
                  <CustomGradientButton title="Send Message" size="elg" />
                </View>
              </View>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default CustomerRequipment;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  header: {
    backgroundColor: Colors.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(15),
    borderRadius: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(17),
    color: Colors.TEXT_WHITE,
    fontWeight: '600',
  },
  reqBody: {
    padding: scale(10),
  },
  msgBody: {
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    borderRadius: scale(5),
    marginBottom: scale(10),
    height: scale(120),
    padding: scale(10),
    textAlignVertical: 'top',
  },
  submitBtn: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  modalContainer: {
    width: modalWidth,
    backgroundColor: '#fff',
    borderRadius: scale(8),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  closeButton: {
    backgroundColor: '#FFF',
    borderRadius: scale(20),
  },
});
