import React from 'react';
import {View, ScrollView, Dimensions} from 'react-native';
import styles from './Trending.styles';
import ProductRequest from '../Request/ProductRequest';
import RepeatCard from '../RepeatCard.js/RepeatCard';

const {width} = Dimensions.get('window');

const defaultProducts = [
  {
    id: '5',
    name: 'Textile Auxiliaries',
    image: null,
    brand: 'Keyson',
    unit: 'ltr',
  },
  {
    id: '6',
    name: 'Rotary Screen Printing',
    image: null,
    brand: 'Keyson',
    unit: 'ltr',
  },
  {
    id: '7',
    name: 'Dyeing Chemicals',
    image: null,
    brand: 'Keyson',
    unit: 'ltr',
  },
  {
    id: '8',
    name: 'Finishing Agents',
    image: null,
    brand: 'Keyson',
    unit: 'ltr',
  },
];

const TrendingProducts = ({products}) => {
  const displayProducts = products?.length ? products : defaultProducts;

  return (
    <View style={styles.container}>
      <ProductRequest />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingRight: 100, // Ensure last card is visible
          },
        ]}>
        {displayProducts.map((product, index) => (
          <View
            key={product.id || index.toString()}
            style={[
              styles.cardWrapper,
              {
                marginVertical: 5,
              },
            ]}>
            <RepeatCard
              unique={product.id}
              imageSource={product.image}
              name={product.name}
              brand={product.brand}
              unit={product.unit}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TrendingProducts;
