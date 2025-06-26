// import {useNavigation} from '@react-navigation/native';
// import React, {useEffect, useRef, useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   ScrollView,
// } from 'react-native';
// import {ROUTES} from '../../constants/routes';
// import CustomText from '../../CustomText';
// import {
//   setCategoryName,
//   setParentCategoryName,
// } from '../../redux/slices/productSlice';
// import {useDispatch} from 'react-redux';
// import {fallbackImg} from '../../utils/images';
// import {getRouteName} from '../../utils/function/routeName';
// import styles from './List.styles';
// import HapticFeedback from 'react-native-haptic-feedback';

// const hapticOptions = {
//   enableVibrateFallback: true,
//   ignoreAndroidSystemSettings: false,
// };

// const ProductList = ({title, products, onViewAll, idx}) => {
//   const scrollX = useRef(new Animated.Value(0)).current;

//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const [animationScales, setAnimationScales] = useState([]);
//   const [fadeAnims, setFadeAnims] = useState([]);

//   useEffect(() => {
//     const newScales = products.map(() => new Animated.Value(1));
//     const newFades = products.map(() => new Animated.Value(0));
//     setAnimationScales(newScales);
//     setFadeAnims(newFades);

//     // Trigger fade + scale-in animation with delay for smooth appearance
//     newFades.forEach((fade, index) => {
//       Animated.parallel([
//         Animated.timing(fade, {
//           toValue: 1,
//           duration: 400,
//           delay: index * 100,
//           useNativeDriver: true,
//         }),
//         Animated.spring(newScales[index], {
//           toValue: 1,
//           friction: 5,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     });
//   }, [products]);

//   const handlePressIn = index => {
//     if (animationScales[index]) {
//       Animated.spring(animationScales[index], {
//         toValue: 0.95,
//         useNativeDriver: true,
//       }).start();
//     }
//   };

//   const handlePressOut = index => {
//     if (animationScales[index]) {
//       Animated.spring(animationScales[index], {
//         toValue: 1,
//         useNativeDriver: true,
//       }).start();
//     }
//   };

//   const handleProductItem = (item, idx) => {
//     HapticFeedback.trigger('impactLight', hapticOptions);
//     dispatch(setCategoryName(item.name));

//     if (item.subcategories) {
//       dispatch(setParentCategoryName(item.name));
//       navigation.navigate(ROUTES.ITEM_SCREEN, {
//         subcategories: item.subcategories,
//         categoryId: item._id,
//         parentCategoryName: item.parentCategoryName,
//         subcategoryId: item.subcategories[0]?._id,
//         selectedItem: item.subcategories[0]?.name,
//       });
//     } else {
//       dispatch(setParentCategoryName(item.parentCategoryName));
//       navigation.navigate(ROUTES.ITEM_SCREEN, {
//         subcategories: item.subCategories,
//         categoryId: item.parentCategoryId,
//         parentCategoryName: item.parentCategoryName,
//         subcategoryId: item._id,
//         selectedItem: item.subCategories[idx]?.name,
//       });
//     }
//   };

//   const handleAllProductsPress = () => {
//     HapticFeedback.trigger('impactLight', hapticOptions);
//     navigation.navigate('products');
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>{title}</Text>
//         <TouchableOpacity onPress={onViewAll}>
//           {title !== 'Shop By Category' && (
//             <CustomText style={styles.viewAll}>View All</CustomText>
//           )}
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         decelerationRate="fast" // 👈 smoother scroll
//         snapToAlignment="center"
//         contentContainerStyle={{paddingHorizontal: 0}}>
//         {products &&
//           products.map((product, index) => (
//             <Animated.View
//               key={index}
//               style={{
//                 opacity: fadeAnims[index] || new Animated.Value(1),
//                 transform: [
//                   {
//                     scale: animationScales[index] || new Animated.Value(1),
//                   },
//                 ],
//               }}>
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 style={styles.productCard}
//                 onPressIn={() => handlePressIn(index)}
//                 onPressOut={() => handlePressOut(index)}
//                 onPress={() => handleProductItem(product, index)}>
//                 <Image
//                   source={{
//                     uri: product.image
//                       ? `https://api.saraldyechems.com/upload/image/${product.image}`
//                       : fallbackImg(),
//                   }}
//                   style={styles.productImage}
//                 />
//                 <CustomText
//                   style={[
//                     styles.productName,
//                     {fontWeight: '700', color: '#5A5A5A'},
//                   ]}>
//                   {product.name}
//                 </CustomText>
//               </TouchableOpacity>
//             </Animated.View>
//           ))}

