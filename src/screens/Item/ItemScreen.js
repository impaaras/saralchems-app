import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {StorageKeys, storage} from '../../utils/storage';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import ProductCard from '../../components/Card/ProductCard';
import FilterButtons from '../../components/Buttons/Filter/FilterButtons';
import VariantsModal from '../../components/VariantsModal';
import ProductModal from '../ProductDetails/ProductModal';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {addItem, closeModal} from '../../redux/slices/cartSlice';
import {
  setCategoryId,
  setCategoryName,
  setCurrentSubcategoryId,
  setParentCategoryName,
  setSelectedCategory,
  setSelectedVariant,
  setSubcategories,
} from '../../redux/slices/productSlice';
import {API_URL} from '../../utils/ApiService';
import styles from './Item.styles';

const ItemScreen = ({route}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const showVariants = useSelector(state => state.auth.showVariants);
  const sortOption = useSelector(state => state.sort.sortOption);
  const selectedCategory = useSelector(state => state.product.selectedCategory);
  const currentSubcategoryId = useSelector(
    state => state.product.currentSubcategoryId,
  );
  const subcategories = useSelector(state => state.product.subcategories);
  const categoryId = useSelector(state => state.product.categoryId);

  // Set initial category data when screen is focused
  useEffect(() => {
    console.log();
    if (isFocused && route.params) {
      dispatch(setSelectedCategory(route.params?.selectedItem));
      dispatch(setCurrentSubcategoryId(route.params?.subcategoryId));
      dispatch(setSubcategories(route.params?.subcategories));
      dispatch(setCategoryId(route.params?.categoryId));
    }
  }, [isFocused, route.params]);
  const handleCategorySelection = category => {
    dispatch(setSelectedCategory(category.name));
    dispatch(setSelectedVariant(null));

    dispatch(setCurrentSubcategoryId(category._id));
  };

  // Fetch products when subcategory changes
  useEffect(() => {
    // if (!isFocused) return;

    setProduct([]);
    setErrorMsg('');
    setLoading(true);

    if (!categoryId || !currentSubcategoryId) {
      setErrorMsg('No category or subcategory selected');
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      const token = storage.getString(StorageKeys.AUTH_TOKEN);
      try {
        console.log(categoryId, currentSubcategoryId);
        const response = await axios.get(
          `${API_URL}/product/category/${categoryId}/subcategory/${currentSubcategoryId}`,
          {headers: {Authorization: `Bearer ${token}`}},
        );

        setProduct(response.data);
      } catch (error) {
        setErrorMsg(
          error.response?.data?.message || 'Failed to fetch products',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentSubcategoryId, categoryId]);

  // Sort products when sortOption changes
  const sortedProducts = React.useMemo(() => {
    if (!product || product.length === 0) return [];

    const productsToSort = [...product];

    if (sortOption === 'name-asc') {
      return productsToSort.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      return productsToSort.sort((a, b) => b.name.localeCompare(a.name));
    }

    return productsToSort;
  }, [product, sortOption, subcategories]);

  const selectedProductItem = useSelector(state => state.cart.selectedProduct);
  const isProductModalOpen = useSelector(
    state => state.cart.isProductModalOpen,
  );

  const handleAddPress = product => {
    dispatch(addItem(product));
  };

  return (
    <View style={styles.screen}>
      <DashboardHeader
        categories={subcategories || route.params?.subcategories}
      />
      <View style={styles.scrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.container}>
          {subcategories &&
            subcategories.map(category => (
              <TouchableOpacity
                key={category._id}
                style={[
                  styles.itemContainer,
                  selectedCategory === category.name && styles.selectedItem,
                ]}
                onPress={() => handleCategorySelection(category)}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1583364493238-248032147fbd?auto=format&fit=crop&w=1974&q=80',
                  }}
                  style={styles.image}
                />
                <Text style={styles.itemTitle}>{category.name}</Text>
                {selectedCategory === category.name && (
                  <View style={styles.borderBottom} />
                )}
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
      <FilterButtons
        filters={['Filter']}
        selectedFilter="sort"
        onFilterPress={() => {}}
      />

      <ScrollView
        style={styles.productsContainer}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{fontSize: 16, color: 'gray'}}>Loading...</Text>
          </View>
        ) : errorMsg ? (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{fontSize: 16, color: 'red'}}>{errorMsg}</Text>
          </View>
        ) : sortedProducts.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {sortedProducts &&
              sortedProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  item={product}
                  onAddPress={handleAddPress}
                  idx={index}
                />
              ))}
          </View>
        ) : (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{fontSize: 16, color: 'gray'}}>
              No items available
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ItemScreen;
