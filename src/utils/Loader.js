import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Text, Dimensions} from 'react-native';
import Colors from '../assets/color';
import LoaderIcon from '../assets/icons/svg/loader.svg';

const {width} = Dimensions.get('window');

const CurvedArrowLoader = ({visible = true, size = 60}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    if (visible) {
      animationRef.current = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      );
      animationRef.current.start();
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
        rotateAnim.setValue(0);
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        rotateAnim.setValue(0);
      }
    };
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.loaderCard, {width: size + 80, height: size + 80}]}>
        <Animated.View
          style={[
            styles.spinnerContainer,
            {
              width: size,
              height: size,
              transform: [{rotate: spin}],
            },
          ]}>
          <LoaderIcon width={size} height={size} color={Colors.PRIMARY} />
        </Animated.View>

        <Text style={styles.loadingText}>Loading</Text>
      </View>
    </View>
  );
};

// Alternative with custom size and styling props
const CustomCurvedArrowLoader = ({
  visible = true,
  size = 60,
  iconColor = Colors.PRIMARY,
  backgroundColor = '#FFFFFF',
  textColor = '#374151',
  loadingText = 'Loading',
  animationDuration = 1200,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    if (visible) {
      animationRef.current = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      );
      animationRef.current.start();
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
        rotateAnim.setValue(0);
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        rotateAnim.setValue(0);
      }
    };
  }, [visible, animationDuration]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.loaderCard,
          {
            width: size + 80,
            height: size + 80,
            backgroundColor: backgroundColor,
          },
        ]}>
        <Animated.View
          style={[
            styles.spinnerContainer,
            {
              width: size,
              height: size,
              transform: [{rotate: spin}],
            },
          ]}>
          <LoaderIcon
            width={size}
            height={size}
            color={iconColor}
            fill={iconColor}
          />
        </Animated.View>

        {loadingText && (
          <Text style={[styles.loadingText, {color: textColor}]}>
            {loadingText}
          </Text>
        )}
      </View>
    </View>
  );
};

export default CurvedArrowLoader;
export {CustomCurvedArrowLoader};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    letterSpacing: 0.5,
  },
});
