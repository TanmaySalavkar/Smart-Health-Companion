import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({ size = "large", color = "#0066cc" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default Loader;
