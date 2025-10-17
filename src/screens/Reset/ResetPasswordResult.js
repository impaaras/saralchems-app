import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Image,
  Vibration,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../assets/logo.png';
import {useDispatch, useSelector} from 'react-redux';
import {resetPassword} from '../../redux/slices/authSlice';
import {ROUTES} from '../../constants/routes';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Loader from '../../utils/Loader';
import SuccessAnimation from '../../utils/Modal/SuccessAnimation';
import {moderateScale} from '../../utils/Responsive/responsive';

const OTP_TYPE = 'passwordReset';

// Get screen dimensions
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Responsive utility functions
const wp = percentage => {
  return (percentage * screenWidth) / 100;
};

const hp = percentage => {
  return (percentage * screenHeight) / 100;
};

const isSmallDevice = screenWidth < 420;
const isMediumDevice = screenWidth >= 360 && screenWidth < 414;
const isLargeDevice = screenWidth >= 414;
const isTablet = screenWidth >= 768;

// Dynamic font sizes based on screen size
const getFontSize = (small, medium, large, tablet) => {
  if (isTablet) return tablet || large;
  if (isLargeDevice) return large;
  if (isMediumDevice) return medium;
  return small;
};

export default function ResetPasswordResult({navigation, route}) {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.auth);

  // Extract email from route params
  const {email} = route.params || {};

  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorToastAnim = useRef(new Animated.Value(-100)).current;
  const [loader, setLoader] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if form is valid
  const isFormValid = () => {
    return newPassword.length >= 6 && otp.join('').length === 6;
  };

  // Animation references
  const logoScaleAnim = useRef(new Animated.Value(0)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const formTranslateYAnim = useRef(new Animated.Value(50)).current;
  const formOpacityAnim = useRef(new Animated.Value(0)).current;
  const passwordInputScaleAnim = useRef(new Animated.Value(1)).current;
  const otpContainerScaleAnim = useRef(new Animated.Value(1)).current;
  const resetButtonScaleAnim = useRef(new Animated.Value(1)).current;
  const resetButtonOpacityAnim = useRef(new Animated.Value(1)).current;
  const circleAnim1 = useRef(new Animated.Value(0)).current;
  const circleAnim2 = useRef(new Animated.Value(0)).current;
  const otpInputAnims = useRef(
    Array.from({length: 6}, () => ({
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.7),
    })),
  ).current;

  // Create responsive styles
  const responsiveStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(244, 249, 255,0.9)',
      height: '100%',
      width: '100%',
    },
    circle1: {
      position: 'absolute',
      top: isSmallDevice ? hp(-10) : hp(-8.5),
      left: isSmallDevice ? -wp(40) : -wp(30),
      width: isTablet ? wp(26) : isSmallDevice ? wp(50) : wp(50),
      height: isTablet ? wp(26) : isSmallDevice ? wp(50) : wp(50),
      borderRadius: isTablet ? wp(19) : isSmallDevice ? wp(30) : wp(37.5),
      backgroundColor: '#8BA1C3',
      opacity: 0.7,
      zIndex: 1,
    },
    circle2: {
      position: 'absolute',
      top: isSmallDevice ? hp(-13) : hp(-11),
      left: isSmallDevice ? wp(-5) : wp(2),
      width: isTablet ? wp(22) : isSmallDevice ? wp(40) : wp(42.5),
      height: isTablet ? wp(22) : isSmallDevice ? wp(40) : wp(42.5),
      borderRadius: isTablet ? wp(12.5) : isSmallDevice ? wp(25) : wp(25),
      backgroundColor: '#8BA1C3',
      opacity: 0.7,
      zIndex: 0,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: isSmallDevice ? hp(8) : hp(12),
      marginBottom: isSmallDevice ? hp(8) : hp(12),
      width: '100%',
    },
    logo: {
      width: isTablet ? wp(26) : isSmallDevice ? wp(40) : wp(50),
      height: isTablet ? wp(26) : isSmallDevice ? wp(40) : wp(50),
      borderRadius: isTablet ? wp(13) : isSmallDevice ? wp(20) : wp(25),
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#555',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    logoImage: {
      width: isTablet ? wp(20) : isSmallDevice ? wp(25) : wp(35),
      height: isTablet ? wp(20) : isSmallDevice ? wp(25) : wp(35),
      marginLeft: wp(5),
    },
    formContainer: {
      paddingHorizontal: isSmallDevice ? wp(8) : wp(10),
      justifyContent: 'center',
      width: '100%',
    },
    input: {
      width: '100%',
      height: isSmallDevice ? hp(6) : hp(6.5),
      color: 'black',
      backgroundColor: '#fff',
      borderRadius: wp(6.25),
      paddingHorizontal: wp(5),
      borderWidth: 1,
      borderColor: '#DDD',
      marginBottom: hp(1.9),
      fontSize: moderateScale(14),
      shadowColor: '#333',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
    inputEmpty: {
      backgroundColor: '#FFF',
      borderColor: '#e0e0e0',
    },
    inputError: {
      borderColor: '#ff0000',
      backgroundColor: '#fff9f9',
    },
    inputValid: {
      borderColor: '#4CAF50',
      backgroundColor: '#f8fff8',
    },
    loginButtonContainer: {
      width: '100%',
      height: isSmallDevice ? hp(5.5) : hp(6.25),
      marginTop: hp(2.5),
      borderRadius: wp(6.25),
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
    loginButton: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2B4C7E',
    },
    loginButtonDisabled: {
      // backgroundColor: '#a0a0a0',
      backgroundColor: '#2B4C7E',
      // backgroundColor: '#a0a0a0',
    },
    loginButtonText: {
      color: '#fff',
      fontSize: getFontSize(16, 18, 20, 22),
      fontWeight: '600',
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(2.5),
      width: '100%',
    },
    signupText: {
      width: moderateScale(190),
      color: '#666',
      textAlign: 'center',
      fontSize: moderateScale(14),
    },
    signupLink: {
      color: '#2B4C7E',
      fontWeight: '600',
      textAlign: 'center',
      marginLeft: wp(1.25),
      fontSize: moderateScale(14),
    },
    forgotPassword: {
      color: '#2B4C7E',
      textAlign: 'center',
      marginVertical: hp(1.25),
      fontSize: moderateScale(14),
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    errorToast: {
      position: 'absolute',
      bottom: hp(2.5),
      left: wp(5),
      right: wp(5),
      backgroundColor: '#ff6b6b',
      padding: hp(1.9),
      borderRadius: wp(2),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    errorToastText: {
      color: 'white',
      fontSize: getFontSize(12, 14, 16, 18),
      textAlign: 'center',
      fontWeight: '600',
    },
    errorText: {
      color: '#ff0000',
      fontSize: getFontSize(12, 14, 16, 18),
      marginBottom: hp(2.5),
      textAlign: 'center',
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp(5),
      paddingHorizontal: isSmallDevice ? 0 : wp(2.5),
    },
    otpInput: {
      width: isTablet ? wp(8) : isSmallDevice ? wp(10) : wp(12.5),
      height: isTablet ? wp(8) : isSmallDevice ? wp(10) : wp(12.5),
      borderRadius: wp(3),
      borderWidth: 1,
      borderColor: '#DDD',
      backgroundColor: '#fff',
      fontSize: getFontSize(16, 20, 24, 28),
      textAlign: 'center',
      color: 'black',
      shadowColor: '#333',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
    otpInputEmpty: {
      backgroundColor: '#f9f9f9',
      borderColor: '#e0e0e0',
    },
    otpInputValid: {
      borderColor: '#4CAF50',
      backgroundColor: '#f8fff8',
    },
    otpInputError: {
      borderColor: '#ff0000',
      backgroundColor: '#fff9f9',
    },
    otpText: {
      marginLeft: wp(2.5),
      fontSize: getFontSize(12, 14, 16, 18),
      marginBottom: hp(1.25),
      color: '#333',
    },
  });

  // Get input style based on state
  const getInputStyle = () => {
    if (errors.newPassword) return responsiveStyles.inputError;
    if (newPassword.length >= 6) return responsiveStyles.inputValid;
    if (newPassword.length === 0) return responsiveStyles.inputEmpty;
    return responsiveStyles.input;
  };

  // Get OTP input style based on state
  const getOtpInputStyle = index => {
    if (errors.otp) return responsiveStyles.otpInputError;
    if (otp[index] !== '') return responsiveStyles.otpInputValid;
    return responsiveStyles.otpInput;
  };

  // Haptic feedback functions
  const lightHaptic = () => {
    Vibration.vibrate(10);
  };

  const mediumHaptic = () => {
    Vibration.vibrate([0, 50]);
  };

  const gentleHaptic = () => {
    Vibration.vibrate(5);
  };

  // Initial entrance animations
  useEffect(() => {
    // Decorative circles animation
    Animated.parallel([
      Animated.timing(circleAnim1, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(circleAnim2, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo entrance with spring animation
    Animated.parallel([
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacityAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Form entrance with gentle slide up
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(formTranslateYAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(formOpacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);

    // OTP inputs staggered entrance
    setTimeout(() => {
      otpInputAnims.forEach((anim, index) => {
        setTimeout(() => {
          Animated.parallel([
            Animated.spring(anim.scale, {
              toValue: 1,
              tension: 60,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        }, index * 80);
      });
    }, 1000);
  }, []);

  // Show error toast message with enhanced animation
  const showErrorToast = message => {
    setErrorMessage(message);
    mediumHaptic();

    Animated.sequence([
      Animated.spring(errorToastAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.spring(errorToastAnim, {
        toValue: -100,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => setErrorMessage(''));
  };

  // Enhanced input focus animations
  const handlePasswordFocus = () => {
    gentleHaptic();
    Animated.spring(passwordInputScaleAnim, {
      toValue: 1.02,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handlePasswordBlur = () => {
    Animated.spring(passwordInputScaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleOtpFocus = index => {
    gentleHaptic();
    Animated.spring(otpInputAnims[index].scale, {
      toValue: 1.1,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleOtpBlur = index => {
    Animated.spring(otpInputAnims[index].scale, {
      toValue: 1,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handlePasswordChange = value => {
    setNewPassword(value);
    if (errors.newPassword) {
      setErrors(prev => ({
        ...prev,
        newPassword: '',
      }));
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '') {
      lightHaptic();
      Animated.sequence([
        Animated.spring(otpInputAnims[index].scale, {
          toValue: 1.15,
          tension: 150,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(otpInputAnims[index].scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (errors.otp) {
      setErrors(prev => ({
        ...prev,
        otp: '',
      }));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const clearOtp = () => {
    setOtp(['', '', '', '', '', '']);
    otpInputAnims.forEach((anim, index) => {
      setTimeout(() => {
        Animated.sequence([
          Animated.spring(anim.scale, {
            toValue: 0.8,
            tension: 100,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 50);
    });
    inputRefs.current[0]?.focus();
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!email || email.trim() === '') {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!newPassword) {
      tempErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      tempErrors.newPassword = 'Password must be at least 6 characters';
    }

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      tempErrors.otp = 'Please enter full 6-digit OTP';
    } else if (!/^\d{6}$/.test(otpString)) {
      tempErrors.otp = 'OTP must contain only digits';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleResetPress = () => {
    lightHaptic();

    Animated.sequence([
      Animated.parallel([
        Animated.spring(resetButtonScaleAnim, {
          toValue: 0.95,
          tension: 150,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(resetButtonOpacityAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(resetButtonScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(resetButtonOpacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      handleResetPassword();
    });
  };

  const handleSignupPress = () => {
    gentleHaptic();
    navigation.navigate('Register');
  };

  const handleResetPassword = async () => {
    setLoader(true);
    if (isSubmitting) return;

    if (!validateForm()) {
      showErrorToast('Please check all fields and try again');
      setLoader(false);
      return;
    }
    setIsSubmitting(true);
    try {
      const otpCode = otp.join('');
      await dispatch(
        resetPassword({
          email,
          otp: otpCode,
          newPassword,
          type: OTP_TYPE,
        }),
      ).unwrap();
      setLoader(false);
      mediumHaptic();
      setShowSuccess(true);
    } catch (err) {
      console.log('Password reset error:', err);
      const errorMsg =
        err?.message ||
        err?.data?.message ||
        err?.response?.data?.message ||
        'Invalid OTP or OTP expired. Please try again.';
      showErrorToast(errorMsg);
      clearOtp();
      setLoader(false);
      setIsSubmitting(false);
    }
  };

  const handleSuccessComplete = () => {
    setIsSubmitting(false);
    navigation.navigate(ROUTES.LOGIN);
  };

  return (
    <SafeAreaView style={responsiveStyles.container}>
      {loader && <Loader />}

      <SuccessAnimation
        visible={showSuccess}
        message="Password Reset Successfully!"
        duration={1500}
        onComplete={handleSuccessComplete}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={hp(20)}
        showsVerticalScrollIndicator={false}>
        {/* Decorative circles */}
        <Animated.View
          style={[
            responsiveStyles.circle1,
            {
              transform: [
                {
                  scale: circleAnim1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
                {
                  translateX: circleAnim1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-wp(12.5), 0],
                  }),
                },
              ],
              opacity: circleAnim1,
            },
          ]}
        />
        <Animated.View
          style={[
            responsiveStyles.circle2,
            {
              transform: [
                {
                  scale: circleAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                },
                {
                  translateX: circleAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [wp(7.5), 0],
                  }),
                },
              ],
              opacity: circleAnim2,
            },
          ]}
        />

        {/* Logo */}
        <Animated.View
          style={[
            responsiveStyles.logoContainer,
            {
              transform: [
                {scale: logoScaleAnim},
                {
                  rotateY: logoScaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['180deg', '0deg'],
                  }),
                },
              ],
              opacity: logoOpacityAnim,
            },
          ]}>
          <View style={responsiveStyles.logo}>
            <Image source={logo} style={responsiveStyles.logoImage} />
          </View>
        </Animated.View>

        {/* Form */}
        <Animated.View
          style={[
            responsiveStyles.formContainer,
            {
              transform: [{translateY: formTranslateYAnim}],
              opacity: formOpacityAnim,
            },
          ]}>
          <Text style={responsiveStyles.otpText}>Enter new password</Text>
          <Animated.View style={{transform: [{scale: passwordInputScaleAnim}]}}>
            <TextInput
              style={[responsiveStyles.input, getInputStyle()]}
              placeholder="New password"
              placeholderTextColor="#999"
              secureTextEntry
              value={newPassword}
              onChangeText={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              editable={!isSubmitting}
            />
          </Animated.View>
          {errors.newPassword && (
            <Text style={responsiveStyles.errorText}>{errors.newPassword}</Text>
          )}

          <Text style={responsiveStyles.otpText}>Enter OTP</Text>
          <View style={responsiveStyles.otpContainer}>
            {otp.map((digit, index) => (
              <Animated.View
                key={index}
                style={{
                  transform: [{scale: otpInputAnims[index].scale}],
                  opacity: otpInputAnims[index].opacity,
                }}>
                <TextInput
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={[responsiveStyles.otpInput, getOtpInputStyle(index)]}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  onFocus={() => handleOtpFocus(index)}
                  onBlur={() => handleOtpBlur(index)}
                  editable={!isSubmitting}
                />
              </Animated.View>
            ))}
          </View>
          {errors.otp && (
            <Text style={responsiveStyles.errorText}>{errors.otp}</Text>
          )}

          <Animated.View
            style={{
              transform: [{scale: resetButtonScaleAnim}],
              opacity: resetButtonOpacityAnim,
            }}>
            <TouchableOpacity
              style={[
                responsiveStyles.loginButtonContainer,
                (loading || isSubmitting || !isFormValid()) &&
                  responsiveStyles.buttonDisabled,
              ]}
              onPress={handleResetPress}
              disabled={loading || isSubmitting || !isFormValid()}>
              <LinearGradient
                colors={
                  isFormValid()
                    ? ['#2B4C7E', '#121C29']
                    : ['#2B4C7E', '#2B4C7E']
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={responsiveStyles.loginButton}>
                <Text style={responsiveStyles.loginButtonText}>
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            responsiveStyles.signupContainer,
            {
              opacity: formOpacityAnim,
            },
          ]}>
          <Text style={responsiveStyles.signupText}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={handleSignupPress}>
            <Text style={responsiveStyles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>

        {errorMessage !== '' && (
          <Animated.View
            style={[
              responsiveStyles.errorToast,
              {transform: [{translateY: errorToastAnim}]},
            ]}>
            <Text style={responsiveStyles.errorToastText}>{errorMessage}</Text>
          </Animated.View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
