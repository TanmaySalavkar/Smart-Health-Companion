import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import { AppContext } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../theme';

const DoctorDetails = ({ route, navigation }) => {
  const { doctor } = route.params;
  const { bookAppointment } = useContext(AppContext);
  
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Generate avatar initials
  const initials = doctor.name
    ?.replace('Dr. ', '')
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2) || '?';

  const handleBook = async () => {
    if (!selectedDay || !selectedTime) return;
    
    const success = await bookAppointment(doctor, selectedDay, selectedTime);
    if (success) {
      Alert.alert("Success", `Appointment booked with ${doctor.name} on ${selectedDay} at ${selectedTime}`);
      navigation.goBack();
    } else {
      Alert.alert("Error", "Failed to book appointment.");
    }
  };

  // Find available times for the selected day
  const availableTimes = doctor.availability?.find(a => a.day === selectedDay)?.times || [];

  // Get day abbreviation
  const getDayAbbrev = (day) => {
    const abbrevs = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
    return abbrevs[day] || day.substring(0, 3);
  };

  return (
    <GradientBackground style={styles.gradient}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
          
          {/* Contact Icons */}
          <View style={styles.contactRow}>
            <View style={[styles.contactIcon, { backgroundColor: COLORS.dentalBlue }]}>
              <Text style={styles.contactEmoji}>📞</Text>
            </View>
            <View style={[styles.contactIcon, { backgroundColor: COLORS.brainPurple }]}>
              <Text style={styles.contactEmoji}>✉️</Text>
            </View>
            <View style={[styles.contactIcon, { backgroundColor: COLORS.generalGreen }]}>
              <Text style={styles.contactEmoji}>💬</Text>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
          </View>
        </View>

        {/* Description */}
        {doctor.description && (
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{doctor.description}</Text>
          </View>
        )}

        {/* Schedule Section */}
        {doctor.availability && doctor.availability.length > 0 ? (
          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>Select a Day</Text>
            <View style={styles.daysRow}>
              {doctor.availability.map((slot, index) => (
                <TouchableOpacity 
                  key={slot.day} 
                  style={[
                    styles.dayChip, 
                    selectedDay === slot.day && styles.dayChipActive
                  ]}
                  onPress={() => {
                    setSelectedDay(slot.day);
                    setSelectedTime(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayAbbrev, 
                    selectedDay === slot.day && styles.dayTextActive
                  ]}>
                    {getDayAbbrev(slot.day)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedDay && (
              <>
                <Text style={styles.sectionTitle}>Select a Time</Text>
                <View style={styles.timesGrid}>
                  {availableTimes.map((time) => (
                    <TouchableOpacity 
                      key={time} 
                      style={[
                        styles.timeChip, 
                        selectedTime === time && styles.timeChipActive
                      ]}
                      onPress={() => setSelectedTime(time)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.timeText, 
                        selectedTime === time && styles.timeTextActive
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        ) : (
          <View style={styles.noScheduleCard}>
            <Text style={styles.noScheduleText}>No schedule available for this doctor.</Text>
          </View>
        )}
        
        {/* Book Button */}
        <TouchableOpacity 
          style={[
            styles.bookButton, 
            (!selectedDay || !selectedTime) && styles.bookButtonDisabled
          ]} 
          onPress={handleBook}
          disabled={!selectedDay || !selectedTime}
          activeOpacity={0.7}
        >
          <Text style={styles.bookButtonText}>Book an Appointment</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: { 
    flex: 1, 
    paddingHorizontal: SPACING.xl,
  },

  // Profile Card
  profileCard: { 
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.button,
  },
  avatarText: {
    color: COLORS.textWhite,
    fontSize: 28,
    fontWeight: '700',
  },
  name: { 
    ...FONTS.h2,
    marginBottom: SPACING.xs,
  },
  specialization: { 
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  contactRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.circle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactEmoji: {
    fontSize: 18,
  },
  ratingBadge: { 
    backgroundColor: COLORS.ratingBg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
  },
  ratingText: { 
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ratingText,
  },

  // Description
  descriptionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.soft,
  },
  descriptionText: { 
    ...FONTS.body,
    lineHeight: 24,
  },

  // Schedule
  scheduleSection: { 
    marginBottom: SPACING.lg,
  },
  sectionTitle: { 
    ...FONTS.h3,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  daysRow: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  dayChip: { 
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.soft,
  },
  dayChipActive: { 
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.button,
  },
  dayAbbrev: { 
    ...FONTS.h3,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  dayTextActive: { 
    color: COLORS.textWhite,
  },

  // Times
  timesGrid: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  timeChip: { 
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.soft,
  },
  timeChipActive: { 
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.button,
  },
  timeText: { 
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  timeTextActive: { 
    color: COLORS.textWhite,
  },

  // No schedule
  noScheduleCard: {
    backgroundColor: COLORS.errorBg,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  noScheduleText: { 
    ...FONTS.body,
    color: COLORS.error,
    textAlign: 'center',
  },

  // Book Button
  bookButton: { 
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg + 2,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  bookButtonDisabled: { 
    backgroundColor: COLORS.primaryLight,
    opacity: 0.5,
    ...SHADOWS.soft,
  },
  bookButtonText: { 
    ...FONTS.button,
    fontSize: 17,
  },
});

export default DoctorDetails;
