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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/routes';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart, getCart} from '../../redux/slices/addToCartSlice';
import {closeModal, openModal} from '../../redux/slices/modalSlice';
import Icon from 'react-native-vector-icons/Fontisto';
import {setSelectedVariant} from '../../redux/slices/productSlice';
// import {RotateCw} from 'lucide-react';
import {PackageCheck, RotateCw, X} from 'lucide-react-native';
import {setVariants} from '../../redux/slices/cartSlice';
import {toggleShowVariants} from '../../redux/slices/authSlice';
import {selectVariant} from '../../utils/function/function';

// Custom dropdown component
const Dropdown = ({options, selectedValue, onSelect, label}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.dropdownText}>{selectedValue}</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownOptions}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownOption}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}>
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Quantity selector component

const QuantitySelector = ({quantity, setQuantity, unit, enabled}) => {
  const selectedVariant = useSelector(state => state.product.selectedVariant);
  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  // const trueValue = !(selectedVariant && enabled === '');
  let trueValue = !(selectedVariant && (!enabled || enabled === ''));
  console.log(!enabled);

  return (
    <View style={styles.quantityContainer}>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          disabled={trueValue}
          onPress={decrement}>
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>
        <View style={styles.quantityValueContainer}>
          <Text style={styles.quantityValue}>{quantity}</Text>
        </View>
        <TouchableOpacity
          style={styles.quantityButton}
          disabled={trueValue}
          onPress={increment}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const OptionButton = ({label, selected, onPress, idx, item}) => {
  const selectedVariant = useSelector(state => state.product.selectedVariant);
  const selectedProduct = useSelector(state => state.product.selectedProduct);
  let newSelected = `${label}${idx}${item.parentId}${item._id}`;

  // Conditionally slice only if selectedVariant is longer than newSelected
  const selectedVariantTrimmed =
    selectedVariant?.length > newSelected.length
      ? selectedVariant.slice(0, -1)
      : selectedVariant;

  return (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selectedVariantTrimmed === newSelected && styles.selectedOption,
      ]}
      onPress={onPress}>
      {selectedVariantTrimmed !== newSelected ? (
        <Text style={styles.optionButtonText}>{label}</Text>
      ) : (
        <Text style={styles.selectedOptionText}>{label}</Text>
      )}
    </TouchableOpacity>
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

  const productData = product;

  // Handle screen dimension changes for responsiveness
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Determine if the product has selectable options
  const hasOptions =
    productData.variants && Object.keys(productData.variants).length > 0;

  // Determine if the product has dimension options
  const hasDimensions = productData.variants && productData.variants.dimensions;

  // Determine if the product has color options
  const hasColors = productData.variants && productData.variants.colors;

  // Determine if the product has mesh count options
  const hasMeshCount = productData.variants && productData.variants.meshCount;

  // Determine if the product has width options
  const hasWidth = productData.variants && productData.variants.width;

  // Determine if the product has size options
  const hasSizes = productData.variants && productData.variants.sizes;

  const navigation = useNavigation();

  const handleShowMore = product => {
    // dispatch(openScreen(product));
    dispatch(closeModal());
    navigation.navigate(ROUTES.PRODUCT_DETAILS, {product});
  };

  const dispatch = useDispatch();
  const {items, loading, error} = useSelector(state => state.addToCart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const categoryName = useSelector(state => state.product.categoryName);
  const selectedVariant = useSelector(state => state.product.selectedVariant);

  const handleAddToCart = (productId, variant, quantity, itemId) => {
    const last8 = selectedVariant.slice(-8); // get last 8 characters
    const last8OfItemId = itemId.slice(-8); // get last 8 characters

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

    dispatch(addToCart({productId, variant, quantity}))
      .unwrap()
      .catch(err => {
        Alert.alert('Error', err.message || 'Failed to add to cart');
      });
    dispatch(
      openModal({
        modalType: 'ViewCart',
        callbackId: '123',
      }),
    );
    dispatch(setSelectedVariant(null));
    // dispatch(closeModal());
    // navigation.navigate(ROUTES.CART);
  };

  const handleClose = () => {
    dispatch(
      closeModal({
        modalType: 'VARIANT_MODAL',
        callbackId: '123', // optional
      }),
    );
  };
  const handleShowVariants = variantArray => {
    dispatch(setVariants(variantArray));
    dispatch(toggleShowVariants());
    dispatch(
      openModal({
        modalType: 'VARIANT_MODAL',
        callbackId: '123',
      }),
    );
  };

  const handleVariantSelect = (variant, index, parentId, productId) => {
    selectVariant(dispatch, variant, index, parentId, productId);
    setCustomValue('');
  };

  useEffect(() => {
    if (customValue != '') {
      selectVariant(dispatch, customValue);
    }
  }, [customValue]);
  // const OpenCart = itemId => {};

  const calculateTotal = (variant, quantity) => {
    const match = variant.match(/(\d+(\.\d+)?)\s*(kg|gm|ltr)/i);
    if (!match) return `${variant}`;

    const value = parseFloat(match[1]);
    const unit = match[3].toLowerCase();
    const total = value * quantity;

    if (unit === 'gm' && total >= 1000) {
      return `${total / 1000}kg`;
    }

    return `${total}${unit}`;
  };

  // const resultTotal = (variant, quantity) => {
  //   // Extract numeric part
  //   const numberMatch = variant?.match(/^\d+(\.\d+)?/);
  //   // Extract unit part
  //   const unitMatch = variant?.match(/(kg|gm|ltr|ml)/i);

  //   if (!numberMatch || !unitMatch) return '0';

  //   const value = parseFloat(numberMatch[0]);
  //   const unit = unitMatch[0].toLowerCase();
  //   const total = value * quantity;

  //   return `${total}${unit}`;
  // };

  return (
    <View style={{backgroundColor: '#E0EBF9', borderRadius: 25}}>
      <View style={[styles.modalContent, {maxHeight: dimensions.height * 0.8}]}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  productData.image ||
                  `https://s3-alpha-sig.figma.com/img/5ffb/a192/2dd4c257df96f4b702c011168d3cffb7?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=U2Smx6pgvm867-k7A3ze9tyriadTE5yxgW94WVaLEeXrisHy1MIWtdMiai20EcL5YG6b4hrFOcDFdQNmVVkxsBX7elT0vufLN7I7Adjd7Cr4mtGlSfQ7NAYYI4DZBgqfcJiRTb128mma9alrjrzQ644iFbFVSZb6cchvIiJkoh8WZbqipRUGa603jVW~CUE~bl-LB35GXPny58zzgR9tIj0A4GyLNjXefrh-A3~BLkUh7PIpKtxiEJoX4xjfx-~XCHDEklFMuEv4aLm1KGusEAD1N2p73-NAMyAdPD6KtVBHW7K9zgxKKpb7An0mDK6zoX0e1Sq06AAIBYhIcY4NFg__`,
              }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>

          <View style={{marginHorizontal: 10}}>
            <Text style={styles.title}>{selectedProductItem.name}</Text>
          </View>
          <View
            style={{
              backgroundColor: '#E5F1FF',
              paddingTop: 10,
              margin: 10,
              borderRadius: 10,
              paddingHorizontal: 10,
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  display: 'flex',
                  marginBottom: 10,
                  flexDirection: 'row',
                }}>
                <Text style={styles.infoLabel}>Category :</Text>
                <Text style={{}} numberOfLines={1} ellipsizeMode="tail">
                  {(categoryName || 'Texttile Auxlier').length > 20
                    ? `${categoryName.substring(0, 20)}...`
                    : categoryName}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  marginBottom: 10,
                  flexDirection: 'row',
                }}>
                <Text style={styles.infoLabel}>Brand :</Text>
                <Text style={styles.infoValue}>
                  {(selectedProductItem.brand || 'Kayson').length > 8
                    ? `${(selectedProductItem.brand || 'Kayson').substring(
                        0,
                        8,
                      )}...`
                    : selectedProductItem.brand || 'Kayson'}
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
                          {size === 'loose' || size === 'losse' ? (
                            <TextInput
                              style={styles.customInput}
                              placeholder="Enter your Value"
                              value={customValue}
                              onChangeText={setCustomValue}
                            />
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
                {selectedProductItem.variants.length > 3 && (
                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() =>
                      handleShowVariants(selectedProductItem.variants)
                    }>
                    <Text style={styles.moreButtonText}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 12}}>Unit: </Text>
                <Text style={{fontSize: 12}}>ltr</Text>
              </View>
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Product Description:</Text>
            <Text
              style={styles.descriptionText}
              numberOfLines={showMore ? undefined : 3}>
              Our Nylon (12 No. 54" (NxM)) is a high-quality, durable synthetic
              fabric designed for multiple industrial and commercial
              applications. Made from premium-grade nylon fibers, this fabric
              offers excellent strength, flexibility, and resistance to wear and
              tear.
              {/* {selectedProductItem?.description || productData.description} */}
            </Text>
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => handleShowMore(product)}>
              <Text style={styles.showMoreText}>
                {showMore ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View
          style={{
            backgroundColor: '#FFF',
            paddingBottom: 10,
            paddingTop: 10,
            borderRadius: 20,
          }}>
          {/* Total Quantity */}
          <View style={styles.totalQtyContainer}>
            <Text style={styles.totalQtyText}>
              Total Qty:{' '}
              {customValue || calculateTotal(selectedVariant, quantity) || ''}
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
            <LinearGradient
              colors={['#38587F', '#101924']} // Left to right gradient colors
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.receiptButton} // Make sure the gradient covers the button
            >
              <TouchableOpacity
                style={styles.addToCartButton}
                disabled={selectedVariant === null}
                onPress={() =>
                  handleAddToCart(
                    selectedProductItem._id,
                    selectedVariant,
                    quantity,
                    selectedProductItem._id,
                  )
                }>
                <Text style={styles.addToCartText}>Add To Cart</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'center',
          paddingTop: 8,
          paddingBottom: 2,
          alignItems: 'center',
        }}
        onPress={handleClose}>
        <X size={18} />
        <Text style={{marginLeft: 0, fontSize: 16, fontWeight: '500'}}>
          Close
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    fontSize: 20,
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
    backgroundColor: '#CCC',
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 10,
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
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginRight: 5,
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
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
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  selectedOptionText: {
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
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  showMoreButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  showMoreText: {
    fontSize: 14,
    color: '#3C5D86',
    fontWeight: '500',
  },
  totalQtyContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  totalQtyText: {
    fontSize: 14,
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
    fontSize: 14,
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
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderLeftColor: '#CCC',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRightColor: '#CCC',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C5D86',
  },
  quantityValueContainer: {
    paddingHorizontal: 15,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  unitText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  addToCartButton: {
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3C5D87',
    paddingVertical: 8,

    paddingHorizontal: 10,
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
