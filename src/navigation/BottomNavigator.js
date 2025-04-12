// import React, {useRef, useState, useEffect} from 'react';
// import {Animated, ScrollView, Dimensions} from 'react-native';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import CustomTabBar from './CustomTabBar';
// import {ROUTES} from '../constants/routes';
// import HomeScreen from '../screens/HomeScreen';
// import ProductsScreen from '../screens/ProductsScreen';
// import OrderHistory from '../screens/OrderHistory';
// import OrderTrackingScreen from '../screens/OrderTrackingScreen';
// import {Cart, ItemScreen, Profile, Search} from '../screens';

// import ProductDetail from '../screens/ProductDetails/ProductDetail';

// const Tab = createBottomTabNavigator();

// const BottomNavigator = () => {
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const lastScrollY = useRef(0);
//   const tabBarHeight = 70; // Adjust based on your tab bar height
//   const tabBarOffset = useRef(new Animated.Value(0)).current;
//   const isScrolling = useRef(false);
//   const scrollTimeout = useRef(null);
//   const [isTabBarVisible, setIsTabBarVisible] = useState(true);

//   // Function to handle scroll events
//   const handleScroll = Animated.event(
//     [{nativeEvent: {contentOffset: {y: scrollY}}}],
//     {
//       useNativeDriver: false,
//       listener: event => {
//         const currentScrollY = event.nativeEvent.contentOffset.y;

//         // Clear previous timeout
//         if (scrollTimeout.current) {
//           clearTimeout(scrollTimeout.current);
//         }
//         console.log('*******');

//         // Set scrolling flag
//         isScrolling.current = true;

//         // Only process significant scroll differences to avoid jitter
//         if (Math.abs(currentScrollY - lastScrollY.current) > 2) {
//           // Determine scroll direction
//           const isScrollingDown = currentScrollY > lastScrollY.current;

//           // If scrolling down and beyond threshold, hide the tab bar
//           if (isScrollingDown && currentScrollY > 20) {
//             if (isTabBarVisible) {
//               setIsTabBarVisible(false);
//               Animated.spring(tabBarOffset, {
//                 toValue: tabBarHeight,
//                 useNativeDriver: true,
//                 friction: 8,
//               }).start();
//             }
//           }
//           // If scrolling up, show the tab bar
//           else if (!isScrollingDown) {
//             if (!isTabBarVisible) {
//               setIsTabBarVisible(true);
//               Animated.spring(tabBarOffset, {
//                 toValue: 0,
//                 useNativeDriver: true,
//                 friction: 8,
//               }).start();
//             }
//           }

//           // Update last scroll position
//           lastScrollY.current = currentScrollY;
//         }
//         scrollTimeout.current = setTimeout(() => {
//           isScrolling.current = false;
//         }, 150);
//       },
//     },
//   );
//   useEffect(() => {
//     return () => {
//       if (scrollTimeout.current) {
//         clearTimeout(scrollTimeout.current);
//       }
//     };
//   }, []);

//   const wrapScreen = ScreenComponent => {
//     return props => {
//       const routeName = props.route.name;

//       // Directly return the screen without scroll handling if it's PRODUCT_DETAILS
//       if (routeName === ROUTES.PRODUCT_DETAILS || ROUTES.SEARCH) {
//         // Also hide the tab bar permanently
//         useEffect(() => {
//           Animated.timing(tabBarOffset, {
//             toValue: tabBarHeight,
//             useNativeDriver: true,
//             duration: 200,
//           }).start();
//         }, []);

//         return (
//           <ScrollView
//             style={{backgroundColor: '#F4F9FF'}}
//             {...props}
//             scrollEnabled={false} // disable scroll handling
//             contentContainerStyle={{paddingBottom: 0}}
//             overScrollMode="never"
//             bounces={false}
//             showsVerticalScrollIndicator={false}>
//             <ScreenComponent {...props} />
//           </ScrollView>
//         );
//       }

//       return (
//         <ScrollView
//           style={{backgroundColor: '#F4F9FF'}}
//           {...props}
//           scrollEventThrottle={16}
//           onScroll={handleScroll}
//           contentContainerStyle={{paddingBottom: tabBarHeight + 10}}
//           overScrollMode="never"
//           bounces={false}
//           showsVerticalScrollIndicator={false}>
//           <ScreenComponent {...props} />
//         </ScrollView>
//       );
//     };
//   };

//   return (
//     <Tab.Navigator
//       tabBar={props => <CustomTabBar {...props} translateY={tabBarOffset} />}
//       screenOptions={{headerShown: false}}>
//       <Tab.Screen name="Home">
//         {props => wrapScreen(HomeScreen)(props)}
//       </Tab.Screen>
//       <Tab.Screen name="products">
//         {props => wrapScreen(ProductsScreen)(props)}
//       </Tab.Screen>
//       <Tab.Screen name={ROUTES.CART}>
//         {props => wrapScreen(Cart)(props)}
//       </Tab.Screen>
//       <Tab.Screen name={ROUTES.TRACKING}>
//         {props => wrapScreen(OrderTrackingScreen)(props)}
//       </Tab.Screen>
//       <Tab.Screen name={ROUTES.HISTORY}>
//         {props => wrapScreen(OrderHistory)(props)}
//       </Tab.Screen>
//       <Tab.Screen name={ROUTES.PROFILE}>
//         {props => wrapScreen(Profile)(props)}
//       </Tab.Screen>
//       <Tab.Screen name={ROUTES.PRODUCT_DETAILS}>
//         {props => wrapScreen(ProductDetail)(props)}
//       </Tab.Screen>
//       <Tab.Screen name={ROUTES.ITEM_SCREEN}>
//         {props => wrapScreen(ItemScreen)(props)}
//       </Tab.Screen>
//       <Tab.Screen name={ROUTES.SEARCH}>
//         {props => wrapScreen(Search)(props)}
//       </Tab.Screen>
//     </Tab.Navigator>
//   );
// };

// export default BottomNavigator;
import React, {useRef, useState, useEffect} from 'react';
import {Animated, ScrollView} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';
import {ROUTES} from '../constants/routes';

import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import OrderHistory from '../screens/OrderHistory';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import ProductDetail from '../screens/ProductDetails/ProductDetail';

import {Cart, ItemScreen, Profile, Search} from '../screens';

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

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  const wrapScreen = ScreenComponent => {
    return props => {
      const routeName = props.route.name;

      // Hide tab bar permanently on Product Details
      if (routeName === ROUTES.PRODUCT_DETAILS) {
        useEffect(() => {
          Animated.timing(tabBarOffset, {
            toValue: tabBarHeight,
            useNativeDriver: true,
            duration: 200,
          }).start();
        }, []);

        return <ScreenComponent {...props} />;
      }

      // If it's the SEARCH screen, do not use ScrollView for handling scroll
      if (routeName === ROUTES.SEARCH || routeName === 'products') {
        return <ScreenComponent {...props} />;
      }

      // For other screens, pass scroll handler to the screen
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
      <Tab.Screen name="Home">
        {props => wrapScreen(HomeScreen)(props)}
      </Tab.Screen>
      <Tab.Screen name="products">
        {props => wrapScreen(ProductsScreen)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.CART}>
        {props => wrapScreen(Cart)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.TRACKING}>
        {props => wrapScreen(OrderTrackingScreen)(props)}
      </Tab.Screen>
      <Tab.Screen name={ROUTES.HISTORY}>
        {props => wrapScreen(OrderHistory)(props)}
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
