import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Easing} from 'react-native';
import {CheckCircle, AlertCircle, Info, X} from 'lucide-react-native';

/**
 * A reusable success animation component showing a checkmark with a custom message
 * @param {Object} props
 * @param {string} props.message - Message to display with the success animation
 * @param {number} props.duration - Duration in ms before auto-hiding (default: 1500ms)
 * @param {Function} props.onComplete - Callback function to run after animation completes
 * @param {boolean} props.visible - Whether the animation is visible
 * @param {string} props.backgroundColor - Background color of the animation container
 * @param {Object} props.style - Additional style for the container
 */
const SuccessAnimation = ({
  message = 'Success!',
  duration = 1500,
  onComplete = () => {},
  visible = true,
  backgroundColor = 'rgba(0, 0, 0, 0.7)',
  style = {},
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animation sequence
      Animated.sequence([
        // Fade in and scale up container
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
        ]),

        // Animate checkmark with bounce effect
        Animated.parallel([
          Animated.timing(checkOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(checkScale, {
            toValue: 1.2,
            duration: 350,
            easing: Easing.out(Easing.back(2)),
            useNativeDriver: true,
          }),
        ]),

        // Normalize checkmark scale
        Animated.timing(checkScale, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),

        // Hold for a moment
        Animated.delay(duration - 650),

        // Fade out
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset animation values
        checkOpacity.setValue(0);
        checkScale.setValue(0);

        // Call completion callback
        onComplete();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          opacity,
          transform: [{scale}],
        },
        style,
      ]}>
      <Animated.View
        style={{
          opacity: checkOpacity,
          transform: [{scale: checkScale}],
        }}>
        <CheckCircle stroke="green" width={50} height={50} strokeWidth={2.5} />
      </Animated.View>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  message: {
    color: 'green',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
});

export default SuccessAnimation;
