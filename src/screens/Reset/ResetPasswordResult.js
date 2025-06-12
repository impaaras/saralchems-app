// import React, {useState, useRef, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Animated,
//   SafeAreaView,
//   Image,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import logo from '../../assets/logo.png';
// import {useDispatch, useSelector} from 'react-redux';
// import {resetPassword} from '../../redux/slices/authSlice';
// import {ROUTES} from '../../constants/routes';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import styles from './Reset.styles';
// import Loader from '../../utils/Loader';

// // Define OTP type for password reset to match backend expectations
// const OTP_TYPE = 'passwordReset';

// export default function ResetPasswordResult({navigation, route}) {
//   const dispatch = useDispatch();
//   const {loading} = useSelector(state => state.auth);

//   // Extract email from route params
//   const {email} = route.params || {};

//   const [newPassword, setNewPassword] = useState('');
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const inputRefs = useRef([]);
//   const [errors, setErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const errorToastAnim = useRef(new Animated.Value(-100)).current;
//   const [loader, setLoader] = useState(false);

//   // Show error toast animation
//   const showErrorToast = message => {
//     setErrorMessage(message);
//     Animated.sequence([
//       Animated.timing(errorToastAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.delay(3000),
//       Animated.timing(errorToastAnim, {
//         toValue: -100,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start(() => setErrorMessage(''));
//   };

//   const handlePasswordChange = value => {
//     setNewPassword(value);
//     if (errors.newPassword) {
//       setErrors(prev => ({
//         ...prev,
//         newPassword: '',
//       }));
//     }
//   };

//   const handleOtpChange = (value, index) => {
//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value !== '' && index < 5) {
//       inputRefs.current[index + 1].focus();
//     }

//     if (errors.otp) {
//       setErrors(prev => ({
//         ...prev,
//         otp: '',
//       }));
//     }
//   };

//   const handleKeyPress = (e, index) => {
//     if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const clearOtp = () => {
//     setOtp(['', '', '', '', '', '']);
//     inputRefs.current[0]?.focus();
//   };

//   const validateForm = () => {
//     let tempErrors = {};

//     // Email validation
//     if (!email || email.trim() === '') {
//       tempErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       tempErrors.email = 'Please enter a valid email address';
//     }

//     // Password validation - ensure it matches your backend minimum requirements
//     if (!newPassword) {
//       tempErrors.newPassword = 'New password is required';
//     } else if (newPassword.length < 6) {
//       tempErrors.newPassword = 'Password must be at least 6 characters';
//     }

//     // OTP validation - ensure it's a 6-digit number
//     const otpString = otp.join('');
//     if (otpString.length !== 6) {
//       tempErrors.otp = 'Please enter full 6-digit OTP';
//     } else if (!/^\d{6}$/.test(otpString)) {
//       tempErrors.otp = 'OTP must contain only digits';
//     }

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleResetPassword = async () => {
//     setLoader(true);
//     if (isSubmitting) return;

//     if (!validateForm()) {
//       showErrorToast('Please check all fields and try again');
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const otpCode = otp.join('');
//       await dispatch(
//         resetPassword({
//           email,
//           otp: otpCode,
//           newPassword,
//           type: OTP_TYPE, // Add the type parameter to match backend expectation
//         }),
//       ).unwrap();
//       setLoader(false);
//       navigation.navigate(ROUTES.LOGIN);
//     } catch (err) {
//       console.log('Password reset error:', err);
//       const errorMsg =
//         err?.message ||
//         err?.data?.message ||
//         err?.response?.data?.message ||
//         'Invalid OTP or OTP expired. Please try again.';
//       showErrorToast(errorMsg);
//       clearOtp();
//     } finally {
//       setLoader(false);
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {loader && <Loader />}
//       <KeyboardAwareScrollView
//         contentContainerStyle={{flexGrow: 1}}
//         enableOnAndroid
//         keyboardShouldPersistTaps="handled"
//         extraScrollHeight={170}
//         showsVerticalScrollIndicator={false}>
//         <View style={styles.circle1} />
//         <View style={styles.circle2} />

//         <View style={styles.logoContainer}>
//           <Image
//             source={logo}
//             style={{width: 140, marginLeft: 20, height: 140}}
//           />
//         </View>

//         <View style={styles.formContainer}>
//           <TextInput
//             style={[styles.input, errors.email && styles.inputError]}
//             placeholder="Email address"
//             placeholderTextColor="#555"
//             keyboardType="email-address"
//             value={email || ''}
//             editable={false}
//             autoCapitalize="none"
//           />
//           {errors.email && (
//             <Text style={styles.errorText}>{errors.errorText}</Text>
//           )}

//           <TextInput
//             style={[styles.input, errors.newPassword && styles.inputError]}
//             placeholder="New password"
//             placeholderTextColor="#555"
//             secureTextEntry
//             value={newPassword}
//             onChangeText={handlePasswordChange}
//             editable={!isSubmitting}
//           />
//           {errors.newPassword && (
//             <Text style={styles.errorText}>{errors.newPassword}</Text>
//           )}

//           <View style={styles.otpContainer}>
//             {otp.map((digit, index) => (
//               <TextInput
//                 key={index}
//                 ref={ref => (inputRefs.current[index] = ref)}
//                 style={[styles.otpInput, errors.otp && styles.inputError]}
//                 maxLength={1}
//                 keyboardType="number-pad"
//                 value={digit}
//                 onChangeText={value => handleOtpChange(value, index)}
//                 onKeyPress={e => handleKeyPress(e, index)}
//                 editable={!isSubmitting}
//               />
//             ))}
//           </View>
//           {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

//           <TouchableOpacity
//             style={[
//               styles.loginButtonContainer,
//               (loading || isSubmitting) && styles.buttonDisabled,
//             ]}
//             onPress={handleResetPassword}
//             disabled={loading || isSubmitting}>
//             <LinearGradient
//               colors={['#2B4C7E', '#121C29']}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}
//               style={styles.loginButton}>
//               <Text style={styles.loginButtonText}>
//                 {isSubmitting ? 'Resetting...' : 'Reset Password'}
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.signupContainer}>
//           <Text style={styles.signupText}>Don't have an account?</Text>
//           <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//             <Text style={styles.signupLink}>Sign Up</Text>
//           </TouchableOpacity>
//         </View>

