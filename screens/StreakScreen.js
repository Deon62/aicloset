import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';
const ORANGE = '#F97316';

const WEEK_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StreakScreen({ onBack = () => {} }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const s = await AsyncStorage.getItem('@profile_streak');
        const n = Number(String(s || '').replace(/[^0-9]/g, ''));
        if (!mounted) return;
        setStreak(Number.isFinite(n) ? n : 0);
      } catch {
        if (!mounted) return;
        setStreak(0);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const daysStreakLabel = streak === 1 ? 'day streak' : 'days streak';

  const activeDays = useMemo(() => {
    const count = Math.max(0, Math.min(7, streak));
    const now = new Date();
    const jsDay = now.getDay();
    const indexToday = jsDay === 0 ? 6 : jsDay - 1;
    const set = new Set();
    for (let i = 0; i < count; i += 1) {
      const idx = (indexToday - i + 7) % 7;
      set.add(idx);
    }
    return set;
  }, [streak]);

  const message = streak > 0 ? "You're on Fire!" : 'Start your streak today';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Streak</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.flame}>🔥</Text>
          <Text style={styles.bigNumber}>{streak}</Text>
          <Text style={styles.bigLabel}>{daysStreakLabel}</Text>

          <View style={styles.weekCard}>
            <View style={styles.weekRow}>
              {WEEK_KEYS.map((k, idx) => (
                <View key={k} style={styles.weekCol}>
                  <Text style={styles.weekDay}>{k[0]}</Text>
                  <View style={[styles.weekDot, activeDays.has(idx) ? styles.weekDotActive : null]}>
                    {activeDays.has(idx) ? <Text style={styles.weekCheck}>✓</Text> : null}
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.weekDivider} />
            <Text style={styles.weekMessage}>
              {message} <Text style={styles.weekMessageEmoji}>🔥</Text>
            </Text>
          </View>
        </View>

        <Text style={styles.hint}>Streak counts update once per day when you open the app.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 20, gap: 16 },
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
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { color: DARK, fontSize: 20, fontFamily: 'Nunito_700Bold' },
  headerSpacer: { width: 40, height: 40 },

  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  flame: { fontSize: 70, lineHeight: 78 },
  bigNumber: { marginTop: 4, color: ORANGE, fontSize: 64, fontFamily: 'Nunito_700Bold', lineHeight: 72 },
  bigLabel: { color: ORANGE, fontSize: 18, fontFamily: 'Nunito_700Bold' },

  weekCard: {
    marginTop: 16,
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    padding: 14,
  },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekCol: { alignItems: 'center', gap: 8, flex: 1 },
  weekDay: { color: '#6A6A6A', fontSize: 12, fontFamily: 'Nunito_700Bold' },
  weekDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDotActive: {
    borderColor: '#FFEDD5',
    backgroundColor: '#FFEDD5',
  },
  weekCheck: { color: ORANGE, fontSize: 14, fontFamily: 'Nunito_700Bold' },
  weekDivider: { marginTop: 12, height: 1, backgroundColor: '#F1F1F1' },
  weekMessage: { marginTop: 12, textAlign: 'center', color: DARK, fontSize: 16, fontFamily: 'Nunito_700Bold' },
  weekMessageEmoji: { color: ORANGE },

  hint: { textAlign: 'center', color: '#6A6A6A', fontSize: 12, fontFamily: 'Nunito_600SemiBold' },
});
