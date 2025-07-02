import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Platform,
  Vibration,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/routes';
import LinearGradient from 'react-native-linear-gradient';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCart,
  removeFromCart,
  updateCartItem,
} from '../../redux/slices/addToCartSlice';
import {fallbackImg} from '../../utils/images';
import styles from './Cart.styles';
import {StorageKeys, storage} from '../../utils/storage';
import EmptyCartScreen from './EmptyCart';
import Loader from '../../utils/Loader';
import {setActiveProduct} from '../../redux/slices/newCart';
import {openModal} from '../../redux/slices/modalSlice';
import {addItem} from '../../redux/slices/cartSlice';

import {useAlert} from '../../context/CustomAlertContext';
import {useLoader} from '../../context/LoaderContext';
import ScrollImage from '../../components/ScrollImage/Index';
import CartShimmer from './CartShimmer';
import {Trash2} from 'lucide-react-native';

// Enhanced TouchableOpacity with animations and haptic feedback
const AnimatedTouchable = ({
  children,
  onPress,
  style,
  hapticType = 'light',
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const triggerHaptic = type => {
    if (Platform.OS === 'ios') {
      // iOS Haptic Feedback
      const ReactNativeHapticFeedback = require('react-native-haptic-feedback');
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };

      switch (type) {
        case 'light':
          ReactNativeHapticFeedback?.trigger('impactLight', options);
          break;
        case 'medium':
          ReactNativeHapticFeedback?.trigger('impactMedium', options);
          break;
        case 'heavy':
          ReactNativeHapticFeedback?.trigger('impactHeavy', options);
          break;
        default:
          ReactNativeHapticFeedback?.trigger('selection', options);
      }
    } else {
      // Android Vibration fallback
      switch (type) {
        case 'light':
          Vibration.vibrate(10);
          break;
        case 'medium':
          Vibration.vibrate(20);
          break;
        case 'heavy':
          Vibration.vibrate(50);
          break;
        default:
          Vibration.vibrate(5);
      }
    }
  };

  const handlePressIn = () => {
    triggerHaptic(hapticType);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...props}>
      <Animated.View
        style={[
          style,
          {
            transform: [{scale: scaleAnim}],
            opacity: opacityAnim,
          },
        ]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const CartItem = ({product, onRemove, onDecrement, onIncrement}) => {
  let [variantId, setVariantId] = useState(null);
  const navigation = useNavigation();
  const [qty, setQty] = useState(product.quantity);

  const dispatch = useDispatch();

  useEffect(() => {
    setQty(product.quantity);
  }, [product.quantity]);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Staggered entrance animation
    Animated.sequence([
      Animated.delay(Math.random() * 200), // Random delay for staggered effect
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
          delay: 100,
        }),
      ]),
    ]).start();
  }, []);

  const calculateTotal = (variant, quantity) => {
    const match = variant.match(/(\d+(\.\d+)?)\s*(kg|gm|ltr|ml)/i);
    if (!match) return `${quantity}`; // Fallback if no match

    const value = parseFloat(match[1]);
    const unit = match[3].toLowerCase();
    const total = value * quantity;

    if (unit === 'gm' && total >= 1000) {
      return `${total / 1000}kg`;
    }

    return `${parseFloat(total.toFixed(1))}${unit}`;
  };

  const removeTrailingDigits = variant => {
    const match = variant?.match(/^\d+(\.\d+)?\s*(kg|gm|ml|ltr|ml)/i);
    return match ? match[0].replace(/\s+/, '') : '';
  };

  const activeProduct = useSelector(state => state.newCart.activeProduct);

  const openAddModal = (product, index, currentIndex) => {
    console.log(product);
    if (
      activeProduct?.selectedVariant === null ||
      activeProduct?._id !== currentIndex
    ) {
      dispatch(setActiveProduct(product));
    }
    setVariantId(index);
    const newProduct = {
      ...product,
      parentId: index,
      variants: product.variants || [],
    };

    dispatch(addItem(newProduct));
    dispatch(
      openModal({
        modalType: 'PRODUCT_MODAL',
        callbackId: '123',
        product: newProduct,
      }),
    );
  };

  const updateQuantity = newQty => {
    const numericQty = parseInt(newQty, 10);
    if (!isNaN(numericQty) && numericQty > 0) {
      const difference = numericQty - product.quantity;

      if (difference === 0) return; // nothing to update

      setQty(numericQty);

      dispatch(
        updateCartItem({
          productId: product.productId._id,
          variant: product.variant,
          quantity: difference, // ✅ Send the difference!
        }),
      )
        .unwrap()
        .then(() => dispatch(getCart()))
        .catch(err => {
          console.error('Update failed:', err);
        });
    }
  };

  const animatedRemove = () => {
    Animated.parallel([]).start(() => {
      onRemove();
    });
  };

  return (
    <Animated.View
      style={[
        styles.cartItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            {scale: scaleAnim},
          ],
        },
      ]}>
      {product && <ScrollImage product={product} reffer="cart" />}
      <View style={styles.cartItemDetails}>
        <View style={styles.cartItemHeader}>
          <AnimatedTouchable
            // onPress={() => openAddModal(product, 0, product?._id)}
            hapticType="light">
            <Text style={styles.cartItemName}>{product?.productId?.name}</Text>
          </AnimatedTouchable>
          <AnimatedTouchable onPress={animatedRemove} hapticType="medium">
            <Animated.View>
              <Trash2 name="delete" size={18} color="#001" />
              {/* <Icon name="delete" size={22} color="#666" /> */}
            </Animated.View>
          </AnimatedTouchable>
        </View>
        {product.variant !== 'no variant' && (
          <Text style={styles.cartItemSpec}>
            {/* <Text style={{fontWeight: '700'}}>Variant - </Text> */}
            {removeTrailingDigits(product.variant) ||
              product.variant ||
              'Custom variant'}
          </Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.cartItemQuality}>
            <Text style={{fontWeight: '700'}}>Total Qty: </Text>
            {product.variant === 'no variant'
              ? product.quantity
              : calculateTotal(product.variant, product.quantity)}
          </Text>
          <View style={styles.cartItemQuantity}>
            <AnimatedTouchable
              style={[styles.quantityBtn]}
              onPress={onDecrement}
              hapticType="light">
              <Text style={styles.quantityBtnText}>−</Text>
            </AnimatedTouchable>
            <TextInput
              value={String(qty)}
              onChangeText={text => {
                const numeric = text.replace(/[^0-9]/g, '');
                setQty(numeric); // Immediate update for UX
              }}
              onEndEditing={() => updateQuantity(qty)}
              keyboardType="numeric"
              style={styles.quantityInput}
              textAlign="center"
            />

            <AnimatedTouchable
              style={styles.quantityBtn}
              onPress={onIncrement}
              hapticType="light">
              <Text style={styles.quantityBtnText}>+</Text>
            </AnimatedTouchable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {items, loading, error} = useSelector(state => state.addToCart);
  const isScreenFocused = useRef(false);
  const isProcessing = useRef(false);
  const {setLoading} = useLoader();
  const [alertVisible, setAlertVisible] = useState(true);

  // New state for initial loading
  const [initialLoading, setInitialLoading] = useState(true);

  // Animation values
  const containerFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonSlideAnim = useRef(new Animated.Value(50)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Screen entrance animation
    if (!initialLoading) {
      // Only animate after initial load is complete
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
  }, [items, initialLoading]); // Add initialLoading to dependencies

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      isScreenFocused.current = true;
      fetchCartData();
    });

    return unsubscribe;
  }, [navigation]);

  const {showAlert} = useAlert();

  const fetchCartData = useCallback(async () => {
    setInitialLoading(true); // Set initialLoading to true before fetching
    try {
      await dispatch(getCart()).unwrap();
    } catch (err) {
      showAlert({
        title: 'Error',
        message: 'Failed to load cart',
        rejectText: 'Cancel',
      });
      // The `error` from useSelector might not be immediately available
      // if the `unwrap` call catches the error.
      // Consider using the `err` object directly or re-dispatching an error action.
      showAlert({
        title: 'Error',
        message: err.message, // Use err.message here
        acceptText: 'OK',
      });
    } finally {
      setInitialLoading(false); // Set initialLoading to false after fetch attempt
    }
  }, [dispatch, showAlert]); // Add showAlert to dependencies

  const handleCartOperation = async (
    operation,
    productId,
    variant,
    quantityChange,
  ) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    try {
      await dispatch(
        updateCartItem({
          productId,
          variant,
          quantity: quantityChange,
        }),
      ).unwrap();
      await dispatch(getCart());
    } catch (err) {
      showAlert({
        title: 'Error',
        message: err.message, // Use err.message here
        acceptText: 'OK',
      });
    } finally {
      isProcessing.current = false;
    }
  };

  const handleDecrement = (productId, variant, currentQuantity) => {
    if (currentQuantity > 1) {
      handleCartOperation(updateCartItem, productId, variant, -1);
    } else {
      handleRemoveItem(productId, variant);
    }
  };

  const handleIncrement = (productId, variant) => {
    handleCartOperation(updateCartItem, productId, variant, 1);
  };

  const handleRemoveItem = useCallback(
    (productId, variant) => {
      showAlert({
        title: 'Remove Item',
        message: 'Are you sure you want to remove this item from your cart?',
        onConfirm: async () => {
          try {
            await dispatch(removeFromCart({productId, variant})).unwrap();
            if (isScreenFocused.current) {
              await fetchCartData();
            }
          } catch (err) {
            showAlert({
              title: 'Error',
              message: err.message || 'Failed to remove item',
              acceptText: 'OK',
            });
          }
        },
        acceptText: 'Remove',
        rejectText: 'Cancel',
      });
    },
    [dispatch, fetchCartData, showAlert], // Add showAlert to dependencies
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      isScreenFocused.current = false;
    });

    return unsubscribe;
  }, [navigation]);

  const selectedProductItem = useSelector(state => state.cart.selectedProduct);

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
          setLoading(false); // Ensure loading is turned off even on error
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
                  key={`${index}`}
                  product={{
                    ...item,
                    id: item.productId._id,
                    name: item.productId.name,
                    variants: item.productId?.variants || item.variants || [],
                    image: Array.isArray(item?.productId?.image)
                      ? item?.productId?.image
                      : [item?.productId?.image || null],
                  }}
                  onRemove={() =>
                    handleRemoveItem(item.productId._id, item.variant)
                  }
                  onDecrement={() =>
                    handleDecrement(
                      item.productId._id,
                      item.variant,
                      item.quantity,
                    )
                  }
                  onIncrement={() =>
                    handleIncrement(item.productId._id, item.variant)
                  }
                />
              ))
            ) : (
              <Animated.View
                style={[
                  {alignItems: 'center', marginTop: 50},
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
                    paddingVertical: 12,
                    paddingHorizontal: 15,
                    borderRadius: 25,
                  }}
                  hapticType="light">
                  <Text
                    style={{fontSize: 14, fontWeight: '600', color: '#3C5D87'}}>
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
