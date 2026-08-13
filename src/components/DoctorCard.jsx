import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING, FONTS } from '../theme';

const DoctorCard = ({ doctor, onPress }) => {
  // Generate avatar initials from doctor name
  const initials = doctor.name
    ?.replace('Dr. ', '')
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2) || '?';

  // Pick avatar color based on specialization
  const avatarColors = {
    Cardiologist: { bg: COLORS.heartRed, text: COLORS.heartIcon },
    Dermatologist: { bg: COLORS.dentalBlue, text: COLORS.dentalIcon },
    Neurologist: { bg: COLORS.brainPurple, text: COLORS.brainIcon },
    Pediatrician: { bg: COLORS.generalGreen, text: COLORS.generalIcon },
    Orthopedic: { bg: '#FFF3E0', text: '#FF9800' },
    ENT: { bg: '#E0F7FA', text: '#00BCD4' },
  };
  const avatarStyle = avatarColors[doctor.specialization] || { bg: COLORS.ratingBg, text: COLORS.primary };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.avatar, { backgroundColor: avatarStyle.bg }]}>
        <Text style={[styles.avatarText, { color: avatarStyle.text }]}>{initials}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialization}>{doctor.specialization}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.cardBg,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.card,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.circle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    ...FONTS.h3,
    marginBottom: 2,
  },
  specialization: {
    ...FONTS.caption,
    fontSize: 14,
  },
  ratingContainer: {
    backgroundColor: COLORS.ratingBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ratingText,
  },
});

export default DoctorCard;