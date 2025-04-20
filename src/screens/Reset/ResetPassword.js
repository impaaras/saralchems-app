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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../assets/logo.png';
import {useDispatch, useSelector} from 'react-redux';
import {requestPasswordReset} from '../../redux/slices/authSlice';
import {ROUTES} from '../../constants/routes';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './Reset.styles';

export default function ResetPassword({navigation}) {
  const dispatch = useDispatch();
  const {loading, error} = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const errorToastAnim = useRef(new Animated.Value(-100)).current;

  const showErrorToast = message => {
    setErrorMessage(message);
    Animated.sequence([
      Animated.timing(errorToastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(5000),
      Animated.timing(errorToastAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setErrorMessage(''));
  };

  const handleChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
    }
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!email || email.trim() === '') {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      showErrorToast('Please check all fields and try again');
      return;
    }
    try {
      await dispatch(requestPasswordReset({email})).unwrap();
      navigation.navigate('OTP', {email});
    } catch (err) {
      let errorMsg = 'Failed to send reset request. Try again later.';
      console.log('er', err.message);
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
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={{width: '100%', justifyContent: 'space-between'}}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image
                source={logo}
                style={{width: 140, marginLeft: 20, height: 140}}
              />
            </View>
          </View>
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
            <TouchableOpacity
              style={[
                styles.loginButtonContainer,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleResetPassword}
              disabled={loading}>
              <LinearGradient
                colors={['#2B4C7E', '#121C29']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Request Reset Link</Text>
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
              {transform: [{translateY: errorToastAnim}]},
            ]}>
            <Text style={styles.errorToastText}>{errorMessage}</Text>
          </Animated.View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
