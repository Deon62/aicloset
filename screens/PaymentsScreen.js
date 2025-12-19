import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../ui/tokens';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

export default function PaymentsScreen({ onBack = () => {} }) {
  const openPayments = async () => {
    const url = 'https://eucossa.com/payments';
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert('Payments', 'Unable to open the website on this device.');
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Payments', 'Failed to open the payments page.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payments</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>Payments are handled on our website</Text>
            <Text style={styles.noticeText}>
              This app does not process funds for now. Please complete payments on our website.
            </Text>
            <TouchableOpacity style={styles.noticeBtn} activeOpacity={0.9} onPress={openPayments}>
              <Text style={styles.noticeBtnText}>Go to payments</Text>
              <Ionicons name="open-outline" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionRow}>
              <Ionicons name="people-outline" size={22} color={DARK} />
              <View style={styles.sectionMain}>
                <Text style={styles.sectionTitle}>One-time membership</Text>
                <Text style={styles.sectionBody}>Pay KSh 50 (or more) once to join and support club activities.</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionRow}>
              <MaterialCommunityIcons name="credit-card-sync-outline" size={24} color={DARK} />
              <View style={styles.sectionMain}>
                <Text style={styles.sectionTitle}>Semester subscriptions</Text>
                <Text style={styles.sectionBody}>Pay KSh 50 (or more) per semester to help keep the club running.</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionRow}>
              <MaterialCommunityIcons name="hand-coin" size={24} color={DARK} />
              <View style={styles.sectionMain}>
                <Text style={styles.sectionTitle}>Donate</Text>
                <Text style={styles.sectionBody}>Support student-led projects, events, and community growth at EUCOSSA.</Text>
              </View>
            </View>
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
  noticeCard: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: '#DCE3FF',
    backgroundColor: '#EEF3FF',
    padding: SPACING.m,
    gap: SPACING.s,
  },
  noticeTitle: {
    ...TYPE.section,
  },
  noticeText: {
    ...TYPE.body,
  },
  noticeBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.brand,
  },
  noticeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  sectionCard: {
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    gap: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sectionMain: {
    flex: 1,
    gap: 6,
  },
  sectionTitle: {
    ...TYPE.section,
  },
  sectionBody: {
    ...TYPE.body,
  },
});