//         {errorMessage !== '' && (
//           <Animated.View
//             style={[
//               styles.errorToast,
//               {transform: [{translateY: errorToastAnim}]},
//             ]}>
//             <Text style={styles.errorToastText}>{errorMessage}</Text>
//           </Animated.View>
//         )}
//       </KeyboardAwareScrollView>
//     </SafeAreaView>
//   );
// }
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../assets/logo.png';
import {useDispatch, useSelector} from 'react-redux';
import {resetPassword} from '../../redux/slices/authSlice';
import {ROUTES} from '../../constants/routes';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './Reset.styles';
import Loader from '../../utils/Loader';
import SuccessAnimation from '../../utils/Modal/SuccessAnimation';

const OTP_TYPE = 'passwordReset';

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
  // New state for success animation
  const [showSuccess, setShowSuccess] = useState(false);

  // Show error toast animation
  const showErrorToast = message => {
    setErrorMessage(message);
    Animated.sequence([
      Animated.timing(errorToastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(errorToastAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setErrorMessage(''));
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
    inputRefs.current[0]?.focus();
  };

  const validateForm = () => {
    let tempErrors = {};

    // Email validation
    if (!email || email.trim() === '') {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    // Password validation - ensure it matches your backend minimum requirements
    if (!newPassword) {
      tempErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      tempErrors.newPassword = 'Password must be at least 6 characters';
    }

    // OTP validation - ensure it's a 6-digit number
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      tempErrors.otp = 'Please enter full 6-digit OTP';
    } else if (!/^\d{6}$/.test(otpString)) {
      tempErrors.otp = 'OTP must contain only digits';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
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
          type: OTP_TYPE, // Add the type parameter to match backend expectation
        }),
      ).unwrap();
      setLoader(false);

      // Show success animation before navigating
      setShowSuccess(true);

      // Navigation will happen via the onComplete callback of SuccessAnimation
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

  // Handle navigation after success animation completes
  const handleSuccessComplete = () => {
    setIsSubmitting(false);
    navigation.navigate(ROUTES.LOGIN);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loader && <Loader />}

      {/* Success Animation */}
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
        extraScrollHeight={170}
        showsVerticalScrollIndicator={false}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.logoContainer}>
          <Image
            source={logo}
            style={{width: 140, marginLeft: 20, height: 140}}
          />
        </View>

        <View style={styles.formContainer}>
          {/* <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email address"
            placeholderTextColor="#555"
            keyboardType="email-address"
            value={email || ''}
            editable={false}
            autoCapitalize="none"
          /> */}
          {/* {errors.email && (
            <Text style={styles.errorText}>{errors.errorText}</Text>
          )} */}
          <Text style={styles.otpText}>Enter new password</Text>
          <TextInput
            style={[styles.input, errors.newPassword && styles.inputError]}
            placeholder="New password"
            placeholderTextColor="#555"
            secureTextEntry
            value={newPassword}
            onChangeText={handlePasswordChange}
            editable={!isSubmitting}
          />
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword}</Text>
          )}

          <Text style={styles.otpText}>Enter OTP</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={[styles.otpInput, errors.otp && styles.inputError]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                editable={!isSubmitting}
              />
            ))}
          </View>
          {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

          <TouchableOpacity
            style={[
              styles.loginButtonContainer,
              (loading || isSubmitting) && styles.buttonDisabled,
            ]}
            onPress={handleResetPassword}
            disabled={loading || isSubmitting}>
            <LinearGradient
              colors={['#2B4C7E', '#121C29']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.loginButton}>
              <Text style={styles.loginButtonText}>
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
