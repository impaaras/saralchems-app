import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import {closeModal} from '../redux/slices/modalSlice';

const VariantsModal = () => {
  const dispatch = useDispatch();
  const handleClose = () => {
    console.log('Dispatching close modal'); // Debug log
    dispatch(closeModal());
  };
  return (
    <View>
      <TouchableOpacity onPress={handleClose}>
        <Text>Close</Text>
      </TouchableOpacity>
      <Text>VariantsModal</Text>
    </View>
  );
};

export default VariantsModal;

const styles = StyleSheet.create({});
