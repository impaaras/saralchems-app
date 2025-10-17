import React, {useEffect, useRef} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import HapticFeedback from 'react-native-haptic-feedback';
import ProductList from '../../components/List/ProductList';
import TrendingProducts from '../../components/Trending/TrendingProducts';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import styles from './Homescreen.styles';
import RepeatOrder from '../../components/RepeatCard.js/RepeatOrder';
import {fetchCategories} from '../../redux/slices/homeSlice';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const HomeScreen = () => {
  const dispatch = useDispatch();
  const {categories, subCategories, loading, error} = useSelector(
    state => state.home,
  );

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const categoriesListAnim = useRef(new Animated.Value(0)).current;
  const sectionAnims = useRef([]).current;
  const scrollY = useRef(new Animated.Value(0)).current; // Add scrollY ref

  const startAnimations = categoriesData => {
    sectionAnims.length = 0;
    for (let i = 0; i < categoriesData.length; i++) {
      sectionAnims.push(new Animated.Value(0));
    }

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
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0) {
      sectionAnims.length = 0;
      categories.forEach(() => {
        sectionAnims.push(new Animated.Value(0));
      });

      // now safe to run animations
      startAnimations(categories);
    }
  }, [categories]);

  // Handle scroll event
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: true},
  );

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
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}>
        <DashboardHeader />
        <TrendingProducts categories={categories} scrollY={scrollY} />
      </Animated.View>

      <Animated.FlatList
        data={categories}
        keyExtractor={item => item._id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollHomescreen}
        onScroll={handleScroll} // Add scroll handler
        scrollEventThrottle={16} // 60fps
        ListHeaderComponent={
          <>
            <RepeatOrder />
            <Animated.View
              style={{
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
              }}>
              <ProductList title="Shop By Category" products={categories} />
            </Animated.View>
          </>
        }
        renderItem={({item, index}) => {
          const anim = sectionAnims[index] || new Animated.Value(1); // fallback
          return (
            <Animated.View
              key={`category-section-${item._id}`} // Add unique key
              style={{
                opacity: anim,
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              }}>
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() =>
                  HapticFeedback.trigger('impactLight', hapticOptions)
                }>
                <ProductList
                  title={item.name}
                  products={subCategories[item._id] || []}
                />
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
