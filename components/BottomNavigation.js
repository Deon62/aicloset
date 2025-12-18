import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BLUE = '#1B56FD';

const tabs = [
  { id: 'home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { id: 'events', label: 'Events', icon: 'calendar-outline', iconActive: 'calendar' },
  { id: 'shop', label: 'Shop', icon: 'pricetags-outline', iconActive: 'pricetags' },
  { id: 'community', label: 'Community', icon: 'people-outline', iconActive: 'people' },
  { id: 'profile', label: 'Profile', icon: 'person-outline', iconActive: 'person' },
];

export default function BottomNavigation({ currentTab, onTabChange }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 10 }]}>
      {tabs.map((tab) => {
        const isActive = tab.id === currentTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => {
              if (tab.id !== currentTab) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onTabChange(tab.id);
            }}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? BRAND_BLUE : '#5A5A5A'}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 2,
    gap: 6,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  tab: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 0,
    alignItems: 'center',
    paddingVertical: 3,
    gap: 2,
  },
  tabActive: {
    backgroundColor: 'transparent',
  },
  label: {
    color: '#5A5A5A',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily: 'Nunito_600SemiBold',
  },
  labelActive: {
    color: BRAND_BLUE,
    fontFamily: 'Nunito_600SemiBold',
  },
});

