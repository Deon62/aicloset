import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold } from '@expo-google-fonts/nunito';

export default function BottomNavigation({ currentScreen, onNavigate }) {
  const insets = useSafeAreaInsets();

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (active) => (
        <Ionicons 
          name={active ? 'home' : 'home-outline'} 
          size={24} 
          color={active ? '#6D9773' : '#999999'} 
        />
      ),
    },
    {
      id: 'loans',
      label: 'Loans',
      icon: (active) => (
        <Ionicons 
          name={active ? 'wallet' : 'wallet-outline'} 
          size={24} 
          color={active ? '#6D9773' : '#999999'} 
        />
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: (active) => (
        <Ionicons 
          name={active ? 'shield-checkmark' : 'shield-outline'} 
          size={24} 
          color={active ? '#6D9773' : '#999999'} 
        />
      ),
    },
    {
      id: 'account',
      label: 'Account',
      icon: (active) => (
        <Ionicons 
          name={active ? 'person' : 'person-outline'} 
          size={24} 
          color={active ? '#6D9773' : '#999999'} 
        />
      ),
    },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {navigationItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => onNavigate(item.id)}
            activeOpacity={0.7}
          >
            {item.icon(isActive)}
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}
            >
              {item.label}
            </Text>
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
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    fontFamily: 'Nunito_400Regular',
  },
  navLabelActive: {
    color: '#6D9773',
    fontFamily: 'Nunito_600SemiBold',
  },
});

