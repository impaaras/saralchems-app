import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import styles from './Carousel.styles';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width * 0.95; // 95% of screen width
const SPACING = 15; // Left margin

const Carousel = ({images}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const renderDots = () => {
    return (
      <View style={styles.dotContainer}>
        {images.map((_, index) => {
          const inputRange = [
            (index - 1) * (ITEM_WIDTH + SPACING),
            index * (ITEM_WIDTH + SPACING),
            (index + 1) * (ITEM_WIDTH + SPACING),
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={index}
              style={[styles.dot, {opacity, transform: [{scale}]}]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled={false} // Disabled to allow partial scrolling
        snapToInterval={ITEM_WIDTH + SPACING} // Snap to each item
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}>
        {images.map((image, index) => (
          <View
            key={index}
            style={[
              styles.imageContainer,
              {marginLeft: index === 0 ? SPACING : 0},
            ]}>
            <Image
              source={{uri: image}}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      {renderDots()}
    </View>
  );
};

export default Carousel;
