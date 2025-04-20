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

const CartItem = ({product, onRemove, onDecrement, onIncrement}) => {
  const navigation = useNavigation();
  const calculateTotal = (variant, quantity) => {
    const match = variant.match(/(\d+)\s*(kg|gm|ltr)/i);
    if (!match) return `${quantity} × ${variant}`;

    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    const total = value * quantity;

    if (unit === 'gm' && total >= 1000) {
      return `${total / 1000}kg`;
    }

    return `${total}${unit}`;
  };
  const removeTrailingDigits = variant => {
    // This will remove 1 or more digits from the end of the string
    return variant?.replace(/\d+$/, '') || '';
  };

  return (
    <View style={styles.cartItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAILS)}>
        {!product.image ? (
          <Image source={{uri: product.image}} style={styles.cartItemImage} />
        ) : (
          <Image
            style={styles.cartItemImage}
            source={{
              uri: fallbackImg(),
            }}
          />
        )}
      </TouchableOpacity>
      <View style={styles.cartItemDetails}>
        <View style={styles.cartItemHeader}>
          <Text style={styles.cartItemName}>{product.productId.name}</Text>
          <TouchableOpacity onPress={onRemove}>
            <Icon name="delete" size={22} color="#666" />
          </TouchableOpacity>
        </View>
        <Text style={styles.cartItemSpec}>
          {removeTrailingDigits(product.variant)}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.cartItemQuality}>
            {product.variant.match(/(kg|gm|ltr)/i) ? (
              <>Total: {calculateTotal(product.variant, product.quantity)}</>
            ) : (
              <>Quantity: {product.quantity}</>
            )}
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
  const isProcessing = useRef(false); // Track if an operation is in progress

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      isScreenFocused.current = true;
      fetchCartData();
    });

    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   fetchCartData();
  // }, []);

  const fetchCartData = useCallback(async () => {
    try {
      await dispatch(getCart()).unwrap();
    } catch (err) {
      Alert.alert('Error', 'Failed to load cart');
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
      Alert.alert('Error', err.message || 'Failed to update quantity');
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
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your cart?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            onPress: async () => {
              try {
                await dispatch(removeFromCart({productId, variant})).unwrap();
                if (isScreenFocused.current) {
                  await fetchCartData();
                }
              } catch (err) {
                Alert.alert('Error', err.message || 'Failed to remove item');
              }
            },
          },
        ],
      );
    },

    [dispatch, fetchCartData],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      isScreenFocused.current = false;
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader />
      <ScrollView
        style={styles.cartContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cartItemsContainer}>
          {items?.length > 0 ? (
            items.map((item, index) => (
              <CartItem
                key={`${index}`}
                product={{
                  ...item,
                  id: item.productId._id,
                  name: item.productId.name,
                  image:
                    item.productId.image || 'https://via.placeholder.com/150',
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
            <View style={{alignItems: 'center', marginTop: 50}}>
              <Text style={{fontSize: 16, color: '#000'}}>
                Your cart is empty
              </Text>
            </View>
          )}
        </View>
        <View style={{paddingBottom: 20}}>
          <View style={{alignSelf: 'center', marginBottom: 20}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('products')}
              style={{
                borderWidth: 1,
                borderColor: '#3C5D87',
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderRadius: 20,
              }}>
              <Text style={{fontSize: 16, fontWeight: '500', color: '#3C5D87'}}>
                Add Product
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <LinearGradient
              colors={['#05842A', '#05842A']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.confirmButton}>
              <TouchableOpacity style={styles.quoteButton}>
                <Text style={styles.quoteButtonText}>Confirm</Text>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={['#38587F', '#101924']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.receiptButton}>
              <TouchableOpacity style={styles.quoteButton}>
                <Text style={styles.quoteButtonText}>Request for Quote</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;
