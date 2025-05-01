import {StyleSheet, Text, TouchableOpacity, View, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {ChevronRight, Rotate3D} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/routes';
import {useDispatch} from 'react-redux';
import {closeModal} from '../../redux/slices/modalSlice';

const ViewCart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const translateY = useRef(new Animated.Value(100)).current; // Start from below screen

  function handleCartOption() {
    dispatch(closeModal());
    navigation.navigate(ROUTES.CART);
  }

  useEffect(() => {
    // Slide up animation
    Animated.timing(translateY, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      dispatch(closeModal());
    }, 5000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [dispatch, translateY]);

  return (
    <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
      <View style={styles.iconContainer}>
        <Rotate3D size={30} />
      </View>
      <View>
        <Text style={styles.title}>View Cart</Text>
        <Text style={styles.subtitle}>1 Item</Text>
      </View>
      <TouchableOpacity
        onPress={handleCartOption}
        style={styles.arrowContainer}>
        <ChevronRight size={30} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ViewCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 30,
    padding: 5,
    backgroundColor: '#3C5D87',
    left: 0,
    right: 0,
  },
  iconContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginRight: 10,
  },
  arrowContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  title: {
    color: 'white',
    fontWeight: '600',
    fontSize: 17,
  },
  subtitle: {
    color: 'white',
    fontWeight: '500',
  },
});
