import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DARK = '#0B0B0F';

export default function NotificationSettingsScreen({ onBack = () => {} }) {
  const items = [
    { label: 'Announcements', value: true },
    { label: 'Community replies', value: true },
    { label: 'Event reminders', value: true },
    { label: 'Marketplace updates', value: false },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {items.map((item, idx) => (
            <View key={item.label} style={[styles.row, idx !== items.length - 1 && styles.rowDivider]}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Switch value={item.value} onValueChange={() => {}} trackColor={{ false: '#E5E5E5', true: '#C7D8FF' }} thumbColor={item.value ? '#1B56FD' : '#FFFFFF'} />
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.lead}>Tip</Text>
          <Text style={styles.body}>You can mute categories here if you prefer fewer alerts. Critical updates may still appear in-app.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: DARK, fontSize: 20, fontFamily: 'Nunito_700Bold' },
  headerSpacer: { width: 40, height: 40 },
  card: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#F1F1F1' },
  rowLabel: { color: DARK, fontSize: 14, fontFamily: 'Nunito_700Bold' },
  lead: { color: DARK, fontSize: 16, fontFamily: 'Nunito_700Bold' },
  body: { color: '#4A4A4A', fontSize: 13, lineHeight: 18, fontFamily: 'Nunito_600SemiBold' },
});
