// import {
//   Animated,
//   Easing,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import ScrollImage from '../../components/ScrollImage/Index';
// import {useNavigation} from '@react-navigation/native';
// import {useDispatch, useSelector} from 'react-redux';
// import {setActiveProduct} from '../../redux/slices/newCart';
// import {openModal} from '../../redux/slices/modalSlice';
// import {
//   getCart,
//   removeFromCart,
//   updateCartItem,
// } from '../../redux/slices/addToCartSlice';
// import AnimatedTouchable from './AnimateTouchable';
// import {Cake, Trash2} from 'lucide-react-native';
// import {
//   calculateTotal,
//   removeTrailingDigits,
// } from '../../utils/function/function';
// import styles from './Cart.styles';
// import {moderateScale} from '../../utils/Responsive/responsive';
// import {useAlert} from '../../context/CustomAlertContext';
// import {useLoader} from '../../context/LoaderContext';

// const CartItemImage = React.memo(({image}) => {
//   return <ScrollImage image={image} reffer="cart" />;
// });

// const ProductName = React.memo(({name}) => {
//   return (
//     <AnimatedTouchable hapticType="light">
//       <Text style={styles.cartItemName}>{name}</Text>
//     </AnimatedTouchable>
//   );
// });

// const CartItem = React.memo(({product, fetchCartData}) => {
//   let [variantId, setVariantId] = useState(null);
//   const navigation = useNavigation();
//   const [qty, setQty] = useState(product.quantity);
//   const dispatch = useDispatch();
//   const {showAlert} = useAlert();
//   const {setLoading} = useLoader();
//   const isProcessing = useRef(false);
//   const debounceRef = useRef(null);

//   const debounceTimer = useRef(null);
//   const accumulatedChange = useRef(0);

//   const debouncedSyncQuantity = () => {
//     if (debounceTimer.current) clearTimeout(debounceTimer.current);

//     debounceTimer.current = setTimeout(async () => {
//       if (accumulatedChange.current !== 0) {
//         try {
//           await dispatch(
//             updateCartItem({
//               productId: product.productId._id,
//               variant: product.variant,
//               quantity: accumulatedChange.current,
//             }),
//           ).unwrap();
//           await dispatch(getCart());
//         } catch (err) {
//           showAlert({
//             title: 'Error',
//             message: err.message,
//             acceptText: 'OK',
//           });
//         } finally {
//           accumulatedChange.current = 0; // reset after syncing
//         }
//       }
//     }, 500); // 500ms debounce delay
//   };

//   const handleCartOperation = async (operation, quantityChange) => {
//     if (isProcessing.current) return;
//     isProcessing.current = true;
//     try {
//       await dispatch(
//         updateCartItem({
//           productId: product.productId._id,
//           variant: product.variant,
//           quantity: quantityChange,
//         }),
//       ).unwrap();
//       await dispatch(getCart());
//     } catch (err) {
//       showAlert({
//         title: 'Error',
//         message: err.message,
//         acceptText: 'OK',
//       });
//     } finally {
//       isProcessing.current = false;
//     }
//   };

//   const handleIncrement = () => {
//     const newQty = qty + 1;
//     setQty(newQty);
//     accumulatedChange.current += 1;
//     debouncedSyncQuantity();
//   };

//   const handleDecrement = () => {
//     const newQty = qty - 1;
//     setQty(newQty);

//     if (newQty >= 1) {
//       accumulatedChange.current -= 1;
//       debouncedSyncQuantity();
//     } else {
//       if (debounceTimer.current) clearTimeout(debounceTimer.current);
//       accumulatedChange.current = 0;
//       handleRemoveItem();
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     };
//   }, []);
//   const handleRemoveItem = () => {
//     showAlert({
//       title: 'Remove Item',
//       message: 'Are you sure you want to remove this item from your cart?',
//       onConfirm: async () => {
//         try {
//           await dispatch(
//             removeFromCart({
//               productId: product.productId._id,
//               variant: product.variant,
//             }),
//           ).unwrap();
//           await fetchCartData();
//         } catch (err) {
//           showAlert({
//             title: 'Error',
//             message: err.message || 'Failed to remove item',
//             acceptText: 'OK',
//           });
//         }
//       },
//       acceptText: 'Remove',
//       rejectText: 'Cancel',
//     });
//   };
//   useEffect(() => {
//     setQty(product.quantity);
//   }, [product.quantity]);

//   // Animation values
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;

