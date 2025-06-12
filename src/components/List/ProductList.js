import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {ROUTES} from '../../constants/routes';
import CustomText from '../../CustomText';
import {
  setCategoryName,
  setParentCategoryName,
} from '../../redux/slices/productSlice';
import {useDispatch} from 'react-redux';
import {fallbackImg} from '../../utils/images';

import {getRouteName} from '../../utils/function/routeName';
import styles from './List.styles';

const ProductList = ({title, products, onViewAll, idx}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleProductItem = (item, idx) => {
    dispatch(setCategoryName(item.name));
    if (item.subcategories) {
      dispatch(setParentCategoryName(item.name));
      navigation.navigate(ROUTES.ITEM_SCREEN, {
        subcategories: item.subcategories,
        categoryId: item._id,
        parentCategoryName: item.parentCategoryName,
        subcategoryId: item.subcategories[0]?._id,
        selectedItem: item.subcategories[0]?.name,
      });
    } else {
      dispatch(setParentCategoryName(item.parentCategoryName));
      navigation.navigate(ROUTES.ITEM_SCREEN, {
        subcategories: item.subCategories,
        categoryId: item.parentCategoryId,
        parentCategoryName: item.parentCategoryName,
        subcategoryId: item._id,
        selectedItem: item.subCategories[idx]?.name,
      });
    }
  };

  const handleAllProductsPress = () => {
    navigation.navigate('products');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onViewAll}>
          {title !== 'Shop By Category' && (
            <CustomText style={styles.viewAll}>View All</CustomText>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products &&
          products.map((product, index) => (
            <TouchableOpacity
              key={index}
              style={styles.productCard}
              onPress={() => handleProductItem(product, index)}>
              <Image
                source={{
                  uri: product.image
                    ? `https://api.saraldyechems.com/upload/image/${product.image}`
                    : fallbackImg(),
                }}
                style={styles.productImage}
              />

              <CustomText
                style={[
                  styles.productName,
                  {fontWeight: '700', color: '#5A5A5A'},
                ]}>
                {product.name}
              </CustomText>
            </TouchableOpacity>
          ))}

        {title === 'Shop By Category' && (
          <TouchableOpacity
            style={styles.productCard}
            onPress={handleAllProductsPress}>
            <Image
              source={{
                uri: fallbackImg(),
              }}
              style={styles.productImage}
            />
            <CustomText
              style={[
                styles.productName,
                {fontWeight: '700', color: '#5A5A5A'},
              ]}>
              All Products
            </CustomText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default ProductList;
