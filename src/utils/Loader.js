// import {ActivityIndicator, View, StyleSheet} from 'react-native';

// const Loader = ({visible}) => {
//   if (!visible) return null;

//   return (
//     <View style={styles.loaderContainer}>
//       <ActivityIndicator size="large" color="#3C5D87" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loaderContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
// });
// export default Loader;

import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated, PanResponder} from 'react-native';

const Loader = ({visible}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const topSandHeight = useRef(new Animated.Value(1)).current;
  const bottomSandHeight = useRef(new Animated.Value(0)).current;
  const sandStreamOpacity = useRef(new Animated.Value(0)).current;
  const isFlipped = useRef(false);

  useEffect(() => {
    if (visible) {
      startSandAnimation();
    }
  }, [visible]);

  const startSandAnimation = () => {
    // Sand flowing animation
    const flowDuration = 4000;

    Animated.loop(
      Animated.sequence([
        // Sand flows from top to bottom
        Animated.parallel([
          Animated.timing(topSandHeight, {
            toValue: 0.1,
            duration: flowDuration,
            useNativeDriver: false,
          }),
          Animated.timing(bottomSandHeight, {
            toValue: 1,
            duration: flowDuration,
            useNativeDriver: false,
          }),
          Animated.timing(sandStreamOpacity, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: false,
          }),
        ]),
        // Brief pause
        Animated.timing(sandStreamOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        // Flip animation
        Animated.timing(rotation, {
          toValue: isFlipped.current ? 0 : 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Reset sand levels after flip
        Animated.parallel([
          Animated.timing(topSandHeight, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(bottomSandHeight, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
          }),
        ]),
      ]),
    ).start();

    // Toggle flip state
    rotation.addListener(({value}) => {
      if (value >= 0.5 && !isFlipped.current) {
        isFlipped.current = true;
      } else if (value < 0.5 && isFlipped.current) {
        isFlipped.current = false;
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        translateX.setOffset(translateX._value);
        translateY.setOffset(translateY._value);
      },
      onPanResponderMove: Animated.event(
        [null, {dx: translateX, dy: translateY}],
        {useNativeDriver: false},
      ),
      onPanResponderRelease: () => {
        translateX.flattenOffset();
        translateY.flattenOffset();

        // Smooth spring back to center
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: false,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: false,
          }),
        ]).start();
      },
    }),
  ).current;

  if (!visible) return null;

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.loaderContainer}>
      <Animated.View
        style={[
          styles.timerContainer,
          {
            transform: [
              {translateX: translateX},
              {translateY: translateY},
              {rotate: rotationInterpolate},
            ],
          },
        ]}
        {...panResponder.panHandlers}>
        {/* Top cap */}
        <View style={styles.topCap} />

        {/* Top bulb container */}
        <View style={styles.topBulb}>
          {/* Top sand */}
          <Animated.View
            style={[
              styles.topSand,
              {
                height: topSandHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 50],
                }),
              },
            ]}
          />

          {/* Glass highlight */}
          <View style={[styles.glassHighlight, styles.topHighlight]} />
        </View>

        {/* Neck (center constriction) */}
        <View style={styles.neck}>
          <Animated.View
            style={[styles.sandStream, {opacity: sandStreamOpacity}]}
          />
        </View>

        {/* Bottom bulb container */}
        <View style={styles.bottomBulb}>
          {/* Bottom sand */}
          <Animated.View
            style={[
              styles.bottomSand,
              {
                height: bottomSandHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 50],
                }),
              },
            ]}
          />

          {/* Glass highlight */}
          <View style={[styles.glassHighlight, styles.bottomHighlight]} />
        </View>

        {/* Bottom cap */}
        <View style={styles.bottomCap} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  timerContainer: {
    width: 70,
    height: 140,
    alignItems: 'center',
  },
  topCap: {
    width: 70,
    height: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 2,
  },
  bottomCap: {
    width: 70,
    height: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
    marginTop: 2,
  },
  topBulb: {
    width: 60,
    height: 55,
    backgroundColor: 'rgba(230, 245, 255, 0.15)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  bottomBulb: {
    width: 60,
    height: 55,
    backgroundColor: 'rgba(230, 245, 255, 0.15)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  neck: {
    width: 16,
    height: 8,
    backgroundColor: 'rgba(230, 245, 255, 0.15)',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSand: {
    width: 50,
    backgroundColor: '#E8C547',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    position: 'absolute',
    bottom: 0,
    shadowColor: '#B8941F',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  bottomSand: {
    width: 50,
    backgroundColor: '#E8C547',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    position: 'absolute',
    bottom: 0,
    shadowColor: '#B8941F',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  sandStream: {
    width: 2,
    height: 6,
    backgroundColor: '#E8C547',
    borderRadius: 1,
  },
  glassHighlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
  },
  topHighlight: {
    width: 6,
    height: 25,
    top: 8,
    left: 12,
    transform: [{rotate: '20deg'}],
  },
  bottomHighlight: {
    width: 6,
    height: 25,
    top: 8,
    left: 12,
    transform: [{rotate: '20deg'}],
  },
});
export default Loader;
