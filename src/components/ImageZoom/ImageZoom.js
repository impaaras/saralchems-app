import React, {useRef} from 'react';
import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const ZoomableImage = ({
  uri,
  style,
  maxZoom = 5,
  minZoom = 1,
  resizeMode = 'contain',
  onZoomStart,
  onZoomEnd,
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const lastTapTimestamp = useRef(0);

  // Calculate container dimensions from style or defaults
  const imageStyle = StyleSheet.flatten([styles.image, style]);
  const containerWidth = imageStyle.width || SCREEN_WIDTH;
  const containerHeight = imageStyle.height || SCREEN_HEIGHT / 3;

  // Double tap gesture
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value !== 1) {
        // Reset to original size if already zoomed
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        // Zoom to 2x when double-tapped at original size
        scale.value = withTiming(2);
        savedScale.value = 2;
      }
    });

  // Pan gesture
  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (onZoomStart && scale.value > 1) runOnJS(onZoomStart)();
    })
    .onUpdate(event => {
      if (scale.value <= 1) return;

      // Calculate boundaries based on current scale
      const maxTranslateX = (containerWidth * (scale.value - 1)) / 2;
      const maxTranslateY = (containerHeight * (scale.value - 1)) / 2;

      // Update translation values with boundaries
      translateX.value = Math.min(
        maxTranslateX,
        Math.max(-maxTranslateX, savedTranslateX.value + event.translationX),
      );
      translateY.value = Math.min(
        maxTranslateY,
        Math.max(-maxTranslateY, savedTranslateY.value + event.translationY),
      );
    })
    .onEnd(() => {
      if (onZoomEnd && scale.value > 1) runOnJS(onZoomEnd)();
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      if (onZoomStart) runOnJS(onZoomStart)();
    })
    .onUpdate(event => {
      // Calculate new scale with boundaries
      const newScale = Math.min(
        maxZoom,
        Math.max(minZoom, savedScale.value * event.scale),
      );
      scale.value = newScale;

      // Adjust translation boundaries based on new scale
      if (newScale <= 1) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      }
    })
    .onEnd(() => {
      if (onZoomEnd) runOnJS(onZoomEnd)();
      savedScale.value = scale.value;

      // Reset position if scale is at or below minimum
      if (scale.value <= 1) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  // Combine gestures
  const combinedGestures = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture,
  );

  // Animated styles
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
    };
  });

  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        {width: containerWidth, height: containerHeight},
      ]}>
      <GestureDetector gesture={combinedGestures}>
        <Animated.Image
          source={{uri}}
          style={[styles.image, style, animatedImageStyle]}
          resizeMode={resizeMode}
          {...(Platform.OS === 'web' ? {loading: 'lazy'} : {})}
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ZoomableImage;
