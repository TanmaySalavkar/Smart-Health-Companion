import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOWS } from '../theme';
import { NutriTrackLogo, AlertIcon, EyeIcon, EyeOffIcon } from '../components/Icons';

const GOALS = [
  { key: 'lose', label: 'Lose Weight', icon: '🔥', desc: 'Calorie deficit for fat loss' },
  { key: 'maintain', label: 'Maintain', icon: '⚖️', desc: 'Stay at your current weight' },
  { key: 'gain', label: 'Gain Muscle', icon: '💪', desc: 'Calorie surplus for growth' },
];
const GENDERS = [
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
  { key: 'other', label: 'Other' },
];

const StepIndicator = ({ current, total }) => (
  <View style={st.stepRow}>
    {Array.from({ length: total }, (_, i) => (
      <View key={i} style={[st.stepDot, i === current && st.stepDotActive]}>
        {i < current ? (
          <Text style={st.stepCheck}>✓</Text>
        ) : (
          <Text style={[st.stepNum, i === current && st.stepNumActive]}>{i + 1}</Text>
        )}
      </View>
    ))}
    <View style={st.stepLine} />
  </View>
);

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('25');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [gender, setGender] = useState('male');
  const [goal, setGoal] = useState('maintain');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Focus states
  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  const handleNext = () => {
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { setError('Please enter a valid email address.'); return; }
    if (!password.trim()) { setError('Please enter a password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setStep(1);
  };

  const handleRegister = async () => {
    setError('');
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    if (!ageNum || ageNum < 10 || ageNum > 120) { setError('Please enter a valid age (10-120).'); return; }
    if (!weightNum || weightNum < 20 || weightNum > 300) { setError('Please enter a valid weight (20-300 kg).'); return; }
    if (!heightNum || heightNum < 100 || heightNum > 250) { setError('Please enter a valid height (100-250 cm).'); return; }
    setIsLoading(true);
    try {
      const result = await register({
        name: name.trim(), email: email.trim().toLowerCase(), password,
        profile: { age: ageNum, weight: weightNum, height: heightNum, gender, goal, activityLevel: 'moderate' },
      });
      if (!result.success) setError(result.error || 'Registration failed.');
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={s.cardTitle}>Create Your Account</Text>
      <Text style={s.cardSub}>Enter your details to get started with personalized nutrition tracking</Text>

      {error ? (
        <View style={s.errBox}>
          <AlertIcon size={16} color="#EF4444" />
          <Text style={s.errText}>{error}</Text>
        </View>
      ) : null}

      <Text style={s.label}>Full Name</Text>
      <View style={[s.inputWrap, nameFocus && s.inputFocused]}>
        <TextInput
          style={s.input} placeholder="Enter your full name" placeholderTextColor={COLORS.dietTextMuted}
          value={name} onChangeText={setName}
          onFocus={() => setNameFocus(true)} onBlur={() => setNameFocus(false)}
          autoCorrect={false}
        />
      </View>

      <Text style={s.label}>Email Address</Text>
      <View style={[s.inputWrap, emailFocus && s.inputFocused]}>
        <TextInput
          style={s.input} placeholder="you@example.com" placeholderTextColor={COLORS.dietTextMuted}
          value={email} onChangeText={setEmail}
          onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)}
          keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
        />
      </View>

      <Text style={s.label}>Password</Text>
      <View style={[s.inputWrap, passFocus && s.inputFocused]}>
        <TextInput
          style={s.input} placeholder="Min 6 characters" placeholderTextColor={COLORS.dietTextMuted}
          value={password} onChangeText={setPassword}
          onFocus={() => setPassFocus(true)} onBlur={() => setPassFocus(false)}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPassword ? (
                <EyeIcon size={22} color={COLORS.dietAccent} />
              ) : (
                <EyeOffIcon size={22} color="#94A3B8" />
              )}
            </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.primaryBtn} onPress={handleNext} activeOpacity={0.85}>
        <Text style={s.primaryBtnText}>Continue</Text>
        <Text style={s.primaryBtnArrow}>→</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={s.cardTitle}>Health Profile</Text>
      <Text style={s.cardSub}>Help us calculate your ideal daily nutrition targets</Text>

      {error ? (
        <View style={s.errBox}>
          <AlertIcon size={16} color="#EF4444" />
          <Text style={s.errText}>{error}</Text>
        </View>
      ) : null}

      {/* Body Metrics */}
      <Text style={s.sectionLabel}>Body Metrics</Text>
      <View style={s.metricsRow}>
        <View style={s.metricCol}>
          <Text style={s.metricLabel}>Age</Text>
          <View style={s.metricInput}>
            <TextInput style={s.metricValue} value={age} onChangeText={setAge} keyboardType="numeric" maxLength={3} />
            <Text style={s.metricUnit}>yrs</Text>
          </View>
        </View>
        <View style={s.metricCol}>
          <Text style={s.metricLabel}>Weight</Text>
          <View style={s.metricInput}>
            <TextInput style={s.metricValue} value={weight} onChangeText={setWeight} keyboardType="numeric" maxLength={3} />
            <Text style={s.metricUnit}>kg</Text>
          </View>
        </View>
        <View style={s.metricCol}>
          <Text style={s.metricLabel}>Height</Text>
          <View style={s.metricInput}>
            <TextInput style={s.metricValue} value={height} onChangeText={setHeight} keyboardType="numeric" maxLength={3} />
            <Text style={s.metricUnit}>cm</Text>
          </View>
        </View>
      </View>

      {/* Gender */}
      <Text style={s.sectionLabel}>Gender</Text>
      <View style={s.genderRow}>
        {GENDERS.map(g => (
          <TouchableOpacity
            key={g.key}
            style={[s.genderChip, gender === g.key && s.genderChipActive]}
            onPress={() => setGender(g.key)}
            activeOpacity={0.7}
          >
            <Text style={[s.genderText, gender === g.key && s.genderTextActive]}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Goal */}
      <Text style={s.sectionLabel}>Your Goal</Text>
      {GOALS.map(g => (
        <TouchableOpacity
          key={g.key}
          style={[s.goalCard, goal === g.key && s.goalCardActive]}
          onPress={() => setGoal(g.key)}
          activeOpacity={0.7}
        >
          <Text style={s.goalIcon}>{g.icon}</Text>
          <View style={s.goalInfo}>
            <Text style={[s.goalLabel, goal === g.key && s.goalLabelActive]}>{g.label}</Text>
            <Text style={s.goalDesc}>{g.desc}</Text>
          </View>
          <View style={[s.goalRadio, goal === g.key && s.goalRadioActive]}>
            {goal === g.key && <View style={s.goalRadioDot} />}
          </View>
        </TouchableOpacity>
      ))}

      {/* Buttons */}
      <View style={s.btnRow}>
        <TouchableOpacity style={s.backBtn} onPress={() => { setStep(0); setError(''); }} activeOpacity={0.7}>
          <Text style={s.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.primaryBtn, { flex: 1 }, isLoading && { opacity: 0.7 }]}
          onPress={handleRegister} disabled={isLoading} activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={s.primaryBtnText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.dietBg} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Branded Header */}
          <View style={s.logoArea}>
            <View style={s.logoBadge}><NutriTrackLogo size={62} /></View>
            <Text style={s.appTitle}>NuFi</Text>
            <Text style={s.appSub}>Smart Diet & Health Companion</Text>
          </View>

          {/* Step Indicator */}
          <StepIndicator current={step} total={2} />

          {/* Form Card */}
          <View style={s.card}>
            {step === 0 ? renderStep1() : renderStep2()}
          </View>

          {/* Sign In Link */}
          <View style={s.linkRow}>
            <Text style={s.linkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={s.linkAction}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const st = StyleSheet.create({
  stepRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40, marginBottom: 24, position: 'relative' },
  stepLine: { position: 'absolute', height: 2, backgroundColor: '#E2E8F0', width: 40, top: '50%' },
  stepDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#E2E8F0', zIndex: 1 },
  stepDotActive: { backgroundColor: COLORS.dietAccent, borderColor: COLORS.dietAccent },
  stepNum: { fontSize: 14, fontWeight: '700', color: COLORS.dietTextMuted },
  stepNumActive: { color: '#FFFFFF' },
  stepCheck: { fontSize: 14, fontWeight: '700', color: COLORS.dietAccent },
});

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dietBg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 },

  // Header
  logoArea: { alignItems: 'center', marginBottom: 20 },
  logoBadge: { marginBottom: 12 },
  appTitle: { fontSize: 28, fontWeight: '800', color: COLORS.dietTextPrimary, letterSpacing: 0.3 },
  appSub: { fontSize: 13, fontWeight: '500', color: COLORS.dietTextSecondary, marginTop: 3 },

  // Card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: '#E2E8F0',
    ...SHADOWS.card,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: COLORS.dietTextPrimary, marginBottom: 4 },
  cardSub: { fontSize: 13, color: COLORS.dietTextSecondary, marginBottom: 20, lineHeight: 19 },

  // Error
  errBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#FCA5A5', gap: 10 },
  errText: { color: '#EF4444', fontSize: 13, fontWeight: '600', flex: 1 },

  // Labels & Inputs
  label: { fontSize: 12, fontWeight: '700', color: COLORS.dietTextSecondary, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 10 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0', paddingHorizontal: 16, marginBottom: 4 },
  inputFocused: { borderColor: COLORS.dietAccent, backgroundColor: '#FFFFFF' },
  input: { flex: 1, color: COLORS.dietTextPrimary, fontSize: 15, paddingVertical: 14, fontWeight: '500' },
  eyeBtn: { padding: 4 },

  // Section Label (Step 2)
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.dietTextPrimary, marginTop: 16, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.6 },

  // Metrics Row
  metricsRow: { flexDirection: 'row', gap: 10 },
  metricCol: { flex: 1 },
  metricLabel: { fontSize: 11, fontWeight: '600', color: COLORS.dietTextSecondary, marginBottom: 6, textAlign: 'center' },
  metricInput: { backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0', paddingVertical: 4, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  metricValue: { fontSize: 18, fontWeight: '700', color: COLORS.dietTextPrimary, textAlign: 'center', paddingVertical: 8, minWidth: 40 },
  metricUnit: { fontSize: 12, color: COLORS.dietTextMuted, fontWeight: '600', marginLeft: 2 },

  // Gender
  genderRow: { flexDirection: 'row', gap: 10 },
  genderChip: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center' },
  genderChipActive: { backgroundColor: COLORS.dietAccentBg, borderColor: COLORS.dietAccent },
  genderText: { fontSize: 14, fontWeight: '600', color: COLORS.dietTextSecondary },
  genderTextActive: { color: COLORS.dietAccentText, fontWeight: '700' },

  // Goal Cards
  goalCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', marginBottom: 8, gap: 12 },
  goalCardActive: { backgroundColor: COLORS.dietAccentBg, borderColor: COLORS.dietAccent },
  goalIcon: { fontSize: 24 },
  goalInfo: { flex: 1 },
  goalLabel: { fontSize: 15, fontWeight: '700', color: COLORS.dietTextPrimary },
  goalLabelActive: { color: COLORS.dietAccentText },
  goalDesc: { fontSize: 12, color: COLORS.dietTextSecondary, marginTop: 2 },
  goalRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  goalRadioActive: { borderColor: COLORS.dietAccent },
  goalRadioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.dietAccent },

  // Buttons
  primaryBtn: { flexDirection: 'row', backgroundColor: COLORS.dietAccent, borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 8, ...SHADOWS.button },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  primaryBtnArrow: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  backBtn: { backgroundColor: '#F1F5F9', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 20 },
  backBtnText: { color: COLORS.dietTextSecondary, fontWeight: '600', fontSize: 15 },

  // Footer
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 20 },
  linkText: { color: COLORS.dietTextSecondary, fontSize: 14 },
  linkAction: { color: COLORS.dietAccent, fontSize: 14, fontWeight: '700' },
});

export default RegisterScreen;
