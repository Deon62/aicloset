import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../ui/tokens';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

export default function SettingsScreen({
  onBack = () => {},
  onOpenHelp = () => {},
  onOpenPrivacy = () => {},
  onOpenAbout = () => {},
  onOpenAccount = () => {},
  onOpenNotifications = () => {},
}) {
  const rows = [
    { id: 'account', label: 'Account', icon: 'person-outline' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
    { id: 'privacy', label: 'Privacy', icon: 'hand-left-outline' },
    { id: 'eucossa', label: 'official website', icon: 'globe-outline', url: 'https://eucossa.com' },
    { id: 'help', label: 'Help', icon: 'help-circle-outline' },
    { id: 'about', label: 'About', icon: 'information-circle-outline' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.sectionCard}>
            {rows.map((row, idx) => {
              const showDivider = idx !== rows.length - 1;
              return (
                <View key={row.id}>
                  <TouchableOpacity
                    style={styles.row}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (row.id === 'help') {
                        onOpenHelp();
                        return;
                      }
                      if (row.id === 'account') {
                        onOpenAccount();
                        return;
                      }
                      if (row.id === 'notifications') {
                        onOpenNotifications();
                        return;
                      }
                      if (row.id === 'privacy') {
                        onOpenPrivacy();
                        return;
                      }
                      if (row.id === 'about') {
                        onOpenAbout();
                        return;
                      }
                      if (row.url) Linking.openURL(row.url);
                    }}
                  >
                    <View style={styles.rowLeft}>
                      <Ionicons name={row.icon} size={18} color={DARK} />
                      <Text style={styles.rowLabel}>{row.label}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#7A7A7A" />
                  </TouchableOpacity>
                  {showDivider ? <View style={styles.divider} /> : null}
                </View>
              );
            })}
          </View>

          <View style={styles.footerNote}>
            <Text style={styles.footerText}>Version 1.0</Text>
            <Text style={styles.footerSubText}>This app is a beta version. Some features may not work yet.</Text>
            <Text style={styles.footerSubText}>
              Developed by{' '}
              <Text
                style={styles.footerLink}
                onPress={() => {
                  Linking.openURL('https://deonhq.xyz');
                }}
              >
                deonhq.xyz
              </Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: {
    ...TYPE.title,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  content: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.s,
    paddingBottom: SPACING.l,
    gap: SPACING.m,
  },
  sectionCard: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    ...TYPE.bodyStrong,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F1F5',
    marginLeft: 44,
  },
  footerNote: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 6,
  },
  footerText: {
    ...TYPE.caption,
    color: COLORS.brand,
  },
  footerSubText: {
    ...TYPE.caption,
  },
  footerLink: {
    color: COLORS.brand,
    textDecorationLine: 'underline',
    fontFamily: 'Nunito_700Bold',
  },
});
