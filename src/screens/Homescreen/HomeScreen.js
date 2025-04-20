import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';

import ProductList from '../../components/List/ProductList';
import axios from 'axios';
import TrendingProducts from '../../components/Trending/TrendingProducts';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {ROUTES} from '../../constants/routes';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '../../utils/ApiService';
import {getRouteName} from '../../utils/function/routeName';
import styles from './Homescreen.styles';

const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get token from Redux store
  const token = useSelector(state => state.auth.token);
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
      console.log('hloss', subCategoriesMap);

      setCategories(categoriesData);
      setSubCategories(subCategoriesMap);
      setLoading(false);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b5998" />
      </View>
    );
  }

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
      <DashboardHeader />
      <TrendingProducts categories={categories} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          <ProductList title="Shop By Category" products={categories} />
        </View>
        {categories.map((category, index) => (
          <View key={category._id}>
            <ProductList
              title={`${category.name}`}
              products={subCategories[category._id] || []}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
