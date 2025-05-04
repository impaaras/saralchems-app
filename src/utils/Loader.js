import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Loader = () => {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size={35} />
      <Text style={{color: 'white', fontWeight: 600, fontSize: 15}}>
        Loading...
      </Text>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loader: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
