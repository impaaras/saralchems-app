import React, {useRef, useEffect} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const wp = percentage => (percentage * screenWidth) / 100;
const hp = percentage => (percentage * screenHeight) / 100;

const OrderCardShimmer = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, []);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      {/* Order header */}
      <View style={styles.header}>
        <Animated.View style={[styles.headerText, {opacity}]} />
        <Animated.View style={[styles.dateText, {opacity}]} />
      </View>

      {/* Status Dot and Quote Sent */}
      <View style={styles.statusRow}>
        <Animated.View style={[styles.statusDot, {opacity}]} />
        <Animated.View style={[styles.statusText, {opacity}]} />
      </View>

      {/* Product card */}
      <View style={styles.productRow}>
        <Animated.View style={[styles.image, {opacity}]} />
        <View style={styles.productDetails}>
          <Animated.View style={[styles.productName, {opacity}]} />
          <Animated.View style={[styles.variant, {opacity}]} />
          <Animated.View style={[styles.quantity, {opacity}]} />
        </View>
        <Animated.View style={[styles.plusBadge, {opacity}]} />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Animated.View style={[styles.confirmButton, {opacity}]} />
        <Animated.View style={[styles.reworkButton, {opacity}]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: wp(3),
    padding: wp(4),
    marginVertical: hp(1),
    // marginHorizontal: wp(3),
    elevation: 10,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  headerText: {
    backgroundColor: '#E1E9EE',
    width: wp(40),
    height: hp(2),
    borderRadius: wp(1),
  },
  dateText: {
    backgroundColor: '#E1E9EE',
    width: wp(30),
    height: hp(2),
    borderRadius: wp(1),
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  statusDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#E1E9EE',
    marginRight: wp(2),
  },
  statusText: {
    width: wp(30),
    height: hp(2),
    backgroundColor: '#E1E9EE',
    borderRadius: wp(1),
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
    backgroundColor: '#F9F9F9',
    borderRadius: wp(2),
  },
  image: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(2),
    backgroundColor: '#E1E9EE',
  },
  productDetails: {
    flex: 1,
    marginLeft: wp(4),
  },
  productName: {
    width: wp(40),
    height: hp(2),
    backgroundColor: '#E1E9EE',
    borderRadius: wp(1),
    marginBottom: hp(0.5),
  },
  variant: {
    width: wp(25),
    height: hp(1.8),
    backgroundColor: '#E1E9EE',
    borderRadius: wp(1),
    marginBottom: hp(0.5),
  },
  quantity: {
    width: wp(20),
    height: hp(1.8),
    backgroundColor: '#E1E9EE',
    borderRadius: wp(1),
  },
  plusBadge: {
    backgroundColor: '#E1E9EE',
    borderRadius: wp(4),
    width: wp(8),
    height: wp(8),
    marginLeft: wp(2),
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: hp(1.2),
  },
  arrow: {
    width: wp(6),
    height: wp(1),
    borderRadius: wp(1),
    backgroundColor: '#E1E9EE',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1.5),
  },
  confirmButton: {
    backgroundColor: '#E1E9EE',
    width: wp(35),
    height: hp(4.5),
    borderRadius: wp(10),
  },
  reworkButton: {
    backgroundColor: '#E1E9EE',
    width: wp(35),
    height: hp(4.5),
    borderRadius: wp(10),
  },
});

export default OrderCardShimmer;
