import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {fallbackImg} from '../../utils/images';
import styles from './Trending.styles';

const {width} = Dimensions.get('window');
const cardWidth = width * 0.45;

const TrendingProducts = ({products}) => {
  // If no products are provided, use these default products
  const defaultProducts = [
    {
      id: '1',
      name: 'Textile Auxiliaries',
      image: fallbackImg(),
    },
    {
      id: '2',
      name: 'Rotary Screen Printing',
      image: fallbackImg(),
    },
    {
      id: '3',
      name: 'Dyeing Chemicals',
      image: fallbackImg(),
    },
    {
      id: '4',
      name: 'Finishing Agents',
      image: fallbackImg(),
    },
  ];

  const displayProducts = products || defaultProducts;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {displayProducts.map(product => (
          <TouchableOpacity key={product.id} style={styles.card}>
            <Image
              source={{uri: product.image}}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{product.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TrendingProducts;
