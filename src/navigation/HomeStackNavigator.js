// HomeStackNavigator.js
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/Homescreen/HomeScreen';
import ProductsScreen from '../screens/Product/ProductsScreen';
import ItemScreen from '../screens/Item/ItemScreen';
import ProductDetail from '../screens/ProductDetails/ProductDetail';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CategoryScreen" component={ProductsScreen} />
      <Stack.Screen name="ItemScreen" component={ItemScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
