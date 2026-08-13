import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { COLORS, FONTS } from '../theme';

const Loader = ({ size = "large", message = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={COLORS.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.bgFallback,
  },
  message: {
    ...FONTS.caption,
    marginTop: 12,
    color: COLORS.textSecondary,
  },
});

export default Loader;
