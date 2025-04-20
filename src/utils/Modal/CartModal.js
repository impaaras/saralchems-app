// import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React, {useState} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import {addToCart} from '../../redux/slices/addToCartSlice';
// import {setSelectedVariant} from '../../redux/slices/productSlice';
// import {useNavigation} from '@react-navigation/native';
// import {closeModal, openModal} from '../../redux/slices/modalSlice';
// import {ROUTES} from '../../constants/routes';
// import LinearGradient from 'react-native-linear-gradient';
// import {
//   CarIcon,
//   ChartNoAxesColumn,
//   CircleX,
//   RotateCw,
//   ShoppingCart,
//   SidebarClose,
// } from 'lucide-react-native';

// const CartModal = ({product}) => {
//   const dispatch = useDispatch();
//   const selectedVariant = useSelector(state => state.product.selectedVariant);
//   const [quantity, setQuantity] = useState(0);
//   const navigation = useNavigation();
//   const handleAddToCart = (productId, variant, quantity) => {
//     console.log('hlo', quantity);
//     dispatch(addToCart({productId, variant, quantity}))
//       .unwrap()
//       .catch(err => {
//         Alert.alert('Error', err.message || 'Failed to add to cart');
//       });
//     dispatch(setSelectedVariant(null));
//     dispatch(closeModal());
//     navigation.navigate(ROUTES.CART);
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };

//   const incrementQuantity = () => {
//     console.log(quantity);
//     setQuantity(quantity + 1);
//   };

//   const handleViewCart = () => {
//     navigation.navigate(ROUTES.CART);
//     dispatch(closeModal());
//   };

//   return (
//     <LinearGradient
//       colors={['#1B2B48', '#2D4565']}
//       start={{x: 0, y: 0}}
//       end={{x: 1, y: 1}}
//       style={{borderRadius: 10, padding: 8, flexDirection: 'column'}}>
//       <TouchableOpacity
//         onPress={() => dispatch(closeModal())}
//         style={{
//           marginLeft: -15,
//           marginTop: -15,
//           width: 22,
//           borderRadius: 20,
//           backgroundColor: 'white',
//         }}>
//         <CircleX size={22} color="black" />
//       </TouchableOpacity>
//       {/* <View style={styles.quantityContainer}>
//         <TouchableOpacity
//           style={styles.quantityBtn1}
//           onPress={decrementQuantity}>
//           <Text style={styles.quantityBtnText}>−</Text>
//         </TouchableOpacity>
//         <Text style={styles.quantityText}>{quantity}</Text>
//         <TouchableOpacity
//           style={styles.quantityBtn2}
//           onPress={incrementQuantity}>
//           <Text style={styles.quantityBtnText}>+</Text>
//         </TouchableOpacity>
//       </View> */}
//       <View style={{backgroundColor: '#FFF', borderRadius: 10, marginTop: 5}}>
//         <TouchableOpacity
//           style={styles.addToCartButton}
//           onPress={handleViewCart}>
//           <Text style={styles.quantityBtnText}>View cart</Text>
//           <ShoppingCart color="black" />
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// };

// export default CartModal;

// const styles = StyleSheet.create({
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     borderColor: '#CCC',
//     // marginRight: 15,
//   },
//   quantityBtn1: {
//     width: 30,
//     // height: 20,
//     borderRightWidth: 1,
//     borderColor: '#CCC',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityBtn2: {
//     width: 30,
//     // height: 20,
//     borderColor: '#CCC',
//     borderLeftWidth: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityBtnText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#000',
//   },
//   quantityText: {
//     paddingHorizontal: 10,
//     fontSize: 16,
//   },
//   addToCartButton: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     alignItems: 'center',
//   },
//   addToCartText: {
//     color: '#000',
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../redux/slices/addToCartSlice';
import {setSelectedVariant} from '../../redux/slices/productSlice';
import {useNavigation} from '@react-navigation/native';
import {closeModal} from '../../redux/slices/modalSlice';
import {ROUTES} from '../../constants/routes';
import LinearGradient from 'react-native-linear-gradient';
import {CircleX, ShoppingCart} from 'lucide-react-native';

const {height} = Dimensions.get('window');

const CartModal = ({product}) => {
  const dispatch = useDispatch();
  const selectedVariant = useSelector(state => state.product.selectedVariant);
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animation when the component mounts
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    // Animate out before closing
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(closeModal());
    });
  };

  const handleAddToCart = (productId, variant, quantity) => {
    if (quantity < 1) {
      Alert.alert('Error', 'Please select at least 1 item');
      return;
    }

    dispatch(addToCart({productId, variant, quantity}))
      .unwrap()
      .catch(err => {
        Alert.alert('Error', err.message || 'Failed to add to cart');
      });
    dispatch(setSelectedVariant(null));
    handleClose();
    navigation.navigate(ROUTES.CART);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleViewCart = () => {
    handleClose();
    navigation.navigate(ROUTES.CART);
  };

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={handleClose}
        activeOpacity={1}
      />

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <LinearGradient
          colors={['#1B2B48', '#2D4565']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <CircleX size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* <Text style={styles.titleText}>
              {product?.name || 'Product'}{' '}
              {selectedVariant ? `(${selectedVariant})` : ''}
            </Text> */}

            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={decrementQuantity}>
                  <Text style={styles.quantityBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={incrementQuantity}>
                  <Text style={styles.quantityBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() =>
                  handleAddToCart(product?._id, selectedVariant, quantity)
                }
                disabled={!selectedVariant && !product}>
                <Text style={styles.buttonText}>Add to Cart</Text>
                <ShoppingCart color="white" size={18} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewCartButton}
                onPress={handleViewCart}>
                <Text style={styles.viewCartText}>View Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

export default CartModal;

const styles = StyleSheet.create({
  overlay: {
    // position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '100%',
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: -5,
  },
  body: {
    paddingVertical: 8,
  },
  titleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  quantitySection: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  quantityBtn: {
    width: 40,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  quantityText: {
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    minWidth: 30,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  addToCartButton: {
    backgroundColor: '#3C5D87',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  viewCartButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  },
  viewCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
