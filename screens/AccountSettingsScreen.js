import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../ui/tokens';

const DARK = '#0B0B0F';

export default function AccountSettingsScreen({ onBack = () => {} }) {
  const items = [
    { label: 'Make profile private', value: false },
    { label: 'Show GitHub on profile', value: true },
    { label: 'Enable activity status', value: false },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
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
          <Text style={styles.lead}>Need changes?</Text>
          <Text style={styles.body}>Profile edits are in the Profile Info page. Use privacy toggles here to limit visibility.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  content: { padding: SPACING.l, gap: SPACING.m, paddingBottom: 40 },
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
  headerTitle: { ...TYPE.title },
  headerSpacer: { width: 40, height: 40 },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    gap: SPACING.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#F0F1F5' },
  rowLabel: { ...TYPE.bodyStrong },
  lead: { ...TYPE.section },
  body: { ...TYPE.body },
});
