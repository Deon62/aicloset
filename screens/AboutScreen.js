import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../ui/tokens';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';

export default function AboutScreen({ onBack = () => {} }) {
  const openDeon = async () => {
    const url = 'https://deonhq.xyz';
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) return;
      await Linking.openURL(url);
    } catch (e) {
      // ignore
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.lead}>Eucossa App</Text>
          <Text style={styles.body}>Connecting Egerton University computer science students with communities, events, and club merch.</Text>
          <Text style={styles.body}>Version 1.0 · Built for smoother onboarding, community discussions, and event access.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.lead}>Credits</Text>
          <Text style={styles.body}>
            Design & tested by the Eucossa 2025/2026 exec team. engineered by{' '}
            <Text style={styles.link} onPress={openDeon}>
              https://deonhq.xyz
            </Text>
          </Text>
          <Text style={styles.body}>Feedback or ideas? Reach out via the Help page.</Text>
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
  lead: { ...TYPE.section },
  body: { ...TYPE.body },
  link: {
    color: COLORS.brand,
    fontFamily: 'Nunito_700Bold',
    textDecorationLine: 'underline',
  },
});
