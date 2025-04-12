import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {searchProducts} from '../redux/slices/searchSlice';
import DashboardHeader from '../components/DashBoardHeader';
import ProductCard from '../components/ProductCard';
import {addItem} from '../redux/slices/cartSlice';

const PAGE_SIZE = 15;

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const {
    results: allProducts,
    loading,
    error,
  } = useSelector(state => state.search);

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Call API every time screen is focused
  useFocusEffect(
    useCallback(() => {
      dispatch(searchProducts(''));
    }, [dispatch]),
  );

  // When full product list is updated, reset visible products
  useEffect(() => {
    if (allProducts.length > 0) {
      setVisibleProducts(allProducts.slice(0, PAGE_SIZE));
      setCurrentPage(1);
    }
  }, [allProducts]);

  const handleAddPress = product => {
    dispatch(addItem(product));
  };

  const renderProductItem = ({item, index}) => (
    <ProductCard
      key={item._id}
      item={item}
      onAddPress={handleAddPress}
      idx={index}
    />
  );

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const nextData = allProducts.slice(0, nextPage * PAGE_SIZE);

    if (nextData.length > visibleProducts.length) {
      setVisibleProducts(nextData);
      setCurrentPage(nextPage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader />
      <View
        style={{
          zIndex: 9999,
          backgroundColor: '#FFF',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          marginTop: -80,
        }}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={visibleProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.flatListContainer}
            showsVerticalScrollIndicator={false}
            numColumns={3}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              visibleProducts.length < allProducts.length ? (
                <Text style={styles.loadingText}>Loading more...</Text>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});
