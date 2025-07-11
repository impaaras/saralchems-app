import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
  Platform,
  FlatList,
  Animated,
  Easing,
  Vibration,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/routes';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart, getCart} from '../../redux/slices/addToCartSlice';
import {closeModal, openModal} from '../../redux/slices/modalSlice';
import Icon from 'react-native-vector-icons/Fontisto';
import {setSelectedVariant} from '../../redux/slices/newCart';
import {PackageCheck, RotateCw, X} from 'lucide-react-native';
import {setVariants} from '../../redux/slices/cartSlice';
import {toggleShowVariants} from '../../redux/slices/authSlice';
import {selectVariant, triggerHaptic} from '../../utils/function/function';
import {extractQuantityPrefix} from '../../utils/function/removeVariantCharacter';
import {fallbackImg} from '../../utils/images';
import ScrollImage from '../../components/ScrollImage/Index';
import {
  moderateScale,
  verticalScale,
  scale,
} from '../../utils/Responsive/responsive';

// Enhanced Custom dropdown component with animations
const Dropdown = ({options, selectedValue, onSelect, label}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedScale = useRef(new Animated.Value(0.95)).current;

  const toggleDropdown = () => {
    triggerHaptic('medium');
    setIsOpen(!isOpen);

    if (!isOpen) {
      // Opening animation
      Animated.parallel([
        Animated.spring(animatedHeight, {
          toValue: options.length * 45,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(animatedOpacity, {
          toValue: 1,
          useNativeDriver: false,
          tension: 120,
          friction: 7,
        }),
        Animated.spring(animatedScale, {
          toValue: 1,
          useNativeDriver: false,
          tension: 120,
          friction: 7,
        }),
      ]).start();
    } else {
      // Closing animation
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(animatedScale, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={toggleDropdown}
        activeOpacity={0.8}>
        <Text style={styles.dropdownText}>{selectedValue}</Text>
        <Animated.Text
          style={[
            styles.dropdownIcon,
            {
              transform: [
                {
                  rotate: animatedOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}>
          ▼
        </Animated.Text>
      </TouchableOpacity>
      {isOpen && (
        <Animated.View
          style={[
            styles.dropdownOptions,
            {
              height: animatedHeight,
              opacity: animatedOpacity,
              transform: [{scale: animatedScale}],
            },
          ]}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownOption}
              onPress={() => {
                triggerHaptic('medium');
                onSelect(option);
                setIsOpen(false);
              }}
              activeOpacity={0.7}>
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

// Enhanced Quantity selector component with animations
const QuantitySelector = ({quantity, setQuantity, unit, enabled}) => {
  const activeProduct = useSelector(state => state.newCart.activeProduct);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const incrementAnim = useRef(new Animated.Value(1)).current;
  const decrementAnim = useRef(new Animated.Value(1)).current;

  const animateButton = animValue => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(animValue, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const increment = () => {
    triggerHaptic('medium');
    animateButton(incrementAnim);
    setQuantity(prev => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      triggerHaptic('medium');
      animateButton(decrementAnim);
      setQuantity(prev => prev - 1);
    }
  };

  let trueValue = !(
    activeProduct?.selectedVariant &&
    (!enabled || enabled === '')
  );

  return (
    <View style={styles.quantityContainer}>
      <View style={styles.quantityControls}>
        <Animated.View style={{transform: [{scale: decrementAnim}]}}>
          <TouchableOpacity
            style={[styles.quantityButton, trueValue && styles.disabledButton]}
            disabled={trueValue}
            onPress={decrement}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.quantityButtonText,
                trueValue && styles.disabledText,
              ]}>
              −
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            styles.quantityValueContainer,
            {transform: [{scale: scaleAnim}]},
          ]}>
          <Text style={styles.quantityValue}>{quantity}</Text>
        </Animated.View>
        <Animated.View style={{transform: [{scale: incrementAnim}]}}>
          <TouchableOpacity
            style={[styles.quantityButton, trueValue && styles.disabledButton]}
            disabled={trueValue}
            onPress={increment}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.quantityButtonText,
                trueValue && styles.disabledText,
              ]}>
              +
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

// Enhanced Option Button with animations
const OptionButton = ({label, selected, onPress, idx, item}) => {
  const activeProduct = useSelector(state => state.newCart.activeProduct);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  let newSelected = `${label}AFTER${idx}${item.parentId}${item._id}`;
  const selectedVariantTrimmed =
    activeProduct?.selectedVariant?.length > newSelected.length
      ? activeProduct?.selectedVariant.slice(0, -1)
      : activeProduct?.selectedVariant;

  const isSelected = selectedVariantTrimmed === newSelected;

  const handlePress = () => {
    triggerHaptic('selection');
    // Button press animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });

    onPress();
  };

  useEffect(() => {
    if (isSelected) {
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isSelected]);

  return (
    <Animated.View
      style={{
        transform: [{scale: scaleAnim}],
        opacity: opacityAnim,
      }}>
      <TouchableOpacity
        style={[styles.optionButton, isSelected && styles.selectedOption]}
        onPress={handlePress}
        activeOpacity={0.8}>
        <Text
          style={[
            styles.optionButtonText,
            isSelected && styles.selectedOptionText,
          ]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProductModal = ({product}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [customValue, setCustomValue] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedSize, setSelectedSize] = useState(null);
  const selectedProductItem = useSelector(state => state.cart.selectedProduct);

  // Animation refs
  const slideAnim = useRef(new Animated.Value(dimensions.height)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {items, loading, error} = useSelector(state => state.addToCart);

  const productData = product;

  // Initialize modal entrance animation
  useEffect(() => {
    // Entrance animation sequence
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle bounce animation for attention
    setTimeout(() => {
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 500);
  }, []);

  // Handle screen dimension changes for responsiveness
  // useEffect(() => {
  //   const subscription = Dimensions.addEventListener('change', ({window}) => {
  //     setDimensions(window);
  //   });
  //   return () => subscription?.remove();
  // }, []);

  // useEffect(() => {
  //   dispatch(getCart());
  // }, [dispatch]);

  const categoryName = useSelector(state => state.product.categoryName);
  const selectedVariant = useSelector(state => state.product.selectedVariant);

  const handleShowMore = product => {
    triggerHaptic('light');
    dispatch(closeModal());
    navigation.navigate(ROUTES.PRODUCT_DETAILS, {product});
  };

  const handleAddToCart = (productId, variant, quantity, itemId) => {
    triggerHaptic('medium');
    const last8 = variant.slice(-8);
    const last8OfItemId = itemId.slice(-8);

    if (last8 === last8OfItemId) {
      dispatch(
        openModal({
          modalType: 'ViewCart',
          callbackId: '123',
        }),
      );
    } else {
      setVariants(null);
    }
    let newVariant;
    if (customValue && customValue.trim() !== '') {
      newVariant = customValue.trim();
      dispatch(setSelectedVariant(null));
    } else {
      newVariant = extractQuantityPrefix(variant);
    }

    dispatch(addToCart({productId, variant: newVariant, quantity}))
      .unwrap()
      .catch(err => {
        showAlert({
          title: 'Error',
          message: err.message,
          acceptText: 'OK',
        });
      });
    dispatch(
      openModal({
        modalType: 'ViewCart',
        callbackId: '123',
      }),
    );
    dispatch(setSelectedVariant(null));
  };

  const handleAddToCartMachineProduct = (productId, quantity) => {
    triggerHaptic('medium');
    let variant = 'no variant';
    dispatch(addToCart({productId, variant, quantity}))
      .unwrap()
      .catch(err => {
        showAlert({
          title: 'Error',
          message: err.message,
          acceptText: 'OK',
        });
      });
    dispatch(
      openModal({
        modalType: 'ViewCart',
        callbackId: '123',
      }),
    );
    dispatch(setSelectedVariant(null));
  };

  const handleClose = () => {
    triggerHaptic('light');

    // Exit animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: dimensions.height,
        duration: 250,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(
        closeModal({
          modalType: 'VARIANT_MODAL',
          callbackId: '123',
        }),
      );
    });
  };

  const handleShowVariants = (variantArray, parentIndex, parentId) => {
    triggerHaptic('selection');

    const updatedVariants = variantArray.map(v => ({
      label: v,
      parentIndex,
      parentId,
    }));
    dispatch(setVariants(updatedVariants));
    dispatch(toggleShowVariants());
    dispatch(
      openModal({
        modalType: 'VARIANT_MODAL',
        callbackId: '123',
      }),
    );
  };

  const handleVariantSelect = (variant, index, parentId, productId) => {
    triggerHaptic('selection');
    selectVariant(dispatch, variant, index, parentId, productId);
    setCustomValue('');
  };

  useEffect(() => {
    if (customValue != '') {
      selectVariant(dispatch, customValue);
    }
  }, [customValue]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const calculateTotal = (variant, quantity) => {
    if (!variant) return '';
    const cleanVariant = variant.split(/AFTER|"/i)[0].trim();

    const match = cleanVariant.match(/^(.*?)(\d+(\.\d+)?)\s*(kg|gm|ltr)$/i);

    if (match) {
      const namePart = match[1].trim();
      const value = parseFloat(match[2]);
      const unit = match[4].toLowerCase();
      const total = value * quantity;

      const formattedTotal =
        unit === 'gm' && total >= 1000
          ? `${(total / 1000).toFixed(2)}kg`
          : `${total}${unit}`;

      return namePart ? `${namePart} ${formattedTotal}` : formattedTotal;
    }

    return cleanVariant;
  };

  const flatListRef = useRef(null);
  const images = [
    '6835f4c60a5e90b467049ddf',
    '6835f4c50a5e90b467049ddd',
    '683568b5a45bd79a89b93bcf',
    '683568b6a45bd79a89b93bd1',
    '683568b8a45bd79a89b93bd3',
  ];

  const activeProduct = useSelector(state => state.newCart.activeProduct);

  return (
    <Animated.View
      style={[
        {
          justifyContent: 'flex-end',
        },
        {
          opacity: backgroundOpacity,
        },
      ]}>
      <Animated.View
        style={[
          {
            backgroundColor: '#E0EBF9',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            maxHeight: dimensions.height * 0.9,
          },
          {
            transform: [{translateY: slideAnim}, {scale: scaleAnim}],
            opacity: fadeAnim,
          },
        ]}>
        <View
          style={[styles.modalContent, {maxHeight: dimensions.height * 0.8}]}>
          <Animated.ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            style={{opacity: fadeAnim}}>
            <Animated.View
              style={{
                transform: [{scale: bounceAnim}],
                marginLeft: -23,
              }}>
              {!product?.image ||
              product.image.length === 0 ||
              product?.item?.length === 0 ? (
                <ScrollImage image={images} />
              ) : (
                <ScrollImage image={product?.image} />
              )}
            </Animated.View>
            <Animated.View
              style={{
                marginHorizontal: scale(10),
                marginTop: scale(10),
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}>
              <Text style={styles.title}>{selectedProductItem.name}</Text>
            </Animated.View>

            <Animated.View
              style={{
                backgroundColor: '#E5F1FF',
                paddingTop: 10,
                margin: 10,
                borderRadius: 10,
                paddingHorizontal: 10,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '65%',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.infoLabel}>Category :</Text>
                  <Text style={{fontSize: moderateScale(12), flex: 1}}>
                    {product?.categorySubcategoryPairs[0]?.categoryId.name}
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    marginBottom: 10,
                    width: '40%',
                    flexDirection: 'row',
                    alignItems: 'right',
                  }}>
                  <Text style={styles.infoLabel}>Brand :</Text>
                  <Text style={styles.infoValue}>
                    {selectedProductItem.brand || 'None'}
                  </Text>
                </View>
              </View>

              <View style={styles.optionsSection}>
                <View
                  style={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {selectedProductItem &&
                      selectedProductItem?.variants
                        .slice(0, 3)
                        .map((size, index) => (
                          <View key={index}>
                            {size === 'loose' ||
                            size === 'losse' ||
                            size === 'Custom' ||
                            size === 'Custom (Kg)' ||
                            size === 'custom (kg)' ? (
                              <Animated.View
                                style={{
                                  opacity: fadeAnim,
                                  transform: [
                                    {
                                      translateX: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0],
                                      }),
                                    },
                                  ],
                                }}>
                                <TextInput
                                  style={styles.customInput}
                                  placeholder="Enter your Value"
                                  value={customValue}
                                  onChangeText={text => {
                                    triggerHaptic('light');
                                    setCustomValue(text);
                                  }}
                                />
                              </Animated.View>
                            ) : (
                              <OptionButton
                                key={`${index}`}
                                label={size}
                                selected={selectedSize === size}
                                onPress={() =>
                                  handleVariantSelect(
                                    size,
                                    index,
                                    selectedProductItem.parentId,
                                    selectedProductItem._id,
                                  )
                                }
                                idx={index}
                                item={selectedProductItem}
                              />
                            )}
                          </View>
                        ))}
                  </ScrollView>
                  {selectedProductItem.variants?.length > 3 && (
                    <Animated.View
                      style={{
                        opacity: fadeAnim,
                        transform: [
                          {
                            scale: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.8, 1],
                            }),
                          },
                        ],
                      }}>
                      <TouchableOpacity
                        style={styles.moreButton}
                        onPress={() => {
                          triggerHaptic('selection');
                          handleShowVariants(
                            selectedProductItem.variants,
                            selectedProductItem.parentId,
                            selectedProductItem._id,
                          );
                        }}
                        activeOpacity={0.8}>
                        <Text style={styles.moreButtonText}>+</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold', fontSize: 12}}>Unit: </Text>
                  <Text style={{fontSize: 12}}>ltr</Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.descriptionContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [40, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <Text style={styles.descriptionTitle}>Product Description:</Text>
              <Text
                style={styles.descriptionText}
                numberOfLines={showMore ? undefined : 3}>
                Our Nylon (12 No. 54" (NxM)) is a high-quality, durable
                synthetic fabric designed for multiple industrial and commercial
                applications. Made from premium-grade nylon fibers, this fabric
                offers excellent strength, flexibility, and resistance to wear
                and tear.
              </Text>
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => handleShowMore(product)}
                activeOpacity={0.8}>
                <Text style={styles.showMoreText}>
                  {showMore ? 'Show Less' : 'Show More'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.ScrollView>

          <Animated.View
            style={{
              backgroundColor: '#FFF',
              paddingBottom: 10,
              paddingTop: 10,
              borderRadius: 20,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            }}>
            {/* Total Quantity */}
            <View style={styles.totalQtyContainer}>
              <Text style={styles.totalQtyText}>
                Total Qty:{' '}
                {customValue ||
                  calculateTotal(activeProduct?.selectedVariant, quantity) ||
                  ''}
              </Text>
            </View>

            {/* Quantity and Add to Cart */}
            <View style={styles.actionContainer}>
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                unit={productData.unit}
                enabled={customValue}
              />

              {categoryName === 'Textile Printing Machines' ||
              !selectedProductItem?.variants.length ||
              activeProduct?.selectVariant ||
              categoryName === 'Machines' ? (
                <LinearGradient
                  colors={['#38587F', '#101924']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.receiptButton}>
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() =>
                      handleAddToCartMachineProduct(
                        selectedProductItem._id,
                        quantity,
                      )
                    }
                    activeOpacity={0.8}>
                    <Text style={styles.addToCartText}>Add To Cart</Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : (
                <LinearGradient
                  colors={['#38587F', '#101924']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.receiptButton}>
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    disabled={activeProduct?.selectedVariant === null}
                    onPress={() =>
                      handleAddToCart(
                        selectedProductItem._id,
                        activeProduct?.selectedVariant,
                        quantity,
                        selectedProductItem._id,
                      )
                    }
                    activeOpacity={0.8}>
                    <Text style={styles.addToCartText}>Add To Cart</Text>
                  </TouchableOpacity>
                </LinearGradient>
              )}
            </View>
          </Animated.View>
        </View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}>
          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignSelf: 'center',
              paddingVertical: verticalScale(4),
              alignItems: 'center',
            }}
            onPress={handleClose}
            activeOpacity={0.8}>
            <X size={moderateScale(18)} />
            <Text
              style={{
                marginLeft: 0,
                fontSize: moderateScale(14),
                fontWeight: '500',
              }}>
              Close
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingTop: 5,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    position: 'relative',
  },
  title: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 0,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    padding: 10,
    borderRadius: 15,
    // marginHorizontal: 10,
  },

  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: '#000',
    marginRight: 5,
  },
  infoValue: {
    fontSize: moderateScale(12),
    color: '#000',
    flex: 1,
  },
  optionsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',

    justifyContent: 'space-between',
    // marginHorizontal: 7,
    marginBottom: 5,
  },
  optionButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 5,

    borderWidth: 1,
    borderColor: '#D0E4FF',
  },
  selectedOption: {
    backgroundColor: '#3C5D86',
  },
  optionButtonText: {
    fontSize: moderateScale(12),
    color: '#000',
    fontWeight: '500',
  },
  selectedOptionText: {
    fontSize: moderateScale(12),
    color: 'white',
  },
  addButton: {
    backgroundColor: '#3C5D86',
    borderRadius: 10,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  addButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  customInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customInput: {
    width: width * 0.5, // <-- 70% of device width
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 5,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#D0E4FF',
  },
  unitLabel: {
    fontSize: 12,
    color: '#555',
    textAlign: 'right',
  },
  dropdownsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 5,
  },
  dropdownContainer: {
    width: '31%',
    marginBottom: 10,
  },
  dropdownLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0E4FF',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#333',
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 5,
    zIndex: 1000,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#D0E4FF',
    maxHeight: 150,
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#333',
  },
  descriptionContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    // marginHorizontal: 5,
    marginBottom: 15,
  },
  descriptionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: moderateScale(12),
    color: '#555',
    // lineHeight: 20,
  },
  showMoreButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  showMoreText: {
    fontSize: moderateScale(14),
    color: '#3C5D86',
    fontWeight: '500',
  },
  totalQtyContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  totalQtyText: {
    fontSize: moderateScale(14),

    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  quantityLabel: {
    fontSize: scale(10),
    color: '#333',
    marginRight: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  quantityButton: {
    width: scale(30),
    height: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderLeftColor: '#CCC',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRightColor: '#CCC',
  },
  quantityButtonText: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    color: '#3C5D86',
  },
  quantityValueContainer: {
    paddingHorizontal: moderateScale(12),
  },
  quantityValue: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#333',
  },
  unitText: {
    fontSize: moderateScale(14),
    color: '#555',
    marginLeft: 10,
  },
  addToCartButton: {
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(7),
  },
  addToCartText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    // marginLeft: -10,
    // paddingRight: 10,
    color: 'white',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3C5D87',
    paddingHorizontal: 6,
    borderRadius: 100,
  },
  moreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  moreButton: {
    backgroundColor: '#3C5D85',
    borderRadius: 3,
    width: 24,
    marginBottom: 9,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductModal;
