// import React, {useCallback, useEffect, useRef} from 'react';
// import {
//   Text,
//   View,
//   SafeAreaView,
//   ScrollView,
//   Animated,
//   Easing,
// } from 'react-native';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import DashboardHeader from '../../components/Header/DashBoardHeader';
// import {useDispatch, useSelector} from 'react-redux';
// import styles from './Cart.styles';
// import {StorageKeys, storage} from '../../utils/storage';
// import EmptyCartScreen from './EmptyCart';
// import {useAlert} from '../../context/CustomAlertContext';
// import {useLoader} from '../../context/LoaderContext';
// import CartItem from './CartItem';
// import AnimatedTouchable from './AnimateTouchable';
// import {
//   scale,
//   moderateScale,
//   verticalScale,
// } from '../../utils/Responsive/responsive';
// import {getCart} from '../../redux/slices/addToCartSlice';

// const Cart = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const {items, loading} = useSelector(state => state.addToCart);
//   const {setLoading} = useLoader();
//   const {showAlert} = useAlert();
//   // Animation values
//   const containerFadeAnim = useRef(new Animated.Value(0)).current;
//   const buttonSlideAnim = useRef(new Animated.Value(50)).current;
//   const buttonFadeAnim = useRef(new Animated.Value(0)).current;

//   const fetchCartData = useCallback(async () => {
//     setLoading(true);
//     try {
//       await dispatch(getCart()).unwrap();
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       fetchCartData();
//     }, [fetchCartData]),
//   );
//   // Add useEffect to handle cart items changes
//   useEffect(() => {
//     if (!loading) {
//       // Trigger animations when items change
//       Animated.parallel([
//         Animated.timing(containerFadeAnim, {
//           toValue: 1,
//           duration: 400,
//           easing: Easing.out(Easing.quad),
//           useNativeDriver: true,
//         }),
//         Animated.sequence([
//           Animated.delay(200),
//           Animated.parallel([
//             Animated.spring(buttonSlideAnim, {
//               toValue: 0,
//               useNativeDriver: true,
//               tension: 60,
//               friction: 8,
//             }),
//             Animated.timing(buttonFadeAnim, {
//               toValue: 1,
//               duration: 500,
//               easing: Easing.out(Easing.quad),
//               useNativeDriver: true,
//             }),
//           ]),
//         ]),
//       ]).start();
//     }
//   }, [items, loading]);

//   const requestForQuote = async quoteData => {
//     const token = storage.getString(StorageKeys.AUTH_TOKEN);
//     showAlert({
//       title: 'Are you sure?',
//       message: 'Do you want to send this quote?',
//       onConfirm: async () => {
//         setLoading(true);
//         try {
//           const response = await fetch(
//             'https://api.saraldyechems.com/order/send-quote',
//             {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//               },
//             },
//           );

//           await dispatch(getCart()).unwrap();
//           const result = await response.json();

//           if (response.ok) {
//             setLoading(false);
//           } else {
//             showAlert({
//               title: 'Error',
//               message: result?.message || 'Something went wrong.',
//               acceptText: 'OK',
//             });
//           }
//         } catch (error) {
//           showAlert({
//             title: 'Error',
//             message: error.message,
//             acceptText: 'OK',
//           });
//         } finally {
//           setLoading(false);
//         }
//       },
//       acceptText: 'Yes',
//       rejectText: 'Cancel',
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <DashboardHeader />
//       <Animated.View style={[{flex: 1}, {opacity: containerFadeAnim}]}>
//         <ScrollView
//           style={styles.cartContent}
//           showsVerticalScrollIndicator={false}>
//           <View style={styles.cartItemsContainer}>
//             {items && items?.length > 0 ? (
//               items?.map((item, index) => (
//                 <CartItem
//                   key={item._id}
//                   id={item.productId._id}
//                   name={item.productId.name}
//                   image={
//                     Array.isArray(item.productId.image)
//                       ? item.productId.image
//                       : [item.productId.image || null]
//                   }
//                   variant={item.variant}
//                   quantity={item.quantity}
//                   originalProduct={item.productId} // only if required
//                   fetchCartData={fetchCartData}
//                 />
//               ))
//             ) : (
//               <Animated.View
//                 style={[
//                   {alignItems: 'center', marginTop: verticalScale(50)},
//                   {opacity: containerFadeAnim},
//                 ]}>
//                 <EmptyCartScreen />
//               </Animated.View>
//             )}
//           </View>
//           <Animated.View
//             style={[
//               {paddingBottom: 20},
//               {
//                 opacity: buttonFadeAnim,
//                 transform: [{translateY: buttonSlideAnim}],
//               },
//             ]}>
//             {items?.length > 0 && (
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-around',
//                 }}>
//                 <AnimatedTouchable
//                   onPress={() => navigation.navigate('products')}
//                   style={{
//                     borderWidth: 1,
//                     borderColor: '#3C5D87',
//                     paddingVertical: verticalScale(5),
//                     paddingHorizontal: scale(10),
//                     borderRadius: scale(25),
//                   }}
//                   hapticType="light">
//                   <Text
//                     style={{
//                       fontSize: moderateScale(16),
//                       fontWeight: '600',
//                       color: '#3C5D87',
//                     }}>
//                     Add Product
//                   </Text>
//                 </AnimatedTouchable>
//                 <LinearGradient
//                   colors={['#38587F', '#101924']}
//                   start={{x: 0, y: 0}}
//                   end={{x: 1, y: 0}}
//                   style={styles.receiptButton}>
//                   <AnimatedTouchable
//                     style={styles.quoteButton}
//                     onPress={requestForQuote}
//                     hapticType="heavy">
//                     <Text style={styles.quoteButtonText}>
//                       Request for Quote
//                     </Text>
//                   </AnimatedTouchable>
//                 </LinearGradient>
//               </View>
//             )}
//           </Animated.View>
//         </ScrollView>
//       </Animated.View>
//     </SafeAreaView>
//   );
// };