//   useEffect(() => {
//     Animated.sequence([
//       Animated.delay(Math.random() * 200), // Random delay for staggered effect
//       Animated.parallel([
//         Animated.spring(slideAnim, {
//           toValue: 1,
//           useNativeDriver: true,
//           tension: 60,
//           friction: 8,
//         }),
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 600,
//           easing: Easing.out(Easing.cubic),
//           useNativeDriver: true,
//         }),
//         Animated.spring(scaleAnim, {
//           toValue: 1,
//           useNativeDriver: true,
//           tension: 50,
//           friction: 8,
//           delay: 100,
//         }),
//       ]),
//     ]).start();
//   }, []);

//   const activeProduct = useSelector(state => state.newCart.activeProduct);

//   const openAddModal = (product, index, currentIndex) => {
//     if (
//       activeProduct?.selectedVariant === null ||
//       activeProduct?._id !== currentIndex
//     ) {
//       dispatch(setActiveProduct(product));
//     }
//     setVariantId(index);
//     const newProduct = {
//       ...product,
//       parentId: index,
//       variants: product.variants || [],
//     };

//     dispatch(addItem(newProduct));
//     dispatch(
//       openModal({
//         modalType: 'PRODUCT_MODAL',
//         callbackId: '123',
//         product: newProduct,
//       }),
//     );
//   };

//   const updateQuantity = newQty => {
//     const numericQty = parseInt(newQty, 10);
//     if (!isNaN(numericQty) && numericQty > 0) {
//       const difference = numericQty - product.quantity;

//       if (difference === 0) return;

//       setQty(numericQty);

//       dispatch(
//         updateCartItem({
//           productId: product.productId._id,
//           variant: product.variant,
//           quantity: difference, // ✅ Send the difference!
//         }),
//       )
//         .unwrap()
//         .then(() => dispatch(getCart()))
//         .catch(err => {
//           console.log('Update failed:', err);
//         });
//     }
//   };

//   const animatedRemove = () => {
//     Animated.parallel([]).start(() => {
//       handleRemoveItem();
//     });
//   };

//   const ProductVariant = React.memo(({variant}) => {
//     if (variant === 'no variant') return null;
//     return (
//       <Text style={styles.cartItemSpec}>
//         {removeTrailingDigits(variant) || variant || 'Custom variant'}
//       </Text>
//     );
//   });

//   return (
//     <View style={[styles.cartItem]}>
//       <CartItemImage image={product?.image} />
//       <View style={styles.cartItemDetails}>
//         <View style={styles.cartItemHeader}>
//           <ProductName name={product?.productId?.name} />
//           <AnimatedTouchable onPress={animatedRemove} hapticType="medium">
//             <Animated.View>
//               <Trash2 name="delete" size={moderateScale(18)} color="#001" />
//             </Animated.View>
//           </AnimatedTouchable>
//         </View>
//         <ProductVariant variant={product.variant} />
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//           }}>
//           <Text style={styles.cartItemQuality}>
//             <Text style={{fontWeight: '500', fontSize: moderateScale(11)}}>
//               Total Qty:{' '}
//             </Text>
//             {product.variant === 'no variant'
//               ? product.quantity
//               : calculateTotal(product.variant, product.quantity)}
//           </Text>
//           <View style={styles.cartItemQuantity}>
//             <AnimatedTouchable
//               style={[styles.quantityBtn]}
//               onPress={handleDecrement}
//               disabled={qty <= 1}
//               hapticType="light">
//               <Text style={styles.quantityBtnText}>−</Text>
//             </AnimatedTouchable>
//             <TextInput
//               value={String(qty)}
//               onChangeText={text => {
//                 const numeric = text.replace(/[^0-9]/g, '');
//                 setQty(numeric); // Immediate update for UX
//               }}
//               onEndEditing={() => updateQuantity(qty)}
//               keyboardType="numeric"
//               style={styles.quantityInput}
//               textAlign="center"
//             />

//             <AnimatedTouchable
//               style={styles.quantityBtn}
//               onPress={handleIncrement}
//               hapticType="light">
//               <Text style={styles.quantityBtnText}>+</Text>
//             </AnimatedTouchable>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// });

// function areEqual(prevProps, nextProps) {
//   return (
//     prevProps.product.id === nextProps.product.id &&
//     prevProps.product.quantity === nextProps.product.quantity
//   );
// }

// export default React.memo(CartItem, areEqual);

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
import {
  getCart,
  removeFromCart,
  updateCartItem,
} from '../../redux/slices/addToCartSlice';
import AnimatedTouchable from './AnimateTouchable';
import {Cake, Trash2} from 'lucide-react-native';
import {
  calculateTotal,
  removeTrailingDigits,
} from '../../utils/function/function';
import styles from './Cart.styles';
import {moderateScale} from '../../utils/Responsive/responsive';
import {useAlert} from '../../context/CustomAlertContext';
import {useLoader} from '../../context/LoaderContext';

