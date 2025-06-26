// import React, {useEffect, useState, useRef} from 'react';
// import {
//   View,
//   StyleSheet,
//   SafeAreaView,
//   Text,
//   Animated,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import {useSelector} from 'react-redux';
// import axios from 'axios';
// import HapticFeedback from 'react-native-haptic-feedback';

// import ProductList from '../../components/List/ProductList';
// import TrendingProducts from '../../components/Trending/TrendingProducts';
// import DashboardHeader from '../../components/Header/DashBoardHeader';
// import {API_URL} from '../../utils/ApiService';
// import styles from './Homescreen.styles';
// import {useLoader} from '../../context/LoaderContext';

// const hapticOptions = {
//   enableVibrateFallback: true,
//   ignoreAndroidSystemSettings: false,
// };

// const HomeScreen = () => {
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState({});
//   const {setLoading} = useLoader();
//   const [error, setError] = useState(null);
//   const token = useSelector(state => state.auth.token);

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const sectionAnims = useRef([]).current;

//   const getCategoryData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`${API_URL}/category`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const categoriesData = response.data;

//       const subCategoriesMap = {};
//       categoriesData.forEach(category => {
//         const subcats = category.subcategories.map(subcat => ({
//           ...subcat,
//           parentCategoryId: category._id,
//           parentCategoryName: category.name,
//           subCategories: category.subcategories,
//         }));
//         subCategoriesMap[category._id] = subcats || [];
//       });

//       setCategories(categoriesData);
//       setSubCategories(subCategoriesMap);
//       setLoading(false);

//       // Animate sections with staggered fade-in
//       Animated.stagger(150, [
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         ...categoriesData.map((_, i) =>
//           Animated.timing(sectionAnims[i], {
//             toValue: 1,
//             duration: 500,
//             delay: i * 100,
//             useNativeDriver: true,
//           }),
//         ),
//       ]).start();
//     } catch (error) {
//       setLoading(false);
//       if (
//         error.response &&
//         (error.response.status === 401 || error.response.status === 403)
//       ) {
//         setError('Session expired. Please login again.');
//       } else {
//         setError('Failed to load categories');
//         console.log(
//           'Category Fetch Error:',
//           error.response?.data?.message || error.message,
//         );
//       }
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       // Prepare animated values
//       sectionAnims.length = 0;
//       for (let i = 0; i < 50; i++) {
//         sectionAnims.push(new Animated.Value(0));
//       }
//       getCategoryData();
//     }
//   }, [token]);

//   if (error) {
//     return (
//       <>
//         <DashboardHeader />
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       </>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <DashboardHeader />
//       <TrendingProducts categories={categories} />

//       <Animated.ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollHomescreen}
//         decelerationRate="fast">
//         <Animated.View
//           style={[
//             styles.sectionContainer,
//             {opacity: fadeAnim, transform: [{scale: fadeAnim}]},
//           ]}>
//           <ProductList title="Shop By Category" products={categories} />
//         </Animated.View>

//         {categories.map((category, index) => (
//           <Animated.View
//             key={category._id}
//             style={{
//               opacity: sectionAnims[index],
//               transform: [
//                 {
//                   translateY: sectionAnims[index].interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [20, 0],
//                   }),
//                 },
//               ],
//             }}>
//             <TouchableOpacity
//               activeOpacity={0.95}
//               onPress={() =>
//                 HapticFeedback.trigger('impactLight', hapticOptions)
//               }>
//               <ProductList
//                 title={`${category.name}`}
//                 products={subCategories[category._id] || []}
//               />
//             </TouchableOpacity>
//           </Animated.View>
//         ))}
//       </Animated.ScrollView>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;

import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity,
  Easing, // Import Easing for more control over animation curves
} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import HapticFeedback from 'react-native-haptic-feedback';

import ProductList from '../../components/List/ProductList';
import TrendingProducts from '../../components/Trending/TrendingProducts';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {API_URL} from '../../utils/ApiService';
import styles from './Homescreen.styles';
import {useLoader} from '../../context/LoaderContext';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const {setLoading} = useLoader();
  const [error, setError] = useState(null);
  const token = useSelector(state => state.auth.token);

  // Animation values
  const headerAnim = useRef(new Animated.Value(0)).current; // For header/TrendingProducts
  const categoriesListAnim = useRef(new Animated.Value(0)).current; // For "Shop By Category"
  const sectionAnims = useRef([]).current; // For individual category lists

  const getCategoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/category`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const categoriesData = response.data;

      const subCategoriesMap = {};
      categoriesData.forEach(category => {
        const subcats = category.subcategories.map(subcat => ({
          ...subcat,
          parentCategoryId: category._id,
          parentCategoryName: category.name,
          subCategories: category.subcategories,
        }));
        subCategoriesMap[category._id] = subcats || [];
      });

      setCategories(categoriesData);
      setSubCategories(subCategoriesMap);
      setLoading(false);

      // Prepare animated values for sections
      sectionAnims.length = 0; // Clear previous values
      for (let i = 0; i < categoriesData.length; i++) {
        sectionAnims.push(new Animated.Value(0));
      }

      // Staggered animations for a luxurious feel
      Animated.stagger(120, [
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease), // Smooth ease-out
          useNativeDriver: true,
        }),
        Animated.timing(categoriesListAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          delay: 100, // Slight delay after header
          useNativeDriver: true,
        }),
        ...categoriesData.map((_, i) =>
          Animated.spring(sectionAnims[i], {
            toValue: 1,
            friction: 8, // Soft spring effect
            tension: 40,
            delay: 150 * (i + 1), // Increase delay for more deliberate staggered effect
            useNativeDriver: true,
          }),
        ),
      ]).start();
    } catch (error) {
      setLoading(false);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to load categories');
        console.log(
          'Category Fetch Error:',
          error.response?.data?.message || error.message,
        );
      }
    }
  };

  useEffect(() => {
    if (token) {
      getCategoryData();
    }
  }, [token]);

  if (error) {
    return (
      <>
        <DashboardHeader />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header and TrendingProducts animate in together */}
      <Animated.View
        style={[
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0], // Slide down from top
                }),
              },
            ],
          },
        ]}>
        <DashboardHeader />
        <TrendingProducts categories={categories} />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollHomescreen}
        decelerationRate="fast" // Already good, maintains smoother scroll
        scrollEventThrottle={16} // Optimize for smoother scrolling
      >
        {/* "Shop By Category" section animates in slightly after header */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: categoriesListAnim,
              transform: [
                {
                  scale: categoriesListAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1], // Slight zoom in effect
                  }),
                },
                {
                  translateY: categoriesListAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0], // Slide up from bottom
                  }),
                },
              ],
            },
          ]}>
          <ProductList title="Shop By Category" products={categories} />
        </Animated.View>

        {/* Individual category lists animate in with spring effect */}
        {categories.map((category, index) => (
          <Animated.View
            key={category._id}
            style={{
              opacity: sectionAnims[index],
              transform: [
                {
                  translateY: sectionAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0], // Slide up from bottom
                  }),
                },
              ],
            }}>
            <TouchableOpacity
              activeOpacity={0.95} // Slightly less active to convey luxury
              onPress={() => {
                HapticFeedback.trigger('impactLight', hapticOptions); // Gentle tap feedback
              }}>
              <ProductList
                title={`${category.name}`}
                products={subCategories[category._id] || []}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
