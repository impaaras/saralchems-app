import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import Svg, {Path, Circle} from 'react-native-svg';
const ErrorFallback = () => {
  const handleGoHome = () => {
    (global as any).forceAppRestart?.();
  };

  return (
    <View style={styles.container}>
      <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="#FF6B6B" strokeWidth="2.5" />
        <Path
          d="M12 7v5"
          stroke="#FF6B6B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Path
          d="M12 16h.01"
          stroke="#FF6B6B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </Svg>

      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.message}>
        This page isn't working properly right now. You can go back to the home
        screen.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorFallback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 16,
    color: '#333',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
