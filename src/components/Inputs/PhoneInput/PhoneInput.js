import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import styles from './Phone.styles';

const PhoneInput = ({label}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.countryCode}>
          <Text>+1</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="858585858"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
};

export default PhoneInput;
