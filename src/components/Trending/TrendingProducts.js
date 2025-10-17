// import React, {useState, useEffect, useRef} from 'react';
// import {View, ScrollView, Dimensions, Animated} from 'react-native';
// import styles from './Trending.styles';
// import ProductRequest from '../Request/ProductRequest';
// import RepeatCard from '../RepeatCard.js/RepeatCard';

// const {width} = Dimensions.get('window');
// const CARD_ORIGINAL_HEIGHT = 230;

// const defaultProducts = [
//   {
//     id: '5',
//     name: 'Textile Auxiliaries',
//     image: null,
//     brand: 'Keyson',
//     unit: 'ltr',
//   },
//   {
//     id: '6',
//     name: 'Rotary Screen Printing',
//     image: null,
//     brand: 'Keyson',
//     unit: 'ltr',
//   },
//   {
//     id: '7',
//     name: 'Dyeing Chemicals',
//     image: null,
//     brand: 'Keyson',
//     unit: 'ltr',
//   },
//   {
//     id: '8',
//     name: 'Finishing Agents',
//     image: null,
//     brand: 'Keyson',
//     unit: 'ltr',
//   },
// ];

// // Animation configurations - All realtime
// const getScaleAnimation = scrollY => {
//   if (!scrollY) return 1;

//   return scrollY.interpolate({
//     inputRange: [0, 100, 150, 200],
//     outputRange: [1, 0.8, 0.7, 0.7],
//     extrapolate: 'clamp',
//   });
// };

// const getHeightAnimation = scrollY => {
//   if (!scrollY) return CARD_ORIGINAL_HEIGHT;

//   return scrollY.interpolate({
//     inputRange: [0, 100, 150, 200],
//     outputRange: [
//       CARD_ORIGINAL_HEIGHT,
//       CARD_ORIGINAL_HEIGHT * 0.9,
//       CARD_ORIGINAL_HEIGHT * 0.8,
//       CARD_ORIGINAL_HEIGHT * 0.7,
//     ],
//     extrapolate: 'clamp',
//   });
// };

// const getMarginLeftAnimation = scrollY => {
//   if (!scrollY) return 1;

//   return scrollY.interpolate({
//     inputRange: [0, 50, 100, 150],
//     outputRange: [1, -20, -45, -75],
//     extrapolate: 'clamp',
//   });
// };

// const getPaddingVerticalAnimation = scrollY => {
//   if (!scrollY) return 0;

//   return scrollY.interpolate({
//     inputRange: [0, 100, 150, 200],
//     outputRange: [0, -10, -20, -40],
//     extrapolate: 'clamp',
//   });
// };

// const TrendingProducts = ({products, scrollY}) => {
//   const displayProducts = defaultProducts;

//   // Real-time animations
//   const scaleAnimation = getScaleAnimation(scrollY);
//   const heightAnimation = getHeightAnimation(scrollY);
//   const marginLeftAnimation = getMarginLeftAnimation(scrollY);
//   const paddingVerticalAnimation = getPaddingVerticalAnimation(scrollY);

//   return (
//     <Animated.View
//       style={[
//         styles.container,
//         {
//           paddingVertical: paddingVerticalAnimation,
//           height: heightAnimation,
//         },
//       ]}>
//       <ProductRequest />
//       <Animated.View
//         style={{
//           transform: [{scale: scaleAnimation}],
//           flex: 1,
//           marginVertical: paddingVerticalAnimation,
//           marginRight: -100,
//           marginLeft: marginLeftAnimation,
//         }}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={[
//             styles.scrollContent,
//             {
//               paddingRight: 100, // Add extra padding to ensure last card is visible
//             },
//           ]}>
//           {displayProducts.map((product, index) => (
//             <View
//               key={product.id || index.toString()}
//               style={[
//                 styles.cardWrapper,
//                 {
//                   marginVertical: 5,
//                 },
//               ]}>
//               <RepeatCard
//                 unique={product.id}
//                 imageSource={product.image}
//                 name={product.name}
//                 brand={product.brand}
//                 unit={product.unit}
//               />
//             </View>
//           ))}
//         </ScrollView>
//       </Animated.View>
//     </Animated.View>
//   );
// };

