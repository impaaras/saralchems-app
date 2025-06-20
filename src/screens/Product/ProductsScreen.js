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
import {searchProducts} from '../../redux/slices/searchSlice';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import ProductCard from '../../components/Card/ProductCard';
import {addItem} from '../../redux/slices/cartSlice';
import styles from './Product.styles';
import {useLoader} from '../../context/LoaderContext';

const PAGE_SIZE = 15;

const ProductsScreen = () => {
  const dispatch = useDispatch();

  const {setLoading} = useLoader();
  const {
    results: allProducts,
    loading,
    error,
  } = useSelector(state => state.search);

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Call API every time screen is focused
  // useFocusEffect(
  //   useCallback(() => {
  //     dispatch(searchProducts(''));
  //   }, [dispatch]),
  // );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          await dispatch(searchProducts('')).unwrap();
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false); // Hide loader
        }
      };

      fetchData();
    }, [dispatch, setLoading]),
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
        {error ? (
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
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProductsScreen;
