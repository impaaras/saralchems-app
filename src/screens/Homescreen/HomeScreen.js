import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity,
  Easing,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import HapticFeedback from 'react-native-haptic-feedback';

import ProductList from '../../components/List/ProductList';
import TrendingProducts from '../../components/Trending/TrendingProducts';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {API_URL} from '../../utils/ApiService';
import styles from './Homescreen.styles';
import {useLoader} from '../../context/LoaderContext';
import {fetchCategories} from '../../redux/slices/categoriesSlice';

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
  const headerAnim = useRef(new Animated.Value(0)).current;
  const categoriesListAnim = useRef(new Animated.Value(0)).current;
  const sectionAnims = useRef([]).current;
  const dispatch = useDispatch();

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
      // Wait for all subcategory processing to complete
      const subCategoriesMap = {};
      const processedCategories = [];

      // Process all categories and their subcategories synchronously
      for (const category of categoriesData) {
        // Only include categories that have subcategories
        if (category.subcategories && category.subcategories.length > 0) {
          const subcats = category.subcategories.map(subcat => ({
            ...subcat,
            parentCategoryId: category._id,
            parentCategoryName: category.name,
            subCategories: category.subcategories,
          }));
          subCategoriesMap[category._id] = subcats;
          processedCategories.push(category);
        }
      }
      // Set all data at once after processing is complete
      setCategories(processedCategories);
      setSubCategories(subCategoriesMap);
      // Prepare animated values for sections
      sectionAnims.length = 0;
      for (let i = 0; i < processedCategories.length; i++) {
        sectionAnims.push(new Animated.Value(0));
      }
      // Mark data as ready and start animations
      setLoading(false);

      // Start animations after data is ready
      setTimeout(() => {
        startAnimations(processedCategories);
      }, 100);
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
  // const getCategoryData = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const categoriesData = await dispatch(fetchCategories()).unwrap();

  //     const subCategoriesMap = {};
  //     const processedCategories = [];

  //     for (const category of categoriesData) {
  //       if (category.subcategories && category.subcategories.length > 0) {
  //         const subcats = category.subcategories.map(subcat => ({
  //           ...subcat,
  //           parentCategoryId: category._id,
  //           parentCategoryName: category.name,
  //           subCategories: category.subcategories,
  //         }));
  //         subCategoriesMap[category._id] = subcats;
  //         processedCategories.push(category);
  //       }
  //     }

  //     setCategories(processedCategories);
  //     setSubCategories(subCategoriesMap);

  //     sectionAnims.length = 0;
  //     for (let i = 0; i < processedCategories.length; i++) {
  //       sectionAnims.push(new Animated.Value(0));
  //     }

  //     setLoading(false);

  //     setTimeout(() => {
  //       startAnimations(processedCategories);
  //     }, 100);
  //   } catch (error) {
  //     setLoading(false);
  //     if (error.tokenExpired) {
  //       setError('Session expired. Please login again.');
  //     } else {
  //       setError('Failed to load categories');
  //       console.log('Category Fetch Error:', error?.message || error);
  //     }
  //   }
  // };

  const startAnimations = categoriesData => {
    // Staggered animations for a luxurious feel
    Animated.stagger(120, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(categoriesListAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        delay: 100,
        useNativeDriver: true,
      }),
      ...categoriesData.map((_, i) =>
        Animated.spring(sectionAnims[i], {
          toValue: 1,
          friction: 8,
          tension: 40,
          delay: 150 * (i + 1),
          useNativeDriver: true,
        }),
      ),
    ]).start();
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
      <Animated.View
        style={[
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}>
        <DashboardHeader />
        <TrendingProducts categories={categories} />
      </Animated.View>
      <Animated.FlatList
        data={categories}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollHomescreen}
        decelerationRate="fast"
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            <Animated.View
              style={[
                styles.sectionContainer,
                {
                  opacity: categoriesListAnim,
                  transform: [
                    {
                      scale: categoriesListAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                    {
                      translateY: categoriesListAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <ProductList title="Shop By Category" products={categories} />
            </Animated.View>
          </>
        }
        renderItem={({item, index}) => (
          <Animated.View
            style={{
              opacity: sectionAnims[index],
              transform: [
                {
                  translateY: sectionAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            }}>
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => {
                HapticFeedback.trigger('impactLight', hapticOptions);
              }}>
              <ProductList
                title={item.name}
                products={subCategories[item._id] || []}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
