import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../assets/logo.png';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../../redux/slices/authSlice';
import {ROUTES} from '../../constants/routes';
import {ScrollView} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './Login.styles';

export default function LoginScreen({navigation}) {
  const dispatch = useDispatch();
  const {loading, error} = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const errorToastAnim = useRef(new Animated.Value(-100)).current;

  // Show error toast message
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
      setErrorMessage('');
    });
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

  // Handle login with validation
  const handleLogin = async () => {
    if (!validateForm()) {
      showErrorToast('Please check all fields and try again');
      return;
    }

    try {
      await dispatch(loginUser({email, password})).unwrap();
      // Success case is handled by your navigation middleware or redux state
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
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={170}
        showsVerticalScrollIndicator={false}>
        {/* Decorative circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        {/* Logo */}
        <View style={{width: '100%', justifyContent: 'space-between'}}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image
                source={logo}
                style={{width: 140, marginLeft: 20, height: 140}}
              />
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email"
              placeholderTextColor="#555"
              keyboardType="email-address"
              value={email}
              onChangeText={text => handleChange('email', text)}
              autoCapitalize="none"
            />

            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Enter password"
              placeholderTextColor="#555"
              value={password}
              onChangeText={text => handleChange('password', text)}
              secureTextEntry
            />

            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.RESET_PASSWORD)}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.loginButtonContainer,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}>
              <LinearGradient
                colors={['#2B4C7E', '#121C29']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

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
}
