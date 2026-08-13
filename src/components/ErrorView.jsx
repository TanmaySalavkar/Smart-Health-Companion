import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING, FONTS } from '../theme';

const ErrorView = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>!</Text>
      </View>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    backgroundColor: COLORS.bgFallback,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.error,
  },
  title: {
    ...FONTS.h2,
    marginBottom: SPACING.sm,
  },
  message: {
    ...FONTS.body,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    color: COLORS.textSecondary,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.pill,
    ...SHADOWS.button,
  },
  buttonText: {
    ...FONTS.button,
  },
});

export default ErrorView;
