import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import SearchIcon from '../components/SearchIcon';
import { AppContext } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../theme';

const CATEGORIES = [
  { id: 'heart', label: 'Heart', emoji: '❤️', bg: COLORS.heartRed, color: COLORS.heartIcon },
  { id: 'dental', label: 'Dental', emoji: '🦷', bg: COLORS.dentalBlue, color: COLORS.dentalIcon },
  { id: 'brain', label: 'Brain', emoji: '🧠', bg: COLORS.brainPurple, color: COLORS.brainIcon },
  { id: 'general', label: 'General', emoji: '🏥', bg: COLORS.generalGreen, color: COLORS.generalIcon },
];

const Dashboard = ({ navigation }) => {
  const { user, appointments } = useContext(AppContext);

  useEffect(() => {
    console.log("Dashboard Loaded");
  }, []);

  return (
    <GradientBackground style={styles.gradient}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Hello, {user.name} 👋</Text>
              <Text style={styles.subtitle}>Find your desired specialist</Text>
            </View>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{user.name?.[0] || 'U'}</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate("Doctors")}
          activeOpacity={0.7}
        >
          <Text style={styles.searchPlaceholder}>Search for doctor</Text>
          <View style={styles.searchIcon}>
            <SearchIcon size={20} color={COLORS.textWhite} />
          </View>
        </TouchableOpacity>

        {/* Category Section */}
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => navigation.navigate("Doctors")}
              activeOpacity={0.7}
            >
              <View style={[styles.categoryIcon, { backgroundColor: cat.bg }]}>
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() => navigation.navigate("Appointments")}
            activeOpacity={0.7}
          >
            <View style={[styles.summaryIconCircle, { backgroundColor: COLORS.ratingBg }]}>
              <Text style={styles.summaryEmoji}>📅</Text>
            </View>
            <Text style={styles.summaryValue}>{appointments.length}</Text>
            <Text style={styles.summaryLabel}>Appointments</Text>
          </TouchableOpacity>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconCircle, { backgroundColor: COLORS.heartRed }]}>
              <Text style={styles.summaryEmoji}>💊</Text>
            </View>
            <Text style={styles.summaryValue}>3</Text>
            <Text style={styles.summaryLabel}>Reminders</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Doctors")}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>Find a Doctor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Appointments")}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>View Appointments</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  header: {
    marginTop: 50,
    marginBottom: SPACING.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...FONTS.h1,
    fontSize: 26,
  },
  subtitle: {
    ...FONTS.body,
    marginTop: SPACING.xs,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  avatarText: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: '700',
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.pill,
    paddingLeft: SPACING.xl,
    paddingRight: SPACING.xs,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.soft,
  },
  searchPlaceholder: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.textLight,
  },
  searchIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Categories
  sectionTitle: {
    ...FONTS.h3,
    marginBottom: SPACING.lg,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  categoryItem: {
    alignItems: 'center',
    width: 72,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.soft,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },

  // Summary cards
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  summaryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.circle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  summaryEmoji: {
    fontSize: 20,
  },
  summaryValue: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.primary,
  },
  summaryLabel: {
    ...FONTS.caption,
    marginTop: SPACING.xs,
  },

  // Buttons
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.button,
  },
  primaryButtonText: {
    ...FONTS.button,
    fontSize: 17,
  },
  secondaryButton: {
    backgroundColor: COLORS.cardBg,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  secondaryButtonText: {
    ...FONTS.button,
    color: COLORS.primary,
    fontSize: 17,
  },
});

export default Dashboard;