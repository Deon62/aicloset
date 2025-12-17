import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>EUCOSSA</Text>
        <Text style={styles.subtitle}>Computer Science Club</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome</Text>
          <Text style={styles.cardText}>
            Explore upcoming events, connect with members, and buy/sell tech items in the marketplace.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>This week</Text>
          <Text style={styles.cardText}>Workshop: Web Development Basics</Text>
          <Text style={styles.cardText}>Community: Project team sign-ups</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick links</Text>
          <Text style={styles.cardText}>Events: See schedule and announcements</Text>
          <Text style={styles.cardText}>Marketplace: Find affordable tech gear</Text>
          <Text style={styles.cardText}>Community: Meet members and share ideas</Text>
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
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.6,
  },
  subtitle: {
    marginTop: -8,
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 22,
    fontFamily: 'Nunito_400Regular',
  },
  card: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  cardText: {
    color: '#4A4A4A',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
});
