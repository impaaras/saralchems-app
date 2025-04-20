import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  setCategoryId,
  setCategoryName,
  setCurrentSubcategoryId,
  setSelectedCategory,
  setSubcategories,
} from '../../redux/slices/productSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import styles from './Dropdown.styles';

const DropdownMenu = ({currentRouteName, categories}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotateAnimation] = useState(new Animated.Value(0));
  const [selectedCategory, setSecSelectedCategory] = useState(null);
  const parentCategoryName = useSelector(
    state => state.product.parentCategoryName,
  );
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.timing(rotateAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  useFocusEffect(
    React.useCallback(() => {
      setSecSelectedCategory(null);
      setIsOpen(false);
    }, []),
  );

  // const handleCategorySelect = (category, index) => {
  //   console.log(category._id);
  //   setSecSelectedCategory(category);
  //   dispatch(setCategoryId(category._id));
  //   dispatch(setSubcategories(category?.subcategories));
  //   dispatch(setCategoryName(category.name));
  //   dispatch(setSelectedCategory(category.subcategories[0]?.name));
  //   dispatch(setCurrentSubcategoryId(category.subcategories[0]?._id));

  //   setIsOpen(false);
  // };
  const handleCategorySelect = (category, index) => {
    if (category._id === 'all-products') {
      dispatch(setCategoryId(null));
      dispatch(setSubcategories([]));
      dispatch(setCategoryName('All Products'));
      dispatch(setSelectedCategory(null));
      dispatch(setCurrentSubcategoryId(null));
      setSecSelectedCategory(null);
    } else {
      setSecSelectedCategory(category);
      dispatch(setCategoryId(category._id));
      dispatch(setSubcategories(category?.subcategories));
      dispatch(setCategoryName(category.name));
      dispatch(setSelectedCategory(category.subcategories[0]?.name));
      dispatch(setCurrentSubcategoryId(category.subcategories[0]?._id));
    }

    setIsOpen(false);
  };

  const animatedStyles = {
    transform: [{rotate: rotateInterpolate}],
  };

  const fullCategoryList = [
    {_id: 'all-products', name: 'All Products'},
    ...(categories || []),
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={toggleDropdown}
        activeOpacity={0.8}>
        <Text style={styles.dropdownButtonText}>
          {selectedCategory?.name || parentCategoryName || 'All Products'}
        </Text>
        <Animated.View style={animatedStyles}>
          <Ionicons name="chevron-down" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownListContainer}>
          {fullCategoryList.map((category, index) => (
            <TouchableOpacity
              key={category._id || index}
              style={[
                styles.dropdownItem,
                selectedCategory?._id === category._id && styles.activeItem,
                category._id === 'all-products' &&
                  !selectedCategory &&
                  styles.activeItem,
              ]}
              onPress={() => handleCategorySelect(category, index)}>
              <Text
                style={[
                  styles.dropdownItemText,
                  (selectedCategory?._id === category._id ||
                    (!selectedCategory && category._id === 'all-products')) &&
                    styles.activeItemText,
                ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default DropdownMenu;
