import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';

export default function PrivacyScreen({ onBack = () => {} }) {
  const requestData = () => {
    Linking.openURL('mailto:eucossa@egerton.ac.ke?subject=Account%20Data%20Request');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.lead}>Your data</Text>
          <Text style={styles.body}>We store your profile (name, course, year, GitHub) and your posts in communities you join.</Text>
          <Text style={styles.body}>You can delete your account by contacting support. Posts may remain if required for moderation.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.lead}>Data requests</Text>
          <Text style={styles.body}>Need a copy of your data or want it removed? Tap below to email us and we will respond promptly.</Text>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={requestData}>
            <Text style={styles.ctaText}>Request my account data</Text>
          </TouchableOpacity>
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
  ctaBtn: {
    marginTop: 6,
    backgroundColor: BRAND_BLUE,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Nunito_700Bold' },
});
