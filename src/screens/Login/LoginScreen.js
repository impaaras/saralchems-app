import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Vibration,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../assets/logo.png';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../../redux/slices/authSlice';
import {ROUTES} from '../../constants/routes';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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

export default function LoginScreen({navigation}) {
  const dispatch = useDispatch();
  const {loading, error} = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const errorToastAnim = useRef(new Animated.Value(-100)).current;

  // Animation references
  const logoScaleAnim = useRef(new Animated.Value(0)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const formTranslateYAnim = useRef(new Animated.Value(50)).current;
  const formOpacityAnim = useRef(new Animated.Value(0)).current;
  const emailInputScaleAnim = useRef(new Animated.Value(1)).current;
  const passwordInputScaleAnim = useRef(new Animated.Value(1)).current;
  const loginButtonScaleAnim = useRef(new Animated.Value(1)).current;
  const loginButtonOpacityAnim = useRef(new Animated.Value(1)).current;
  const circleAnim1 = useRef(new Animated.Value(0)).current;
  const circleAnim2 = useRef(new Animated.Value(0)).current;

  // Responsive styles
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
      marginTop: isSmallDevice ? hp(16) : hp(18),
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
      marginBottom: hp(2),
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
      fontSize: getFontSize(14, 16, 18, 20),
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
      backgroundColor: '#a0a0a0',
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
      paddingBottom: hp(5),
      marginTop: hp(2.5),
      width: '100%',
    },
    signupText: {
      color: '#666',
      fontSize: getFontSize(14, 16, 18, 20),
    },
    signupLink: {
      color: '#2B4C7E',
      fontWeight: '600',
      marginLeft: wp(1.25),
      fontSize: getFontSize(14, 16, 18, 20),
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
    forgotPassword: {
      color: '#2B4C7E',
      textAlign: 'center',
      marginBottom: hp(1.9),
      marginTop: hp(1.7),
      fontSize: getFontSize(14, 16, 18, 20),
    },
  });

  // Get input style based on state
  const getInputStyle = fieldName => {
    if (errors[fieldName]) return responsiveStyles.inputError;
    if (
      fieldName === 'email' &&
      email.length > 0 &&
      /^\S+@\S+\.\S+$/.test(email)
    )
      return responsiveStyles.inputValid;
    if (fieldName === 'password' && password.length >= 6)
      return responsiveStyles.inputValid;
    if (
      (fieldName === 'email' && email.length === 0) ||
      (fieldName === 'password' && password.length === 0)
    )
      return responsiveStyles.inputEmpty;
    return responsiveStyles.input;
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      email.length > 0 && /^\S+@\S+\.\S+$/.test(email) && password.length >= 6
    );
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
      Animated.delay(5000),
      Animated.spring(errorToastAnim, {
        toValue: -100,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setErrorMessage('');
    });
  };

  // Enhanced input focus animations
  const handleInputFocus = inputType => {
    gentleHaptic();
    const scaleAnim =
      inputType === 'email' ? emailInputScaleAnim : passwordInputScaleAnim;

    Animated.spring(scaleAnim, {
      toValue: 1.02,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = inputType => {
    const scaleAnim =
      inputType === 'email' ? emailInputScaleAnim : passwordInputScaleAnim;

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  // Handle input changes with error clearing
  const handleChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Validate form input
  const validateForm = () => {
    let tempErrors = {};

    // Email validation
    if (!email || email.trim() === '') {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password || password.trim() === '') {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Enhanced button press animation
  const handleLoginPress = () => {
    lightHaptic();

    Animated.sequence([
      Animated.parallel([
        Animated.spring(loginButtonScaleAnim, {
          toValue: 0.95,
          tension: 150,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(loginButtonOpacityAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(loginButtonScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(loginButtonOpacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      handleLogin();
    });
  };

  // Handle forgot password with gentle animation
  const handleForgotPasswordPress = () => {
    gentleHaptic();
    navigation.navigate(ROUTES.RESET_PASSWORD);
  };

  // Handle signup navigation with gentle animation
  const handleSignupPress = () => {
    gentleHaptic();
    navigation.navigate('Register');
  };

  // Handle login with validation
  const handleLogin = async () => {
    if (!validateForm()) {
      showErrorToast('Please check all fields and try again');
      return;
    }

    try {
      await dispatch(loginUser({email, password})).unwrap();
      mediumHaptic();
    } catch (err) {
      let errorMsg = 'Login failed. Please check your credentials.';

      if (err?.message) {
        errorMsg = err.message;
      } else if (err?.data?.message) {
        errorMsg = err.data.message;
      }

      showErrorToast(errorMsg);
    }
  };

  return (
    <SafeAreaView style={responsiveStyles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={hp(20)}
        showsVerticalScrollIndicator={false}>
        {/* Decorative circles with entrance animation */}
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

        {/* Logo with enhanced entrance animation */}
        <View style={{width: '100%', justifyContent: 'space-between'}}>
          <View style={responsiveStyles.logoContainer}>
            <Animated.View
              style={[
                responsiveStyles.logo,
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
              <Image source={logo} style={responsiveStyles.logoImage} />
            </Animated.View>
          </View>

          {/* Form with entrance animation */}
          <Animated.View
            style={[
              responsiveStyles.formContainer,
              {
                transform: [{translateY: formTranslateYAnim}],
                opacity: formOpacityAnim,
              },
            ]}>
            <Animated.View style={{transform: [{scale: emailInputScaleAnim}]}}>
              <TextInput
                style={[
                  responsiveStyles.input,
                  getInputStyle('email'),
                  errors.email && responsiveStyles.inputError,
                ]}
                placeholder="Enter your email"
                placeholderTextColor="#555"
                keyboardType="email-address"
                value={email}
                onChangeText={text => handleChange('email', text)}
                onFocus={() => handleInputFocus('email')}
                onBlur={() => handleInputBlur('email')}
                autoCapitalize="none"
              />
            </Animated.View>

            <Animated.View
              style={{transform: [{scale: passwordInputScaleAnim}]}}>
              <TextInput
                style={[
                  responsiveStyles.input,
                  getInputStyle('password'),
                  errors.password && responsiveStyles.inputError,
                ]}
                placeholder="Enter password"
                placeholderTextColor="#555"
                value={password}
                onChangeText={text => handleChange('password', text)}
                onFocus={() => handleInputFocus('password')}
                onBlur={() => handleInputBlur('password')}
                secureTextEntry
              />
            </Animated.View>

            <TouchableOpacity
              onPress={handleForgotPasswordPress}
              style={{
                alignSelf: 'center',
              }}>
              <Text style={responsiveStyles.forgotPassword}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Animated.View
              style={{
                transform: [{scale: loginButtonScaleAnim}],
                opacity: loginButtonOpacityAnim,
              }}>
              <TouchableOpacity
                style={[
                  responsiveStyles.loginButtonContainer,
                  (loading || !isFormValid()) &&
                    responsiveStyles.buttonDisabled,
                ]}
                onPress={handleLoginPress}
                disabled={loading || !isFormValid()}>
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
                    {loading ? 'Logging in...' : 'Login'}
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
        </View>

        {errorMessage !== '' && (
          <Animated.View
            style={[
              responsiveStyles.errorToast,
              {
                transform: [{translateY: errorToastAnim}],
              },
            ]}>
            <Text style={responsiveStyles.errorToastText}>{errorMessage}</Text>
          </Animated.View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
