import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState, useMemo, useCallback} from 'react';
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

const ProductList = ({title, products}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Memoize filtered products to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return title === 'Shop By Category'
      ? products.filter(product => product?.subcategories?.length > 0)
      : products;
  }, [products, title]);

  const animationScalesRef = useRef([]);
  const fadeAnimsRef = useRef([]);
  const allProductsScaleAnim = useRef(new Animated.Value(1)).current;
  const allProductsFadeAnim = useRef(new Animated.Value(0)).current;

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);

  // Initialize animations when products change
  useEffect(() => {
    if (filteredProducts.length === 0) {
      setAnimationsInitialized(true);
      return;
    }

    // Reset animation arrays
    animationScalesRef.current = [];
    fadeAnimsRef.current = [];

    // Create new animated values for each product
    filteredProducts.forEach(() => {
      animationScalesRef.current.push(new Animated.Value(1));
      fadeAnimsRef.current.push(new Animated.Value(0));
    });

    setAnimationsInitialized(true);
  }, [filteredProducts]);

  // Start animations when animations are initialized
  useEffect(() => {
    if (animationsInitialized && filteredProducts.length > 0 && !isAnimating) {
      startAnimations();
    }
  }, [animationsInitialized, filteredProducts.length, isAnimating]);

  const startAnimations = useCallback(() => {
    if (isAnimating || filteredProducts.length === 0) return;

    setIsAnimating(true);

    // Prepare animations for all product cards
    const productAnimations = filteredProducts.map((_, index) =>
      Animated.parallel([
        Animated.timing(fadeAnimsRef.current[index], {
          toValue: 1,
          duration: 400,
          delay: index * 50,
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
            duration: 400,
            delay: filteredProducts.length * 50,
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
      Animated.stagger(30, productAnimations).start(() => {
        setIsAnimating(false);
      });
    } else {
      setIsAnimating(false);
    }
  }, [
    filteredProducts,
    title,
    isAnimating,
    allProductsFadeAnim,
    allProductsScaleAnim,
  ]);

  const getAnimatedValues = (index, isAllProducts = false) => {
    if (isAllProducts) {
      return {
        scale: allProductsScaleAnim,
        fade: allProductsFadeAnim,
      };
    }

    if (animationScalesRef.current[index] && fadeAnimsRef.current[index]) {
      return {
        scale: animationScalesRef.current[index],
        fade: fadeAnimsRef.current[index],
      };
    }

    // Fallback values
    return {
      scale: new Animated.Value(1),
      fade: new Animated.Value(1),
    };
  };

  const handlePressIn = useCallback(index => {
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
  }, []);

  const handlePressOut = useCallback(index => {
    const {scale} = getAnimatedValues(index);
    if (scale) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  const handleAllProductsPressIn = useCallback(() => {
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
  }, []);

  const handleAllProductsPressOut = useCallback(() => {
    const {scale} = getAnimatedValues(0, true);
    if (scale) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  const handleProductItem = useCallback(
    (item, index) => {
      dispatch(setCategoryName(item.name));
      console.log(item, 'data new ');
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
    },
    [dispatch, navigation],
  );

  const handleViewAllProducts = useCallback(() => {
    HapticFeedback.trigger('impactLight', hapticOptions);
    navigation.navigate('products');
  }, [navigation]);

  // Show shimmer while animations are not initialized
  if (!animationsInitialized) {
    return (
      <View style={styles.shimmerContainer}>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <ProductListShimmer key={`shimmer-${index}`} />
        ))}
      </View>
    );
  }

  // Don't render if no products exist after filtering
  if (filteredProducts.length === 0) {
    return null;
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
          return (
            <Animated.View
              key={`${product._id}-${index}`} // Use product ID + index for unique key
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
      </ScrollView>
    </View>
  );
};

export default ProductList;