// export default TrendingProducts;

import React from 'react';
import {View, ScrollView, Dimensions, Animated} from 'react-native';
import styles from './Trending.styles';
import ProductRequest from '../Request/ProductRequest';
import RepeatCard from '../RepeatCard.js/RepeatCard';

const {width} = Dimensions.get('window');
const CARD_ORIGINAL_HEIGHT = 230;

const defaultProducts = [
  {
    id: '5',
    name: 'Textile Auxiliaries',
    image: null,
    brand: 'Keyson',
    unit: 'ltr',
  },
  {
    id: '6',
    name: 'Rotary Screen Printing',
    image: null,
    brand: 'Keyson',
    unit: 'ltr',
  },
  {
    id: '7',
    name: 'Dyeing Chemicals',
    image: null,
    brand: 'Keyson',
    unit: 'ltr',
  },
  {
    id: '8',
    name: 'Finishing Agents',
    image: null,
    brand: 'Keyson',
    unit: 'ltr',
  },
];

// Smooth animation function
const getAnimation = scrollY => {
  if (!scrollY) {
    return {
      scale: 1,
      opacity: 1,
      height: CARD_ORIGINAL_HEIGHT,
      marginLeft: 0,
      paddingVertical: 0,
    };
  }

  const scale = scrollY.interpolate({
    inputRange: [0, 100, 150, 200],
    outputRange: [1, 0.8, 0.7, 0.7],
    extrapolate: 'clamp',
  });

  // Keep sufficient height to prevent cutting
  const height = scrollY.interpolate({
    inputRange: [0, 100, 150, 200],
    outputRange: [
      CARD_ORIGINAL_HEIGHT,
      CARD_ORIGINAL_HEIGHT * 0.9, // Reduced shrinkage
      CARD_ORIGINAL_HEIGHT * 0.8, // Reduced shrinkage
      CARD_ORIGINAL_HEIGHT * 0.7, // Reduced shrinkag
    ],
    // outputRange: [210, 160, 110],
    extrapolate: 'clamp',
  });

  const marginLeft = scrollY.interpolate({
    inputRange: [0, 50, 100, 150],
    outputRange: [1, -20, -45, -75],
    extrapolate: 'clamp',
  });

  // Add padding to compensate for scaling
  const paddingVertical = scrollY.interpolate({
    inputRange: [0, 100, 150, 200],
    outputRange: [0, -10, -20, -40],
    extrapolate: 'clamp',
  });

  return {
    scale,
    opacity: 1,
    height,
    marginLeft,
    paddingVertical,
  };
};

const TrendingProducts = ({products, scrollY}) => {
  const displayProducts = defaultProducts;

  // Get animated values
  const animation = getAnimation(scrollY);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingVertical: animation.paddingVertical,
          height: animation.height,
        },
      ]}>
      <ProductRequest />
      <Animated.View
        style={{
          transform: [{scale: animation.scale}],
          flex: 1,
          marginVertical: animation.paddingVertical,
          // marginVertical: -30,
          marginRight: -100,
          marginLeft: animation.marginLeft,
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              // Add padding to scroll content to prevent cutting
            },
          ]}>
          {displayProducts.map((product, index) => (
            <View
              key={product.id || index.toString()}
              style={[
                styles.cardWrapper,
                {
                  // Add margin to individual cards for better spacing when scaled
                  marginVertical: 5,
                },
              ]}>
              <RepeatCard
                unique={product.id}
                imageSource={product.image}
                name={product.name}
                brand={product.brand}
                unit={product.unit}
              />
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

export default TrendingProducts;
