import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAuthState} from '../redux/slices/authSlice';
import StackNavigation from './StackNavigation';
import AuthNavigator from './AuthNavigator';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';

// Responsive utility functions
const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const bottomTextAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkAuthState = async () => {
      await dispatch(fetchAuthState());

      // Start animations sequence
      Animated.sequence([
        // Main brand animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideUpAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Tagline animation
        Animated.timing(taglineAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        // Bottom text animation
        Animated.timing(bottomTextAnim, {
          toValue: 1,
          duration: 500,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Hide splash screen after animations
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    };

    checkAuthState();
  }, [dispatch, fadeAnim, scaleAnim, slideUpAnim, taglineAnim, bottomTextAnim]);

  if (loading) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#3C5D87" />
        <LinearGradient
          colors={['#3C5D87', '#4A6FA5', '#3C5D87']}
          style={styles.splashContainer}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <View style={styles.contentContainer}>
            {/* Company Name with Animation */}
            <Animated.View
              style={[
                styles.brandContainer,
                {
                  opacity: fadeAnim,
                  transform: [{scale: scaleAnim}, {translateY: slideUpAnim}],
                },
              ]}>
              <Text style={styles.companyName}>
                <Text style={styles.saralText}>SARAL</Text>
                <Text style={styles.dyeText}>DYE</Text>
                <Text style={styles.chemsText}>CHEMS</Text>
              </Text>

              {/* Animated Tagline */}
              <Animated.Text
                style={[
                  styles.tagline,
                  {
                    opacity: taglineAnim,
                    transform: [
                      {
                        translateY: taglineAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}>
                Quality Chemical Solutions
              </Animated.Text>
            </Animated.View>

            {/* Animated Bottom Text */}
            <Animated.View
              style={[
                styles.bottomContainer,
                {
                  opacity: bottomTextAnim,
                  transform: [
                    {
                      translateY: bottomTextAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <View style={styles.divider} />
              <Text style={styles.poweredBy}>POWERED BY INNOVATION</Text>
            </Animated.View>

            {/* Subtle background animation dots */}
            <View style={styles.backgroundPattern}>
              {[...Array(3)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.patternDot,
                    {
                      opacity: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.1],
                      }),
                      transform: [
                        {
                          scale: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                          }),
                        },
                      ],
                    },
                    {
                      left: `${20 + index * 30}%`,
                      top: `${15 + index * 20}%`,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </LinearGradient>
      </>
    );
  }

  return <>{isAuthenticated ? <StackNavigation /> : <AuthNavigator />}</>;
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
    position: 'relative',
  },
  brandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyName: {
    fontSize: moderateScale(42),
    fontWeight: '900',
    letterSpacing: moderateScale(-1),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  saralText: {
    color: '#FFFFFF',
    fontSize: moderateScale(38),
  },
  dyeText: {
    color: '#E2E8F0',
    fontSize: moderateScale(38),
  },
  chemsText: {
    color: '#CBD5E0',
    fontSize: moderateScale(38),
  },
  tagline: {
    fontSize: moderateScale(13),
    color: '#E2E8F0',
    fontWeight: '600',
    marginTop: verticalScale(16),
    letterSpacing: moderateScale(2),
    textTransform: 'uppercase',
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: verticalScale(80),
    alignItems: 'center',
  },
  divider: {
    width: scale(60),
    height: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
    marginBottom: verticalScale(16),
    borderRadius: 1,
  },
  poweredBy: {
    fontSize: moderateScale(11),
    color: '#E2E8F0',
    fontWeight: '700',
    letterSpacing: moderateScale(3),
    opacity: 0.8,
    textAlign: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  patternDot: {
    position: 'absolute',
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: '#FFFFFF',
    opacity: 0.05,
  },
});

export default AppNavigator;
