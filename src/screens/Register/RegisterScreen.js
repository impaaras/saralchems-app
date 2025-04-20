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
} from 'react-native';
import React, {useState, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../redux/slices/authSlice';
import logo from '../../assets/logo.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './Register.styles';

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

  const businessTypes = [
    'Retail',
    'Wholesale',
    'Manufacturing',
    'Service',
    'Technology',
  ];

  const showErrorToast = message => {
    setErrorMessage(message);

    Animated.sequence([
      Animated.timing(errorToastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(5000), // Stay visible for 5 seconds
      Animated.timing(errorToastAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animation completes, clear the error message
      setErrorMessage('');
    });
  };

  // Handle input changes
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

  // Handle business type selection
  const handleBusinessTypeSelect = type => {
    handleChange('businessType', type);
    setIsDropdownOpen(false);
  };

  // Validation function
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

  // Handle registration
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

      // Show success message and navigate to OTP screen
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
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={170}
        showsVerticalScrollIndicator={false}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <ScrollView style={{flex: 1, width: '100%'}}>
          <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Image
                  source={logo}
                  style={{width: 80, marginLeft: 10, height: 80}}
                />
              </View>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <TextInput
                style={[styles.input, errors.personName && styles.inputError]}
                placeholder="Person Name"
                placeholderTextColor="#555"
                value={formData.personName}
                onChangeText={text => handleChange('personName', text)}
              />
              {/* {errors.personName && (
              <Text style={styles.errorText}>{errors.personName}</Text>
            )} */}

              <TextInput
                style={[styles.input, errors.companyName && styles.inputError]}
                placeholder="Company Name"
                placeholderTextColor="#555"
                value={formData.companyName}
                onChangeText={text => handleChange('companyName', text)}
              />
              {/* {errors.companyName && (
              <Text style={styles.errorText}>{errors.companyName}</Text>
            )} */}

              {/* Custom Dropdown */}
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={[
                    styles.dropdownButton,
                    errors.businessType && styles.inputError,
                  ]}
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <Text style={styles.dropdownButtonText}>
                    {formData.businessType || 'Select Business Type'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
                {isDropdownOpen && (
                  <View style={styles.dropdownList}>
                    {businessTypes.map((type, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => handleBusinessTypeSelect(type)}>
                        <Text style={styles.dropdownItemText}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              {/* {errors.businessType && (
              <Text style={styles.errorText}>{errors.businessType}</Text>
            )} */}

              <TextInput
                style={[styles.input, errors.gstNo && styles.inputError]}
                placeholder="GST No."
                placeholderTextColor="#555"
                value={formData.gstNo}
                onChangeText={text => handleChange('gstNo', text)}
              />
              {/* {errors.gstNo && (
              <Text style={styles.errorText}>{errors.gstNo}</Text>
            )} */}

              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Phone"
                placeholderTextColor="#555"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={text => handleChange('phone', text)}
              />
              {/* {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )} */}

              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter you email"
                placeholderTextColor="#555"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={text => handleChange('email', text)}
              />
              {/* {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )} */}

              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                placeholder="Company Address"
                placeholderTextColor="#555"
                multiline
                value={formData.address}
                onChangeText={text => handleChange('address', text)}
              />
              {/* {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )} */}

              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor="#555"
                secureTextEntry
                value={formData.password}
                onChangeText={text => handleChange('password', text)}
              />

              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirm Password"
                placeholderTextColor="#555"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={text => handleChange('confirmPassword', text)}
              />
              {/* {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )} */}

              <TouchableOpacity
                style={[
                  styles.loginButtonContainer,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading}>
                <LinearGradient
                  colors={['#2B4C7E', '#121C29']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Registering...' : 'Register'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signupLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {errorMessage !== '' && (
          <Animated.View
            style={[
              styles.errorToast,
              {
                transform: [{translateY: errorToastAnim}],
              },
            ]}>
            <Text style={styles.errorToastText}>{errorMessage}</Text>
          </Animated.View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
