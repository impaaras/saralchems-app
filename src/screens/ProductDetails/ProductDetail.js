import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import LinearGradient from 'react-native-linear-gradient';
import {fallbackImg} from '../../utils/images';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart, getCart} from '../../redux/slices/addToCartSlice';
import {ROUTES} from '../../constants/routes';
import {setSelectedVariant} from '../../redux/slices/productSlice';
import {setVariants} from '../../redux/slices/cartSlice';
import {toggleShowVariants} from '../../redux/slices/authSlice';
import {closeModal, openModal} from '../../redux/slices/modalSlice';
import styles from './ProductDetail.styles';

// Option button component
const OptionButton = ({label, selected, onPress, idx}) => {
  const selectedVariant = useSelector(state => state.product.selectedVariant);
  let newSelected = `${label}${idx}`;
  return (
    <TouchableOpacity
      style={[
        styles.optionButton,
        selectedVariant === newSelected && styles.selectedOption,
      ]}
      onPress={onPress}>
      {selectedVariant !== newSelected ? (
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
  const [quantity, setQuantity] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [customValue, setCustomValue] = useState('');
  const route = useRoute();
  const {product} = route.params;

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    console.log(quantity);
    setQuantity(quantity + 1);
  };

  const dispatch = useDispatch();
  const {items, loading, error} = useSelector(state => state.addToCart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const categoryName = useSelector(state => state.product.categoryName);

  const handleAddToCart = (productId, variant, quantity) => {
    console.log('hlo', quantity);
    dispatch(addToCart({productId, variant, quantity}))
      .unwrap()
      .catch(err => {
        Alert.alert('Error', err.message || 'Failed to add to cart');
      });
    dispatch(setSelectedVariant(null));
    dispatch(closeModal());
    navigation.navigate(ROUTES.CART);
  };

  const selectVariant = (variant, index) => {
    let newVariantName = `${variant}${index}`;
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

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader name={product?.name} />
      <ScrollView
        style={styles.productContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: fallbackImg(),
            }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product?.name}</Text>

          {/* Product Details Row */}
          <View style={styles.detailsRow}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>Textile Auxiliaries</Text>
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
            {/* SKU and Input Row */}
            <View style={styles.skuRow}>
              {product &&
                product.variants.map((size, sizeIndex) => (
                  <View key={`${size._id}-${sizeIndex}`}>
                    {size === 'loose' || size === 'losse' ? (
                      <View style={styles.customInputContainer}>
                        <TextInput
                          style={styles.customInput}
                          placeholder="Enter your Value"
                          value={customValue}
                          onChangeText={setCustomValue}
                          keyboardType="numeric"
                        />
                      </View>
                    ) : (
                      <OptionButton
                        key={`${sizeIndex}`}
                        label={size}
                        selected={selectedSize === size}
                        onPress={() => selectVariant(size, sizeIndex)}
                        idx={sizeIndex}
                      />
                    )}
                  </View>
                ))}

              <TouchableOpacity
                style={styles.plusButton}
                onPress={() => handleShowVariants(product.variants)}>
                <Icon name="add" size={20} color="#FFF" />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.orderButton}
                onPress={() => dispatch(setSelectedVariant('No variant'))}>
                <Text style={styles.orderButtonText}>Don't know</Text>
              </TouchableOpacity> */}
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

      <View style={styles.bottomActions}>
        {selectedVariant === null && (
          <Text
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignSelf: 'center',
              textAlign: 'center',
              color: 'red',
              marginBottom: 10,
              width: '80%',
            }}>
            ** Please select a variant before adding the item to your cart. **
          </Text>
        )}
        <View style={styles.totalQty}>
          <Text style={styles.totalQtyText}>Total Qty: 400 L</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityBtn1}
              onPress={decrementQuantity}>
              <Text style={styles.quantityBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityBtn2}
              onPress={incrementQuantity}>
              <Text style={styles.quantityBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={['#1B2B48', '#2D4565']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{borderRadius: 100}}>
            <TouchableOpacity
              style={styles.addToCartButton}
              disabled={selectedVariant === null}
              onPress={() =>
                handleAddToCart(product._id, selectedVariant, quantity)
              }>
              <Text style={styles.addToCartText}>Add To Cart</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetail;
