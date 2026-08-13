import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import { AppContext } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../theme';

const Appointments = () => {
  const { appointments, cancelAppointment } = useContext(AppContext);

  const handleCancel = (id) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          onPress: async () => {
            const success = await cancelAppointment(id);
            if (!success) {
              Alert.alert("Error", "Could not cancel appointment.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <GradientBackground style={styles.gradient}>
      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Text style={styles.emptyIcon}>📅</Text>
          </View>
          <Text style={styles.emptyTitle}>No Appointments Yet</Text>
          <Text style={styles.emptyText}>Book an appointment with a doctor to get started.</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Doctor Avatar */}
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {item.doctor.name?.replace('Dr. ', '')?.[0] || '?'}
                </Text>
              </View>
              
              <View style={styles.infoContainer}>
                <Text style={styles.doctorName}>{item.doctor.name}</Text>
                <Text style={styles.specialization}>{item.doctor.specialization}</Text>
                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleEmoji}>🕐</Text>
                  <Text style={styles.scheduleText}>{item.day} at {item.time}</Text>
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => handleCancel(item.id)} 
                style={styles.cancelButton}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.ratingBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    ...FONTS.h2,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...FONTS.body,
    textAlign: 'center',
    color: COLORS.textLight,
  },

  // List
  listContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  // Card
  card: { 
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: COLORS.cardBg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: '700',
  },
  infoContainer: { 
    flex: 1,
  },
  doctorName: { 
    ...FONTS.h3,
    fontSize: 16,
  },
  specialization: { 
    ...FONTS.caption,
    marginTop: 2,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  scheduleEmoji: {
    fontSize: 12,
    marginRight: SPACING.xs,
  },
  scheduleText: { 
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Cancel
  cancelButton: { 
    width: 36,
    height: 36,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: { 
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default Appointments;
