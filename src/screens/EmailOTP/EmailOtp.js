import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {verifyOTP, resendOTP} from '../../redux/slices/authSlice';
import styles from './Email.styles';

const RESEND_COOLDOWN_TIME = 300; // 5 minutes in seconds

const EmailOtp = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {email} = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [attempts, setAttempts] = useState(3);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  const cooldownTimerRef = useRef(null);
  const errorToastAnim = useRef(new Animated.Value(-100)).current;
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  const startResendCooldown = () => {
    setResendCooldown(RESEND_COOLDOWN_TIME);
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
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

  const handleVerify = async () => {
    if (isVerifying) return;

    const otpString = otp.join('');

    if (otpString.length !== 6) {
      showErrorToast('Please enter all 6 digits of the OTP');
      return;
    }

    if (attempts <= 0) {
      showErrorToast('Maximum attempts exceeded. Please request a new OTP.');
      clearOtp();
      setAttempts(3);
      return;
    }

    setIsVerifying(true);

    try {
      await dispatch(verifyOTP({email, otp: otpString})).unwrap();
      navigation.navigate('Home');
    } catch (error) {
      setAttempts(prev => prev - 1);
      showErrorToast(`Invalid OTP. ${attempts - 1} attempts remaining.`);
      clearOtp();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) {
      showErrorToast(
        `Please wait ${Math.ceil(resendCooldown / 60)} minutes and ${
          resendCooldown % 60
        } seconds`,
      );
      return;
    }

    try {
      await dispatch(resendOTP({email})).unwrap();
      clearOtp();
      setAttempts(3);
      startResendCooldown();
      showErrorToast('New OTP has been sent to your email');
    } catch (error) {
      showErrorToast(error.message || 'Failed to resend OTP');
    }
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Email Verification</Text>
          <Text style={styles.subHeaderText}>
            Please enter the 6-digit code sent to your email
          </Text>
          {attempts < 3 && (
            <Text style={styles.attemptsText}>
              {attempts} {attempts === 1 ? 'attempt' : 'attempts'} remaining
            </Text>
          )}
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[styles.otpInput, isVerifying && styles.otpInputDisabled]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              editable={!isVerifying}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButtonContainer,
            isVerifying && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={isVerifying}>
          <LinearGradient
            colors={['#2B4C7E', '#121C29']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.verifyButton}>
            <Text style={styles.verifyButtonText}>
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={resendCooldown > 0}>
            <Text
              style={[
                styles.resendLink,
                resendCooldown > 0 && styles.resendLinkDisabled,
              ]}>
              {resendCooldown > 0
                ? `Resend in ${formatTime(resendCooldown)}`
                : 'Resend'}
            </Text>
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
    </SafeAreaView>
  );
};

export default EmailOtp;
