import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {PackageCheck} from 'lucide-react-native';
import {ROUTES} from '../constants/routes';
import {useSelector} from 'react-redux';
import CustomText from '../CustomText';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../utils/Responsive/responsive';
import {triggerHaptic} from '../utils/function/function';

const windowWidth = Dimensions.get('window').width;

const CustomTabBar = ({state, descriptors, navigation, translateY}) => {
  const [index, setIndex] = useState(state.index);
  const {items} = useSelector(state => state.addToCart);

  useEffect(() => {
    setIndex(state.index);
  }, [state.index]);

  const handleNavigateScreen = index => {
    setIndex(index);
    const screens = [
      ROUTES.HOME,
      ROUTES.PRODUCT_SCREEN,
      ROUTES.CART,
      ROUTES.HISTORY,
    ];

    navigation.navigate(screens[index]);
  };

  const TabButton = ({iconComponent, label, isActive, onPress}) => {
    const ButtonContent = () => (
      <View style={styles.tabContent}>
        {label === 'Cart' && items?.length > 0 && (
          <View
            style={[
              styles.cartBadge,
              {
                backgroundColor: isActive ? 'white' : '#2D4565',
              },
            ]}>
            <Text
              style={{
                fontSize: scale(10),
                color: isActive ? '#1B2B48' : 'white',
              }}>
              {items.length}
            </Text>
          </View>
        )}
        {iconComponent}

        <Text style={isActive ? styles.tabLabel : styles.inactiveTabLabel}>
          {label}
        </Text>
      </View>
    );

    return isActive ? (
      <LinearGradient
        colors={['#2D4565', '#2D4565', '#1B2B48', '#1B2B48']}
        start={{x: 0, y: 0}} // Top
        end={{x: 0, y: 1}} // Bottom
        style={styles.activeTabButton}>
        <ButtonContent />
      </LinearGradient>
    ) : (
      <TouchableOpacity style={styles.inactiveTabButton} onPress={onPress}>
        <ButtonContent />
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY}],
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
      ]}>
      <View style={styles.tabBar}>
        <TabButton
          iconComponent={
            <Home
              name="home"
              size={scale(20)}
              color={index === 0 ? '#FFF' : '#5A5A5A'}
            />
          }
          label="Home"
          isActive={index === 0}
          onPress={() => handleNavigateScreen(0)}
        />
        <TabButton
          iconComponent={
            <Ionicons
              name="view-dashboard"
              size={scale(20)}
              color={index === 1 ? '#FFF' : '#5A5A5A'}
            />
          }
          label="Products"
          isActive={index === 1}
          onPress={() => handleNavigateScreen(1)}
        />
        <TabButton
          iconComponent={
            <FontAwesome
              name="cart-plus"
              size={scale(20)}
              color={index === 2 ? '#FFF' : '#5A5A5A'}
            />
          }
          label="Cart"
          isActive={index === 2}
          onPress={() => handleNavigateScreen(2)}
        />
        <TabButton
          iconComponent={
            <PackageCheck
              color={index === 3 ? '#FFF' : '#5A5A5A'}
              size={scale(20)}
            />
          }
          label="Order History"
          isActive={index === 3}
          onPress={() => handleNavigateScreen(3)}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3C5C85',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 35,
    paddingVertical: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginTop: scale(-18),
    marginHorizontal: scale(10),
    borderRadius: scale(35),
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9DFE7',
    height: scale(50),
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  activeTabButton: {
    flex: 1,
    height: scale(47),
    borderRadius: scale(100),
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: scale(70),
  },
  inactiveTabButton: {
    flex: 1,
    height: 52,
    borderRadius: 25,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: scale(70),
  },
  tabContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
    // paddingVertical: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: scale(-10),
    borderRadius: scale(40),
    paddingHorizontal: 5,
    zIndex: 9999,
  },
  tabLabel: {
    fontSize: scale(11),
    color: '#FFF',
    fontWeight: '700',
    fontFamily: 'Poppins-Medium', // Use your Poppins font
  },
  inactiveTabLabel: {
    fontSize: scale(11),
    color: '#5A5A5A',
    fontWeight: '600',
  },
});

export default CustomTabBar;
