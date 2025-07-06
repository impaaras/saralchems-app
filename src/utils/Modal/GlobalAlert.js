// import React, {useEffect, useRef, useState} from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   Dimensions,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const GlobalAlert = ({
//   visible,
//   onClose,
//   title = 'Do you want to accept?',
//   message = "Accepting it will open a pandora's box.",
//   onReject,
//   onAccept,
//   rejectText = 'Cancel',
//   acceptText = 'Confirm',
// }) => {
//   // Animation values
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.9)).current;
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     if (visible) {
//       setIsVisible(true);
//       // Start animations when modal becomes visible
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.spring(scaleAnim, {
//           toValue: 1,
//           friction: 8,
//           tension: 40,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } else {
//       // Reverse animations when modal is hidden
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleAnim, {
//           toValue: 0.9,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [visible, fadeAnim, scaleAnim]);

//   // Handle outside press
//   const handleBackdropPress = () => {
//     setIsVisible(false);
//     onClose();
//   };

//   // Prevent inner content press from closing
//   const handleContentPress = e => {
//     e.stopPropagation();
//   };

//   return (
//     <>
//       {isVisible && (
//         <TouchableWithoutFeedback onPress={handleBackdropPress}>
//           <Animated.View
//             style={[
//               styles.overlay,
//               {
//                 opacity: fadeAnim,
//               },
//             ]}>
//             <TouchableWithoutFeedback onPress={handleContentPress}>
//               <Animated.View
//                 style={[
//                   styles.modalContainer,
//                   {
//                     opacity: fadeAnim,
//                     transform: [{scale: scaleAnim}],
//                   },
//                 ]}>
//                 {/* Close Button */}
//                 <TouchableOpacity
//                   style={styles.closeButton}
//                   onPress={onClose}
//                   hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
//                   <Ionicons name="close" size={24} color="#000" />
//                 </TouchableOpacity>

//                 {/* Modal Content */}
//                 <View style={styles.contentContainer}>
//                   {/* Title */}
//                   <Text style={styles.title}>{title}</Text>

//                   {/* Message */}
//                   <Text style={styles.message}>{message}</Text>

//                   {/* Action Buttons */}
//                   <View style={styles.buttonContainer}>
//                     <TouchableOpacity
//                       style={styles.rejectButton}
//                       onPress={onReject || onClose}>
//                       <Text style={styles.rejectButtonText}>{rejectText}</Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       style={styles.acceptButton}
//                       //   onPress={onAccept || onClose}
//                       onPress={() => {
//                         console.log('Confirm button pressed');
//                         if (onAccept) {
//                           console.log('onAccept function exists');
//                           onAccept();
//                         } else {
//                           console.log('onAccept not provided, calling onClose');
//                           onClose();
//                         }
//                       }}>
//                       <Text style={styles.acceptButtonText}>{acceptText}</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </Animated.View>
//             </TouchableWithoutFeedback>
//           </Animated.View>
//         </TouchableWithoutFeedback>
//       )}
//     </>
//   );
// };

// export default GlobalAlert;

// const {width} = Dimensions.get('window');
// const modalWidth = width > 500 ? 420 : width * 0.85;

// const styles = StyleSheet.create({
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   modalContainer: {
//     width: modalWidth,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     zIndex: 1,
//   },
//   contentContainer: {
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   message: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 24,
//     lineHeight: 22,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 8,
//   },
//   rejectButton: {
//     flex: 1,
//     height: 48,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#000',
//     marginRight: 8,
//   },
//   rejectButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//   },
//   acceptButton: {
//     flex: 1,
//     height: 48,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//     backgroundColor: '#3C5D87',
//     marginLeft: 8,
//   },
//   acceptButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//   },
// });

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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HapticFeedback from 'react-native-haptic-feedback';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, scale} from '../Responsive/responsive';

const {width} = Dimensions.get('window');
const modalWidth = width > 500 ? 420 : width * 0.85;

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
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [
                      {scale: scaleAnim},
                      {translateY: translateYAnim},
                    ],
                    opacity: fadeAnim,
                  },
                ]}>
                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
                  <Ionicons
                    name="close"
                    size={moderateScale(20)}
                    color="#000"
                  />
                </TouchableOpacity>

                {/* Modal Content */}
                <View style={styles.contentContainer}>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.message}>{message}</Text>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={handleReject}>
                      <Text style={styles.rejectButtonText}>{rejectText}</Text>
                    </TouchableOpacity>
                    <LinearGradient
                      colors={['#38587F', '#101924']}
                      start={{x: 0, y: 0}}
                      style={styles.acceptButton}
                      end={{x: 1, y: 0}}>
                      <TouchableOpacity onPress={handleAccept}>
                        <Text style={styles.acceptButtonText}>
                          {acceptText}
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
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
  modalContainer: {
    width: modalWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
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
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    minWidth: scale(200),
    fontSize: moderateScale(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: scale(4),
  },
  rejectButton: {
    flex: 1,
    height: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 8,
  },
  rejectButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#000',
  },
  acceptButton: {
    flex: 1,
    height: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#3C5D87',
    marginLeft: 8,
  },
  acceptButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#fff',
  },
});
