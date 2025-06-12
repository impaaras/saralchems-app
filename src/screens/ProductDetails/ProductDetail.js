import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import LinearGradient from 'react-native-linear-gradient';
import {fallbackImg} from '../../utils/images';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart, getCart} from '../../redux/slices/addToCartSlice';
import {ROUTES} from '../../constants/routes';
import {setActiveProduct, setSelectedVariant} from '../../redux/slices/newCart';
import {setVariants} from '../../redux/slices/cartSlice';
import {toggleShowVariants} from '../../redux/slices/authSlice';
import {closeModal, openModal} from '../../redux/slices/modalSlice';
import styles from './ProductDetail.styles';
import ZoomableImage from '../../components/ImageZoom/ImageZoom';
import {extractQuantityPrefix} from '../../utils/function/removeVariantCharacter';

import {useAlert} from '../../context/CustomAlertContext';
import ImageZoomModal from '../../components/ImageZoom/ImageZoom';
import ScrollImage from '../../components/ScrollImage/Index';

const {width: screenWidth} = Dimensions.get('window');

// Option button component
const OptionButton = ({
  label,
  selected,
  onPress,
  idx,
  parentId,
  productId,
  activeVariant,
}) => {
  const activeProduct = useSelector(state => state.newCart.activeProduct);
  let newSelected = `${label}AFTER${idx}${parentId}${productId}`;
  return (
    <TouchableOpacity
      style={[
        styles.optionButton,
        activeProduct?.selectedVariant === newSelected && styles.selectedOption,
      ]}
      onPress={onPress}>
      {activeProduct?.selectedVariant !== newSelected ? (
        <Text style={styles.optionButtonText}>{label}</Text>
      ) : (
        <Text style={styles.selectedOptionText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

// Expandable section component
const ExpandableSection = ({title, children}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setExpanded(!expanded)}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Icon
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#000"
        />
      </TouchableOpacity>

      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

const ProductDetail = () => {
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [customValue, setCustomValue] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef(null);
  const route = useRoute();
  const {product, parentIndex, activeVariant} = route.params;
  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');

  const images = [
    '6835f4c60a5e90b467049ddf',
    '6835f4c50a5e90b467049ddd',
    '683568b5a45bd79a89b93bcf',
    '683568b6a45bd79a89b93bd1',
    '683568b8a45bd79a89b93bd3',
  ];

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const dispatch = useDispatch();
  const {items, loading, error} = useSelector(state => state.addToCart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const categoryName = useSelector(state => state.product.categoryName);

  const {showAlert} = useAlert();
  const handleAddToCart = (productId, variant, quantity) => {
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
          message: error.message,
          acceptText: 'OK',
        });
        // Alert.alert('Error', err.message || 'Failed to add to cart');
      });
    dispatch(setSelectedVariant(null));
    setQuantity(1);
    setCustomValue('');
    dispatch(
      openModal({
        modalType: 'ViewCart',
        callbackId: '123',
      }),
    );
  };
  const handleAddToCartWithMachines = (productId, quantity) => {
    let variant = 'no variant';
    dispatch(addToCart({productId, variant, quantity}))
      .unwrap()
      .catch(err => {
        showAlert({
          title: 'Error',
          message: err.message,
          acceptText: 'OK',
        });
        // Alert.alert('Error', err.message || 'Failed to add to cart');
      });
    dispatch(setSelectedVariant(null));
    setQuantity(1);
    dispatch(
      openModal({
        modalType: 'ViewCart',
        callbackId: '123',
      }),
    );
  };

  const selectVariant = (variant, index, parentIndex, productId) => {
    let newVariantName = `${variant}AFTER${index}${parentIndex}${productId}`;
    dispatch(setSelectedVariant(newVariantName));
  };

  const handleShowVariants = variantArray => {
    dispatch(setVariants(variantArray));
    dispatch(toggleShowVariants());
    dispatch(
      openModal({
        modalType: 'VARIANT_MODAL',

        callbackId: '123', // optional
      }),
    );
  };

  const selectedVariant = useSelector(state => state.product.selectedVariant);
  const selectedProductItem = useSelector(state => state.cart.selectedProduct);

  function checkVariantsValue() {
    if (activeProduct?.selectedVariant !== null && product?._id) {
      const productIdLast8 = product?._id.slice(-8);
      const variantLast8 = activeProduct?.selectedVariant.slice(-8);

      if (productIdLast8 === variantLast8) {
        return false;
      } else {
        return true;
      }
    }
    return true; // default false if conditions not met
  }

  const cleanVariant = variant => {
    if (!variant) return '';
    return variant.split('"')[0];
  };

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
          ? `${parseFloat((total / 1000).toFixed(1))}kg`
          : `${parseFloat(total.toFixed(1))}${unit}`;

      return namePart ? `${namePart} ${formattedTotal}` : formattedTotal;
    }

    // fallback if no match
    return cleanVariant;
  };

  const activeProduct = useSelector(state => state.newCart.activeProduct);

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader name={product?.name} />
      <ScrollView
        style={styles.productContent}
        showsVerticalScrollIndicator={false}>
        {!product?.image || product?.item?.length === 0 ? (
          <ScrollImage product={images} />
        ) : (
          <ScrollImage product={product} />
        )}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product?.name}</Text>

          {/* Product Details Row */}
          <View style={styles.detailsRow}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>
                  {product?.categorySubcategoryPairs[0]?.categoryId.name}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Brand:</Text>
                <Text style={styles.detailValue}>{product?.brand}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Units (in):</Text>
                <Text style={styles.detailValue}>ltr</Text>
              </View>
            </View>
            <View style={styles.skuRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listVariant}>
                {product &&
                  product.variants.slice(0, 7)?.map((size, sizeIndex) => (
                    <View
                      key={`${size._id || size}-${sizeIndex}`}
                      style={{
                        marginRight: 0,
                      }}>
                      {size === 'loose' || size === 'losse' ? (
                        <View style={styles.customInputContainer}>
                          <TextInput
                            style={styles.customInput}
                            placeholder="Enter your Value"
                            value={customValue}
                            onChangeText={value => {
                              setCustomValue(value);
                              selectVariant(null);
                            }}
                            keyboardType="numeric"
                          />
                        </View>
                      ) : (
                        <OptionButton
                          label={size}
                          selected={selectedSize === size}
                          onPress={() =>
                            selectVariant(
                              size,
                              sizeIndex,
                              parentIndex,
                              product?._id,
                            )
                          }
                          idx={sizeIndex}
                          parentId={parentIndex}
                          productId={product?._id}
                          activeVariant={activeVariant}
                        />
                      )}
                    </View>
                  ))}
              </ScrollView>

              {product?.variants?.length > 3 && (
                <TouchableOpacity
                  style={styles.plusButton}
                  onPress={() => handleShowVariants(product.variants)}>
                  <Icon name="add" size={20} color="#FFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.bottomActions}>
            <View style={styles.totalQty}>
              <Text style={styles.totalQtyText}>
                Total Qty:{' '}
                {selectedVariant?.includes('loose')
                  ? customValue
                  : calculateTotal(activeProduct?.selectedVariant, quantity)}
              </Text>
              {/* <Text style={styles.totalQtyText}>Total Qty: {customValue}</Text> */}
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityBtn1}
                  disabled={checkVariantsValue()}
                  onPress={decrementQuantity}>
                  <Text style={styles.quantityBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityBtn2}
                  disabled={checkVariantsValue()}
                  onPress={incrementQuantity}>
                  <Text style={styles.quantityBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              {categoryName === 'Machines' ? (
                <LinearGradient
                  colors={['#1B2B48', '#2D4565']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={{borderRadius: 100}}>
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() =>
                      handleAddToCartWithMachines(product._id, quantity)
                    }>
                    <Text style={styles.addToCartText}>Add To Cart</Text>
                  </TouchableOpacity>
                </LinearGradient>
              ) : (
                <LinearGradient
                  colors={['#1B2B48', '#2D4565']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={{borderRadius: 100}}>
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    disabled={
                      customValue === '' &&
                      activeProduct?.selectedVariant === null
                    }
                    onPress={() =>
                      handleAddToCart(
                        product._id,
                        customValue !== ''
                          ? customValue
                          : activeProduct?.selectedVariant,
                        quantity,
                      )
                    }>
                    <Text style={styles.addToCartText}>Add To Cart</Text>
                  </TouchableOpacity>
                </LinearGradient>
              )}
            </View>
          </View>

          {/* Product Type */}
          <Text style={styles.productType}>NYLON (12 No. 54" (NAM))</Text>

          {/* Product Description */}
          <ExpandableSection title="Product Description:">
            <Text style={styles.sectionText}>
              Our Nylon (12 No. 54" (NAM)) is a high-quality, durable synthetic
              fabric designed for multiple industrial and commercial
              applications. Made from premium-grade nylon fibers, this fabric
              offers excellent strength and abrasion resistance to wear and
              tear.
            </Text>
          </ExpandableSection>
          <ExpandableSection title="Key Features:">
            <View style={styles.featureItem}>
              <Icon name="circle" size={14} color="#5A5A5A" />
              <Text style={styles.featureText}>
                <Text style={styles.featureHighlight}>Durable & Strong:</Text>{' '}
                High tensile strength ensures longevity and reliability.
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="circle" size={14} color="#5A5A5A" />
              <Text style={styles.featureText}>
                <Text style={styles.featureHighlight}>
                  Lightweight & Flexible:
                </Text>{' '}
                Easy to handle and adaptable to various applications.
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="circle" size={14} color="#5A5A5A" />
              <Text style={styles.featureText}>
                <Text style={styles.featureHighlight}>
                  Weather & Moisture Resistant:
                </Text>{' '}
                Performs well in outdoor and humid conditions.
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="circle" size={14} color="#5A5A5A" />
              <Text style={styles.featureText}>
                <Text style={styles.featureHighlight}>Versatile Use:</Text>{' '}
                Suitable for netting, filtration, protective covers, and
                industrial purposes.
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="circle" size={14} color="#5A5A5A" />
              <Text style={styles.featureText}>
                <Text style={styles.featureHighlight}>Standard Width:</Text>{' '}
                54-inch width provides ample coverage for different projects.
              </Text>
            </View>
          </ExpandableSection>

          <ExpandableSection title="Specifications:">
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Material:</Text>
              <Text style={styles.specValue}>100% Nylon</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Mesh/Thread Size:</Text>
              <Text style={styles.specValue}>12 No. (NAM)</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Width:</Text>
              <Text style={styles.specValue}>54 inches</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Color Options:</Text>
              <Text style={styles.specValue}>
                Available in various colors upon request
              </Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Customization:</Text>
              <Text style={styles.specValue}>
                Can be tailored to specific requirements
              </Text>
            </View>
          </ExpandableSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
