import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Easing,
} from 'react-native';
import {ROUTES} from '../../constants/routes';
import CustomText from '../../CustomText';
import {
  setCategoryName,
  setParentCategoryName,
} from '../../redux/slices/productSlice';
import {useDispatch} from 'react-redux';
import {fallbackImg} from '../../utils/images';
import styles from './List.styles';
import HapticFeedback from 'react-native-haptic-feedback';
import SafeImage from '../SafeImage/SafeImage';
import ProductListShimmer from '../../utils/Skeltons/ProductListShimmer';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const ProductList = ({title, products, onViewAll, idx}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const animationScalesRef = useRef([]);
  const fadeAnimsRef = useRef([]);
  const allProductsScaleAnim = useRef(new Animated.Value(1)).current;
  const allProductsFadeAnim = useRef(new Animated.Value(0)).current;

  const [animationsReady, setAnimationsReady] = useState(false);
  const [productsReady, setProductsReady] = useState(false); // New state to ensure products are fully loaded

  useEffect(() => {
    // Reset state
    setAnimationsReady(false);
    setProductsReady(false);

    // Wait for products to be properly set
    if (!products || products.length === 0) {
      setProductsReady(true); // If no products, mark as ready
      setAnimationsReady(true);
      return;
    }

    // Filter products first (same logic as render)
    const filteredProducts =
      title === 'Shop By Category'
        ? products?.filter(product => product?.subcategories?.length > 0)
        : products;

    // If no filtered products, mark as ready
    if (!filteredProducts || filteredProducts.length === 0) {
      setProductsReady(true);
      setAnimationsReady(true);
      return;
    }

    // Reset animated values
    animationScalesRef.current = [];
    fadeAnimsRef.current = [];

    // Create Animated.Value for each filtered product
    filteredProducts.forEach(() => {
      animationScalesRef.current.push(new Animated.Value(1));
      fadeAnimsRef.current.push(new Animated.Value(0));
    });

    // Mark products as ready
    setProductsReady(true);

    // Small delay to ensure state is updated
    setTimeout(() => {
      startAnimations(filteredProducts);
    }, 50);
  }, [products, title]);

  const startAnimations = filteredProducts => {
    // Prepare animations for all product cards
    const productAnimations = filteredProducts.map((_, index) =>
      Animated.parallel([
        Animated.timing(fadeAnimsRef.current[index], {
          toValue: 1,
          duration: 500,
          delay: index * 80,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(animationScalesRef.current[index], {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    );

    // Add "All Products" card animation if needed
    if (title === 'Shop By Category') {
      productAnimations.push(
        Animated.parallel([
          Animated.timing(allProductsFadeAnim, {
            toValue: 1,
            duration: 500,
            delay: filteredProducts.length * 80,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(allProductsScaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      );
    }

    // Start all animations together
    if (productAnimations.length > 0) {
      Animated.stagger(50, productAnimations).start(() => {
        setAnimationsReady(true);
      });
    } else {
      setAnimationsReady(true);
    }
  };

  const getAnimatedValues = (index, isAllProducts = false) => {
    if (isAllProducts) {
      return {
        scale: allProductsScaleAnim,
        fade: allProductsFadeAnim,
      };
    }
    return {
      scale: animationScalesRef.current[index],
      fade: fadeAnimsRef.current[index],
    };
  };

  const handlePressIn = index => {
    const {scale} = getAnimatedValues(index);
    if (scale) {
      HapticFeedback.trigger('impactLight', hapticOptions);
      Animated.spring(scale, {
        toValue: 0.96,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = index => {
    const {scale} = getAnimatedValues(index);
    if (scale) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAllProductsPressIn = () => {
    const {scale} = getAnimatedValues(0, true);
    if (scale) {
      HapticFeedback.trigger('impactLight', hapticOptions);
      Animated.spring(scale, {
        toValue: 0.96,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAllProductsPressOut = () => {
    const {scale} = getAnimatedValues(0, true);
    if (scale) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleProductItem = (item, index) => {
    dispatch(setCategoryName(item.name));

    if (item.subcategories) {
      dispatch(setParentCategoryName(item.name));
      navigation.navigate(ROUTES.ITEM_SCREEN, {
        subcategories: item.subcategories,
        categoryId: item._id,
        parentCategoryName: item.parentCategoryName,
        subcategoryId: item.subcategories[0]?._id,
        selectedItem: item.subcategories[0]?.name,
      });
    } else {
      dispatch(setParentCategoryName(item.parentCategoryName));
      navigation.navigate(ROUTES.ITEM_SCREEN, {
        subcategories: item.subCategories,
        categoryId: item.parentCategoryId,
        parentCategoryName: item.parentCategoryName,
        subcategoryId: item._id,
        selectedItem: item.subCategories[index]?.name,
      });
    }
  };

  const handleViewAllProducts = () => {
    HapticFeedback.trigger('impactLight', hapticOptions);
    navigation.navigate('products');
  };

  // Filter products before rendering
  const filteredProducts =
    title === 'Shop By Category'
      ? products?.filter(product => product?.subcategories?.length > 0)
      : products;

  // Don't render if products aren't ready or if no products exist
  if (!productsReady || !filteredProducts || filteredProducts.length === 0) {
    return null;
  }

  // Show basic structure while animations are preparing
  if (!animationsReady) {
    return (
      <View style={styles.shimmerContainer}>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <ProductListShimmer key={index} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="center"
        contentContainerStyle={{paddingHorizontal: 0}}
        scrollEventThrottle={16}>
        {filteredProducts.map((product, index) => {
          const {scale, fade} = getAnimatedValues(index);
          if (!scale || !fade) return null;

          return (
            <Animated.View
              key={`product-${index}`}
              style={{
                opacity: fade,
                transform: [{scale: scale}],
              }}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.productCard}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                onPress={() => handleProductItem(product, index)}>
                <SafeImage
                  sourceUri={
                    product.image
                      ? `https://api.saraldyechems.com/upload/image/${product.image}`
                      : null
                  }
                  style={styles.productImage}
                />
                <CustomText
                  style={[
                    styles.productName,
                    {fontWeight: '700', color: '#5A5A5A'},
                  ]}>
                  {product.name}
                </CustomText>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* {title === 'Shop By Category' && (
          <Animated.View
            style={{
              opacity: allProductsFadeAnim,
              transform: [{scale: allProductsScaleAnim}],
            }}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.productCard}
              onPressIn={handleAllProductsPressIn}
              onPressOut={handleAllProductsPressOut}
              onPress={handleViewAllProducts}>
              <Image
                source={{uri: fallbackImg()}}
                style={styles.productImage}
              />
              <CustomText
                style={[
                  styles.productName,
                  {fontWeight: '700', color: '#5A5A5A'},
                ]}>
                All Products
              </CustomText>
            </TouchableOpacity>
          </Animated.View>
        )} */}
      </ScrollView>
    </View>
  );
};

export default ProductList;
