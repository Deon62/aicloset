import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS, TYPE } from '../ui/tokens';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';

const SWAP_OPTIONS = [
  { key: 'eventPass', title: 'Event pass', points: 3000 },
  { key: 'tee', title: 'Tee', points: 5000 },
  { key: 'hoodie', title: 'Hoodie', points: 7000 },
];

export default function RedeemPointsScreen({ onBack = () => {} }) {
  const [phone, setPhone] = useState('');
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swapKey, setSwapKey] = useState('eventPass');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem('@profile_points');
        const p = Number(String(stored || '').replace(/[^0-9-]/g, ''));
        if (!mounted) return;
        setPoints(Number.isFinite(p) ? p : 0);
      } catch (e) {
        console.warn('Failed to load points', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const normalizedPhone = useMemo(() => {
    const v = String(phone || '').trim();
    const digits = v.replace(/[^0-9]/g, '');
    if (!digits) return '';
    if (digits.startsWith('0') && digits.length === 10) return digits;
    if (digits.startsWith('254') && digits.length === 12) return digits;
    if (v.startsWith('+') && digits.startsWith('254') && digits.length === 12) return `+${digits}`;
    return v;
  }, [phone]);

  const isValidPhone = useMemo(() => {
    const v = String(phone || '').trim();
    const digits = v.replace(/[^0-9]/g, '');
    if (digits.startsWith('0') && digits.length === 10) return true;
    if (digits.startsWith('254') && digits.length === 12) return true;
    if (v.startsWith('+') && digits.startsWith('254') && digits.length === 12) return true;
    return false;
  }, [phone]);

  const minPoints = 10000;
  const canRedeem = points >= minPoints;
  const pointsToKsh = useMemo(() => {
    if (!Number.isFinite(points)) return 0;
    return Math.round(points / 10);
  }, [points]);

  const selectedSwap = useMemo(() => {
    return SWAP_OPTIONS.find((o) => o.key === swapKey) || SWAP_OPTIONS[0];
  }, [swapKey]);

  const canSwap = points >= (selectedSwap?.points || 0);

  const redeem = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!canRedeem) {
      Alert.alert('Not enough points', `You need at least ${minPoints.toLocaleString()} points to redeem.`);
      return;
    }

    if (!isValidPhone) {
      Alert.alert('Invalid M-Pesa number', 'Enter a valid phone number (e.g. 07XXXXXXXX or +2547XXXXXXXX).');
      return;
    }

    Alert.alert('Redeem request sent', `We will process your redemption to ${normalizedPhone}.`);
  };

  const swap = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!canSwap) {
      Alert.alert(
        'Not enough points',
        `You need at least ${(selectedSwap?.points || 0).toLocaleString()} points to swap for a ${selectedSwap?.title || 'reward'}.`
      );
      return;
    }

    Alert.alert(
      'Confirm swap',
      `Swap ${selectedSwap.points.toLocaleString()} points for a ${selectedSwap.title}?\n\nThis will send the points to our club account.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Swap',
          onPress: () => {
            Alert.alert('Swap request sent', `Your ${selectedSwap.title} swap has been submitted. Points will be sent to the club account.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Redeem Points</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.illustrationWrap}>
            <Image source={require('../assets/mpesa.png')} style={styles.mpesaImg} resizeMode="contain" />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your points</Text>
            <Text style={styles.pointsValue}>{loading ? '—' : points.toLocaleString()}</Text>
            <Text style={styles.note}>Rate: 10,000 points = KSh 1,000</Text>
            <Text style={styles.note}>Estimated value: KSh {loading ? '—' : pointsToKsh.toLocaleString()}</Text>
            <Text style={styles.note}>Minimum redeemable: {minPoints.toLocaleString()} points</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Redeem to M-Pesa</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="07XXXXXXXX"
              placeholderTextColor={COLORS.subtle}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <Text style={styles.helperText}>We will send your redemption to this number.</Text>

            {!canRedeem ? (
              <View style={styles.warningBox}>
                <Ionicons name="alert-circle-outline" size={18} color="#B42318" />
                <Text style={styles.warningText}>
                  You need {Math.max(0, minPoints - points).toLocaleString()} more points to redeem.
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.redeemBtn, (!canRedeem || !isValidPhone) && styles.redeemBtnDisabled]}
              onPress={redeem}
              disabled={!canRedeem || !isValidPhone}
            >
              <Text style={styles.redeemBtnText}>Redeem</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Swap for merch & passes</Text>
            <Text style={styles.helperText}>Swapping sends your points to our club account.</Text>

            <View style={styles.swapList}>
              {SWAP_OPTIONS.map((opt) => {
                const selected = opt.key === swapKey;
                const enough = points >= opt.points;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    activeOpacity={0.9}
                    onPress={() => setSwapKey(opt.key)}
                    style={[styles.swapRow, selected && styles.swapRowSelected]}
                  >
                    <View style={styles.swapRowLeft}>
                      <Text style={styles.swapTitle}>{opt.title}</Text>
                      <Text style={[styles.swapMeta, !enough && styles.swapMetaWarn]}>{opt.points.toLocaleString()} points</Text>
                    </View>
                    <View style={styles.swapRowRight}>
                      {selected ? (
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.brand} />
                      ) : (
                        <Ionicons name="ellipse-outline" size={20} color="#BDBDBD" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {!canSwap ? (
              <View style={styles.warningBox}>
                <Ionicons name="alert-circle-outline" size={18} color="#B42318" />
                <Text style={styles.warningText}>
                  You need {Math.max(0, selectedSwap.points - points).toLocaleString()} more points to swap for {selectedSwap.title}.
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.swapBtn, !canSwap && styles.redeemBtnDisabled]}
              onPress={swap}
              disabled={!canSwap}
            >
              <Text style={styles.swapBtnText}>Swap</Text>
              <Ionicons name="swap-horizontal" size={18} color="#FFFFFF" />
            </TouchableOpacity>
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
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    padding: SPACING.l,
    gap: SPACING.m,
    paddingBottom: SPACING.xl,
  },
  illustrationWrap: {
    alignItems: 'center',
    marginTop: 6,
  },
  mpesaImg: {
    width: 220,
    height: 120,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACING.m,
    gap: SPACING.s,
  },
  cardTitle: {
    ...TYPE.caption,
  },
  pointsValue: {
    marginTop: 8,
    color: COLORS.text,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'Nunito_700Bold',
  },
  note: {
    marginTop: 0,
    ...TYPE.caption,
  },
  fieldLabel: {
    ...TYPE.section,
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s + SPACING.xs,
    backgroundColor: COLORS.surface,
    ...TYPE.bodyStrong,
  },
  helperText: {
    marginTop: 8,
    ...TYPE.body,
  },
  warningBox: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFF1F3',
    borderWidth: 1,
    borderColor: '#FFD0D6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  warningText: {
    flex: 1,
    color: '#B42318',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  redeemBtn: {
    marginTop: 14,
    backgroundColor: COLORS.brand,
    paddingVertical: SPACING.s + SPACING.xs,
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  redeemBtnDisabled: {
    opacity: 0.5,
  },
  redeemBtnText: {
    ...TYPE.bodyStrong,
    color: '#FFFFFF',
  },
  swapList: {
    marginTop: SPACING.s,
    gap: SPACING.s,
  },
  swapRow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.s + SPACING.xs,
    paddingHorizontal: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
  },
  swapRowSelected: {
    borderColor: '#C9D6FF',
    backgroundColor: COLORS.bg,
  },
  swapRowLeft: {
    flex: 1,
    paddingRight: 10,
  },
  swapRowRight: {
    width: 24,
    alignItems: 'flex-end',
  },
  swapTitle: {
    ...TYPE.bodyStrong,
  },
  swapMeta: {
    marginTop: 4,
    ...TYPE.caption,
  },
  swapMetaWarn: {
    color: '#B42318',
  },
  swapBtn: {
    marginTop: 14,
    backgroundColor: COLORS.text,
    paddingVertical: SPACING.s + SPACING.xs,
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  swapBtnText: {
    ...TYPE.bodyStrong,
    color: '#FFFFFF',
  },
});
