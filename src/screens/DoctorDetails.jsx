import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AppContext } from '../context/AppContext';

const DoctorDetails = ({ route, navigation }) => {
  const { doctor } = route.params;
  const { bookAppointment } = useContext(AppContext);
  
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialization}>{doctor.specialization}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
        </View>
        {doctor.description && (
          <Text style={styles.description}>{doctor.description}</Text>
        )}
      </View>

      {doctor.availability && doctor.availability.length > 0 ? (
        <View style={styles.scheduleContainer}>
          <Text style={styles.sectionTitle}>Select a Day</Text>
          <View style={styles.chipsContainer}>
            {doctor.availability.map((slot) => (
              <TouchableOpacity 
                key={slot.day} 
                style={[styles.chip, selectedDay === slot.day && styles.activeChip]}
                onPress={() => {
                  setSelectedDay(slot.day);
                  setSelectedTime(null); // reset time when day changes
                }}
              >
                <Text style={[styles.chipText, selectedDay === slot.day && styles.activeChipText]}>{slot.day}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedDay && (
            <>
              <Text style={styles.sectionTitle}>Select a Time</Text>
              <View style={styles.chipsContainer}>
                {availableTimes.map((time) => (
                  <TouchableOpacity 
                    key={time} 
                    style={[styles.chip, selectedTime === time && styles.activeChip]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.chipText, selectedTime === time && styles.activeChipText]}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      ) : (
        <Text style={styles.noScheduleText}>No schedule available for this doctor.</Text>
      )}
      
      <TouchableOpacity 
        style={[styles.bookButton, (!selectedDay || !selectedTime) && styles.disabledButton]} 
        onPress={handleBook}
        disabled={!selectedDay || !selectedTime}
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: { padding: 25, backgroundColor: "#ffffff", borderRadius: 12, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: "bold", color: '#333', marginBottom: 8 },
  specialization: { fontSize: 18, color: "#666", marginBottom: 16 },
  ratingBadge: { backgroundColor: '#f0f8ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 15 },
  ratingText: { fontSize: 16, fontWeight: 'bold', color: '#0066cc' },
  description: { fontSize: 15, color: '#555', textAlign: 'center', lineHeight: 22, marginTop: 10 },
  scheduleContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#e0e0e0', borderWidth: 1, borderColor: '#d0d0d0' },
  activeChip: { backgroundColor: '#0066cc', borderColor: '#005bb5' },
  chipText: { color: '#333', fontWeight: 'bold' },
  activeChipText: { color: '#ffffff' },
  noScheduleText: { fontSize: 16, color: '#d9534f', textAlign: 'center', marginVertical: 20 },
  bookButton: { backgroundColor: '#0066cc', paddingVertical: 15, borderRadius: 10, alignItems: 'center', elevation: 2, marginBottom: 40 },
  disabledButton: { backgroundColor: '#a0c4e8', elevation: 0 },
  bookButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' }
});

export default DoctorDetails;
