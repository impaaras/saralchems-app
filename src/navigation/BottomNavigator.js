import React, {useRef, useState, useEffect} from 'react';
import {Animated, ScrollView} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import {ROUTES} from '../constants/routes';
import HomeScreen from '../screens/Homescreen/HomeScreen';
import ProductsScreen from '../screens/Product/ProductsScreen';
import OrderHistory from '../screens/History/OrderHistory';
import OrderTrackingScreen from '../screens/Tracking/OrderTrackingScreen';
import ProductDetail from '../screens/ProductDetails/ProductDetail';
import {Cart, ItemScreen, Profile, Search, AccountLedger} from '../screens';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const tabBarHeight = 70;
  const tabBarOffset = useRef(new Animated.Value(0)).current;
  const isScrolling = useRef(false);
  const scrollTimeout = useRef(null);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: false,
      listener: event => {
        const currentScrollY = event.nativeEvent.contentOffset.y;

        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }

        isScrolling.current = true;

        if (Math.abs(currentScrollY - lastScrollY.current) > 2) {
          const isScrollingDown = currentScrollY > lastScrollY.current;

          if (isScrollingDown && currentScrollY > 20) {
            if (isTabBarVisible) {
              setIsTabBarVisible(false);
              Animated.spring(tabBarOffset, {
                toValue: tabBarHeight,
                useNativeDriver: true,
                friction: 8,
              }).start();
            }
          } else if (!isScrollingDown) {
            if (!isTabBarVisible) {
              setIsTabBarVisible(true);
              Animated.spring(tabBarOffset, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
              }).start();
            }
          }

          lastScrollY.current = currentScrollY;
        }

        scrollTimeout.current = setTimeout(() => {
          isScrolling.current = false;
        }, 150);
      },
    },
  );

  const wrapScreen = ScreenComponent => {
    return props => {
      const routeName = props.route.name;
      if (
        routeName === ROUTES.SEARCH ||
        routeName === 'products' ||
        routeName === ROUTES.HISTORY ||
        routeName === ROUTES.CART ||
        routeName === 'Home'
      ) {
        return <ScreenComponent {...props} />;
      }
      return (
        <ScrollView
          style={{backgroundColor: '#F4F9FF'}}
          {...props}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          contentContainerStyle={{paddingBottom: tabBarHeight + 10}}
          overScrollMode="never"
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <ScreenComponent {...props} />
        </ScrollView>
      );
    };
  };

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} translateY={tabBarOffset} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name={ROUTES.HOME}>
        {props => wrapScreen(HomeScreen)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.PRODUCT_SCREEN}>
        {props => wrapScreen(ProductsScreen)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.CART}>
        {props => wrapScreen(Cart)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.HISTORY}>
        {props => wrapScreen(OrderHistory)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.TRACKING}>
        {props => wrapScreen(OrderTrackingScreen)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.LEDGER}>
        {props => wrapScreen(AccountLedger)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.PROFILE}>
        {props => wrapScreen(Profile)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.PRODUCT_DETAILS}>
        {props => wrapScreen(ProductDetail)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.ITEM_SCREEN}>
        {props => wrapScreen(ItemScreen)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.SEARCH}>
        {props => wrapScreen(Search)(props)}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomNavigator;
