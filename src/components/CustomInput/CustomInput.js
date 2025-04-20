import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import styles from './Custom.styles';

const CustomInput = ({label, placeholder, secureTextEntry, keyboardType}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default CustomInput;
