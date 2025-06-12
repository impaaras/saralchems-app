import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {openModal} from '../../redux/slices/modalSlice';

const Index = ({product, reffer}) => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleImageZoom = (imageList, currentIndex) => {
    dispatch(
      openModal({
        modalType: 'ImageZoomModal',
        modalProps: {
          visible: true,
          imageList,
          currentIndex,
        },
      }),
    );
  };

  const renderDots = () => {
    if (product?.image?.length <= 1) return null;
    return (
      <View style={styles.dotsContainer}>
        {product?.image?.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              currentImageIndex === index && styles.activeDot,
            ]}
            onPress={() => {
              flatListRef.current?.scrollToIndex({
                index,
                animated: true,
              });
              setCurrentImageIndex(index);
            }}
          />
        ))}
      </View>
    );
  };

  const onScrollEnd = e => {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentImageIndex(pageNum);
  };

  const images = [
    '6835f4c60a5e90b467049ddf',
    '6835f4c50a5e90b467049ddd',
    '683568b5a45bd79a89b93bcf',
    '683568b6a45bd79a89b93bd1',
    '683568b8a45bd79a89b93bd3',
  ];

  const renderImageItem = ({item, index}) => {
    if (reffer === 'cart') {
      return (
        <TouchableOpacity
          onPress={() => handleImageZoom(product?.image, index)}
          activeOpacity={0.9}>
          <Image
            source={{
              uri: `https://api.saraldyechems.com/upload/image/${item}`,
            }}
            style={styles.cartItemImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => handleImageZoom(product?.image, index)}
          activeOpacity={0.9}>
          <View style={styles.imageSlideContainer}>
            <Image
              source={{
                uri: `https://api.saraldyechems.com/upload/image/${item}`,
              }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderImageItemWithDummyData = ({item, index}) => {
    if (reffer === 'cart') {
      return (
        <TouchableOpacity
          onPress={() => handleImageZoom(images, index)}
          activeOpacity={0.9}>
          <Image
            source={{
              uri: `https://api.saraldyechems.com/upload/image/${item}`,
            }}
            style={styles.cartItemImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => handleImageZoom(images, index)}
          activeOpacity={0.9}>
          <View style={styles.imageSlideContainer}>
            <Image
              source={{
                uri: `https://api.saraldyechems.com/upload/image/${item}`,
              }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <>
      {!product?.image || product?.item?.length === 0 ? (
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
            data={reffer === 'cart' ? [images[0]] : images}
            renderItem={renderImageItemWithDummyData}
            keyExtractor={(product, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={Dimensions.get('window').width}
            snapToAlignment="start"
          />
          {renderDots()}
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
            // data={product?.image}
            data={reffer === 'cart' ? [product?.image?.[0]] : product?.image}
            renderItem={renderImageItem}
            keyExtractor={(premium, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={Dimensions.get('window').width}
            snapToAlignment="start"
          />
          {renderDots()}
        </View>
      )}
    </>
  );
};

export default Index;

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
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    // padding: 10,
    marginBottom: 10,

    borderRadius: 15,
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
  imageSlideContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    // backgroundColor: '#F0F0F0',
  },
});
