import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

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
            <Ionicons name="arrow-back" size={20} color={DARK} />
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
              <Ionicons name="copy" size={18} color={BRAND_BLUE} />
              <Text style={styles.copyText}>{copied ? 'Copied' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.noteBox}>
            <Ionicons name="information-circle-outline" size={16} color={BRAND_BLUE} />
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
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 20, gap: 18 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  lead: { color: DARK, fontSize: 16, fontFamily: 'Nunito_700Bold' },
  tillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  tillLabel: { color: '#6A6A6A', fontSize: 12, fontFamily: 'Nunito_600SemiBold' },
  tillNumber: { color: DARK, fontSize: 20, fontFamily: 'Nunito_700Bold', letterSpacing: 1 },
  tillName: { color: '#4A4A4A', fontSize: 13, fontFamily: 'Nunito_600SemiBold' },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  copyText: { color: BRAND_BLUE, fontSize: 13, fontFamily: 'Nunito_700Bold' },
  noteBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F6F7FB',
    alignItems: 'center',
  },
  noteText: { flex: 1, color: '#4A4A4A', fontSize: 13, lineHeight: 18, fontFamily: 'Nunito_600SemiBold' },
  paidBtn: {
    marginTop: 'auto',
    height: 52,
    borderRadius: 14,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Nunito_700Bold' },
});
