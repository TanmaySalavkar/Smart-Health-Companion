import React, { useContext, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, RefreshControl, Dimensions, Modal, Pressable
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { DietContext } from '../context/DietContext';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const CircleProgress = ({ size, strokeWidth, progress, color, children }) => {
  const r = (size - strokeWidth) / 2;
  const p = Math.min(Math.max(progress, 0), 1);
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ position: 'absolute', width: size, height: size }}>
        <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: '#E2E8F0' }} />
      </View>
      <View style={{ position: 'absolute', width: size, height: size, transform: [{ rotate: '-90deg' }] }}>
        <View style={{
          width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth,
          borderColor: 'transparent', borderTopColor: color,
          borderRightColor: p > 0.25 ? color : 'transparent',
          borderBottomColor: p > 0.5 ? color : 'transparent',
          borderLeftColor: p > 0.75 ? color : 'transparent',
        }} />
      </View>
      {children}
    </View>
  );
};

const MacroBar = ({ label, current, target, color, unit = 'g' }) => {
  const pct = target > 0 ? Math.min(current / target, 1) : 0;
  return (
    <View style={s.macroRow}>
      <View style={s.macroLabelRow}>
        <View style={[s.macroDot, { backgroundColor: color }]} />
        <Text style={s.macroLabel}>{label}</Text>
        <Text style={s.macroVal}>{Math.round(current)}/{target}{unit}</Text>
      </View>
      <View style={s.macroBarBg}>
        <View style={[s.macroBarFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const DietDashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useContext(AuthContext);
  const { dashboard, fetchDashboard } = useContext(DietContext);
  const [refreshing, setRefreshing] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  useFocusEffect(useCallback(() => { fetchDashboard(); }, [fetchDashboard]));

  const onRefresh = async () => { 
    setRefreshing(true); 
    await fetchDashboard(); 
    setRefreshing(false); 
  };

  const targets = dashboard.targets || { calories: 2000, protein: 150, carbs: 250, fat: 65, fiber: 30, sugar: 50, sodium: 2300 };
  const consumed = dashboard.consumed || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 };
  const meals = Array.isArray(dashboard.meals) ? dashboard.meals : [];
  const habits = Array.isArray(dashboard.habits) ? dashboard.habits : [];
  const healthScore = Number(dashboard.healthScore) || 30;
  const userName = dashboard.userName || '';
  const calPct = targets.calories > 0 ? (Number(consumed.calories) || 0) / targets.calories : 0;
  const bottomInset = Math.max(insets.bottom + 16, 24);

  return (
    <View style={[s.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.dietBg} />
      
      <ScrollView 
        style={s.scroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomInset + 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.dietAccent} colors={[COLORS.dietAccent]} />}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.appTag}>NutriTrack AI</Text>
            <Text style={s.greeting}>Hi, {userName || user?.name || 'User'} 👋</Text>
            <Text style={s.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          </View>
          <View style={s.headerRight}>
            <TouchableOpacity 
              style={s.avatarCircle} 
              onPress={() => setProfileModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={s.avatarText}>{(userName || user?.name || 'U')[0].toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Title */}
        <Text style={s.sectionTitle}>Your Daily Nutrition Overview</Text>

        {/* Health Score */}
        <View style={s.scoreCard}>
          <CircleProgress size={100} strokeWidth={8} progress={(healthScore || 30) / 100}
            color={healthScore > 70 ? COLORS.dietScoreGood : healthScore > 40 ? COLORS.dietScoreMid : COLORS.dietScoreLow}>
            <Text style={s.scoreNum}>{healthScore || 30}</Text>
            <Text style={s.scoreLabel}>Score</Text>
          </CircleProgress>
          <View style={s.scoreInfo}>
            <Text style={s.scoreTitle}>Health Score</Text>
            <Text style={s.scoreDesc}>{healthScore > 70 ? 'Great job! Keep it up!' : healthScore > 40 ? 'Good progress today' : 'Log more meals to improve'}</Text>
          </View>
        </View>

        {/* Calories Card */}
        <View style={s.calCard}>
          <View style={s.calHeader}>
            <Text style={s.calTitle}>Calories</Text>
            <View style={s.calBadge}><Text style={s.calBadgeText}>Today</Text></View>
          </View>
          <View style={s.calBody}>
            <CircleProgress size={120} strokeWidth={10} progress={Math.min(calPct, 1)} color={COLORS.dietAccent}>
              <Text style={s.calNum}>{Math.round(consumed.calories)}</Text>
              <Text style={s.calUnit}>kcal</Text>
            </CircleProgress>
            <View style={s.calStats}>
              <View style={s.calStatRow}><Text style={s.calStatLabel}>Target</Text><Text style={s.calStatVal}>{targets.calories} kcal</Text></View>
              <View style={s.calStatRow}><Text style={s.calStatLabel}>Consumed</Text><Text style={[s.calStatVal, { color: COLORS.dietAccent }]}>{Math.round(consumed.calories)} kcal</Text></View>
              <View style={s.calStatRow}><Text style={s.calStatLabel}>Remaining</Text><Text style={s.calStatVal}>{Math.max(0, targets.calories - Math.round(consumed.calories))} kcal</Text></View>
            </View>
          </View>
        </View>

        {/* Macros */}
        <View style={s.macroCard}>
          <Text style={s.macroTitle}>Macronutrients</Text>
          <MacroBar label="Protein" current={consumed.protein} target={targets.protein} color={COLORS.dietProtein} />
          <MacroBar label="Carbs" current={consumed.carbs} target={targets.carbs} color={COLORS.dietCarbs} />
          <MacroBar label="Fat" current={consumed.fat} target={targets.fat} color={COLORS.dietFat} />
          <MacroBar label="Fiber" current={consumed.fiber} target={targets.fiber} color={COLORS.dietFiber} />
          <MacroBar label="Sugar" current={consumed.sugar} target={targets.sugar} color={COLORS.dietSugar} />
          <MacroBar label="Sodium" current={consumed.sodium} target={targets.sodium} color={COLORS.dietSodium} unit="mg" />
        </View>

        {/* Habits */}
        {habits && habits.length > 0 && (
          <View style={s.habitsCard}>
            <Text style={s.macroTitle}>Daily Habits</Text>
            {habits.map((h, i) => (
              <View key={i} style={s.habitRow}>
                <Text style={s.habitIcon}>{h.icon || '✅'}</Text>
                <Text style={[s.habitText, h.completed && s.habitDone]}>{h.title}</Text>
                {h.completed && <Text style={s.habitCheck}>✓</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Today's Meals */}
        <View style={s.mealsCard}>
          <View style={s.mealsHeader}>
            <Text style={s.macroTitle}>Today's Meals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MealHistory')} activeOpacity={0.7}>
              <Text style={s.historyLink}>View History  📅</Text>
            </TouchableOpacity>
          </View>
          {meals.length > 0 ? meals.map((m, i) => (
            <View key={m._id || i} style={s.mealItem}>
              <View style={s.mealIconWrap}><Text style={s.mealIcon}>{m.mealType === 'breakfast' ? '🌅' : m.mealType === 'lunch' ? '☀️' : m.mealType === 'dinner' ? '🌙' : '🍎'}</Text></View>
              <View style={s.mealInfo}>
                <Text style={s.mealName} numberOfLines={1}>{m.name || 'Unnamed Meal'}</Text>
                <Text style={s.mealTime}>{(m.mealType || 'meal').charAt(0).toUpperCase() + (m.mealType || 'meal').slice(1)}{m.loggedAt ? ' • ' + new Date(m.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
              </View>
              <Text style={s.mealCal}>{m.calories || 0} kcal</Text>
            </View>
          )) : (
            <View style={s.emptyMeals}>
              <Text style={s.emptyIcon}>🍽️</Text>
              <Text style={s.emptyText}>No meals logged yet today</Text>
              <Text style={s.emptySubtext}>Tap the + button below to scan your meal</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating AI Food Scanner Circular Button */}
      <View style={[s.fabContainer, { bottom: bottomInset }]}>
        <TouchableOpacity 
          style={s.circleScanBtn} 
          onPress={() => navigation.navigate('FoodScanner')} 
          activeOpacity={0.85}
        >
          <Text style={s.circleScanIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Profile & Health Target Modal */}
      <Modal
        visible={profileModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <Pressable style={s.modalOverlay} onPress={() => setProfileModalVisible(false)}>
          <Pressable style={s.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={s.modalHeader}>
              <View style={s.modalAvatarCircle}>
                <Text style={s.modalAvatarText}>{(userName || user?.name || 'U')[0].toUpperCase()}</Text>
              </View>
              <View style={s.modalUserInfo}>
                <Text style={s.modalUserName}>{userName || user?.name || 'User'}</Text>
                <Text style={s.modalUserEmail}>{user?.email || 'user@example.com'}</Text>
              </View>
            </View>

            <View style={s.divider} />

            {/* Health Profile Targets */}
            <Text style={s.menuSectionTitle}>Daily Nutrition Target</Text>
            <View style={s.profileGrid}>
              <View style={s.profileMetric}>
                <Text style={s.metricLabel}>Target Calories</Text>
                <Text style={s.metricValue}>{targets.calories} kcal</Text>
              </View>
              <View style={s.profileMetric}>
                <Text style={s.metricLabel}>Goal</Text>
                <Text style={[s.metricValue, { textTransform: 'capitalize' }]}>{user?.healthProfile?.goal || 'Maintain'}</Text>
              </View>
            </View>

            <View style={s.divider} />

            {/* Menu Options */}
            <TouchableOpacity 
              style={[s.menuItem, s.logoutItem]} 
              onPress={() => {
                setProfileModalVisible(false);
                logout();
              }}
            >
              <Text style={s.menuItemIcon}>🚪</Text>
              <Text style={[s.menuItemText, s.logoutText]}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={s.closeBtn} 
              onPress={() => setProfileModalVisible(false)}
            >
              <Text style={s.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dietBg },
  scroll: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  appTag: { color: COLORS.dietAccent, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  greeting: { fontSize: 24, fontWeight: '800', color: COLORS.dietTextPrimary },
  dateText: { fontSize: 13, color: COLORS.dietTextSecondary, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.dietAccentBg, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.dietAccent },
  avatarText: { color: COLORS.dietAccentText, fontSize: 18, fontWeight: '800' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dietTextPrimary, marginTop: 16, marginBottom: 16 },

  // Health Score
  scoreCard: { flexDirection: 'row', backgroundColor: COLORS.dietCard, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.dietCardBorder, alignItems: 'center', gap: 20, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  scoreNum: { fontSize: 28, fontWeight: '800', color: COLORS.dietTextPrimary },
  scoreLabel: { fontSize: 10, color: COLORS.dietTextSecondary, marginTop: -2 },
  scoreInfo: { flex: 1 },
  scoreTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dietTextPrimary, marginBottom: 4 },
  scoreDesc: { fontSize: 13, color: COLORS.dietTextSecondary, lineHeight: 18 },

  // Week
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 4 },
  dayCircle: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.dietCard, borderWidth: 1, borderColor: COLORS.dietCardBorder },
  dayActive: { backgroundColor: COLORS.dietAccent, borderColor: COLORS.dietAccent },
  dayText: { fontSize: 13, fontWeight: '600', color: COLORS.dietTextSecondary },
  dayTextActive: { color: '#FFFFFF' },

  // Calories
  calCard: { backgroundColor: COLORS.dietCard, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.dietCardBorder, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dietTextPrimary },
  calBadge: { backgroundColor: COLORS.dietAccentBg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  calBadgeText: { color: COLORS.dietAccentText, fontSize: 11, fontWeight: '700' },
  calBody: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  calNum: { fontSize: 26, fontWeight: '800', color: COLORS.dietAccent },
  calUnit: { fontSize: 11, color: COLORS.dietTextSecondary, marginTop: -2 },
  calStats: { flex: 1, gap: 8 },
  calStatRow: { flexDirection: 'row', justifyContent: 'space-between' },
  calStatLabel: { fontSize: 13, color: COLORS.dietTextSecondary },
  calStatVal: { fontSize: 13, fontWeight: '600', color: COLORS.dietTextPrimary },

  // Macros
  macroCard: { backgroundColor: COLORS.dietCard, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.dietCardBorder, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  macroTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dietTextPrimary, marginBottom: 14 },
  macroRow: { marginBottom: 12 },
  macroLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  macroDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  macroLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.dietTextPrimary },
  macroVal: { fontSize: 12, color: COLORS.dietTextSecondary },
  macroBarBg: { height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' },
  macroBarFill: { height: 6, borderRadius: 3 },

  // Habits
  habitsCard: { backgroundColor: COLORS.dietCard, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.dietCardBorder, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  habitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.dietCardBorder },
  habitIcon: { fontSize: 18, marginRight: 12 },
  habitText: { flex: 1, fontSize: 14, color: COLORS.dietTextPrimary },
  habitDone: { textDecorationLine: 'line-through', color: COLORS.dietTextMuted },
  habitCheck: { color: COLORS.dietAccent, fontSize: 16, fontWeight: '700' },

  // Meals
  mealsCard: { backgroundColor: COLORS.dietCard, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.dietCardBorder, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  mealsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  historyLink: { fontSize: 13, fontWeight: '700', color: COLORS.dietAccent },
  mealItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.dietCardBorder },
  mealIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.dietAccentBg, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  mealIcon: { fontSize: 18 },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 14, fontWeight: '600', color: COLORS.dietTextPrimary },
  mealTime: { fontSize: 12, color: COLORS.dietTextSecondary, marginTop: 2 },
  mealCal: { fontSize: 14, fontWeight: '700', color: COLORS.dietAccent },
  emptyMeals: { alignItems: 'center', paddingVertical: 20 },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', color: COLORS.dietTextSecondary },
  emptySubtext: { fontSize: 12, color: COLORS.dietTextMuted, marginTop: 4 },

  // Floating Circular AI Scanner Button
  fabContainer: { position: 'absolute', left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  circleScanBtn: { width: 62, height: 62, borderRadius: 31, backgroundColor: COLORS.dietAccent, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: COLORS.dietAccent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, borderWidth: 3, borderColor: '#FFFFFF' },
  circleScanIcon: { fontSize: 34, fontWeight: '700', color: '#FFFFFF', marginTop: -3 },

  // Modal / Profile Dropdown
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: COLORS.dietCardBorder, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  modalAvatarCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.dietAccentBg, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.dietAccent },
  modalAvatarText: { color: COLORS.dietAccentText, fontSize: 22, fontWeight: '800' },
  modalUserInfo: { flex: 1 },
  modalUserName: { fontSize: 18, fontWeight: '700', color: COLORS.dietTextPrimary },
  modalUserEmail: { fontSize: 13, color: COLORS.dietTextSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.dietCardBorder, marginVertical: 16 },
  menuSectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.dietTextMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  profileGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  profileMetric: { flex: 1, backgroundColor: COLORS.dietSurface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.dietCardBorder },
  metricLabel: { fontSize: 11, color: COLORS.dietTextSecondary, marginBottom: 4 },
  metricValue: { fontSize: 15, fontWeight: '700', color: COLORS.dietAccent },

  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, backgroundColor: COLORS.dietSurface, marginBottom: 10 },
  menuItemIcon: { fontSize: 18, marginRight: 12 },
  menuItemText: { fontSize: 15, fontWeight: '600', color: COLORS.dietTextPrimary },
  logoutItem: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' },
  logoutText: { color: '#EF4444' },
  closeBtn: { marginTop: 8, paddingVertical: 12, alignItems: 'center' },
  closeBtnText: { color: COLORS.dietTextSecondary, fontSize: 14, fontWeight: '600' },
});

export default DietDashboardScreen;
