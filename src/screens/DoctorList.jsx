import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl, TextInput, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientBackground from '../components/GradientBackground';
import DoctorCard from "../components/DoctorCard";
import Loader from "../components/Loader";
import ErrorView from "../components/ErrorView";
import SearchIcon from "../components/SearchIcon";
import { getDoctors } from "../services/api";
import { COLORS, SPACING, RADIUS, SHADOWS, FONTS } from '../theme';

export default function DoctorList({ navigation }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredData(data);
    } else {
      const query = search.toLowerCase();
      setFilteredData(
        data.filter(d => 
          d.name?.toLowerCase().includes(query) || 
          d.specialization?.toLowerCase().includes(query)
        )
      );
    }
  }, [search, data]);

  const fetchDoctors = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(false);
    
    // Offline-first: Try to load from cache immediately
    try {
      const cached = await AsyncStorage.getItem('@doctors_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setData(parsed);
        }
      }
    } catch (e) {
      console.log("Failed to load cache", e);
    }

    try {
      // Fetch fresh data from server
      const res = await getDoctors();
      if (Array.isArray(res)) {
        setData(res);
        await AsyncStorage.setItem('@doctors_cache', JSON.stringify(res));
      }
    } catch (err) {
      console.log("Error fetching doctors from server:", err);
      if (data.length === 0) {
        setError(true);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDoctors(true);
  };

  if (loading && data.length === 0) return <Loader message="Finding doctors..." />;

  if (error && data.length === 0) {
    return <ErrorView onRetry={() => fetchDoctors()} message="Could not fetch doctors. Please check your connection." />;
  }

  return (
    <GradientBackground style={styles.gradient}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={18} color={COLORS.textLight} style={{ marginRight: SPACING.sm }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or specialization"
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {filteredData.length === 0 && search.trim() !== '' ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No doctors found for "{search}"</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => (item.id || item._id || Math.random()).toString()}
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              onPress={() => navigation.navigate("DoctorDetails", { doctor: item })}
            />
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.soft,
  },
  searchInput: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  listContainer: {
    paddingVertical: SPACING.sm,
    paddingBottom: SPACING.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});