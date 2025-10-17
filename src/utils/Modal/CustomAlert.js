import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

const {width} = Dimensions.get('window');

// Create an Alert Context to manage alert state globally
const AlertContext = createContext();

/**
 * AlertProvider - Context provider for the custom alert system
 * Wrap your root component with this provider
 */
export const AlertProvider = ({children}) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
    dismissable: false,
    customStyles: {},
  });

  const showAlert = config => {
    setAlertConfig({...alertConfig, ...config, visible: true});
  };

  const hideAlert = () => {
    setAlertConfig({...alertConfig, visible: false});
  };

  return (
    <AlertContext.Provider value={{showAlert, hideAlert}}>
      {children}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={() => {
          hideAlert();
          alertConfig.onConfirm && alertConfig.onConfirm();
        }}
        onCancel={() => {
          hideAlert();
          alertConfig.onCancel && alertConfig.onCancel();
        }}
        dismissable={alertConfig.dismissable}
        customStyles={alertConfig.customStyles}
      />
    </AlertContext.Provider>
  );
};

// Hook to use the alert
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }

  const {showAlert, hideAlert} = context;

  // Utility methods for different alert types
  const success = options => {
    return new Promise((resolve, reject) => {
      showAlert({
        ...options,
        type: 'success',
        onConfirm: () => {
          resolve(true);
          options.onConfirm && options.onConfirm();
        },
        onCancel: () => {
          reject(false);
          options.onCancel && options.onCancel();
        },
      });
    });
  };

  const error = options => {
    return new Promise((resolve, reject) => {
      showAlert({
        ...options,
        type: 'error',
        onConfirm: () => {
          resolve(true);
          options.onConfirm && options.onConfirm();
        },
        onCancel: () => {
          reject(false);
          options.onCancel && options.onCancel();
        },
      });
    });
  };

  const warning = options => {
    return new Promise((resolve, reject) => {
      showAlert({
        ...options,
        type: 'warning',
        onConfirm: () => {
          resolve(true);
          options.onConfirm && options.onConfirm();
        },
        onCancel: () => {
          reject(false);
          options.onCancel && options.onCancel();
        },
      });
    });
  };

  const info = options => {
    return new Promise((resolve, reject) => {
      showAlert({
        ...options,
        type: 'info',
        onConfirm: () => {
          resolve(true);
          options.onConfirm && options.onConfirm();
        },
        onCancel: () => {
          reject(false);
          options.onCancel && options.onCancel();
        },
      });
    });
  };

  const confirm = options => {
    return new Promise((resolve, reject) => {
      showAlert({
        ...options,
        type: options.type || 'warning',
        onConfirm: () => {
          resolve(true);
          options.onConfirm && options.onConfirm();
        },
        onCancel: () => {
          reject(false);
          options.onCancel && options.onCancel();
        },
      });
    });
  };

  return {
    show: showAlert,
    hide: hideAlert,
    success,
    error,
    warning,
    info,
    confirm,
  };
};

/**
 * CustomAlert - An enhanced alert component for React Native
 *
 * @param {Object} props
 * @param {boolean} props.visible - Control alert visibility
 * @param {string} props.title - Alert title text
 * @param {string} props.message - Alert message text
 * @param {string} props.type - Alert type: 'success', 'error', 'warning', 'info' (default: 'info')
 * @param {Function} props.onConfirm - Function to call when confirm button is pressed
 * @param {Function} props.onCancel - Function to call when cancel button is pressed (optional)
 * @param {string} props.confirmText - Text for confirm button (default: 'OK')
 * @param {string} props.cancelText - Text for cancel button (default: 'Cancel')
 * @param {boolean} props.dismissable - Whether alert can be dismissed by tapping outside (default: false)
 * @param {Object} props.customStyles - Custom styles to override default styles
 */
const CustomAlert = ({
  visible = false,
  title = '',
  message = '',
  type = 'info',
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  dismissable = false,
  customStyles = {},
}) => {
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.spring(animationValue, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animationValue]);

  // Get alert colors based on type
  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: '#E7F7EF',
          icon: '#34C759',
          border: '#34C759',
        };
      case 'error':
        return {
          background: '#FEEFEF',
          icon: '#FF3B30',
          border: '#FF3B30',
        };
      case 'warning':
        return {
          background: '#FFF9ED',
          icon: '#FF9500',
          border: '#FF9500',
        };
      default: // info
        return {
          background: '#EFF6FF',
          icon: '#007AFF',
          border: '#007AFF',
        };
    }
  };

  const colors = getColors();

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '!';
      case 'warning':
        return '⚠';
      default: // info
        return 'i';
    }
  };

  // Animation styles
  const animatedStyles = {
    transform: [
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1],
        }),
      },
    ],
    opacity: animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (dismissable && onCancel) {
      onCancel();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={[styles.container, customStyles.container]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.alertContainer,
                {backgroundColor: colors.background},
                customStyles.alertContainer,
                animatedStyles,
              ]}>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: colors.icon},
                  customStyles.iconContainer,
                ]}>
                <Text style={styles.iconText}>{getIcon()}</Text>
              </View>

              <View style={styles.contentContainer}>
                {title ? (
                  <Text style={[styles.title, customStyles.title]}>
                    {title}
                  </Text>
                ) : null}

                {message ? (
                  <Text style={[styles.message, customStyles.message]}>
                    {message}
                  </Text>
                ) : null}
              </View>

              <View
                style={[styles.buttonContainer, customStyles.buttonContainer]}>
                {onCancel && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.cancelButton,
                      customStyles.cancelButton,
                    ]}
                    onPress={onCancel}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.cancelButtonText,
                        customStyles.cancelButtonText,
                      ]}>
                      {cancelText}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    {backgroundColor: colors.icon},
                    customStyles.confirmButton,
                  ]}
                  onPress={onConfirm}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.confirmButtonText,
                      customStyles.confirmButtonText,
                    ]}>
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#212121',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: '#616161',
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#F8F8F8',
    borderRightWidth: 1,
    borderRightColor: '#EEEEEE',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#616161',
    fontWeight: '600',
    fontSize: 16,
  },
});

export {CustomAlert};
