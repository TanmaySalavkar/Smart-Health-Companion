import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

/**
 * GradientBackground - Pastel background wrapper.
 * To enable gradients: rebuild the Android app after installing
 * react-native-linear-gradient (cd android && ./gradlew clean && cd .. && npx react-native run-android)
 */
const GradientBackground = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgFallback,
  },
});

export default GradientBackground;
