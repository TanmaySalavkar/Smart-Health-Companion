import React, { useState, useContext, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DietContext } from '../context/DietContext';
import { COLORS, SHADOWS } from '../theme';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formatDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const isToday = (d) => formatDate(d) === formatDate(new Date());
const isSameDay = (a, b) => formatDate(a) === formatDate(b);

const isFuture = (d) => {
  const check = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = new Date();
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return check > todayZero;
};

const getWeekDates = (refDate) => {
  const d = new Date(refDate);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const dd = new Date(start);
    dd.setDate(start.getDate() + i);
    dates.push(dd);
  }
  return dates;
};

const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };

const MealHistoryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { fetchHistory } = useContext(DietContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekRef, setWeekRef] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const weekDates = getWeekDates(weekRef);

  const loadMeals = useCallback(async (date) => {
    setLoading(true);
    try {
      const result = await fetchHistory(formatDate(date));
      if (result && result.success && Array.isArray(result.meals)) {
        setMeals(result.meals);
      } else {
        setMeals([]);
      }
    } catch (e) {
      console.error('Error loading meal history:', e);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  useFocusEffect(useCallback(() => {
    loadMeals(selectedDate);
  }, [selectedDate, loadMeals]));

  const onSelectDate = (date) => {
    setSelectedDate(date);
  };

  const onPrevWeek = () => {
    const d = new Date(weekRef);
    d.setDate(d.getDate() - 7);
    setWeekRef(d);
  };

  const onNextWeek = () => {
    const d = new Date(weekRef);
    d.setDate(d.getDate() + 7);
    
    // Get Sunday of today's week
    const today = new Date();
    const todayWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    todayWeekStart.setDate(todayWeekStart.getDate() - todayWeekStart.getDay());
    
    // Get Sunday of target week
    const targetWeekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    targetWeekStart.setDate(targetWeekStart.getDate() - targetWeekStart.getDay());
    
    if (targetWeekStart > todayWeekStart) {
      return; // Block navigating to future weeks
    }
    setWeekRef(d);
  };

  const onGoToToday = () => {
    const today = new Date();
    setWeekRef(today);
    setSelectedDate(today);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeals(selectedDate);
    setRefreshing(false);
  };

  // Calculate daily totals
  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + (Number(m.calories) || 0),
    protein: acc.protein + (Number(m.protein) || 0),
    carbs: acc.carbs + (Number(m.carbs) || 0),
    fat: acc.fat + (Number(m.fat) || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const monthLabel = `${MONTHS[weekDates[0].getMonth()]}${weekDates[0].getMonth() !== weekDates[6].getMonth() ? ' – ' + MONTHS[weekDates[6].getMonth()] : ''} ${weekDates[0].getFullYear()}`;

  return (
    <View style={[s.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.dietBg} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Meal History</Text>
        <TouchableOpacity onPress={onGoToToday}>
          <Text style={s.todayBtn}>Today</Text>
        </TouchableOpacity>
      </View>

      {/* Month & Week Navigation */}
      <View style={s.monthRow}>
        <TouchableOpacity onPress={onPrevWeek} style={s.navArrow}><Text style={s.navArrowText}>‹</Text></TouchableOpacity>
        <Text style={s.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity onPress={onNextWeek} style={s.navArrow}><Text style={s.navArrowText}>›</Text></TouchableOpacity>
      </View>

      {/* Week Calendar Strip */}
      <View style={s.weekStrip}>
        {weekDates.map((d, i) => {
          const selected = isSameDay(d, selectedDate);
          const today = isToday(d);
          const future = isFuture(d);
          return (
            <TouchableOpacity
              key={i}
              style={[s.dayCol, selected && s.dayColSelected, future && s.dayColFuture]}
              onPress={() => !future && onSelectDate(d)}
              activeOpacity={future ? 1 : 0.7}
              disabled={future}
            >
              <Text style={[s.dayLabel, selected && s.dayLabelSelected, future && s.dayFuture]}>{WEEKDAYS[d.getDay()]}</Text>
              <Text style={[s.dayNum, selected && s.dayNumSelected, today && !selected && s.dayNumToday, future && s.dayFuture]}>{d.getDate()}</Text>
              {today && <View style={[s.todayDot, selected && s.todayDotSelected]} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 20, 30) }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.dietAccent} colors={[COLORS.dietAccent]} />}
      >
        {/* Selected Date Label */}
        <Text style={s.dateLabel}>
          {isToday(selectedDate) ? 'Today' : `${WEEKDAYS[selectedDate.getDay()]}, ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`}
        </Text>

        {loading ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={COLORS.dietAccent} />
            <Text style={s.loadingText}>Loading meals...</Text>
          </View>
        ) : meals.length > 0 ? (
          <>
            {/* Daily Summary */}
            <View style={s.summaryCard}>
              <Text style={s.summaryTitle}>Daily Summary</Text>
              <View style={s.summaryGrid}>
                <View style={s.summaryItem}>
                  <Text style={[s.summaryVal, { color: COLORS.dietAccent }]}>{Math.round(totals.calories)}</Text>
                  <Text style={s.summaryUnit}>kcal</Text>
                </View>
                <View style={s.summaryDivider} />
                <View style={s.summaryItem}>
                  <Text style={[s.summaryVal, { color: COLORS.dietProtein }]}>{Math.round(totals.protein)}g</Text>
                  <Text style={s.summaryUnit}>Protein</Text>
                </View>
                <View style={s.summaryDivider} />
                <View style={s.summaryItem}>
                  <Text style={[s.summaryVal, { color: COLORS.dietCarbs }]}>{Math.round(totals.carbs)}g</Text>
                  <Text style={s.summaryUnit}>Carbs</Text>
                </View>
                <View style={s.summaryDivider} />
                <View style={s.summaryItem}>
                  <Text style={[s.summaryVal, { color: COLORS.dietFat }]}>{Math.round(totals.fat)}g</Text>
                  <Text style={s.summaryUnit}>Fat</Text>
                </View>
              </View>
            </View>

            {/* Meals List */}
            <Text style={s.mealsTitle}>{meals.length} Meal{meals.length !== 1 ? 's' : ''} Logged</Text>
            {meals.map((m, i) => (
              <View key={m._id || i} style={s.mealCard}>
                <View style={s.mealIconWrap}>
                  <Text style={s.mealIcon}>{MEAL_ICONS[m.mealType] || '🍽️'}</Text>
                </View>
                <View style={s.mealInfo}>
                  <Text style={s.mealName} numberOfLines={1}>{m.name || 'Unnamed Meal'}</Text>
                  <Text style={s.mealMeta}>
                    {(m.mealType || 'meal').charAt(0).toUpperCase() + (m.mealType || 'meal').slice(1)}
                    {m.loggedAt ? ' • ' + new Date(m.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </Text>
                </View>
                <View style={s.mealRight}>
                  <Text style={s.mealCal}>{m.calories || 0}</Text>
                  <Text style={s.mealCalUnit}>kcal</Text>
                  {m.nutriScore && (
                    <View style={[s.nutriBadge, { backgroundColor: getNutriColor(m.nutriScore) + '20' }]}>
                      <Text style={[s.nutriBadgeText, { color: getNutriColor(m.nutriScore) }]}>{m.nutriScore}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </>
        ) : (
          /* Empty State */
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>🍽️</Text>
            <Text style={s.emptyTitle}>No Meals Logged</Text>
            <Text style={s.emptySub}>
              {isToday(selectedDate)
                ? 'Tap the + button on the dashboard to scan your first meal today'
                : 'No meals were logged on this day'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const getNutriColor = (score) => {
  const colors = { A: '#16A34A', B: '#2563EB', C: '#F59E0B', D: '#EA580C', E: '#EF4444' };
  return colors[score] || '#94A3B8';
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dietBg },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  backBtn: { padding: 6 },
  backText: { color: COLORS.dietAccent, fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.dietTextPrimary },
  todayBtn: { color: COLORS.dietAccent, fontSize: 14, fontWeight: '700', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: COLORS.dietAccentBg, borderRadius: 8 },

  // Month nav
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  monthLabel: { fontSize: 15, fontWeight: '700', color: COLORS.dietTextPrimary },
  navArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  navArrowText: { fontSize: 22, fontWeight: '600', color: COLORS.dietTextSecondary, marginTop: -2 },

  // Calendar strip
  weekStrip: { flexDirection: 'row', paddingHorizontal: 12, marginBottom: 16, gap: 4 },
  dayCol: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  dayColSelected: { backgroundColor: COLORS.dietAccent, borderColor: COLORS.dietAccent },
  dayColFuture: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', opacity: 0.8 },
  dayLabel: { fontSize: 11, fontWeight: '600', color: COLORS.dietTextMuted, marginBottom: 4 },
  dayLabelSelected: { color: 'rgba(255,255,255,0.8)' },
  dayNum: { fontSize: 17, fontWeight: '700', color: COLORS.dietTextPrimary },
  dayNumSelected: { color: '#FFFFFF' },
  dayNumToday: { color: COLORS.dietAccent },
  dayFuture: { opacity: 0.35 },
  todayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.dietAccent, marginTop: 4 },
  todayDotSelected: { backgroundColor: '#FFFFFF' },

  scroll: { flex: 1, paddingHorizontal: 20 },
  dateLabel: { fontSize: 20, fontWeight: '800', color: COLORS.dietTextPrimary, marginBottom: 16, marginTop: 4 },

  // Loading
  loadingWrap: { alignItems: 'center', paddingTop: 60 },
  loadingText: { color: COLORS.dietTextSecondary, fontSize: 14, marginTop: 12 },

  // Summary Card
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', ...SHADOWS.card },
  summaryTitle: { fontSize: 14, fontWeight: '700', color: COLORS.dietTextSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 14 },
  summaryGrid: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryVal: { fontSize: 20, fontWeight: '800' },
  summaryUnit: { fontSize: 11, color: COLORS.dietTextMuted, marginTop: 2, fontWeight: '600' },
  summaryDivider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },

  // Meals
  mealsTitle: { fontSize: 14, fontWeight: '700', color: COLORS.dietTextSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  mealCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', ...SHADOWS.soft },
  mealIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.dietAccentBg, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  mealIcon: { fontSize: 20 },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 15, fontWeight: '700', color: COLORS.dietTextPrimary },
  mealMeta: { fontSize: 12, color: COLORS.dietTextSecondary, marginTop: 3 },
  mealRight: { alignItems: 'flex-end' },
  mealCal: { fontSize: 18, fontWeight: '800', color: COLORS.dietAccent },
  mealCalUnit: { fontSize: 10, color: COLORS.dietTextMuted, fontWeight: '600' },
  nutriBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  nutriBadgeText: { fontSize: 11, fontWeight: '800' },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.dietTextSecondary, marginBottom: 6 },
  emptySub: { fontSize: 14, color: COLORS.dietTextMuted, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
});

export default MealHistoryScreen;
