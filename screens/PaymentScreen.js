import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../ui/tokens';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';

export default function PaymentScreen({ onBack = () => {}, onPaid = () => {} }) {
  const TILL = '4239478';
  const NAME = 'Deon Orina Nyabwengi';
  const [copied, setCopied] = useState(false);

  const copyTill = async () => {
    try {
      await Clipboard.setStringAsync(TILL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      Alert.alert('Copy failed', 'Could not copy the till number.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.card}>
          <Text style={styles.lead}>Pay with M-Pesa (Buy Goods)</Text>
          <View style={styles.tillRow}>
            <View>
              <Text style={styles.tillLabel}>Till number</Text>
              <Text style={styles.tillNumber}>{TILL}</Text>
              <Text style={styles.tillName}>Name: {NAME}</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} activeOpacity={0.9} onPress={copyTill}>
              <Ionicons name="copy" size={18} color={COLORS.brand} />
              <Text style={styles.copyText}>{copied ? 'Copied' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.noteBox}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.brand} />
            <Text style={styles.noteText}>We are working on integrating club payment gateways to automate this step.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.paidBtn} activeOpacity={0.9} onPress={onPaid}>
          <Text style={styles.paidText}>I have paid</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, padding: SPACING.l, gap: SPACING.m },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  headerTitle: { ...TYPE.title },
  headerSpacer: { width: 40, height: 40 },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACING.m,
    gap: SPACING.s,
    backgroundColor: COLORS.surface,
  },
  lead: { ...TYPE.section },
  tillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.s,
  },
  tillLabel: { ...TYPE.caption },
  tillNumber: { color: DARK, fontSize: 20, fontFamily: 'Nunito_700Bold', letterSpacing: 1 },
  tillName: { ...TYPE.body },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  copyText: { ...TYPE.caption, color: COLORS.brand },
  noteBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
  },
  noteText: { flex: 1, ...TYPE.body },
  paidBtn: {
    marginTop: 'auto',
    height: 52,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidText: { ...TYPE.bodyStrong, color: '#FFFFFF' },
});
