import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/routes';
import LinearGradient from 'react-native-linear-gradient';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {useDispatch, useSelector} from 'react-redux';
import styles from './Cart.styles';
import {StorageKeys, storage} from '../../utils/storage';
import EmptyCartScreen from './EmptyCart';
import {useAlert} from '../../context/CustomAlertContext';
import {useLoader} from '../../context/LoaderContext';
import CartShimmer from './CartShimmer';
import CartItem, {CartItemImage, ProductName} from './CartItem';
import AnimatedTouchable from './AnimateTouchable';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../utils/Responsive/responsive';
import {
  getCart,
  removeFromCart,
  updateCartItem,
} from '../../redux/slices/addToCartSlice';

const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {items, loading, error} = useSelector(state => state.addToCart);
  const isScreenFocused = useRef(false);
  const isProcessing = useRef(false);
  const {setLoading} = useLoader();
  const [alertVisible, setAlertVisible] = useState(true);
  const selectedProductItem = useSelector(state => state.cart.selectedProduct);
  const [initialLoading, setInitialLoading] = useState(true);
  const {showAlert} = useAlert();

  // Animation values
  const containerFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(50)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!initialLoading) {
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
  }, [items, initialLoading]);

  const fetchCartData = useCallback(async () => {
    setLoading(true);
    setInitialLoading(true);
    try {
      await dispatch(getCart()).unwrap();
    } catch (err) {
      showAlert({
        title: 'Error',
        message: err.message,
        acceptText: 'OK',
      });
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, [dispatch, showAlert]);

  useFocusEffect(
    useCallback(() => {
      fetchCartData();
    }, []),
  );

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

  // Only show CartShimmer if initialLoading is true
  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <DashboardHeader />
        <CartShimmer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader />
      <Animated.View style={[{flex: 1}, {opacity: containerFadeAnim}]}>
        <ScrollView
          style={styles.cartContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.cartItemsContainer}>
            {items && items?.length > 0 ? (
              items?.map((item, index) => (
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
                  originalProduct={item.productId} // only if required
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
