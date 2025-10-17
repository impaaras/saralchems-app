// import {
//   SafeAreaView,
//   StyleSheet,
//   FlatList,
//   Text,
//   View,
//   TouchableOpacity,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import {searchProducts} from '../../redux/slices/searchSlice';
// import DashboardHeader from '../../components/Header/DashBoardHeader';
// import ProductCard from '../../components/Card/ProductCard';
// import ShimmerCard from './SkeltonCard';
// import {addItem} from '../../redux/slices/cartSlice';
// import styles from './Product.styles';
// import {useLoader} from '../../context/LoaderContext';

// const PAGE_SIZE = 15;

// const ProductsScreen = () => {
//   const dispatch = useDispatch();
//   const {setLoading} = useLoader();
//   const {results, loading, error} = useSelector(state => state.search);
//   const allProducts = results?.products || [];

//   const [visibleProducts, setVisibleProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setIsInitialLoad(true);
//       try {
//         await dispatch(searchProducts('')).unwrap();
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//         setIsInitialLoad(false);
//       }
//     };

//     fetchData();
//     console.log(results);
//   }, [dispatch, setLoading]); // Added dispatch to dependencies

//   useEffect(() => {
//     if (allProducts.length > 0) {
//       setVisibleProducts(allProducts.slice(0, PAGE_SIZE));
//       setCurrentPage(1);
//     }
//   }, [allProducts]);

//   const handleAddPress = product => {
//     dispatch(addItem(product));
//   };

//   // Create shimmer data for initial load
//   const createShimmerData = (count = PAGE_SIZE) => {
//     return Array.from({length: count}, (_, index) => ({
//       _id: `shimmer_${index}`,
//       isShimmer: true,
//     }));
//   };

//   const renderProductItem = ({item, index}) => {
//     if (item.isShimmer || isInitialLoad) {
//       return <ShimmerCard />;
//     }

//     return (
//       <ProductCard
//         key={item._id}
//         item={item}
//         onAddPress={handleAddPress}
//         idx={index}
//         isLoading={loading}
//       />
//     );
//   };

//   const handleLoadMore = () => {
//     if (loading || isInitialLoad) return;

//     const nextPage = currentPage + 1;
//     const nextData = allProducts.slice(0, nextPage * PAGE_SIZE);

//     if (nextData.length > visibleProducts.length) {
//       setVisibleProducts(nextData);
//       setCurrentPage(nextPage);
//     }
//   };

//   const dataToRender =
//     isInitialLoad || loading ? createShimmerData() : visibleProducts;

//   return (
//     <SafeAreaView style={styles.container}>
//       <DashboardHeader />

//       <View style={styles.productContainer}>
//         <FlatList
//           data={dataToRender}
//           renderItem={renderProductItem}
//           keyExtractor={(item, index) => item._id || `shimmer_${index}`}
//           // contentContainerStyle={styles.flatListContainer}
//           showsVerticalScrollIndicator={false}
//           numColumns={3}
//           onEndReached={handleLoadMore}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={() =>
//             visibleProducts.length < allProducts.length ? (
//               <View style={styles.footerShimmerWrapper}>
//                 {Array.from({length: 3}).map((_, index) => (
//                   <ShimmerCard key={`footer-shimmer-${index}`} />
//                 ))}
//               </View>
//             ) : null
//           }
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ProductsScreen;
import {SafeAreaView, FlatList, View} from 'react-native';
import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {searchProducts} from '../../redux/slices/searchSlice';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import ProductCard from '../../components/Card/ProductCard';
import ShimmerCard from './SkeltonCard';
import {addItem} from '../../redux/slices/cartSlice';
import styles from './Product.styles';
import {useLoader} from '../../context/LoaderContext';

const PAGE_SIZE = 12; // Reduced for better performance

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const {setLoading} = useLoader();

  // Optimized selector - only get what we need
  const {results, loading, error} = useSelector(state => ({
    results: state.search.results,
    loading: state.search.loading,
    error: state.search.error,
  }));

  const allProducts = useMemo(
    () => results?.products || [],
    [results?.products],
  );

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasFetchedInitialData = useRef(false);

  // Refs for performance
  const flatListRef = useRef(null);
  const loadingMore = useRef(false);

  // Fetch initial data only once
  useEffect(() => {
    if (hasFetchedInitialData.current || allProducts.length > 0) return;
    const fetchData = async () => {
      hasFetchedInitialData.current = true;
      setLoading(true);
      setIsInitialLoad(true);
      try {
        // Use empty query to get all products
        await dispatch(searchProducts('')).unwrap();
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    fetchData();
  }, [dispatch, setLoading, allProducts.length]);

  // Optimized visible products update
  useEffect(() => {
    if (allProducts.length > 0 && currentPage === 1) {
      const initialProducts = allProducts.slice(0, PAGE_SIZE);
      setVisibleProducts(initialProducts);
    }
  }, [allProducts, currentPage]);

  // Memoized add to cart function
  const handleAddPress = useCallback(
    product => {
      dispatch(addItem(product));
    },
    [dispatch],
  );

  // Memoized shimmer data
  const createShimmerData = useCallback((count = PAGE_SIZE) => {
    return Array.from({length: count}, (_, index) => ({
      _id: `shimmer_${index}`,
      isShimmer: true,
    }));
  }, []);

  // Optimized render item with proper memoization
  const renderProductItem = useCallback(
    ({item, index}) => {
      if (item.isShimmer) {
        return <ShimmerCard />;
      }

      return (
        <ProductCard item={item} onAddPress={handleAddPress} idx={index} />
      );
    },
    [handleAddPress],
  );

  // Debounced load more function
  const handleLoadMore = useCallback(() => {
    if (loadingMore.current || loading || isInitialLoad) return;
    if (visibleProducts.length >= allProducts.length) return;

    loadingMore.current = true;

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * PAGE_SIZE;
    const nextData = allProducts.slice(0, startIndex + PAGE_SIZE);

    if (nextData.length > visibleProducts.length) {
      setVisibleProducts(nextData);
      setCurrentPage(nextPage);
    }

    // Reset loading flag after a short delay
    setTimeout(() => {
      loadingMore.current = false;
    }, 300);
  }, [
    loading,
    isInitialLoad,
    currentPage,
    allProducts,
    visibleProducts.length,
  ]);

  // Optimized data for rendering
  const dataToRender = useMemo(() => {
    if (isInitialLoad || loading) {
      return createShimmerData();
    }
    return visibleProducts;
  }, [isInitialLoad, loading, visibleProducts, createShimmerData]);

  // Memoized key extractor
  const keyExtractor = useCallback((item, index) => {
    return item._id || `shimmer_${index}`;
  }, []);

  // Memoized footer component
  const ListFooterComponent = useMemo(() => {
    if (visibleProducts.length >= allProducts.length || isInitialLoad) {
      return null;
    }

    return (
      <View style={styles.footerShimmerWrapper}>
        {Array.from({length: 3}).map((_, index) => (
          <ShimmerCard key={`footer-shimmer-${index}`} />
        ))}
      </View>
    );
  }, [visibleProducts.length, allProducts.length, isInitialLoad]);

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader />
      <View style={styles.productContainer}>
        <FlatList
          ref={flatListRef}
          data={dataToRender}
          renderItem={renderProductItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3} // Reduced threshold
          ListFooterComponent={ListFooterComponent}
          // Performance optimizations
          initialNumToRender={12}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({
            length: 150, // Approximate height of your card
            offset: 150 * Math.floor(index / 3),
            index,
          })}
        />
      </View>
    </SafeAreaView>
  );
};

export default React.memo(ProductsScreen);