//         {title === 'Shop By Category' && (
//           <Animated.View
//             style={{
//               opacity: new Animated.Value(1),
//               transform: [{scale: new Animated.Value(1)}],
//             }}>
//             <TouchableOpacity
//               style={styles.productCard}
//               onPress={handleAllProductsPress}>
//               <Image
//                 source={{uri: fallbackImg()}}
//                 style={styles.productImage}
//               />
//               <CustomText
//                 style={[
//                   styles.productName,
//                   {fontWeight: '700', color: '#5A5A5A'},
//                 ]}>
//                 All Products
//               </CustomText>
//             </TouchableOpacity>
//           </Animated.View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default ProductList;

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

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const ProductList = ({title, products, onViewAll, idx}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Refs to hold the Animated.Value instances
  // We use `useRef` because we want to maintain the same Animated.Value instances
  // across renders, even when state updates.
  const animationScalesRef = useRef([]);
  const fadeAnimsRef = useRef([]);

  // Separate Animated Values for the "All Products" card
  const allProductsScaleAnim = useRef(new Animated.Value(1)).current;
  const allProductsFadeAnim = useRef(new Animated.Value(0)).current;

  // State to track if animations are ready. This helps prevent rendering
  // Animated.Views before their Animated.Values are initialized.
  const [animationsReady, setAnimationsReady] = useState(false);

  useEffect(() => {
    // Reset existing animated values (if any) and clear refs
    animationScalesRef.current = [];
    fadeAnimsRef.current = [];

    // Create Animated.Value for each product
    products.forEach(() => {
      animationScalesRef.current.push(new Animated.Value(1));
      fadeAnimsRef.current.push(new Animated.Value(0));
    });

    // Prepare animations for all product cards
    const productAnimations = products.map((_, index) =>
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

    // If "Shop By Category" list, add "All Products" card animation
    if (title === 'Shop By Category') {
      productAnimations.push(
        Animated.parallel([
          Animated.timing(allProductsFadeAnim, {
            toValue: 1,
            duration: 500,
            delay: products.length * 80, // Stagger after all product animations
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

    // Start all animations together in a staggered sequence
    if (productAnimations.length > 0) {
      Animated.stagger(50, productAnimations).start(() => {
        setAnimationsReady(true); // Mark animations as ready after they start
      });
    } else {
      setAnimationsReady(true); // If no products, still set ready
    }

    // Cleanup: Potentially reset values if component unmounts or products change
    return () => {
      // Any cleanup needed for animations if they were still running
    };
  }, [products, title]); // Depend on products and title to re-initialize animations

  // Function to get the correct Animated.Value for a given index
  // This helps centralize the logic and provides a safeguard
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
      // Check if the animated value exists
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
      // Check if the animated value exists
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  };

  // Dedicated handlers for the "All Products" card
  const handleAllProductsPressIn = () => {
    const {scale} = getAnimatedValues(0, true); // Use isAllProducts = true
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
    const {scale} = getAnimatedValues(0, true); // Use isAllProducts = true
    if (scale) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  };

  // console.log(products, 'dat');
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

  // Don't render animated views until animations are confirmed ready
  if (!animationsReady) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onViewAll}>
            {title !== 'Shop By Category' && (
              <CustomText style={styles.viewAll}>View All</CustomText>
            )}
          </TouchableOpacity>
        </View>
        {/* You could render a skeleton loader here */}
      </View>
    );
  }

  // 🟢 Filter before rendering
  const filteredProducts =
    title === 'Shop By Category'
      ? products?.filter(product => product?.subcategories?.length > 0)
      : products;

  // 🟠 Skip rendering if empty
  if (!filteredProducts || filteredProducts.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {/* <TouchableOpacity onPress={onViewAll}>
          {title !== 'Shop By Category' && (
            <CustomText style={styles.viewAll}>View All</CustomText>
          )}
        </TouchableOpacity> */}
      </View>
      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="center"
        contentContainerStyle={{paddingHorizontal: 0}}
        scrollEventThrottle={16}>
        {(
          products &&
          (title === 'Shop By Category'
            ? products.filter(product => product?.subcategories?.length > 0)
            : products)
        ).map((product, index) => {
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
                <Image
                  source={{
                    uri: product.image
                      ? `https://api.saraldyechems.com/upload/image/${product.image}`
                      : fallbackImg(),
                  }}
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

        {title === 'Shop By Category' && (
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
        )}
      </ScrollView> */}
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
                <Image
                  source={{
                    uri: product.image
                      ? `https://api.saraldyechems.com/upload/image/${product.image}`
                      : fallbackImg(),
                  }}
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

        {title === 'Shop By Category' && (
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
        )}
      </ScrollView>
    </View>
  );
};

export default ProductList;