const CartItemImage = React.memo(({image}) => {
  return <ScrollImage image={image} reffer="cart" />;
});

const ProductName = React.memo(({name}) => {
  return (
    <AnimatedTouchable hapticType="light">
      <Text style={styles.cartItemName}>{name}</Text>
    </AnimatedTouchable>
  );
});

const CartItem = React.memo(
  ({
    // product, fetchCartData
    id,
    name,
    image,
    variant,
    quantity,
    fetchCartData,
    originalProduct,
  }) => {
    let [variantId, setVariantId] = useState(null);
    const navigation = useNavigation();
    const [qty, setQty] = useState(quantity);
    const dispatch = useDispatch();
    const {showAlert} = useAlert();
    const {setLoading} = useLoader();
    const isProcessing = useRef(false);
    const debounceRef = useRef(null);

    const debounceTimer = useRef(null);
    const accumulatedChange = useRef(0);

    const debouncedSyncQuantity = () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        if (accumulatedChange.current !== 0) {
          try {
            await dispatch(
              updateCartItem({
                productId: id,
                variant: variant,
                quantity: accumulatedChange.current,
              }),
            ).unwrap();
            await dispatch(getCart());
          } catch (err) {
            showAlert({
              title: 'Error',
              message: err.message,
              acceptText: 'OK',
            });
          } finally {
            accumulatedChange.current = 0; // reset after syncing
          }
        }
      }, 500); // 500ms debounce delay
    };

    const handleCartOperation = async (operation, quantityChange) => {
      if (isProcessing.current) return;
      isProcessing.current = true;
      try {
        await dispatch(
          updateCartItem({
            productId: id,
            variant: variant,
            quantity: quantityChange,
          }),
        ).unwrap();
        await dispatch(getCart());
      } catch (err) {
        showAlert({
          title: 'Error',
          message: err.message,
          acceptText: 'OK',
        });
      } finally {
        isProcessing.current = false;
      }
    };

    const handleIncrement = () => {
      const newQty = qty + 1;
      setQty(newQty);
      accumulatedChange.current += 1;
      debouncedSyncQuantity();
    };

    const handleDecrement = () => {
      const newQty = qty - 1;
      setQty(newQty);

      if (newQty >= 1) {
        accumulatedChange.current -= 1;
        debouncedSyncQuantity();
      } else {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        accumulatedChange.current = 0;
        handleRemoveItem();
      }
    };

    useEffect(() => {
      return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
      };
    }, []);
    const handleRemoveItem = () => {
      showAlert({
        title: 'Remove Item',
        message: 'Are you sure you want to remove this item from your cart?',
        onConfirm: async () => {
          try {
            await dispatch(
              removeFromCart({
                productId: id,
                variant: variant,
              }),
            ).unwrap();
            await fetchCartData();
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
    };
    useEffect(() => {
      setQty(quantity);
    }, [quantity]);

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
        variants: variant || [],
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
        const difference = numericQty - quantity;

        if (difference === 0) return;

        setQty(numericQty);

        dispatch(
          updateCartItem({
            productId: id,
            variant: variant,
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
        handleRemoveItem();
      });
    };

    const ProductVariant = React.memo(({variant}) => {
      if (variant === 'no variant') return null;
      return (
        <Text style={styles.cartItemSpec}>
          {removeTrailingDigits(variant) || variant || 'Custom variant'}
        </Text>
      );
    });

    return (
      <View style={[styles.cartItem]}>
        <CartItemImage image={image} />
        <View style={styles.cartItemDetails}>
          <View style={styles.cartItemHeader}>
            <ProductName name={name} />
            <AnimatedTouchable onPress={animatedRemove} hapticType="medium">
              <Animated.View>
                <Trash2 name="delete" size={moderateScale(18)} color="#001" />
              </Animated.View>
            </AnimatedTouchable>
          </View>
          <ProductVariant variant={variant} />
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
              {variant === 'no variant'
                ? quantity
                : calculateTotal(variant, quantity)}
            </Text>
            <View style={styles.cartItemQuantity}>
              <AnimatedTouchable
                style={[styles.quantityBtn]}
                onPress={handleDecrement}
                disabled={qty <= 1}
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
                onPress={handleIncrement}
                hapticType="light">
                <Text style={styles.quantityBtnText}>+</Text>
              </AnimatedTouchable>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

function areEqual(prevProps, nextProps) {
  return (
    prevProps.id === nextProps.id && prevProps.quantity === nextProps.quantity
  );
}

export default React.memo(CartItem, areEqual);
