import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, Animated} from 'react-native';

const SplashScreen = ({onFinish}) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <Image
        source={require('./animation.gif')}
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: '80%',
    height: '80%',
  },
});

export default SplashScreen;
