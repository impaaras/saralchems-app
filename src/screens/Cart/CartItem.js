import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScrollImage from '../../components/ScrollImage/Index';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setActiveProduct} from '../../redux/slices/newCart';
import {openModal} from '../../redux/slices/modalSlice';
import {getCart, updateCartItem} from '../../redux/slices/addToCartSlice';
import AnimatedTouchable from './AnimateTouchable';
import {Trash2} from 'lucide-react-native';
import {
  calculateTotal,
  removeTrailingDigits,
} from '../../utils/function/function';
import styles from './Cart.styles';
import {moderateScale} from '../../utils/Responsive/responsive';

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

      if (difference === 0) return;

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
          console.log('Update failed:', err);
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
              <Trash2 name="delete" size={moderateScale(18)} color="#001" />
            </Animated.View>
          </AnimatedTouchable>
        </View>
        {product.variant !== 'no variant' && (
          <Text style={styles.cartItemSpec}>
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
            <Text style={{fontWeight: '500', fontSize: moderateScale(11)}}>
              Total Qty:{' '}
            </Text>
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

export default CartItem;
