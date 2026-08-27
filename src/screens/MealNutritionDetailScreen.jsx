import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DietContext } from '../context/DietContext';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const NUTRI_COLORS = { A: '#16A34A', B: '#2563EB', C: '#F59E0B', D: '#EA580C', E: '#EF4444' };
const NUTRI_LABELS = { A: 'Excellent Choice', B: 'Balanced Meal', C: 'Moderate', D: 'Less Healthy', E: 'Poor Choice' };

const MacroRing = ({ label, value, target, color, size = 80 }) => {
  const pct = target > 0 ? Math.min(value / target, 1) : 0;
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 6, borderColor: '#E2E8F0' }} />
        <View style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 6, borderColor: 'transparent', borderTopColor: color, borderRightColor: pct > 0.25 ? color : 'transparent', borderBottomColor: pct > 0.5 ? color : 'transparent', borderLeftColor: pct > 0.75 ? color : 'transparent', transform: [{ rotate: '-90deg' }] }} />
        <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.dietTextPrimary }}>{Math.round(pct * 100)}%</Text>
      </View>
      <Text style={{ fontSize: 12, fontWeight: '600', color, marginTop: 6 }}>{label}</Text>
      <Text style={{ fontSize: 10, color: COLORS.dietTextSecondary }}>{Math.round(value)}g</Text>
    </View>
  );
};

const MealNutritionDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { logMeal, isLogging, dashboard } = useContext(DietContext);
  const params = route.params || {};
  const nutrition = params.nutrition || null;
  const imageBase64 = params.imageBase64 || null;
  const [logged, setLogged] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(nutrition?.mealType || 'snack');

  if (!nutrition) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🍽️</Text>
        <Text style={s.errText}>No nutrition data available</Text>
        <TouchableOpacity style={{ marginTop: 20, padding: 14, backgroundColor: COLORS.dietAccent, borderRadius: 12 }} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const n = nutrition;
  const targets = (dashboard && dashboard.targets) || { calories: 2000, protein: 150, carbs: 250, fat: 65, fiber: 30, sugar: 50, sodium: 2300 };
  const consumed = (dashboard && dashboard.consumed) || { calories: 0 };
  const scoreColor = NUTRI_COLORS[n.nutriScore] || NUTRI_COLORS.C;
  const scoreLabel = NUTRI_LABELS[n.nutriScore] || 'Moderate';

  const handleLogMeal = async () => {
    try {
      const result = await logMeal({
        name: n.name || 'Scanned Meal', mealType: selectedMealType || 'snack',
        calories: Number(n.calories) || 0,
        protein: Number(n.protein) || 0, carbs: Number(n.carbs) || 0,
        fat: Number(n.fat) || 0, fiber: Number(n.fiber) || 0,
        sugar: Number(n.sugar) || 0, sodium: Number(n.sodium) || 0,
        nutriScore: n.nutriScore || 'C',
        ingredients: Array.isArray(n.ingredients) ? n.ingredients : [],
        imageBase64: imageBase64 || null,
      });
      if (result && result.success) {
        setLogged(true);
        Alert.alert('Meal Logged! 🎉', `${n.name || 'Meal'} has been added to your daily log.`, [
          { text: 'View Dashboard', onPress: () => navigation.navigate('DietDashboard') },
        ]);
      } else {
        Alert.alert('Error', (result && result.error) || 'Failed to log meal. Please try again.');
      }
    } catch (e) {
      Alert.alert('Error', 'An unexpected error occurred while logging the meal.');
    }
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.dietBg} />
      <ScrollView 
        style={s.scroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 20, 30) }}
      >

        {/* Back Button */}
        <View style={[s.topBar, { marginTop: Math.max(insets.top + 8, 16) }]}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={s.topTitle}>Scan Result</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Food Image Preview */}
        <View style={s.imagePreview}>
          <Text style={s.previewEmoji}>{n.mealType === 'breakfast' ? '🌅' : n.mealType === 'lunch' ? '🥗' : n.mealType === 'dinner' ? '🍽️' : '🍎'}</Text>
          <View style={[s.nutriBadge, { backgroundColor: scoreColor + '18', borderColor: scoreColor }]}>
            <Text style={[s.nutriBadgeText, { color: scoreColor }]}>{n.nutriScore} — {scoreLabel}</Text>
          </View>
        </View>

        {/* Meal Info */}
        <View style={s.infoCard}>
          <Text style={s.mealName}>{n.name}</Text>
          <View style={s.infoRow}>
            <Text style={s.infoTime}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            {n.confidence && <Text style={s.infoConf}>{n.confidence}% confidence</Text>}
          </View>
          <View style={s.calBigRow}>
            <Text style={s.calBig}>{n.calories}</Text>
            <Text style={s.calUnit}>kcal</Text>
          </View>
        </View>

        {/* Meal Category Selector */}
        <View style={s.selectorCard}>
          <Text style={s.selectorTitle}>Logged As</Text>
          <View style={s.selectorGrid}>
            {[
              { key: 'breakfast', label: 'Breakfast', emoji: '🌅' },
              { key: 'lunch', label: 'Lunch', emoji: '☀️' },
              { key: 'dinner', label: 'Dinner', emoji: '🌙' },
              { key: 'snack', label: 'Snack', emoji: '🍎' },
            ].map(({ key, label, emoji }) => {
              const active = selectedMealType === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={[s.selectorBtn, active && s.selectorBtnActive]}
                  onPress={() => setSelectedMealType(key)}
                  activeOpacity={0.7}
                >
                  <Text style={s.selectorEmoji}>{emoji}</Text>
                  <Text style={[s.selectorText, active && s.selectorTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Goal Impact */}
        <View style={s.impactCard}>
          <Text style={s.impactIcon}>📈</Text>
          <View style={s.impactInfo}>
          <Text style={s.impactTitle}>+{Number(n.calories) || 0} kcal added to daily log</Text>
            <Text style={s.impactDesc}>{Math.round(Number(consumed.calories) || 0)} + {Number(n.calories) || 0} = {Math.round((Number(consumed.calories) || 0) + (Number(n.calories) || 0))} / {targets.calories} kcal</Text>
          </View>
        </View>

        {/* Macro Rings */}
        <View style={s.macroCard}>
          <Text style={s.sectionTitle}>Macronutrients</Text>
          <View style={s.ringsRow}>
            <MacroRing label="Protein" value={n.protein} target={targets.protein} color={COLORS.dietProtein} />
            <MacroRing label="Carbs" value={n.carbs} target={targets.carbs} color={COLORS.dietCarbs} />
            <MacroRing label="Fat" value={n.fat} target={targets.fat} color={COLORS.dietFat} />
          </View>
        </View>

        {/* Micro nutrients */}
        <View style={s.microCard}>
          <Text style={s.sectionTitle}>Micronutrients</Text>
          <View style={s.microRow}>
            <View style={s.microItem}>
              <Text style={[s.microVal, { color: COLORS.dietFiber }]}>{n.fiber}g</Text>
              <Text style={s.microLabel}>Fiber</Text>
            </View>
            <View style={s.microItem}>
              <Text style={[s.microVal, { color: COLORS.dietSugar }]}>{n.sugar}g</Text>
              <Text style={s.microLabel}>Sugar</Text>
            </View>
            <View style={s.microItem}>
              <Text style={[s.microVal, { color: COLORS.dietSodium }]}>{n.sodium}mg</Text>
              <Text style={s.microLabel}>Sodium</Text>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        {n.ingredients && n.ingredients.length > 0 && (
          <View style={s.ingredCard}>
            <Text style={s.sectionTitle}>Detected Ingredients</Text>
            <View style={s.chipRow}>
              {n.ingredients.map((ing, i) => (
                <View key={i} style={s.chip}><Text style={s.chipText}>{ing}</Text></View>
              ))}
            </View>
          </View>
        )}

        {/* Log Button */}
        <TouchableOpacity
          style={[s.logBtn, logged && s.logBtnDone, isLogging && { opacity: 0.7 }]}
          onPress={handleLogMeal} disabled={isLogging || logged} activeOpacity={0.8}>
          {isLogging ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={s.logBtnText}>{logged ? '✓ Meal Logged' : '🍽️ Log This Meal'}</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dietBg },
  scroll: { flex: 1, paddingHorizontal: 20 },
  errText: { color: COLORS.dietTextSecondary, fontSize: 16, textAlign: 'center', marginTop: 100 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 48, marginBottom: 16 },
  backBtn: { padding: 8 },
  backText: { color: COLORS.dietAccent, fontSize: 16, fontWeight: '600' },
  topTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dietTextPrimary },

  imagePreview: { height: 180, backgroundColor: COLORS.dietCard, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.dietCardBorder, position: 'relative', shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  previewEmoji: { fontSize: 64 },
  nutriBadge: { position: 'absolute', top: 12, right: 12, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  nutriBadgeText: { fontSize: 12, fontWeight: '700' },

  infoCard: { backgroundColor: COLORS.dietCard, borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: COLORS.dietCardBorder, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  mealName: { fontSize: 22, fontWeight: '700', color: COLORS.dietTextPrimary, marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  infoTag: { backgroundColor: COLORS.dietAccentBg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, color: COLORS.dietAccentText, fontSize: 12, fontWeight: '700', textTransform: 'capitalize', overflow: 'hidden' },
  infoTime: { color: COLORS.dietTextSecondary, fontSize: 12 },
  infoConf: { color: COLORS.dietTextMuted, fontSize: 11 },
  calBigRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  calBig: { fontSize: 42, fontWeight: '800', color: COLORS.dietAccent },
  calUnit: { fontSize: 16, color: COLORS.dietTextSecondary, fontWeight: '600' },

  // Selector
  selectorCard: { backgroundColor: COLORS.dietCard, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: COLORS.dietCardBorder, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  selectorTitle: { fontSize: 14, fontWeight: '700', color: COLORS.dietTextSecondary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  selectorGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  selectorBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.dietSurface, borderRadius: 12, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.dietCardBorder },
  selectorBtnActive: { backgroundColor: COLORS.dietAccentBg, borderColor: COLORS.dietAccent },
  selectorEmoji: { fontSize: 18, marginBottom: 4 },
  selectorText: { fontSize: 12, fontWeight: '600', color: COLORS.dietTextSecondary },
  selectorTextActive: { color: COLORS.dietAccentText, fontWeight: '700' },

  impactCard: { flexDirection: 'row', backgroundColor: COLORS.dietAccentBg, borderRadius: 16, padding: 16, marginBottom: 12, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: COLORS.dietAccent + '33' },
  impactIcon: { fontSize: 24 },
  impactInfo: { flex: 1 },
  impactTitle: { fontSize: 14, fontWeight: '700', color: COLORS.dietAccentText },
  impactDesc: { fontSize: 12, color: COLORS.dietTextSecondary, marginTop: 2 },

  macroCard: { backgroundColor: COLORS.dietCard, borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: COLORS.dietCardBorder, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.dietTextPrimary, marginBottom: 16 },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around' },

  microCard: { backgroundColor: COLORS.dietCard, borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: COLORS.dietCardBorder, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  microRow: { flexDirection: 'row', justifyContent: 'space-around' },
  microItem: { alignItems: 'center' },
  microVal: { fontSize: 20, fontWeight: '800' },
  microLabel: { fontSize: 11, color: COLORS.dietTextSecondary, marginTop: 4 },

  ingredCard: { backgroundColor: COLORS.dietCard, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.dietCardBorder, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: COLORS.dietSurface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.dietCardBorder },
  chipText: { color: COLORS.dietTextPrimary, fontSize: 12, fontWeight: '500' },

  logBtn: { backgroundColor: COLORS.dietAccent, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 8, shadowColor: COLORS.dietAccent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  logBtnDone: { backgroundColor: COLORS.dietScoreGood },
  logBtnText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
});

export default MealNutritionDetailScreen;
