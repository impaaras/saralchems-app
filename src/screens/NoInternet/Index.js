import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import noInternetImage from '../../assets/nointernet.png';
import {scale} from '../../utils/Responsive/responsive';

const NoInternetScreen = ({onRetry}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <Image
        source={noInternetImage}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>No internet connection</Text>
      <Text style={styles.subtitle}>Please check your network</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    height: scale(300),
    width: scale(300),
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2b2b2b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7686A0',
    marginBottom: 24,
  },
  button: {
    borderWidth: 1,
    borderColor: '#1A931B',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#1A931B',
    fontSize: 16,
    fontWeight: '500',
  },
});
