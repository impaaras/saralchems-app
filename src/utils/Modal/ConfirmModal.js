import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
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
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {ROUTES} from '../../constants/routes';
import {fallbackImg} from '../images';

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
const QuantitySelector = ({quantity, setQuantity, unit}) => {
  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <View style={styles.quantityContainer}>
      <View style={styles.quantityControls}>
        <TouchableOpacity style={styles.quantityButton} onPress={decrement}>
          <Text style={styles.quantityButtonText}>−</Text>
        </TouchableOpacity>
        <View style={styles.quantityValueContainer}>
          <Text style={styles.quantityValue}>{quantity}</Text>
        </View>
        <TouchableOpacity style={styles.quantityButton} onPress={increment}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Option button component
const OptionButton = ({label, selected, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.optionButton, selected && styles.selectedOption]}
      onPress={onPress}>
      <Text
        style={[
          styles.optionButtonText,
          selected && styles.selectedOptionText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const ConfirmModal = ({title, message, onClose, product}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [customValue, setCustomValue] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedSize, setSelectedSize] = useState(null);
  const selectedProductItem = useSelector(state => state.cart.selectedProduct);

  const showVariants = useSelector(state => state.auth.showVariants);

  // Example product data structure (would come from props in real usage)
  const defaultProduct = {
    name: 'Stoving Thinner',
    category: 'Textile Auxiliaries',
    brand: 'Kayson',
    image: fallbackImg(),
    description:
      'Our Nylon (12 No. 54" (NxM)) is a high-quality, durable synthetic fabric designed for multiple industrial and commercial applications. Made from premium-grade nylon fibers, this fabric offers excellent strength, flexibility, and resistance to wear and tear.',
    variants: {
      sizes: ['20 L', '200 L'],
      dimensions: ['80*56 (N * M)'],
      meshCount: ['45', '50', '60'],
      width: ['67', '70', '75'],
      colors: ['White', 'Blue', 'Black'],
    },
    unit: 'ltr',
    totalQty: '400 L',
  };

  const productData = selectedProductItem || defaultProduct;

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

  const handleShowMore = () => {
    onClose(); // Close the modal first
    // navigation.navigate(ROUTES.PRODUCT_DETAILS);
  };
  return (
    <>
      <View style={styles.modalContainer}>
        <View
          style={[styles.modalContent, {maxHeight: dimensions.height * 0.9}]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose} // Make sure this is properly connected
              activeOpacity={0.7}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: productData.image || fallbackImg(),
                }}
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>
            <View style={{marginHorizontal: 10}}>
              <Text style={styles.title}>
                {selectedProductItem?.name || 'Product Name'}
              </Text>
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
                  <Text style={styles.infoValue}>
                    {selectedProductItem?.brand}
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
                    {selectedProductItem?.brand}
                  </Text>
                </View>
              </View>

              {hasSizes && (
                <View style={styles.optionsSection}>
                  {selectedProductItem?.variants.map((size, index) => (
                    <OptionButton
                      key={`${index}`}
                      label={size}
                      selected={selectedSize === size}
                      onPress={() => setSelectedSize(size)}
                    />
                  ))}
                  <View style={styles.customInputContainer}>
                    <TextInput
                      style={styles.customInput}
                      placeholder="Enter your Value"
                      value={customValue}
                      onChangeText={setCustomValue}
                      keyboardType="numeric"
                    />
                  </View>
                  <Text style={styles.unitLabel}>Unit : ltr</Text>
                </View>
              )}
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Product Description:</Text>
              <Text
                style={styles.descriptionText}
                numberOfLines={showMore ? undefined : 3}>
                {selectedProductItem?.description}
              </Text>
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={handleShowMore}>
                <Text style={styles.showMoreText}>
                  {showMore ? 'Show Less' : 'Show More'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View
            style={{
              backgroundColor: '#E5F1FF',
              paddingBottom: 10,
              paddingTop: 10,
              borderRadius: 20,
            }}>
            {/* Total Quantity */}
            <View style={styles.totalQtyContainer}>
              <Text style={styles.totalQtyText}>
                Total Qty: {productData.totalQty}
              </Text>
            </View>

            {/* Quantity and Add to Cart */}
            <View style={styles.actionContainer}>
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                unit={productData.unit}
              />
              <LinearGradient
                colors={['#38587F', '#101924']} // Left to right gradient colors
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.receiptButton} // Make sure the gradient covers the button
              >
                <TouchableOpacity style={styles.addToCartButton}>
                  <Text style={styles.addToCartText}>Add To Cart</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Product Modal css
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
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
    // marginHorizontal: 7,
    marginBottom: 5,
  },
  optionButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 10,
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
    marginBottom: 10,
    // width: 100,
  },
  customInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 30,
    width: '70%',
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
});

export default ConfirmModal;
