// ShimmerCard.js
import React, {useRef, useEffect} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Helper functions for responsive design
const wp = percentage => {
  return (percentage * screenWidth) / 100;
};

const hp = percentage => {
  return (percentage * screenHeight) / 100;
};

// Get card width based on screen size
const getCardWidth = () => {
  if (screenWidth < 350) return '48%';
  if (screenWidth < 500) return '32%';
  if (screenWidth < 768) return '31%';
  return '24%';
};

// Get image height based on screen size
const getImageHeight = () => {
  if (screenWidth < 350) return hp(12);
  if (screenWidth < 400) return hp(13);
  if (screenWidth < 500) return hp(14);
  return hp(15);
};

const ProductListShimmer = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    startShimmer();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={shimmerStyles.card}>
      {/* Image Container */}
      <View style={shimmerStyles.imageContainer}>
        <Animated.View style={[shimmerStyles.shimmerImage, {opacity}]} />
      </View>
    </View>
  );
};

const shimmerStyles = StyleSheet.create({
  card: {
    width: getCardWidth(),
    borderRadius: wp(2.5),
    padding: wp(1),
    marginBottom: hp(0.6),
    flexDirection: 'column',
    marginHorizontal: wp(0.5),
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: getImageHeight(),
    borderRadius: wp(2),
  },

  shimmerImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2),
    backgroundColor: '#E1E9EE',
  },

  shimmerAddButton: {
    position: 'absolute',
    right: wp(0.8),
    bottom: hp(-1.2),
    backgroundColor: '#E1E9EE',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(1.5),
    width: wp(12),
    height: hp(2.5),
  },

  infoContainer: {
    flex: 1,
    marginTop: hp(1),
  },

  variantsContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: hp(1),
    alignItems: 'center',
  },

  shimmerVariant: {
    backgroundColor: '#E1E9EE',
    borderRadius: wp(1),
    paddingVertical: hp(0.3),
    paddingHorizontal: wp(2),
    marginRight: wp(0.8),
    width: wp(18),
    height: hp(2.2),
  },

  shimmerMoreButton: {
    backgroundColor: '#E1E9EE',
    borderRadius: wp(0.8),
    width: wp(6),
    height: wp(6),
    marginLeft: wp(1),
  },

  shimmerName: {
    backgroundColor: '#E1E9EE',
    borderRadius: wp(0.5),
    height: hp(1.8),
    width: '85%',
    marginVertical: hp(0.5),
  },

  shimmerNameSecond: {
    backgroundColor: '#E1E9EE',
    borderRadius: wp(0.5),
    height: hp(1.8),
    width: '60%',
    marginBottom: hp(0.5),
  },

  brandInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(0.3),
  },

  shimmerBrand: {
    backgroundColor: '#E1E9EE',
    borderRadius: wp(0.5),
    height: hp(1.5),
    width: '50%',
  },

  shimmerUnit: {
    backgroundColor: '#E1E9EE',
    borderRadius: wp(0.5),
    height: hp(1.5),
    width: '25%',
  },
});

export default ProductListShimmer;
