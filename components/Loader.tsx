// components/GlobalLoader.js
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const Loader = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="red" />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000, // Ensure it appears on top
  },
});
