import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Easing, Text} from 'react-native';
import {moderateScale} from './Responsive/responsive';

const Loader = ({visible}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    if (visible) {
      animationRef.current = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      animationRef.current.start();
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
        rotateAnim.setValue(0); // Reset the animation
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
      <Animated.View style={[styles.spinner, {transform: [{rotate: spin}]}]}>
        {Array.from({length: 12}).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              {
                transform: [
                  {rotate: `${i * 30}deg`},
                  {translateY: -moderateScale(16)},
                ],
                opacity: (i + 1) / 12,
              },
            ]}
          />
        ))}
      </Animated.View>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

export default Loader;

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
  spinner: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    position: 'absolute',
    width: moderateScale(4),
    height: moderateScale(10),
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  text: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: moderateScale(16),
    marginTop: moderateScale(10),
  },
});
