import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../constants/routes';
import {useNavigation} from '@react-navigation/native';
import ProductCard from '../Card/ProductCard';
import {addItem} from '../../redux/slices/cartSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {clearHistory} from '../../redux/slices/searchHistory';
import {searchProducts} from '../../redux/slices/searchSlice';
import {useLoader} from '../../context/LoaderContext';

const PAGE_SIZE = 15;

const SearchResults = ({searchText}) => {
  const dispatch = useDispatch();
  const {results, loading, error} = useSelector(state => state.search);
  const {history} = useSelector(state => state.searchHistory);
  const navigation = useNavigation();
  const {setLoading} = useLoader();

  // Pagination state - matching your ProductsScreen implementation
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Update visible products when search results change
  useEffect(() => {
    if (results && results.length > 0) {
      setVisibleProducts(results.slice(0, PAGE_SIZE));
      setCurrentPage(1);
    } else {
      setVisibleProducts([]);
    }
  }, [results]);

  const handleAddPress = product => {
    dispatch(addItem(product));
  };

  const handleHistoryItemPress = async query => {
    setLoading(true);
    try {
      await dispatch(searchProducts(query)).unwrap(); // dispatch & wait
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  // Load more function - matches your ProductsScreen implementation
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const nextData = results.slice(0, nextPage * PAGE_SIZE);

    if (nextData.length > visibleProducts.length) {
      setVisibleProducts(nextData);
      setCurrentPage(nextPage);
    }
  };

  const showNoResults = searchText && results?.length === 0;
  const showInitialState = !searchText && results?.length === 0;

  const renderProductItem = ({item, index}) => (
    <ProductCard
      key={item._id}
      item={item}
      onAddPress={handleAddPress}
      idx={index}
    />
  );

  return (
    <View style={styles.searchResultsContainer}>
      {error ? (
        <View style={styles.emptyStateContainer}>
          <Text style={{fontSize: 16, color: '#555'}}>
            Error: {error.message}
          </Text>
        </View>
      ) : showNoResults ? (
        <View style={styles.emptyStateContainer}>
          <Icon name="search-off" size={48} color="#CCCCCC" />
          <Text style={styles.noResultsText}>
            No results found for "{searchText}"
          </Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={() =>
            history.length > 0 && (
              <></>
              // <View style={styles.historySection}>
              //   <View style={styles.historyHeader}>
              //     <Text style={styles.historyTitle}>Recent Searches</Text>
              //     <TouchableOpacity onPress={handleClearHistory}>
              //       <Text style={styles.clearHistoryText}>Clear</Text>
              //     </TouchableOpacity>
              //   </View>
              //   {history.map((item, index) => (
              //     <TouchableOpacity
              //       key={index}
              //       style={styles.historyItem}
              //       onPress={() => handleHistoryItemPress(item)}>
              //       <Icon name="history" size={20} color="#3C5D87" />
              //       <Text style={styles.historyText}>{item}</Text>
              //     </TouchableOpacity>
              //   ))}
              // </View>
            )
          }
          contentContainerStyle={styles.flatListContainer}
          data={visibleProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item._id}
          numColumns={3}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            visibleProducts.length < (results?.length || 0) ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#3C5D87" />
                <Text style={styles.loadingMoreText}>Loading more...</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

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
    paddingBottom: 330,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555555',
    marginTop: 15,
    fontWeight: '500',
  },
  historySection: {
    padding: 10,
    backgroundColor: '#E5F1FF',
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  clearHistoryText: {
    color: '#3C5D87',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#3C5D87',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  loadingMoreText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
});

export default SearchResults;
