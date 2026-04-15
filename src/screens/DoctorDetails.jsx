import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

const DoctorDetails = ({ route, navigation }) => {
  const { doctor } = route.params;
  const { bookAppointment } = useContext(AppContext);

  const handleBook = async () => {
    const success = await bookAppointment(doctor);
    if (success) {
      Alert.alert("Success", `Appointment booked with ${doctor.name}`);
      navigation.goBack();
    } else {
      Alert.alert("Error", "Failed to book appointment.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.specialization}>{doctor.specialization}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: { padding: 25, backgroundColor: "#ffffff", borderRadius: 12, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 30 },
  name: { fontSize: 24, fontWeight: "bold", color: '#333', marginBottom: 8 },
  specialization: { fontSize: 18, color: "#666", marginBottom: 16 },
  ratingBadge: { backgroundColor: '#f0f8ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  ratingText: { fontSize: 16, fontWeight: 'bold', color: '#0066cc' },
  bookButton: { backgroundColor: '#0066cc', paddingVertical: 15, borderRadius: 10, alignItems: 'center', elevation: 2 },
  bookButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' }
});

export default DoctorDetails;
