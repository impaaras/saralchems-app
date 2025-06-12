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

const CartItem = ({product, onRemove, onDecrement, onIncrement}) => {
  let [variantId, setVariantId] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const calculateTotal = (variant, quantity) => {
    const match = variant.match(/(\d+(\.\d+)?)\s*(kg|gm|ltr)/i);
    if (!match) return `${variant}`;

    const value = parseFloat(match[1]);
    const unit = match[3].toLowerCase();
    const total = value * quantity;

    if (unit === 'gm' && total >= 1000) {
      return `${total / 1000}kg`;
    }

    return `${parseFloat(total.toFixed(1))}${unit}`;
  };
  const removeTrailingDigits = variant => {
    const match = variant?.match(/^\d+(\.\d+)?\s*(kg|gm|ml|ltr)/i);
    return match ? match[0].replace(/\s+/, '') : '';
  };

  const activeProduct = useSelector(state => state.newCart.activeProduct);
  const openAddModal = (product, index, currentIndex) => {
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

  return (
    <View style={styles.cartItem}>
      {product && <ScrollImage product={product} reffer="cart" />}
      <View style={styles.cartItemDetails}>
        <View style={styles.cartItemHeader}>
          <TouchableOpacity
            onPress={() => openAddModal(product, 0, product?._id)}>
            <Text style={styles.cartItemName}>{product.productId.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove}>
            <Icon name="delete" size={22} color="#666" />
          </TouchableOpacity>
        </View>
        <Text style={styles.cartItemSpec}>
          <Text style={{fontWeight: '700'}}>Variant - </Text>
          {removeTrailingDigits(product.variant) ||
            product.variant ||
            'Custom variant'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.cartItemQuality}>
            <Text style={{fontWeight: '700'}}> Total Qty: </Text>
            {product.variant === 'no variant'
              ? product.quantity
              : calculateTotal(product.variant, product.quantity)}
          </Text>
          <View style={styles.cartItemQuantity}>
            <TouchableOpacity style={styles.quantityBtn} onPress={onDecrement}>
              <Text style={styles.quantityBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{product.quantity}</Text>
            <TouchableOpacity style={styles.quantityBtn} onPress={onIncrement}>
              <Text style={styles.quantityBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      isScreenFocused.current = true;
      fetchCartData();
    });

    return unsubscribe;
  }, [navigation]);

  const {showAlert} = useAlert();
  const fetchCartData = useCallback(async () => {
    try {
      await dispatch(getCart()).unwrap();
    } catch (err) {
      showAlert({
        title: 'Error',
        message: 'Failed to load cart',
        rejectText: 'Cancel',
      });
      showAlert({
        title: 'Error',
        message: error.message,
        acceptText: 'OK',
      });
    }
  }, [dispatch]);

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
        message: error.message,
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

    [dispatch, fetchCartData],
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
        }
      },
      acceptText: 'Yes',
      rejectText: 'Cancel',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader />
      <ScrollView
        style={styles.cartContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cartItemsContainer}>
          {items && items?.length > 0 ? (
            items?.map((item, index) => (
              <>
                <CartItem
                  key={`${index}`}
                  product={{
                    ...item,
                    id: item.productId._id,
                    name: item.productId.name,
                    variants: item.productId?.variants || item.variants || [],
                    image: Array.isArray(item?.productId?.image)
                      ? item?.productId?.image // If it's already an array, use it directly
                      : [
                          item?.productId?.image ||
                            'https://via.placeholder.com/150',
                        ], // Convert string to array or use fallback
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
              </>
            ))
          ) : (
            <View style={{alignItems: 'center', marginTop: 50}}>
              <EmptyCartScreen />
            </View>
          )}
        </View>
        <View style={{paddingBottom: 20}}>
          {items?.length > 0 && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('products')}
                style={{
                  borderWidth: 1,
                  borderColor: '#3C5D87',
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 20,
                }}>
                <Text
                  style={{fontSize: 16, fontWeight: '500', color: '#3C5D87'}}>
                  Add Product
                </Text>
              </TouchableOpacity>
              {/* <LinearGradient
                colors={['#05842A', '#05842A']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.confirmButton}>
                <TouchableOpacity style={styles.quoteButton}>
                  <Text style={styles.quoteButtonText}>Confirm</Text>
                </TouchableOpacity>
              </LinearGradient> */}
              <LinearGradient
                colors={['#38587F', '#101924']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.receiptButton}>
                <TouchableOpacity
                  style={styles.quoteButton}
                  onPress={requestForQuote}>
                  <Text style={styles.quoteButtonText}>Request for Quote</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;
