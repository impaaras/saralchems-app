import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {scale, verticalScale, moderateScale} from './responsive';

const ShimmerItem = ({width, height, style}) => {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, {
        duration: 1500, // Increased duration for slower animation
        easing: Easing.linear,
      }),
      -1,
    );
  }, [width, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: '#f1f1f1', // Lighter base color
          overflow: 'hidden',
          borderRadius: moderateScale(5),
        },
        style,
      ]}>
      <Animated.View
        style={[
          {
            height: '100%',
            width: '100%',
            backgroundColor: '#fafafa', // Lighter shimmer color
            opacity: 0.7, // Reduced opacity for lighter effect
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const CartShimmer = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((_, index) => (
        <View key={index} style={styles.cartItemShimmer}>
          {/* Image Shimmer */}
          <ShimmerItem
            width={scale(80)}
            height={scale(80)}
            style={styles.imageShimmer}
          />
          <View style={styles.detailsContainer}>
            {/* First Line (Name + Delete) */}
            <View style={styles.firstLineShimmer}>
              <ShimmerItem
                width={scale(200)}
                height={verticalScale(20)}
                style={{flex: 1}}
              />
              <ShimmerItem
                width={scale(22)}
                height={verticalScale(22)}
                style={{marginLeft: scale(10)}}
              />
            </View>
            <ShimmerItem
              width={scale(200)}
              height={verticalScale(15)}
              style={styles.variantShimmer}
            />
            <View style={styles.quantityContainer}>
              <ShimmerItem
                width={scale(100)}
                height={verticalScale(15)}
                style={styles.quantityTextShimmer}
              />
              <View style={styles.quantityControlsShimmer}>
                <ShimmerItem
                  width={scale(30)}
                  height={verticalScale(30)}
                  style={styles.quantityBtnShimmer}
                />
                <View style={{width: scale(15)}} />
                <ShimmerItem
                  width={scale(30)}
                  height={verticalScale(30)}
                  style={styles.quantityBtnShimmer}
                />
              </View>
            </View>
          </View>
        </View>
      ))}

      {/* Buttons Shimmer */}
      <View style={styles.buttonsContainer}>
        <ShimmerItem
          width={scale(100)}
          height={verticalScale(40)}
          style={styles.addButtonShimmer}
        />
        <ShimmerItem
          width={scale(180)}
          height={verticalScale(40)}
          style={styles.quoteButtonShimmer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: verticalScale(-80),
    backgroundColor: '#FFF',
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(10),
    borderRadius: scale(20),
  },
  cartItemShimmer: {
    flexDirection: 'row',
    marginBottom: verticalScale(10),
    // backgroundColor: '#FFF',

    borderRadius: scale(10),
    padding: scale(10),
    borderWidth: 1,
    borderColor: '#f5f5f5', // Lighter border color
  },
  imageShimmer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(5),
  },
  detailsContainer: {
    flex: 1,
    marginLeft: scale(10),
  },
  firstLineShimmer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(5),
    alignItems: 'center',
  },
  variantShimmer: {
    height: verticalScale(15),
    width: '70%',
    marginBottom: verticalScale(0),
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityTextShimmer: {
    height: verticalScale(19),
    width: '40%',
  },
  quantityControlsShimmer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(8),
  },
  addButtonShimmer: {
    borderWidth: 1,
    borderColor: '#f5f5f5',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(15),
    borderRadius: scale(20),
    width: '30%',
  },
  quoteButtonShimmer: {
    width: '60%',
    borderRadius: scale(25),
    paddingVertical: verticalScale(12),
  },
  quantityBtnShimmer: {
    borderWidth: 1,
    borderColor: '#f5f5f5',
    borderRadius: scale(5),
  },
});

export default CartShimmer;
