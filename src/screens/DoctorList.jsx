import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoctorCard from "../components/DoctorCard";
import Loader from "../components/Loader";
import ErrorView from "../components/ErrorView";
import { getDoctors } from "../services/mockApi";

export default function DoctorList({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(false);
    
    // Offline-first: Try to load from cache immediately
    try {
      const cached = await AsyncStorage.getItem('@doctors_cache');
      if (cached) {
        setData(JSON.parse(cached));
      }
    } catch (e) {
      console.log("Failed to load cache", e);
    }

    try {
      // Fetch fresh data
      const res = await getDoctors();
      setData(res);
      // Update cache
      await AsyncStorage.setItem('@doctors_cache', JSON.stringify(res));
    } catch (err) {
      console.log(err);
      if (data.length === 0) {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && data.length === 0) return <Loader />;

  if (error && data.length === 0) {
    return <ErrorView onRetry={fetchDoctors} message="Could not fetch doctors. Please check your connection." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            onPress={() => navigation.navigate("DoctorDetails", { doctor: item })}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingVertical: 10,
  }
});