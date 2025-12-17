import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Events</Text>
        <Text style={styles.subtitle}>Upcoming sessions, workshops, and competitions.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next meetup</Text>
          <Text style={styles.cardText}>Topic: Intro to Competitive Programming</Text>
          <Text style={styles.cardMeta}>Time: Friday · 3:30 PM</Text>
          <Text style={styles.cardMeta}>Location: Computer Lab</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>This month</Text>
          <Text style={styles.cardText}>Project showcase (teams present what they built)</Text>
          <Text style={styles.cardText}>Hackathon prep: Git + GitHub collaboration</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Announcements</Text>
          <Text style={styles.cardText}>Follow the Community tab for updates and discussions.</Text>
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
    fontSize: 28,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
  },
  subtitle: {
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
  cardMeta: {
    color: '#6A6A6A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
});