// export default Cart;

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {useDispatch, useSelector} from 'react-redux';
import styles from './Cart.styles';
import {StorageKeys, storage} from '../../utils/storage';
import EmptyCartScreen from './EmptyCart';
import {useAlert} from '../../context/CustomAlertContext';
import {useLoader} from '../../context/LoaderContext';
import CartItem from './CartItem';
import AnimatedTouchable from './AnimateTouchable';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../utils/Responsive/responsive';
import {getCart} from '../../redux/slices/addToCartSlice';

const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {items, loading} = useSelector(state => state.addToCart);
  const {setLoading} = useLoader();
  const {showAlert} = useAlert();

  // Track if this is initial load
  const [initialLoad, setInitialLoad] = useState(true);

  // Animation values
  const containerFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(50)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  const fetchCartData = useCallback(async () => {
    // Only show loader on initial load, not on refreshes
    if (initialLoad) {
      setLoading(true);
    }

    try {
      await dispatch(getCart()).unwrap();
    } finally {
      if (initialLoad) {
        setLoading(false);
        setInitialLoad(false);
      }
    }
  }, [initialLoad]);

  useFocusEffect(
    useCallback(() => {
      fetchCartData();
    }, [fetchCartData]),
  );

  useEffect(() => {
    if (!loading && !initialLoad) {
      // Trigger animations when items change after initial load
      Animated.parallel([
        Animated.timing(containerFadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(200),
          Animated.parallel([
            Animated.spring(buttonSlideAnim, {
              toValue: 0,
              useNativeDriver: true,
              tension: 60,
              friction: 8,
            }),
            Animated.timing(buttonFadeAnim, {
              toValue: 1,
              duration: 500,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    }
  }, [items, loading, initialLoad]);

  // Show loading only on initial load when we don't know cart state
  if (initialLoad && loading) {
    return (
      <SafeAreaView style={styles.container}>
        <DashboardHeader />
        <View style={styles.loadingContainer}>
          {/* Your loading indicator */}
        </View>
      </SafeAreaView>
    );
  }

  const requestForQuote = async quoteData => {
    const token = storage.getString(StorageKeys.AUTH_TOKEN);
    showAlert({
      title: 'Are you sure?',
      message: 'Do you want to send this quote?',
      onConfirm: async () => {
        setLoading(true);
        try {
          const response = await fetch(
            'https://api.saraldyechems.com/order/send-quote',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          );

          await dispatch(getCart()).unwrap();
          const result = await response.json();

          if (response.ok) {
            setLoading(false);
          } else {
            showAlert({
              title: 'Error',
              message: result?.message || 'Something went wrong.',
              acceptText: 'OK',
            });
          }
        } catch (error) {
          showAlert({
            title: 'Error',
            message: error.message,
            acceptText: 'OK',
          });
        } finally {
          setLoading(false);
        }
      },
      acceptText: 'Yes',
      rejectText: 'Cancel',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader />
      <Animated.View style={[{flex: 1}, {opacity: containerFadeAnim}]}>
        <ScrollView
          style={styles.cartContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.cartItemsContainer}>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <CartItem
                  key={item._id}
                  id={item.productId._id}
                  name={item.productId.name}
                  image={
                    Array.isArray(item.productId.image)
                      ? item.productId.image
                      : [item.productId.image || null]
                  }
                  variant={item.variant}
                  quantity={item.quantity}
                  originalProduct={item.productId}
                  fetchCartData={fetchCartData}
                />
              ))
            ) : (
              <Animated.View
                style={[
                  {alignItems: 'center', marginTop: verticalScale(50)},
                  {opacity: containerFadeAnim},
                ]}>
                <EmptyCartScreen />
              </Animated.View>
            )}
          </View>
          <Animated.View
            style={[
              {paddingBottom: 20},
              {
                opacity: buttonFadeAnim,
                transform: [{translateY: buttonSlideAnim}],
              },
            ]}>
            {items?.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <AnimatedTouchable
                  onPress={() => navigation.navigate('products')}
                  style={{
                    borderWidth: 1,
                    borderColor: '#3C5D87',
                    paddingVertical: verticalScale(5),
                    paddingHorizontal: scale(10),
                    borderRadius: scale(25),
                  }}
                  hapticType="light">
                  <Text
                    style={{
                      fontSize: moderateScale(16),
                      fontWeight: '600',
                      color: '#3C5D87',
                    }}>
                    Add Product
                  </Text>
                </AnimatedTouchable>
                <LinearGradient
                  colors={['#38587F', '#101924']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.receiptButton}>
                  <AnimatedTouchable
                    style={styles.quoteButton}
                    onPress={requestForQuote}
                    hapticType="heavy">
                    <Text style={styles.quoteButtonText}>
                      Request for Quote
                    </Text>
                  </AnimatedTouchable>
                </LinearGradient>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Cart;
