import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../theme';
import {
  NutriTrackLogo,
  EyeIcon,
  EyeOffIcon,
  AlertIcon,
} from '../components/Icons';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    const result = await login(email.trim().toLowerCase(), password);
    setIsLoading(false);
    if (!result.success) setError(result.error);
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.dietBg} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Logo & Brand Header */}
          <View style={s.logoArea}>
            <View style={s.logoBadgeWrapper}>
              <NutriTrackLogo size={78} />
            </View>
            <Text style={s.appTitle}>NutriTrack</Text>
            <Text style={s.appSub}>Smart Diet & Health Companion</Text>
          </View>

          {/* Login Card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Welcome Back</Text>
            <Text style={s.cardSub}>Sign in to track your daily nutrition goals</Text>

            {error ? (
              <View style={s.errBox}>
                <AlertIcon size={18} color="#EF4444" />
                <Text style={s.errText}>{error}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <Text style={s.label}>Email Address</Text>
            <View style={[s.inputWrap, emailFocused && s.inputWrapFocused]}>
              <TextInput
                style={s.input}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.dietTextMuted}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Field */}
            <Text style={s.label}>Password</Text>
            <View style={[s.inputWrap, passFocused && s.inputWrapFocused]}>
              <TextInput
                style={s.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.dietTextMuted}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={s.eyeToggle}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showPassword ? (
                  <EyeIcon size={22} color={COLORS.dietAccent} />
                ) : (
                  <EyeOffIcon size={22} color="#94A3B8" />
                )}
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[s.btn, isLoading && { opacity: 0.75 }]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={s.btnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View style={s.regRow}>
              <Text style={s.regText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={s.regLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dietBg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', paddingVertical: 40 },
  logoArea: { alignItems: 'center', marginBottom: 28 },
  logoBadgeWrapper: { marginBottom: 16 },
  appTitle: { fontSize: 32, fontWeight: '800', color: COLORS.dietTextPrimary, letterSpacing: 0.3 },
  appSub: { fontSize: 14, fontWeight: '500', color: COLORS.dietTextSecondary, marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: { fontSize: 24, fontWeight: '800', color: COLORS.dietTextPrimary, marginBottom: 4 },
  cardSub: { fontSize: 14, color: COLORS.dietTextSecondary, marginBottom: 22 },
  errBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    gap: 10,
  },
  errText: { color: '#EF4444', fontSize: 13, fontWeight: '600', flex: 1 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.dietTextSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 8 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  inputWrapFocused: {
    borderColor: COLORS.dietAccent,
    backgroundColor: '#FFFFFF',
  },
  input: { flex: 1, color: COLORS.dietTextPrimary, fontSize: 15, paddingVertical: 14, fontWeight: '500' },
  eyeToggle: { padding: 4 },
  btn: {
    backgroundColor: COLORS.dietAccent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 20,
    shadowColor: COLORS.dietAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  btnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  regRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  regText: { color: COLORS.dietTextSecondary, fontSize: 14 },
  regLink: { color: COLORS.dietAccent, fontSize: 14, fontWeight: '700' },
});

export default LoginScreen;

