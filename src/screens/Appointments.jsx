import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';

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
    <View style={styles.container}>
      {appointments.length === 0 ? (
        <Text style={styles.emptyText}>No appointments booked yet.</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoContainer}>
                <Text style={styles.doctorName}>{item.doctor.name}</Text>
                <Text style={styles.specialization}>{item.doctor.specialization}</Text>
                <Text style={styles.date}>Schedule: {item.day} at {item.time}</Text>
              </View>
              <TouchableOpacity onPress={() => handleCancel(item.id)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  emptyText: { fontSize: 16, textAlign: 'center', marginTop: 50, color: '#666' },
  card: { flexDirection: 'row', padding: 15, backgroundColor: "#fff", marginBottom: 10, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, alignItems: 'center', justifyContent: 'space-between' },
  infoContainer: { flex: 1 },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  specialization: { fontSize: 14, color: '#666', marginTop: 4 },
  date: { fontSize: 14, color: '#0066cc', marginTop: 8, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#ffe6e6', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#ffcccc' },
  cancelButtonText: { color: '#d9534f', fontWeight: 'bold', fontSize: 14 },
});

export default Appointments;
