import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {ROUTES} from '../constants/routes';
import CustomText from '../CustomText';
import {setCategoryName} from '../redux/slices/productSlice';
import {useDispatch} from 'react-redux';
import { fallbackImg } from '../utils/images';

const ProductList = ({title, products, onViewAll, idx}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleProductItem = (item, idx) => {
    dispatch(setCategoryName(item.name));
    if (item.subcategories) {
      navigation.navigate(ROUTES.ITEM_SCREEN, {
        subcategories: item.subcategories,
        categoryId: item._id,
        subcategoryId: item.subcategories[0]?._id,
        selectedItem: item.subcategories[0]?.name,
      });
    } else {
      navigation.navigate(ROUTES.ITEM_SCREEN, {
        subcategories: item.subCategories, // No subcategories for subcategory items
        categoryId: item.parentCategoryId, // You'll need to add this to your data
        subcategoryId: item._id,
        selectedItem: item.subCategories[idx]?.name,
      });
    }
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
              {product && product.image ? (
                <Image
                  source={{
                    uri: `https://api.saraldyechems.com/upload/image/${product.image}`,
                  }}
                  style={styles.productImage}
                />
              ) : (
                <Image
                  source={{
                    uri: fallbackImg(),
                  }}
                  style={styles.productImage}
                />
              )}

              <CustomText
                style={[
                  styles.productName,
                  {fontWeight: '700', color: '#5A5A5A'},
                ]}>
                {product.name}
              </CustomText>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#666',
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    width: 100,

    // marginRight: 10,
  },
  productImage: {
    width: 85,
    height: 85,
    borderRadius: 10,
  },
  productName: {
    marginTop: 5,
    fontSize: 11,
    width: '77%',
    // backgroundColor: 'red',
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default ProductList;
