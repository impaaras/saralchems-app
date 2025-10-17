// import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
// } from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import {ROUTES} from '../../constants/routes';
// import {useNavigation} from '@react-navigation/native';
// import ProductCard from '../Card/ProductCard';
// import {addItem} from '../../redux/slices/cartSlice';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {clearHistory} from '../../redux/slices/searchHistory';
// import {searchProducts} from '../../redux/slices/searchSlice';
// import {useLoader} from '../../context/LoaderContext';
// import ShimmerCard from '../../screens/Product/SkeltonCard';

// const PAGE_SIZE = 15;

// const SearchResults = ({searchText}) => {
//   const dispatch = useDispatch();
//   const {results, loading, error} = useSelector(state => state.search);
//   const {history} = useSelector(state => state.searchHistory);
//   const navigation = useNavigation();
//   const {setLoading} = useLoader();

//   // Local state for typing indicator
//   const [isTyping, setIsTyping] = useState(false);

//   // Handle both API response formats
//   const allProducts = useMemo(() => {
//     // If results is directly an array (search results)
//     if (Array.isArray(results)) {
//       return results;
//     }
//     console.log('search results', results);
//     // If results is an object with products property (all products)
//     if (results && results.products && Array.isArray(results.products)) {
//       return results.products;
//     }

//     return [];
//   }, [results]);

//   // Pagination state
//   const [visibleProducts, setVisibleProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Debounce search with typing indicator
//   useEffect(() => {
//     if (!searchText) {
//       setIsTyping(false);
//       return;
//     }

//     setIsTyping(true);

//     const timeoutId = setTimeout(() => {
//       setIsTyping(false);
//       dispatch(searchProducts(searchText));
//     }, 100); // 300ms debounce

//     return () => {
//       clearTimeout(timeoutId);
//     };
//   }, [searchText, dispatch]);

//   // Update visible products when search results change
//   useEffect(() => {
//     if (allProducts.length > 0) {
//       setVisibleProducts(allProducts.slice(0, PAGE_SIZE));
//       setCurrentPage(1);
//     } else {
//       setVisibleProducts([]);
//       setCurrentPage(1);
//     }
//   }, [allProducts]);

//   const showNoResults = allProducts.length === 0 && !loading;

//   const handleAddPress = useCallback(
//     product => {
//       dispatch(addItem(product));
//     },
//     [dispatch],
//   );

//   const handleHistoryItemPress = useCallback(
//     async query => {
//       setLoading(true);
//       try {
//         await dispatch(searchProducts(query)).unwrap();
//       } catch (error) {
//         console.error('Search failed:', error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [dispatch, setLoading],
//   );

//   const handleClearHistory = useCallback(() => {
//     dispatch(clearHistory());
//   }, [dispatch]);

//   const isScrollingRef = useRef(false);

//   const handleScrollBegin = useCallback(() => {
//     isScrollingRef.current = true;
//   }, []);

//   const handleScrollEnd = useCallback(() => {
//     isScrollingRef.current = false;
//   }, []);

//   // Load more function
//   const handleLoadMore = useCallback(() => {
//     if (isScrollingRef.current) return;
//     if (visibleProducts.length >= allProducts.length) {
//       return; // Already showing all products
//     }

//     const nextPage = currentPage + 1;
//     const nextData = allProducts.slice(0, nextPage * PAGE_SIZE);

//     if (nextData.length > visibleProducts.length) {
//       setVisibleProducts(nextData);
//       setCurrentPage(nextPage);
//     }
//   }, [visibleProducts.length, allProducts.length, currentPage, allProducts]);

//   // This is the key logic for showing "Product not found"
//   const showInitialState = !searchText && allProducts.length === 0;

//   const renderProductItem = useCallback(
//     ({item, index}) => (
//       <ProductCard
//         key={item._id}
//         item={item}
//         onAddPress={handleAddPress}
//         idx={index}
//       />
//     ),
//     [handleAddPress],
//   );

//   const keyExtractor = useCallback(item => item._id, []);

//   // Render shimmer cards while typing
//   const renderShimmerGrid = () => (
//     <View style={styles.shimmerContainer}>
//       {Array.from({length: 9}).map((_, index) => (
//         <ShimmerCard key={`shimmer-typing-${index}`} />
//       ))}
//     </View>
//   );

