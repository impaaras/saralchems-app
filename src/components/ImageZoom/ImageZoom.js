import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Animated,
  PanResponder,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {closeModal} from '../../redux/slices/modalSlice';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const ImageZoomModal = ({visible, imageList, currentIndex, onClose}) => {
  const dispatch = useDispatch();
  const [currentScale, setCurrentScale] = useState(1);
  const lastTapRef = useRef(0);
  const lastDistance = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  const handleNext = () => {
    if (currentImageIndex === imageList.length - 1) {
      setCurrentImageIndex(0);
    }
    if (currentImageIndex < imageList.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentImageIndex === 0) {
      setCurrentImageIndex(imageList.length - 1);
    }
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const lastScale = useRef(1);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  // Update state whenever scale changes
  useEffect(() => {
    scale.addListener(({value}) => {
      setCurrentScale(value);
    });
    return () => {
      scale.removeAllListeners();
    };
  }, [scale]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: evt => {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
          handleDoubleTap(evt.nativeEvent);
        }
        lastTapRef.current = now;
      },

      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length === 2) {
          const [touch1, touch2] = touches;
          const dx = touch2.pageX - touch1.pageX;
          const dy = touch2.pageY - touch1.pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (!lastDistance.current) {
            lastDistance.current = distance;
          } else {
            const scaleChange = distance / lastDistance.current;
            const newScale = Math.max(
              1,
              Math.min(lastScale.current * scaleChange, 4),
            );
            scale.setValue(newScale);
          }
        } else if (touches.length === 1 && lastScale.current > 1) {
          translateX.setValue(lastTranslateX.current + gestureState.dx);
          translateY.setValue(lastTranslateY.current + gestureState.dy);
        }
      },

      onPanResponderRelease: () => {
        scale.stopAnimation(val => {
          lastScale.current = val;
        });
        translateX.stopAnimation(val => {
          lastTranslateX.current = val;
        });
        translateY.stopAnimation(val => {
          lastTranslateY.current = val;
        });
        lastDistance.current = null;
      },
    }),
  ).current;

  const handleDoubleTap = touch => {
    const x = touch.pageX;
    const y = touch.pageY;

    const newScale = lastScale.current > 1 ? 1 : 2.5;
    const offsetX = (x - screenWidth / 2) * (newScale - 1);
    const offsetY = (y - screenHeight / 2) * (newScale - 1);

    Animated.parallel([
      Animated.timing(scale, {
        toValue: newScale,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: newScale === 1 ? 0 : -offsetX,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: newScale === 1 ? 0 : -offsetY,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      lastScale.current = newScale;
      lastTranslateX.current = newScale === 1 ? 0 : -offsetX;
      lastTranslateY.current = newScale === 1 ? 0 : -offsetY;
    });
  };

  const handleZoomIn = () => {
    let newScale = Math.min(lastScale.current + 0.5, 4);
    Animated.timing(scale, {
      toValue: newScale,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      lastScale.current = newScale;
    });
  };

  const handleZoomOut = () => {
    let newScale = Math.max(lastScale.current - 0.5, 1);
    Animated.timing(scale, {
      toValue: newScale,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      lastScale.current = newScale;
      if (newScale === 1) {
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          lastTranslateX.current = 0;
          lastTranslateY.current = 0;
        });
      }
    });
  };

  const handleReset = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      lastScale.current = 1;
      lastTranslateX.current = 0;
      lastTranslateY.current = 0;
    });
  };

  const handleClose = () => {
    dispatch(
      closeModal({
        modalType: 'ImageZoomModal',
      }),
    );
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={handleZoomOut}
            disabled={currentScale <= 1}>
            <Icon
              name="zoom-out"
              size={20}
              color={currentScale <= 1 ? '#666' : '#FFF'}
            />
          </TouchableOpacity>
          <Text style={styles.zoomText}>{Math.round(currentScale * 100)}%</Text>
          <TouchableOpacity
            style={styles.zoomButton}
            onPress={handleZoomIn}
            disabled={currentScale >= 4}>
            <Icon
              name="zoom-in"
              size={20}
              color={currentScale >= 4 ? '#666' : '#FFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Icon name="refresh" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        {imageList.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.navSideButton, styles.leftNav]}
              onPress={handlePrev}>
              <Icon name="keyboard-arrow-left" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navSideButton, styles.rightNav]}
              onPress={handleNext}>
              <Icon name="keyboard-arrow-right" size={22} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.imageContainer} {...panResponder.panHandlers}>
        <Animated.Image
          // source={{uri: imageUri}}
          source={{
            uri: `https://api.saraldyechems.com/upload/image/${imageList[currentImageIndex]}`,
          }}
          style={[
            styles.image,
            {
              transform: [{scale}, {translateX}, {translateY}],
            },
          ]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    marginTop: 120,
    padding: 8,
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginTop: 120,
    paddingVertical: 8,
  },
  zoomButton: {
    padding: 5,
    marginHorizontal: 5,
  },
  resetButton: {
    padding: 5,
    marginLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#666',
    paddingLeft: 15,
  },
  zoomText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 10,
    minWidth: 40,
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth - 40,
    height: screenHeight - 200,
    maxWidth: screenWidth - 40,
    maxHeight: screenHeight - 200,
  },
  navSideButton: {
    position: 'absolute',
    top: -50,
    transform: [{translateY: -25}],
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    zIndex: 999,
  },
  leftNav: {
    left: -10,
  },
  rightNav: {
    right: -10,
  },
  navButtonText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default ImageZoomModal;
