import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

const DoctorCard = ({ doctor, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#666666',
  },
  ratingContainer: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066cc',
  },
});

export default DoctorCard;