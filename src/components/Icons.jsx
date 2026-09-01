import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Eye, EyeOff, Home, Heart, Salad, Bell } from 'lucide-react-native';


// NutriTrack Modern Sleek Logo Emblem
export const NutriTrackLogo = ({ size = 76 }) => {
  const outerSize = size;
  const innerSize = size * 0.52;
  return (
    <View style={[logoStyles.container, { width: outerSize, height: outerSize, borderRadius: outerSize * 0.32 }]}>
      {/* Subtle Inner Glow Ring */}
      <View style={[logoStyles.innerGlow, { width: outerSize - 8, height: outerSize - 8, borderRadius: (outerSize - 8) * 0.32 }]} />
      {/* Abstract Leaf & Track Graphic */}
      <View style={[logoStyles.leafMain, { width: innerSize, height: innerSize }]}>
        <View style={logoStyles.leafLeft} />
        <View style={logoStyles.leafRight} />
        <View style={logoStyles.stem} />
      </View>
    </View>
  );
};

const logoStyles = StyleSheet.create({
  container: {
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  innerGlow: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  leafMain: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafLeft: {
    position: 'absolute',
    width: '60%',
    height: '82%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderBottomRightRadius: 22,
    transform: [{ rotate: '-25deg' }, { translateX: -3 }],
  },
  leafRight: {
    position: 'absolute',
    width: '52%',
    height: '72%',
    backgroundColor: '#DCFCE7',
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    transform: [{ rotate: '30deg' }, { translateX: 7 }, { translateY: -2 }],
  },
  stem: {
    position: 'absolute',
    bottom: -2,
    width: 3.5,
    height: '48%',
    backgroundColor: '#15803D',
    borderRadius: 2,
    transform: [{ rotate: '-10deg' }],
  },
});

// Email Icon Component
export const EmailIcon = ({ size = 20, color = '#64748B' }) => {
  const w = size;
  const h = size * 0.72;
  return (
    <View style={{ width: w, height: h, borderWidth: 1.8, borderColor: color, borderRadius: 4, justifyContent: 'flex-start', overflow: 'hidden' }}>
      <View
        style={{
          position: 'absolute',
          top: -h * 0.38,
          left: w * 0.1,
          width: w * 0.72,
          height: w * 0.72,
          borderBottomWidth: 1.8,
          borderRightWidth: 1.8,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

// Lock Icon Component
export const LockIcon = ({ size = 20, color = '#64748B' }) => {
  const w = size * 0.85;
  const bodyH = size * 0.55;
  const shackleW = w * 0.55;
  const shackleH = size * 0.45;
  return (
    <View style={{ width: w, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: shackleW,
          height: shackleH,
          borderWidth: 1.8,
          borderColor: color,
          borderTopLeftRadius: shackleW / 2,
          borderTopRightRadius: shackleW / 2,
          borderBottomWidth: 0,
        }}
      />
      <View
        style={{
          width: w,
          height: bodyH,
          borderWidth: 1.8,
          borderColor: color,
          borderRadius: 4,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ width: 3, height: 5, backgroundColor: color, borderRadius: 1.5 }} />
      </View>
    </View>
  );
};

// Eye Icon using Lucide
export const EyeIcon = ({ size = 22, color = '#16A34A' }) => {
  return <Eye size={size} color={color} strokeWidth={2} />;
};

// EyeOff Icon using Lucide
export const EyeOffIcon = ({ size = 22, color = '#94A3B8' }) => {
  return <EyeOff size={size} color={color} strokeWidth={2} />;
};

// Home Icon using Lucide
export const HomeIcon = ({ size = 20, color = '#C8FF00' }) => {
  return <Home size={size} color={color} strokeWidth={2} />;
};

// Heart Icon (Habits) using Lucide
export const HeartIcon = ({ size = 20, color = 'rgba(255,255,255,0.4)' }) => {
  return <Heart size={size} color={color} strokeWidth={2} />;
};

// Salad Icon (Meals) using Lucide
export const SaladIcon = ({ size = 20, color = 'rgba(255,255,255,0.4)' }) => {
  return <Salad size={size} color={color} strokeWidth={2} />;
};

// Bell Icon (To-do) using Lucide
export const BellIcon = ({ size = 20, color = 'rgba(255,255,255,0.4)' }) => {
  return <Bell size={size} color={color} strokeWidth={2} />;
};

// Warning Alert Icon Component
export const AlertIcon = ({ size = 18, color = '#EF4444' }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.8,
        borderColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ width: 2, height: size * 0.36, backgroundColor: color, borderRadius: 1, marginBottom: 2 }} />
      <View style={{ width: 2, height: 2, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
};

// Sunrise Icon (Breakfast)
export const SunriseIcon = ({ size = 22, color = '#F59E0B' }) => {
  const w = size;
  return (
    <View style={{ width: w, height: w, justifyContent: 'flex-end', alignItems: 'center' }}>
      {/* Rays */}
      <View style={{ position: 'absolute', top: w * 0.08, width: 2, height: w * 0.18, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: 'absolute', top: w * 0.15, left: w * 0.12, width: 2, height: w * 0.15, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '-45deg' }] }} />
      <View style={{ position: 'absolute', top: w * 0.15, right: w * 0.12, width: 2, height: w * 0.15, backgroundColor: color, borderRadius: 1, transform: [{ rotate: '45deg' }] }} />
      {/* Half Sun */}
      <View style={{ width: w * 0.55, height: w * 0.28, borderTopLeftRadius: w * 0.28, borderTopRightRadius: w * 0.28, backgroundColor: color, marginBottom: w * 0.08 }} />
      {/* Horizon */}
      <View style={{ width: w * 0.85, height: 2, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
};

// Sun Icon (Lunch)
export const SunIcon = ({ size = 22, color = '#F59E0B' }) => {
  const w = size;
  const center = w * 0.28;
  return (
    <View style={{ width: w, height: w, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: center, height: center, borderRadius: center / 2, backgroundColor: color }} />
      {/* Rays - 4 directions */}
      <View style={{ position: 'absolute', top: w * 0.06, width: 2, height: w * 0.16, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: 'absolute', bottom: w * 0.06, width: 2, height: w * 0.16, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: 'absolute', left: w * 0.06, width: w * 0.16, height: 2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: 'absolute', right: w * 0.06, width: w * 0.16, height: 2, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
};

// Moon Icon (Dinner)
export const MoonIcon = ({ size = 22, color = '#6366F1' }) => {
  const w = size;
  return (
    <View style={{ width: w, height: w, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: w * 0.6, height: w * 0.7, borderRadius: w * 0.35, borderWidth: 2, borderColor: color, backgroundColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '-30deg' }] }} />
    </View>
  );
};

// Apple Icon (Snack)
export const AppleIcon = ({ size = 22, color = '#EF4444' }) => {
  const w = size;
  return (
    <View style={{ width: w, height: w, justifyContent: 'center', alignItems: 'center' }}>
      {/* Stem */}
      <View style={{ position: 'absolute', top: w * 0.05, width: 2, height: w * 0.18, backgroundColor: '#16A34A', borderRadius: 1, transform: [{ rotate: '10deg' }] }} />
      {/* Body */}
      <View style={{ width: w * 0.56, height: w * 0.6, borderRadius: w * 0.2, backgroundColor: color, marginTop: w * 0.15 }} />
    </View>
  );
};