//   return (
//     <View style={styles.searchResultsContainer}>
//       {error ? (
//         <View style={styles.emptyStateContainer}>
//           <Text style={styles.errorText}>
//             Error:{' '}
//             {typeof error === 'string'
//               ? error
//               : error.message || 'Something went wrong'}
//           </Text>
//         </View>
//       ) : isTyping ? (
//         // Show shimmer cards while typing
//         renderShimmerGrid()
//       ) : showNoResults ? (
//         <View style={styles.emptyStateContainer}>
//           <Icon name="search-off" size={48} color="#001" />
//           <Text style={styles.noResultsText}>Product not found</Text>
//         </View>
//       ) : (
//         <FlatList
//           ListHeaderComponent={() => <></>}
//           contentContainerStyle={styles.flatListContainer}
//           data={visibleProducts}
//           renderItem={renderProductItem}
//           // keyExtractor={keyExtractor}
//           keyExtractor={(item, index) => `${item._id}_${index}`}
//           numColumns={3}
//           onEndReached={handleLoadMore}
//           onEndReachedThreshold={0.5}
//           removeClippedSubviews={false}
//           // maxToRenderPerBatch={15}
//           windowSize={5} // Reduced memory
//           maxToRenderPerBatch={12} // Smoother rendering
//           // windowSize={10}
//           initialNumToRender={15}
//           getItemLayout={(data, index) => ({
//             length: 200, // Approximate height of each item
//             offset: 200 * Math.floor(index / 3),
//             index,
//           })}
//           ListFooterComponent={() =>
//             visibleProducts.length < allProducts.length ? (
//               <View style={styles.loadMoreContainer}>
//                 {Array.from({length: 3}).map((_, index) => (
//                   <ShimmerCard key={`shimmer-load-more-${index}`} />
//                 ))}
//               </View>
//             ) : null
//           }
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   searchResultsContainer: {
//     width: '100%',
//     marginTop: -80,
//     borderRadius: 10,
//     height: 1000,
//     backgroundColor: '#E5F1FF',
//     zIndex: 1000,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   flatListContainer: {
//     paddingBottom: 330,
//     backgroundColor: '#FFF',
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   emptyStateContainer: {
//     // flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   shimmerContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     backgroundColor: '#FFF',
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//     padding: 10,
//   },
//   loadMoreContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   noResultsText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#001',
//     marginTop: 15,
//     fontWeight: '500',
//   },
//   loadingText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#3C5D87',
//     marginTop: 10,
//   },
//   errorText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#E74C3C',
//     marginTop: 15,
//   },
//   historySection: {
//     padding: 10,
//     backgroundColor: '#E5F1FF',
//     marginBottom: 10,
//   },
//   historyHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   historyTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#555',
//   },
//   clearHistoryText: {
//     color: '#3C5D87',
//     fontSize: 14,
//   },
//   historyItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   historyText: {
//     marginLeft: 10,
//     fontSize: 18,
//     color: '#3C5D87',
//   },
//   loadingMoreContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 15,
//   },
//   loadingMoreText: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#555',
//   },
// });

// export default SearchResults;
// old code

// import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
// import {View, Text, StyleSheet, FlatList} from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import ProductCard from '../Card/ProductCard';
// import {addItem} from '../../redux/slices/cartSlice';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {searchProducts} from '../../redux/slices/searchSlice';
// import ShimmerCard from '../../screens/Product/SkeltonCard';
// import {scale} from '../../utils/Responsive/responsive';

// const PAGE_SIZE = 12;

// const SearchResults = ({searchText}) => {
//   const dispatch = useDispatch();
//   const {results, loading, error} = useSelector(state => state.search);

//   const [visibleProducts, setVisibleProducts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Handle both API response formats and ensure we always have products
//   const allProducts = useMemo(() => {
//     console.log('resu', results);
//     console.log('🔄 Processing search results...');

//     // If results is directly an array
//     if (Array.isArray(results)) {
//       return results;
//     }

//     // If results is an object with products property
//     if (results && results.products && Array.isArray(results.products)) {
//       return results.products;
//     }

//     // Return empty array if no results
//     return [];
//   }, [results]);

//   // Load all products when component mounts (empty search)
//   useEffect(() => {
//     console.log('🚀 Loading all products on mount...');
//     dispatch(searchProducts('')); // Empty string fetches all products
//   }, [dispatch]);

//   // Handle search when searchText changes
//   useEffect(() => {
//     if (searchText && searchText.trim()) {
//       console.log(`🔍 Searching for: "${searchText}"`);
//       dispatch(searchProducts(searchText.trim()));
//     } else if (searchText === '') {
//       // If search is cleared, load all products again
//       console.log('🔄 Loading all products (search cleared)');
//       dispatch(searchProducts(''));
//     }
//   }, [searchText, dispatch]);

//   useEffect(() => {
//     if (searchText === '' && allProducts.length === 0) {
//       console.log('🔄 Loading all products (empty search)');
//       dispatch(searchProducts(''));
//     }
//   }, [searchText, allProducts.length, dispatch]);

//   // Update visible products when allProducts changes
//   useEffect(() => {
//     if (allProducts.length > 0) {
//       const initialProducts = allProducts.slice(0, PAGE_SIZE);
//       console.log(`📦 Setting ${initialProducts.length} visible products`);
//       setVisibleProducts(initialProducts);
//       setCurrentPage(1);
//     } else {
//       setVisibleProducts([]);
//       setCurrentPage(1);
//     }
//   }, [allProducts]);

//   // Load more products
//   const handleLoadMore = useCallback(() => {
//     if (visibleProducts.length >= allProducts.length) return;

//     const nextPage = currentPage + 1;
//     const nextData = allProducts.slice(0, nextPage * PAGE_SIZE);

//     if (nextData.length > visibleProducts.length) {
//       setVisibleProducts(nextData);
//       setCurrentPage(nextPage);
//       console.log(`📦 Loaded more: ${nextData.length} products`);
//     }
//   }, [visibleProducts.length, allProducts.length, currentPage, allProducts]);

//   const handleAddPress = useCallback(
//     product => {
//       dispatch(addItem(product));
//     },
//     [dispatch],
//   );

//   const renderProductItem = useCallback(
//     ({item, index}) => (
//       <ProductCard item={item} onAddPress={handleAddPress} idx={index} />
//     ),
//     [handleAddPress],
//   );

//   const keyExtractor = useCallback(item => item._id, []);

//   // Render shimmer while loading
//   const renderShimmer = useCallback(
//     () => (
//       <View style={styles.shimmerContainer}>
//         {Array.from({length: 9}).map((_, index) => (
//           <ShimmerCard key={`shimmer-${index}`} />
//         ))}
//       </View>
//     ),
//     [],
//   );

//   // Render load more footer
//   const renderFooter = useCallback(() => {
//     if (visibleProducts.length < allProducts.length && allProducts.length > 0) {
//       return (
//         <View style={styles.loadMoreContainer}>
//           {Array.from({length: 3}).map((_, index) => (
//             <ShimmerCard key={`shimmer-footer-${index}`} />
//           ))}
//         </View>
//       );
//     }
//     return null;
//   }, [visibleProducts.length, allProducts.length]);

//   // Show no results only when we have searched and found nothing
//   // const showNoResults = searchText && allProducts.length === 0 && !loading;
//   const showNoResults = useMemo(() => {
//     return searchText && allProducts.length === 0 && !loading;
//   }, [searchText, allProducts.length, loading]);

//   console.log(
//     `📊 State - Products: ${allProducts.length}, Visible: ${visibleProducts.length}, Loading: ${loading}, Search: "${searchText}"`,
//   );

//   return (
//     <View style={styles.searchResultsContainer}>
//       {error ? (
//         <View style={styles.emptyStateContainer}>
//           <Text style={styles.errorText}>
//             Error:{' '}
//             {typeof error === 'string'
//               ? error
//               : error.message || 'Something went wrong'}
//           </Text>
//         </View>
//       ) : loading && allProducts.length === 0 ? (
//         // Show loading only when no products are loaded yet
//         renderShimmer()
//       ) : showNoResults ? (
//         <View style={styles.emptyStateContainer}>
//           <Icon name="search-off" size={48} color="#001" />
//           <Text style={styles.noResultsText}>Product not found</Text>
//           <Text style={styles.noResultsSubText}>
//             No products found for "{searchText}"
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={visibleProducts}
//           renderItem={renderProductItem}
//           keyExtractor={keyExtractor}
//           numColumns={3}
//           onEndReached={handleLoadMore}
//           onEndReachedThreshold={0.5} // Increased for better UX
//           removeClippedSubviews={false}
//           windowSize={5}
//           maxToRenderPerBatch={6} // Reduced for better performance
//           initialNumToRender={9} // Reduced initial render
//           updateCellsBatchingPeriod={100}
//           getItemLayout={(data, index) => ({
//             length: 180,
//             offset: 180 * Math.floor(index / 3),
//             index,
//           })}
//           ListFooterComponent={renderFooter}
//           ListEmptyComponent={
//             !loading && searchText && allProducts.length === 0 ? (
//               <View style={styles.emptyStateContainer}>
//                 <Icon name="search-off" size={48} color="#001" />
//                 <Text style={styles.noResultsText}>Product not found</Text>
//                 <Text style={styles.noResultsSubText}>
//                   No products found for "{searchText}"
//                 </Text>
//               </View>
//             ) : null
//           }
//           contentContainerStyle={[
//             styles.flatListContainer,
//             allProducts.length === 0 && {flex: 1},
//           ]}
//         />
//         // <FlatList
//         //   data={visibleProducts}
//         //   renderItem={renderProductItem}
//         //   keyExtractor={keyExtractor}
//         //   numColumns={3}
//         //   onEndReached={handleLoadMore}
//         //   onEndReachedThreshold={0.3}
//         //   removeClippedSubviews={true}
//         //   windowSize={3}
//         //   maxToRenderPerBatch={8}
//         //   initialNumToRender={12}
//         //   updateCellsBatchingPeriod={50}
//         //   getItemLayout={(data, index) => ({
//         //     length: 180,
//         //     offset: 180 * Math.floor(index / 3),
//         //     index,
//         //   })}
//         //   ListFooterComponent={renderFooter}
//         //   ListHeaderComponent={() => (
//         //     <View style={styles.resultsHeader}>
//         //       {/* <Text style={styles.resultsCountText}>
//         //         {searchText
//         //           ? `Found ${allProducts.length} products for "${searchText}"`
//         //           : `Showing all products (${allProducts.length})`}
//         //       </Text> */}
//         //     </View>
//         //   )}
//         //   contentContainerStyle={styles.flatListContainer}
//         // />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   searchResultsContainer: {
//     width: '100%',
//     marginTop: -80,
//     borderRadius: 10,
//     height: 1000,
//     backgroundColor: '#E5F1FF',
//     zIndex: 1000,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   flatListContainer: {
//     paddingBottom: scale(380),
//     backgroundColor: '#FFF',

//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   emptyStateContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     paddingTop: 100,
//   },
//   shimmerContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     backgroundColor: '#FFF',
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//     padding: 10,
//     paddingTop: 20,
//   },
//   loadMoreContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     padding: 10,
//   },
//   noResultsText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#001',
//     marginTop: 15,
//     fontWeight: '500',
//   },
//   noResultsSubText: {
//     textAlign: 'center',
//     fontSize: 14,
//     color: '#666',
//     marginTop: 8,
//   },
//   errorText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#E74C3C',
//     marginTop: 15,
//   },
//   resultsHeader: {
//     padding: 15,
//     paddingBottom: 10,
//     backgroundColor: '#FFF',
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   resultsCountText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
// });

// export default SearchResults;

import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ProductCard from '../Card/ProductCard';
import {addItem} from '../../redux/slices/cartSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {searchProducts} from '../../redux/slices/searchSlice';
import ShimmerCard from '../../screens/Product/SkeltonCard';
import {scale} from '../../utils/Responsive/responsive';

const PAGE_SIZE = 12;
const INITIAL_RENDER_COUNT = 12;
const WINDOW_SIZE = 7; // Reduced for better performance

const SearchResults = React.memo(({searchText}) => {
  const dispatch = useDispatch();
  const {results, loading, error} = useSelector(state => state.search);

  const flatListRef = useRef(null);
  const mountedRef = useRef(true);
  const searchTimeoutRef = useRef(null);

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Optimized product extraction with memoization
  const allProducts = useMemo(() => {
    if (Array.isArray(results)) {
      return results;
    }
    if (results?.products && Array.isArray(results.products)) {
      return results.products;
    }
    return [];
  }, [results]);

  // Debounced search with cleanup
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Optimized search with debouncing
  useEffect(() => {
    console.log('resu', results);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      const trimmedSearch = searchText?.trim() || '';

      if (trimmedSearch) {
        dispatch(searchProducts(trimmedSearch));
      } else {
        // Only fetch all products if we don't have any
        if (allProducts.length === 0) {
          dispatch(searchProducts(''));
        }
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchText, dispatch, allProducts.length]);

  // Reset pagination when search changes
  useEffect(() => {
    if (allProducts.length > 0) {
      const initialProducts = allProducts.slice(0, INITIAL_RENDER_COUNT);
      setVisibleProducts(initialProducts);
      setCurrentPage(1);
      setIsLoadingMore(false);
    } else {
      setVisibleProducts([]);
      setCurrentPage(1);
      setIsLoadingMore(false);
    }
  }, [allProducts]);

  // Optimized load more with throttling
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || visibleProducts.length >= allProducts.length) return;

    setIsLoadingMore(true);

    const nextPage = currentPage + 1;
    const nextProducts = allProducts.slice(0, nextPage * PAGE_SIZE);

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      if (mountedRef.current) {
        setVisibleProducts(nextProducts);
        setCurrentPage(nextPage);
        setIsLoadingMore(false);
      }
    });
  }, [visibleProducts.length, allProducts.length, currentPage, isLoadingMore]);

  // Memoized handlers
  const handleAddPress = useCallback(
    product => {
      dispatch(addItem(product));
    },
    [dispatch],
  );

  const renderProductItem = useCallback(
    ({item, index}) => (
      <ProductCard item={item} onAddPress={handleAddPress} idx={index} />
    ),
    [handleAddPress],
  );

  const keyExtractor = useCallback(item => item._id, []);

  // Optimized getItemLayout for better performance
  const getItemLayout = useCallback(
    (data, index) => ({
      length: 180,
      offset: 180 * Math.floor(index / 3),
      index,
    }),
    [],
  );

  // Memoized shimmer components
  const renderShimmer = useCallback(
    () => (
      <View style={styles.shimmerContainer}>
        {Array.from({length: 6}).map((_, index) => (
          <ShimmerCard key={`shimmer-${index}`} />
        ))}
      </View>
    ),
    [],
  );

  const renderFooter = useCallback(() => {
    if (visibleProducts.length < allProducts.length && allProducts.length > 0) {
      return (
        <View style={styles.loadMoreContainer}>
          {Array.from({length: 3}).map((_, index) => (
            <ShimmerCard key={`shimmer-footer-${index}`} />
          ))}
        </View>
      );
    }
    return null;
  }, [visibleProducts.length, allProducts.length]);

  // Memoized state checks
  const showNoResults = useMemo(() => {
    return searchText && allProducts.length === 0 && !loading;
  }, [searchText, allProducts.length, loading]);

  const shouldShowEmptyState = useMemo(() => {
    return !loading && searchText && allProducts.length === 0;
  }, [loading, searchText, allProducts.length]);

  // Optimized FlatList props
  const flatListProps = useMemo(
    () => ({
      ref: flatListRef,
      data: visibleProducts,
      renderItem: renderProductItem,
      keyExtractor: keyExtractor,
      numColumns: 3,
      onEndReached: handleLoadMore,
      onEndReachedThreshold: 0.8, // Increased to trigger later
      // removeClippedSubviews: true, // Enable clipping for better performance
      windowSize: WINDOW_SIZE,
      maxToRenderPerBatch: 6,
      initialNumToRender: INITIAL_RENDER_COUNT,
      updateCellsBatchingPeriod: 50,
      getItemLayout: getItemLayout,
      ListFooterComponent: renderFooter,
      ListEmptyComponent: shouldShowEmptyState ? (
        <View style={styles.emptyStateContainer}>
          <Icon name="search-off" size={48} color="#001" />
          <Text style={styles.noResultsText}>Product not found</Text>
          <Text style={styles.noResultsSubText}>
            No products found for "{searchText}"
          </Text>
        </View>
      ) : null,
      contentContainerStyle: [
        styles.flatListContainer,
        visibleProducts.length === 0 && styles.emptyListContainer,
      ],
    }),
    [
      visibleProducts,
      renderProductItem,
      keyExtractor,
      handleLoadMore,
      getItemLayout,
      renderFooter,
      shouldShowEmptyState,
      searchText,
    ],
  );

  return (
    <View style={styles.searchResultsContainer}>
      {error ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.errorText}>
            {typeof error === 'string'
              ? error
              : error.message || 'Something went wrong'}
          </Text>
        </View>
      ) : loading && allProducts.length === 0 ? (
        renderShimmer()
      ) : showNoResults ? (
        <View style={styles.emptyStateContainer}>
          <Icon name="search-off" size={48} color="#001" />
          <Text style={styles.noResultsText}>Product not found</Text>
          <Text style={styles.noResultsSubText}>
            No products found for "{searchText}"
          </Text>
        </View>
      ) : (
        <FlatList {...flatListProps} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  searchResultsContainer: {
    width: '100%',
    marginTop: -80,
    borderRadius: 10,
    height: 1000,
    backgroundColor: '#E5F1FF',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  flatListContainer: {
    paddingBottom: scale(380),
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: 200, // Prevent layout shifts
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  shimmerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    paddingTop: 20,
  },
  loadMoreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#001',
    marginTop: 15,
    fontWeight: '500',
  },
  noResultsSubText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#E74C3C',
    marginTop: 15,
  },
});

export default SearchResults;
