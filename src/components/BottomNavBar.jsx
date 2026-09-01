import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { HomeIcon, HeartIcon, SaladIcon, BellIcon } from './Icons';

const LIME = '#C8FF00';
const DARK_BG = '#1A1A2E';

const BottomNavBar = ({ activeTab = 'home' }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const tabs = [
    { key: 'home', label: 'Home', route: 'DietDashboard' },
    { key: 'habits', label: 'Habits', route: null },
    { key: 'meals', label: 'Meals', route: 'MealHistory' },
    { key: 'todo', label: 'To-do', route: null },
  ];

  const renderIcon = (key, isActive) => {
    const color = isActive ? LIME : 'rgba(255,255,255,0.4)';

    switch (key) {
      case 'home':
        return (
          <View style={st.iconWrap}>
            <HomeIcon size={20} color={color} />
          </View>
        );
      case 'habits':
        return (
          <View style={st.iconWrap}>
            <HeartIcon size={20} color={color} />
          </View>
        );
      case 'meals':
        return (
          <View style={st.iconWrap}>
            <SaladIcon size={20} color={color} />
          </View>
        );
      case 'todo':
        return (
          <View style={st.iconWrap}>
            <BellIcon size={20} color={color} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[st.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={st.pill}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={st.tab}
              activeOpacity={0.7}
              onPress={() => {
                if (tab.route && tab.route !== navigation.getState()?.routes?.[navigation.getState()?.index]?.name) {
                  navigation.navigate(tab.route);
                }
              }}
            >
              {renderIcon(tab.key, isActive)}
              <Text style={isActive ? st.labelActive : st.label}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}

        {/* + Button */}
        <TouchableOpacity
          style={st.plusBtn}
          onPress={() => navigation.navigate('FoodScanner')}
          activeOpacity={0.85}
        >
          <Text style={st.plusIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    alignItems: 'center', paddingHorizontal: 16, paddingTop: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK_BG,
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  iconWrap: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 3 },
  label: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },
  labelActive: { fontSize: 10, fontWeight: '700', color: LIME },
  plusBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: LIME,
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 4,
  },
  plusIcon: { fontSize: 28, fontWeight: '700', color: DARK_BG, marginTop: -2 },
});

export default BottomNavBar;
