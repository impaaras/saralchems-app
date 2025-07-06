import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Animated,
  Vibration,
  Dimensions,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../redux/slices/authSlice';
import logo from '../../assets/logo.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {scale} from '../Cart/responsive';
import {moderateScale} from '../../utils/Responsive/responsive';

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

const RegisterScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const errorToastAnim = useRef(new Animated.Value(-100)).current;
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    personName: '',
    companyName: '',
    businessType: '',
    gstNo: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Animation references
  const logoScaleAnim = useRef(new Animated.Value(0)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const formTranslateYAnim = useRef(new Animated.Value(50)).current;
  const formOpacityAnim = useRef(new Animated.Value(0)).current;
  const registerButtonScaleAnim = useRef(new Animated.Value(1)).current;
  const registerButtonOpacityAnim = useRef(new Animated.Value(1)).current;
  const circleAnim1 = useRef(new Animated.Value(0)).current;
  const circleAnim2 = useRef(new Animated.Value(0)).current;
  const dropdownScaleAnim = useRef(new Animated.Value(0)).current;
  const dropdownOpacityAnim = useRef(new Animated.Value(0)).current;

  // Input field animation references
  const inputAnimations = useRef({
    personName: new Animated.Value(1),
    companyName: new Animated.Value(1),
    businessType: new Animated.Value(1),
    gstNo: new Animated.Value(1),
    phone: new Animated.Value(1),
    email: new Animated.Value(1),
    address: new Animated.Value(1),
    password: new Animated.Value(1),
    confirmPassword: new Animated.Value(1),
  }).current;

  const businessTypes = [
    'Retail',
    'Wholesale',
    'Manufacturing',
    'Service',
    'Technology',
  ];

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
      marginTop: isSmallDevice ? hp(8) : hp(12),
      marginBottom: isSmallDevice ? hp(4) : hp(6),
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
      // fontSize: getFontSize(10, 12, 14, 16),
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
      textAlign: 'center',
      width: scale(210),
      fontSize: moderateScale(14),
    },
    signupLink: {
      color: '#2B4C7E',
      fontWeight: '600',
      marginLeft: wp(1.25),
      textAlign: 'center',
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
    dropdownContainer: {
      width: '100%',
      marginBottom: hp(1.9),
      zIndex: 10,
    },
    dropdownButton: {
      width: '100%',
      height: isSmallDevice ? hp(5.5) : hp(6.25),
      backgroundColor: '#fff',
      borderRadius: wp(6.25),
      paddingHorizontal: wp(5),
      borderWidth: 1,
      borderColor: '#DDD',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dropdownButtonText: {
      color: '#555',
      fontSize: moderateScale(14),
    },
    dropdownArrow: {
      color: '#555',
      fontSize: moderateScale(14),
    },
    dropdownList: {
      position: 'absolute',
      top: isSmallDevice ? hp(5.8) : hp(6.3),
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: wp(3),
      borderWidth: 1,
      borderColor: '#DDD',
      zIndex: 100,
      maxHeight: hp(40),
    },
    dropdownItem: {
      padding: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    dropdownItemText: {
      fontSize: moderateScale(14),
      color: '#333',
    },
  });

  // Get input style based on state
  const getInputStyle = fieldName => {
    if (errors[fieldName]) return responsiveStyles.inputError;
    if (formData[fieldName].length > 0) return responsiveStyles.inputValid;
    return responsiveStyles.input;
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

  // Dropdown animation effects
  useEffect(() => {
    if (isDropdownOpen) {
      Animated.parallel([
        Animated.spring(dropdownScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(dropdownOpacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(dropdownScaleAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(dropdownOpacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isDropdownOpen]);

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

  const handleInputFocus = inputName => {
    gentleHaptic();
    const scaleAnim = inputAnimations[inputName];

    Animated.spring(scaleAnim, {
      toValue: 1.02,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const isFormValid = () => {
    const {
      personName,
      companyName,
      businessType,
      gstNo,
      phone,
      email,
      address,
      password,
      confirmPassword,
    } = formData;

    return (
      personName &&
      companyName &&
      businessType &&
      gstNo &&
      /^\d{10}$/.test(phone) &&
      /\S+@\S+\.\S+/.test(email) &&
      address &&
      password.length >= 6 &&
      password === confirmPassword
    );
  };

  const handleInputBlur = inputName => {
    const scaleAnim = inputAnimations[inputName];

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleBusinessTypeSelect = type => {
    gentleHaptic();
    handleChange('businessType', type);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    gentleHaptic();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.personName) tempErrors.personName = 'Name is required';
    if (!formData.companyName)
      tempErrors.companyName = 'Company name is required';
    if (!formData.businessType)
      tempErrors.businessType = 'Business type is required';
    if (!formData.gstNo) tempErrors.gstNo = 'GST number is required';
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = 'Valid 10-digit phone number is required';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Valid email is required';
    }
    if (!formData.address) tempErrors.address = 'Address is required';
    if (!formData.password || formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegisterPress = () => {
    lightHaptic();

    Animated.sequence([
      Animated.parallel([
        Animated.spring(registerButtonScaleAnim, {
          toValue: 0.95,
          tension: 150,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(registerButtonOpacityAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(registerButtonScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(registerButtonOpacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      handleRegister();
    });
  };

  const handleSignInPress = () => {
    gentleHaptic();
    navigation.navigate('Login');
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      showErrorToast('Please check all fields and try again');
      return;
    }

    setIsLoading(true);
    try {
      const response = await dispatch(
        registerUser({
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          personName: formData.personName,
          businessType: formData.businessType,
          gstNumber: formData.gstNo,
          phone: formData.phone,
          companyAddress: formData.address,
        }),
      ).unwrap();

      mediumHaptic();
      navigation.navigate('OTP', {email: formData.email});
    } catch (error) {
      console.log(error);
      let errorMsg = 'Registration failed. Please try again.';

      if (error.message === 'User with this email already exists.') {
        errorMsg =
          'This email is already registered. Please use a different email.';
      } else if (error.message) {
        errorMsg = error.message;
      }

      showErrorToast(errorMsg);
    } finally {
      setIsLoading(false);
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

        <ScrollView style={{flex: 1, width: '100%', paddingBottom: scale(50)}}>
          <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
            {/* Logo */}
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

            {/* Form */}
            <Animated.View
              style={[
                responsiveStyles.formContainer,
                {
                  transform: [{translateY: formTranslateYAnim}],
                  opacity: formOpacityAnim,
                },
              ]}>
              <Animated.View
                style={{transform: [{scale: inputAnimations.personName}]}}>
                <TextInput
                  style={[
                    responsiveStyles.input,
                    getInputStyle('personName'),
                    errors.personName && responsiveStyles.inputError,
                  ]}
                  placeholder="Person Name"
                  placeholderTextColor="#555"
                  value={formData.personName}
                  onChangeText={text => handleChange('personName', text)}
                  onFocus={() => handleInputFocus('personName')}
                  onBlur={() => handleInputBlur('personName')}
                />
              </Animated.View>

              <Animated.View
                style={{transform: [{scale: inputAnimations.companyName}]}}>
                <TextInput
                  style={[
                    responsiveStyles.input,
                    getInputStyle('companyName'),
                    errors.companyName && responsiveStyles.inputError,
                  ]}
                  placeholder="Company Name"
                  placeholderTextColor="#555"
                  value={formData.companyName}
                  onChangeText={text => handleChange('companyName', text)}
                  onFocus={() => handleInputFocus('companyName')}
                  onBlur={() => handleInputBlur('companyName')}
                />
              </Animated.View>

              {/* Custom Dropdown */}
              <Animated.View
                style={[
                  responsiveStyles.dropdownContainer,
                  {transform: [{scale: inputAnimations.businessType}]},
                ]}>
                <TouchableOpacity
                  style={[
                    responsiveStyles.dropdownButton,
                    errors.businessType && responsiveStyles.inputError,
                    formData.businessType
                      ? responsiveStyles.inputValid
                      : responsiveStyles.input,
                  ]}
                  onPress={handleDropdownToggle}>
                  <Text style={responsiveStyles.dropdownButtonText}>
                    {formData.businessType || 'Select Business Type'}
                  </Text>
                  <Animated.Text
                    style={[
                      responsiveStyles.dropdownArrow,
                      {
                        transform: [
                          {
                            rotate: isDropdownOpen ? '180deg' : '0deg',
                          },
                        ],
                      },
                    ]}>
                    ▼
                  </Animated.Text>
                </TouchableOpacity>
                {isDropdownOpen && (
                  <Animated.View
                    style={[
                      responsiveStyles.dropdownList,
                      {
                        transform: [
                          {scaleY: dropdownScaleAnim},
                          {
                            translateY: dropdownScaleAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            }),
                          },
                        ],
                        opacity: dropdownOpacityAnim,
                      },
                    ]}>
                    {businessTypes.map((type, index) => (
                      <TouchableOpacity
                        key={index}
                        style={responsiveStyles.dropdownItem}
                        onPress={() => handleBusinessTypeSelect(type)}>
                        <Text style={responsiveStyles.dropdownItemText}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                )}
              </Animated.View>

              <Animated.View
                style={{transform: [{scale: inputAnimations.gstNo}]}}>
                <TextInput
                  style={[
                    responsiveStyles.input,
                    getInputStyle('gstNo'),
                    errors.gstNo && responsiveStyles.inputError,
                  ]}
                  placeholder="GST No."
                  placeholderTextColor="#555"
                  value={formData.gstNo}
                  onChangeText={text => handleChange('gstNo', text)}
                  onFocus={() => handleInputFocus('gstNo')}
                  onBlur={() => handleInputBlur('gstNo')}
                />
              </Animated.View>

              <Animated.View
                style={{transform: [{scale: inputAnimations.phone}]}}>
                <TextInput
                  style={[
                    responsiveStyles.input,
                    getInputStyle('phone'),
                    errors.phone && responsiveStyles.inputError,
                  ]}
                  placeholder="Phone"
                  placeholderTextColor="#555"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={text => handleChange('phone', text)}
                  onFocus={() => handleInputFocus('phone')}
                  onBlur={() => handleInputBlur('phone')}
                />
              </Animated.View>

              <Animated.View
                style={{transform: [{scale: inputAnimations.email}]}}>
                <TextInput
                  style={[
                    responsiveStyles.input,
                    getInputStyle('email'),
                    errors.email && responsiveStyles.inputError,
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor="#555"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={text => handleChange('email', text)}
                  onFocus={() => handleInputFocus('email')}
                  onBlur={() => handleInputBlur('email')}
                />
              </Animated.View>

              <Animated.View
                style={{transform: [{scale: inputAnimations.address}]}}>
                <TextInput
                  style={[
                    responsiveStyles.input,
                    getInputStyle('address'),
                    errors.address && responsiveStyles.inputError,
                  ]}
                  placeholder="Company Address"
                  placeholderTextColor="#555"
                  multiline
                  value={formData.address}
                  onChangeText={text => handleChange('address', text)}
                  onFocus={() => handleInputFocus('address')}
                  onBlur={() => handleInputBlur('address')}
                />
              </Animated.View>

              <Animated.View
                style={{transform: [{scale: inputAnimations.password}]}}>
                <TextInput
                  style={[
                    responsiveStyles.input,
                    getInputStyle('password'),
                    errors.password && responsiveStyles.inputError,
                  ]}
                  placeholder="Password"
                  placeholderTextColor="#555"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={text => handleChange('password', text)}
                  onFocus={() => handleInputFocus('password')}
                  onBlur={() => handleInputBlur('password')}
                />
              </Animated.View>

              <Animated.View
                style={{transform: [{scale: inputAnimations.confirmPassword}]}}>
                <TextInput
                  style={[
                    responsiveStyles.input,
                    getInputStyle('confirmPassword'),
                    errors.confirmPassword && responsiveStyles.inputError,
                  ]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#555"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={text => handleChange('confirmPassword', text)}
                  onFocus={() => handleInputFocus('confirmPassword')}
                  onBlur={() => handleInputBlur('confirmPassword')}
                />
              </Animated.View>

              <Animated.View
                style={{
                  transform: [{scale: registerButtonScaleAnim}],
                  opacity: registerButtonOpacityAnim,
                }}>
                <TouchableOpacity
                  style={[
                    responsiveStyles.loginButtonContainer,
                    (!isFormValid() || isLoading) &&
                      responsiveStyles.buttonDisabled,
                  ]}
                  onPress={handleRegisterPress}
                  disabled={!isFormValid() || isLoading}>
                  <LinearGradient
                    colors={['#2B4C7E', '#121C29']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={responsiveStyles.loginButton}>
                    <Text style={responsiveStyles.loginButtonText}>
                      {isLoading ? 'Registering...' : 'Register'}
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
                Already have an account?
              </Text>
              <TouchableOpacity onPress={handleSignInPress}>
                <Text style={responsiveStyles.signupLink}>Sign in</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>

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
};

export default RegisterScreen;
