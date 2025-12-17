import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND_BLUE = '#1B56FD';
const DARK = '#1D1D1D';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.logosRow}>
              <Image source={require('../assets/egerton.png')} style={styles.logo} resizeMode="contain" />
              <View style={styles.logoDivider} />
              <Image source={require('../assets/eucossa.jpg')} style={styles.logo} resizeMode="contain" />
            </View>
          </View>
          <Text style={styles.title}>Welcome To Egerton University Computer Science Students Association </Text>
          <Text style={styles.subtitle}>Build. Learn. Share. Compete.</Text>
        </View>

        <View style={[styles.card, styles.cardAccent]}>
          <View style={styles.cardRow}>
            <View style={styles.cardMain}>
              <Text style={styles.cardTitle}>Next event</Text>
              <Text style={styles.cardHeadline}>Workshop: Web Development Basics</Text>
              <Text style={styles.cardMeta}>Friday · 3:30 PM · Computer Lab</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Upcoming</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest</Text>
          <View style={styles.card}>
            <Text style={styles.cardMeta}>Project teams sign‑up is open this week.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
    paddingBottom: 70,
  },
  header: {
    gap: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  logoDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E5E5',
  },
  title: {
    fontSize: 20,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 21,
    fontFamily: 'Nunito_400Regular',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardAccent: {
    borderColor: '#DCE3FF',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardMain: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    color: '#0B0B0F',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  cardHeadline: {
    color: DARK,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Nunito_700Bold',
  },
  cardMeta: {
    color: '#6A6A6A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  badge: {
    backgroundColor: '#EEF3FF',
    borderWidth: 1,
    borderColor: '#DCE3FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: BRAND_BLUE,
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});
