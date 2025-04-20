import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setSortOption} from '../../../redux/slices/sortSlice';
import styles from './Filter.styles';
const FilterHeader = ({onSortPress, onFilterPress}) => {
  const dispatch = useDispatch();
  const currentSortOption = useSelector(state => state.sort.sortOption);

  const handleSortPress = () => {
    // Instead of passing a function, check the current state and dispatch the opposite
    const newSortOption =
      currentSortOption === 'name-asc' ? 'name-desc' : 'name-asc';
    dispatch(setSortOption(newSortOption));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Products</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSortPress}>
          <Icon name="sort" size={20} color="#001" />
          <Text style={styles.actionText}>Sort</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FilterHeader;
