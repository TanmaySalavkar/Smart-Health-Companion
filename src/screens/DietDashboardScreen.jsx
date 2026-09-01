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
import BottomNavBar from '../components/BottomNavBar';

const { width } = Dimensions.get('window');
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// ── Circular Progress Ring ──────────────────────────
const CircleProgress = ({ size, strokeWidth, progress, color, bgColor, children }) => {
  const p = Math.min(Math.max(progress, 0), 1);
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ position: 'absolute', width: size, height: size }}>
        <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: bgColor || 'rgba(255,255,255,0.15)' }} />
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

// ── NuFi Colors ──────────────────────────────────────
const LIME = '#C8FF00';
const LIME_DIM = '#A8D600';
const DARK_BG = '#1A1A2E';
const DARK_CARD = '#222240';
const CARD_BG = '#FFFFFF';

const DietDashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useContext(AuthContext);
  const { dashboard, fetchDashboard } = useContext(DietContext);
  const [refreshing, setRefreshing] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Current day index (Mon=0 ... Sun=6)
  const today = new Date();
  const activeDay = today.getDay() === 0 ? 6 : today.getDay() - 1;

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
  const completedHabits = habits.filter(h => h.completed).length;
  const bottomInset = Math.max(insets.bottom + 16, 24);

  return (
    <View style={[s.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomInset + 80 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={LIME_DIM} colors={[LIME_DIM]} />}
      >
        {/* ═══ Header ═══ */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.brandName}>NuFi</Text>
            <Text style={s.streakBadge}> ⚡ 1</Text>
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

        {/* ═══ Daily Score Card (Dark) ═══ */}
        <View style={s.scoreCard}>
          <View style={s.scoreTop}>
            <View style={s.scoreLeft}>
              <Text style={s.scoreLabel}>DAILY SCORE</Text>
              <View style={s.scoreValRow}>
                <Text style={s.scoreNum}>{healthScore}</Text>
                <Text style={s.scoreOf}>/100</Text>
              </View>
              <Text style={s.scoreSub}>Habits · Calories · Work</Text>
            </View>
            <CircleProgress size={64} strokeWidth={5} progress={healthScore / 100} color={LIME} bgColor="rgba(255,255,255,0.12)">
              <Text style={s.scoreRingText}>{Math.round(healthScore)}%</Text>
            </CircleProgress>
          </View>

          {/* Week Strip inside Score Card */}
          <View style={s.weekRow}>
            {DAYS.map((d, i) => (
              <View
                key={i}
                style={[s.weekDayCol, activeDay === i && s.weekDayActive]}
              >
                <Text style={[s.weekDayText, activeDay === i && s.weekDayTextActive]}>{d}</Text>
              </View>
            ))}
          </View>

          {/* Current day score badge */}
          <View style={s.dayScoreBadge}>
            <Text style={s.dayScoreText}>{healthScore}</Text>
          </View>
        </View>

        {/* ═══ Calories Card (Lime Green) ═══ */}
        <View style={s.calCard}>
          <View style={s.calHeader}>
            <View>
              <Text style={s.calTitle}>Calories</Text>
              <View style={s.calValRow}>
                <Text style={s.calNum}>{Math.round(consumed.calories).toLocaleString()}</Text>
                <Text style={s.calOf}>/{targets.calories.toLocaleString()} kcal</Text>
              </View>
            </View>
            <CircleProgress size={56} strokeWidth={4} progress={Math.min(calPct, 1)} color={DARK_BG} bgColor="rgba(0,0,0,0.12)">
              <Text style={s.calRingText}>{Math.round(calPct * 100)}%</Text>
            </CircleProgress>
          </View>

          {/* Macros Grid */}
          <View style={s.macroGrid}>
            <View style={s.macroCell}>
              <Text style={s.macroName}>Protein</Text>
              <Text style={s.macroVal}>{Math.round(consumed.protein)}<Text style={s.macroTarget}>/{targets.protein}g</Text></Text>
            </View>
            <View style={s.macroCell}>
              <Text style={s.macroName}>Carbs</Text>
              <Text style={s.macroVal}>{Math.round(consumed.carbs)}<Text style={s.macroTarget}>/{targets.carbs}g</Text></Text>
            </View>
            <View style={s.macroCell}>
              <Text style={s.macroName}>Fat</Text>
              <Text style={s.macroVal}>{Math.round(consumed.fat)}<Text style={s.macroTarget}>/{targets.fat}g</Text></Text>
            </View>
            <View style={s.macroCell}>
              <Text style={s.macroName}>Sugar</Text>
              <Text style={s.macroVal}>{Math.round(consumed.sugar)}<Text style={s.macroTarget}>/{targets.sugar}g</Text></Text>
            </View>
            <View style={s.macroCell}>
              <Text style={s.macroName}>Fiber</Text>
              <Text style={s.macroVal}>{Math.round(consumed.fiber)}<Text style={s.macroTarget}>/{targets.fiber}g</Text></Text>
            </View>
            <View style={s.macroCell}>
              <Text style={s.macroName}>Sodium</Text>
              <Text style={s.macroVal}>{Math.round(consumed.sodium)}<Text style={s.macroTarget}>/{targets.sodium}mg</Text></Text>
            </View>
          </View>
        </View>

        {/* ═══ Habits & Tasks Cards (Side by Side) ═══ */}
        <View style={s.bottomRow}>
          {/* Habits Card */}
          <TouchableOpacity style={s.bottomCard} activeOpacity={0.85}>
            <Text style={s.bottomCardTitle}>Habits</Text>
            <Text style={s.bottomCardSub}>{habits.length > 0 ? `${habits.length} active` : 'No habits'}</Text>
            <View style={s.habitsVisual}>
              <Text style={s.habitsCount}>{completedHabits}<Text style={s.habitsTotal}>/{habits.length || 5}</Text></Text>
              <View style={s.habitDots}>
                {(habits.length > 0 ? habits : Array(5).fill(null)).slice(0, 5).map((h, i) => (
                  <View key={i} style={[s.habitDot, { backgroundColor: h?.completed ? LIME_DIM : (i % 3 === 0 ? '#EF4444' : i % 3 === 1 ? '#3B82F6' : '#F59E0B') }]} />
                ))}
              </View>
            </View>
          </TouchableOpacity>

          {/* Meals/Tasks Card */}
          <TouchableOpacity
            style={s.bottomCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MealHistory')}
          >
            <Text style={s.bottomCardTitle}>Meals</Text>
            <Text style={s.bottomCardSub}>{meals.length} logged today</Text>
            <View style={s.tasksList}>
              {meals.length > 0 ? meals.slice(0, 2).map((m, i) => (
                <View key={m._id || i} style={s.taskItem}>
                  <View style={[s.taskDot, { backgroundColor: m.mealType === 'breakfast' ? '#F59E0B' : m.mealType === 'lunch' ? '#3B82F6' : '#EF4444' }]} />
                  <Text style={s.taskText} numberOfLines={1}>{m.name || 'Meal'}</Text>
                  <Text style={s.taskTime}>{m.calories || 0}kcal</Text>
                </View>
              )) : (
                <Text style={s.emptyTaskText}>Scan your first meal</Text>
              )}
            </View>
            {meals.length > 0 && (
              <Text style={s.viewHistoryLink}>View History →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ═══ Today's Meals Full List ═══ */}
        {meals.length > 0 && (
          <View style={s.mealsCard}>
            <View style={s.mealsHeader}>
              <Text style={s.mealsTitle}>Today's Meals</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MealHistory')} activeOpacity={0.7}>
                <Text style={s.historyLink}>View All →</Text>
              </TouchableOpacity>
            </View>
            {meals.map((m, i) => (
              <View key={m._id || i} style={s.mealItem}>
                <View style={s.mealIconWrap}>
                  <Text style={s.mealIcon}>{m.mealType === 'breakfast' ? '🌅' : m.mealType === 'lunch' ? '☀️' : m.mealType === 'dinner' ? '🌙' : '🍎'}</Text>
                </View>
                <View style={s.mealInfo}>
                  <Text style={s.mealName} numberOfLines={1}>{m.name || 'Unnamed Meal'}</Text>
                  <Text style={s.mealTime}>{(m.mealType || 'meal').charAt(0).toUpperCase() + (m.mealType || 'meal').slice(1)}{m.loggedAt ? ' · ' + new Date(m.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
                </View>
                <Text style={s.mealCal}>{m.calories || 0} kcal</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ═══ Bottom Navigation Bar ═══ */}
      <BottomNavBar activeTab="home" />

      {/* ═══ Profile Modal ═══ */}
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

            <TouchableOpacity
              style={s.logoutItem}
              onPress={() => {
                setProfileModalVisible(false);
                logout();
              }}
            >
              <Text style={s.logoutIcon}>🚪</Text>
              <Text style={s.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.closeBtn} onPress={() => setProfileModalVisible(false)}>
              <Text style={s.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  scroll: { flex: 1, paddingHorizontal: 16 },

  // ─ Header ─
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 16, paddingHorizontal: 4 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  brandName: { fontSize: 28, fontWeight: '900', color: '#1A1A2E', letterSpacing: -0.5 },
  streakBadge: { fontSize: 16, fontWeight: '700', color: '#F59E0B', marginLeft: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8E8EC', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#1A1A2E', fontSize: 16, fontWeight: '800' },

  // ─ Daily Score Card (Dark) ─
  scoreCard: {
    backgroundColor: DARK_BG,
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    overflow: 'hidden',
  },
  scoreTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  scoreLeft: { flex: 1 },
  scoreLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, marginBottom: 6 },
  scoreValRow: { flexDirection: 'row', alignItems: 'baseline' },
  scoreNum: { fontSize: 52, fontWeight: '900', color: '#FFFFFF', letterSpacing: -2 },
  scoreOf: { fontSize: 18, fontWeight: '600', color: 'rgba(255,255,255,0.4)', marginLeft: 2 },
  scoreSub: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  scoreRingText: { fontSize: 13, fontWeight: '800', color: LIME },

  // Week strip inside dark card
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 2 },
  weekDayCol: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)' },
  weekDayActive: { backgroundColor: LIME },
  weekDayText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.35)' },
  weekDayTextActive: { color: DARK_BG },

  // Day score badge below strip
  dayScoreBadge: { alignSelf: 'center', backgroundColor: LIME, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 5, marginTop: -4 },
  dayScoreText: { fontSize: 14, fontWeight: '800', color: DARK_BG },

  // ─ Calories Card (Lime Green) ─
  calCard: {
    backgroundColor: LIME,
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  calTitle: { fontSize: 16, fontWeight: '700', color: DARK_BG, opacity: 0.7, marginBottom: 4 },
  calValRow: { flexDirection: 'row', alignItems: 'baseline' },
  calNum: { fontSize: 44, fontWeight: '900', color: DARK_BG, letterSpacing: -1.5 },
  calOf: { fontSize: 14, fontWeight: '600', color: 'rgba(26,26,46,0.45)', marginLeft: 2 },
  calRingText: { fontSize: 11, fontWeight: '800', color: DARK_BG },

  // Macros grid inside lime card
  macroGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
  macroCell: {
    width: (width - 72) / 2,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(26,26,46,0.1)',
  },
  macroName: { fontSize: 13, fontWeight: '600', color: 'rgba(26,26,46,0.55)' },
  macroVal: { fontSize: 18, fontWeight: '800', color: DARK_BG, marginTop: 2 },
  macroTarget: { fontSize: 13, fontWeight: '500', color: 'rgba(26,26,46,0.4)' },

  // ─ Bottom Row (Habits + Tasks) ─
  bottomRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  bottomCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 16,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bottomCardTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  bottomCardSub: { fontSize: 12, fontWeight: '500', color: '#94A3B8', marginBottom: 12 },

  // Habits Visual
  habitsVisual: { flex: 1, justifyContent: 'flex-end' },
  habitsCount: { fontSize: 36, fontWeight: '900', color: '#1A1A2E' },
  habitsTotal: { fontSize: 20, fontWeight: '600', color: '#94A3B8' },
  habitDots: { flexDirection: 'row', gap: 4, marginTop: 8 },
  habitDot: { width: 22, height: 6, borderRadius: 3 },

  // Tasks / Meals mini list
  tasksList: { flex: 1, justifyContent: 'flex-start', gap: 6 },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  taskDot: { width: 8, height: 8, borderRadius: 4 },
  taskText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1A1A2E' },
  taskTime: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  emptyTaskText: { fontSize: 13, color: '#94A3B8', fontStyle: 'italic' },
  viewHistoryLink: { fontSize: 12, fontWeight: '700', color: LIME_DIM, marginTop: 8 },

  // ─ Today's Meals Full ─
  mealsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  mealsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mealsTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  historyLink: { fontSize: 13, fontWeight: '700', color: LIME_DIM },
  mealItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  mealIconWrap: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  mealIcon: { fontSize: 18 },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  mealTime: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  mealCal: { fontSize: 14, fontWeight: '700', color: LIME_DIM },

  // ─ Modal / Profile ─
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  modalAvatarCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: LIME, justifyContent: 'center', alignItems: 'center' },
  modalAvatarText: { color: DARK_BG, fontSize: 22, fontWeight: '800' },
  modalUserInfo: { flex: 1 },
  modalUserName: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  modalUserEmail: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  menuSectionTitle: { fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  profileGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  profileMetric: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  metricLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 4 },
  metricValue: { fontSize: 15, fontWeight: '700', color: LIME_DIM },
  logoutItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#FEE2E2', marginBottom: 10, borderWidth: 1, borderColor: '#FCA5A5' },
  logoutIcon: { fontSize: 18, marginRight: 12 },
  logoutText: { color: '#EF4444', fontSize: 15, fontWeight: '600' },
  closeBtn: { marginTop: 4, paddingVertical: 12, alignItems: 'center' },
  closeBtnText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
});

export default DietDashboardScreen;
