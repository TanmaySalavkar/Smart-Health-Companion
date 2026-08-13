// Centralized Theme for Smart Health Companion
// Inspired by soft pastel gradient medical app design

export const COLORS = {
  // Primary palette
  primary: '#6C63FF',        // Soft purple
  primaryDark: '#5A52D5',    // Deeper purple for pressed states
  primaryLight: '#8B85FF',   // Lighter purple
  
  // Accent
  accent: '#4A90D9',         // Soft blue
  accentLight: '#7EB3EC',    // Lighter blue
  
  // Gradients (start → end)
  gradientStart: '#E8DFEF',  // Lavender
  gradientEnd: '#D6E4F0',    // Light blue
  gradientMiddle: '#E0E0F0', // Mid lavender-blue
  
  // Card / Surface
  cardBg: 'rgba(255, 255, 255, 0.75)',    // Glassmorphic white
  cardBgSolid: '#FFFFFF',
  cardBorder: 'rgba(255, 255, 255, 0.9)',
  
  // Background fallback (when gradient unavailable)
  bgFallback: '#EBE5F0',
  
  // Text
  textPrimary: '#2D2D3A',    // Dark charcoal
  textSecondary: '#6B6B80',  // Muted gray
  textLight: '#9A9AB0',      // Light gray
  textWhite: '#FFFFFF',
  
  // Category icon backgrounds
  heartRed: '#FFE0E0',
  heartIcon: '#FF6B6B',
  dentalBlue: '#D6E8FF',
  dentalIcon: '#4A90D9',
  brainPurple: '#E8DFFF',
  brainIcon: '#8B63FF',
  generalGreen: '#D6F5E0',
  generalIcon: '#4CAF50',
  
  // Status
  success: '#4CAF50',
  error: '#FF6B6B',
  errorBg: '#FFE8E8',
  warning: '#FFB74D',
  
  // Rating
  ratingBg: 'rgba(108, 99, 255, 0.1)',
  ratingText: '#6C63FF',
  
  // Shadow
  shadow: '#B0B0C0',
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
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  soft: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Gradient presets for LinearGradient
export const GRADIENTS = {
  background: [COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd],
  card: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'],
  button: [COLORS.primary, COLORS.primaryDark],
  header: [COLORS.gradientStart, COLORS.gradientEnd],
};
