import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';

export default function AboutScreen({ onBack = () => {} }) {
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
          <Text style={styles.lead}>EUCOSSA App</Text>
          <Text style={styles.body}>Connecting Egerton University computer science students with communities, events, and club merch.</Text>
          <Text style={styles.body}>Version 1.0 · Built for smoother onboarding, community discussions, and event access.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.lead}>Credits</Text>
          <Text style={styles.body}>Design & Engineering by the EUCOSSA team.</Text>
          <Text style={styles.body}>Feedback or ideas? Reach out via the Help page.</Text>
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
  lead: { color: DARK, fontSize: 16, fontFamily: 'Nunito_700Bold' },
  body: { color: '#4A4A4A', fontSize: 13, lineHeight: 18, fontFamily: 'Nunito_600SemiBold' },
});
