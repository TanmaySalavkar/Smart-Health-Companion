// Centralized Light Theme for AI Diet Companion App

export const COLORS = {
  // Primary & Accent palette (Fresh Emerald & Mint Green)
  primary: '#16A34A',          // Primary Emerald Green
  primaryDark: '#15803D',      // Deeper green for pressed states
  primaryLight: '#4ADE80',     // Light mint green
  
  accent: '#10B981',           // Soft emerald
  accentLight: '#6EE7B7',      // Lighter emerald
  
  // Gradients
  gradientStart: '#F8FAFC',    // Soft Slate Light
  gradientEnd: '#EFF6FF',      // Soft Blue Light
  gradientMiddle: '#F1F5F9',   
  
  // Card / Surface (Light Theme)
  cardBg: '#FFFFFF',
  cardBgSolid: '#FFFFFF',
  cardBorder: '#E2E8F0',
  
  // Background fallback
  bgFallback: '#F8FAFC',
  
  // Text (High Contrast Light Theme)
  textPrimary: '#0F172A',      // Deep Dark Slate
  textSecondary: '#475569',    // Medium Slate Gray
  textLight: '#94A3B8',        // Light Muted Gray
  textWhite: '#FFFFFF',
  
  // Status & Alerts
  success: '#10B981',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  warning: '#F59E0B',
  
  // Rating
  ratingBg: 'rgba(22, 163, 74, 0.1)',
  ratingText: '#16A34A',
  
  // Shadow
  shadow: '#64748B',

  // ── Diet Dashboard & App Light Theme Palette ──────────
  dietBg: '#F8FAFC',
  dietSurface: '#F1F5F9',
  dietCard: '#FFFFFF',
  dietCardBorder: '#E2E8F0',
  dietAccent: '#16A34A',
  dietAccentDim: '#15803D',
  dietAccentBg: '#DCFCE7',
  dietAccentText: '#166534',
  dietTextPrimary: '#0F172A',
  dietTextSecondary: '#475569',
  dietTextMuted: '#94A3B8',
  
  // Macronutrients (Vibrant contrast on light background)
  dietProtein: '#EF4444',      // Coral Red
  dietCarbs: '#0EA5E9',        // Sky Blue
  dietFat: '#EAB308',          // Amber Gold
  dietFiber: '#10B981',        // Emerald Green
  dietSugar: '#F43F5E',        // Rose Pink
  dietSodium: '#8B5CF6',       // Purple
  
  // Health Score
  dietScoreGood: '#10B981',
  dietScoreMid: '#F59E0B',
  dietScoreLow: '#EF4444',
  
  // Navigation & Floating elements
  dietNavBg: '#FFFFFF',
  dietNavActive: '#16A34A',
  dietNavInactive: '#94A3B8',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 50,
  circle: 999,
};

export const FONTS = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.textLight,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
};

export const SHADOWS = {
  card: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  soft: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const GRADIENTS = {
  background: [COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd],
  card: ['#FFFFFF', '#F8FAFC'],
  button: [COLORS.primary, COLORS.primaryDark],
  header: [COLORS.gradientStart, COLORS.gradientEnd],
};
