import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { id: 'upload', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { id: 'matches', label: 'Matches', icon: 'color-palette-outline', iconActive: 'color-palette' },
  { id: 'closet', label: 'Closet', icon: 'shirt-outline', iconActive: 'shirt' },
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
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? '#0B0B0F' : '#D8E6D5'}
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
    paddingTop: 6,
    paddingBottom: 6,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  tab: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 0,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
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
    color: '#5A5A5A',
    fontFamily: 'Nunito_600SemiBold',
  },
});

