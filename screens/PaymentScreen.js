import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
  const [email, setEmail] = useState('');
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const copyTill = async () => {
    try {
      await Clipboard.setStringAsync(TILL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      Alert.alert('Copy failed', 'Could not copy the till number.');
    }
  };

  const submitPaymentProof = async () => {
    const formEndpoint = 'https://formspree.io/f/xbdrljor';
    const cleanEmail = String(email || '').trim();
    const cleanMsg = String(mpesaMessage || '').trim();

    if (!cleanEmail) {
      Alert.alert('Payment', 'Please enter your email.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      Alert.alert('Payment', 'Please enter a valid email address.');
      return;
    }
    if (!cleanMsg) {
      Alert.alert('Payment', 'Please paste your M-Pesa message.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        type: 'payment_proof',
        email: cleanEmail,
        mpesa_message: cleanMsg,
        till: TILL,
        payee_name: NAME,
        submitted_at: new Date().toISOString(),
        _subject: 'EUCOSSA App - Payment proof',
      };

      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = 'Failed to submit payment proof.';
        try {
          const j = await res.json();
          if (j?.errors?.[0]?.message) msg = j.errors[0].message;
        } catch (e) {
          // ignore
        }
        Alert.alert('Payment', msg);
        return;
      }

      Alert.alert('Payment', 'Thanks! We received your payment proof.');
      setEmail('');
      setMpesaMessage('');
      onPaid();
    } catch (e) {
      console.warn('Payment proof submit failed', e);
      Alert.alert('Payment', 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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

          <View style={styles.card}>
            <Text style={styles.lead}>Confirm payment</Text>
            <Text style={styles.body}>Paste your M-Pesa message and email so we can verify your payment.</Text>

            <View style={styles.inputWrap}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#8A8A8A"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                editable={!submitting}
              />
            </View>

            <View style={styles.inputWrap}>
              <TextInput
                value={mpesaMessage}
                onChangeText={setMpesaMessage}
                placeholder="Paste M-Pesa message"
                placeholderTextColor="#8A8A8A"
                multiline
                textAlignVertical="top"
                style={[styles.input, styles.textarea]}
                editable={!submitting}
              />
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.paidBtn} activeOpacity={0.9} onPress={submitPaymentProof} disabled={submitting}>
          <Text style={styles.paidText}>{submitting ? 'Submitting…' : 'Submit payment proof'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, padding: SPACING.l, gap: SPACING.m },
  scrollContent: { gap: SPACING.m, paddingBottom: 20 },
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
  body: { ...TYPE.body },
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
  inputWrap: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
  },
  input: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
    padding: 0,
  },
  textarea: {
    minHeight: 120,
  },
  paidBtn: {
    height: 52,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidText: { ...TYPE.bodyStrong, color: '#FFFFFF' },
});
