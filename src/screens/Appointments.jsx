import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';

const Appointments = () => {
  const { appointments } = useContext(AppContext);

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
              <Text style={styles.doctorName}>{item.doctor.name}</Text>
              <Text style={styles.specialization}>{item.doctor.specialization}</Text>
              <Text style={styles.date}>Date: {new Date(item.date).toLocaleDateString()}</Text>
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
  card: { padding: 15, backgroundColor: "#fff", marginBottom: 10, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  specialization: { fontSize: 14, color: '#666', marginTop: 4 },
  date: { fontSize: 14, color: '#0066cc', marginTop: 8, fontWeight: 'bold' },
});

export default Appointments;
