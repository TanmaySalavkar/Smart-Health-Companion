import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../context/AppContext';

const Dashboard = ({ navigation }) => {
  const { user, appointments } = useContext(AppContext);

  useEffect(() => {
    console.log("Dashboard Loaded");
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, {user.name} 👋</Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming</Text>
          <Text style={styles.cardValue}>{appointments.length}</Text>
          <Text style={styles.cardLabel}>Appointments</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health</Text>
          <Text style={styles.cardValue}>98%</Text>
          <Text style={styles.cardLabel}>Score</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Doctors")}>
          <Text style={styles.actionButtonText}>Find a Doctor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={() => navigation.navigate("Appointments")}>
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>View Appointments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  actionsContainer: {
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    marginBottom: 15,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  secondaryButtonText: {
    color: '#0066cc',
  }
});

export default Dashboard;