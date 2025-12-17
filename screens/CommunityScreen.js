import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Connect with EUCOSSA members and share resources.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Channels</Text>
          <Text style={styles.cardText}>#announcements</Text>
          <Text style={styles.cardText}>#questions</Text>
          <Text style={styles.cardText}>#projects</Text>
          <Text style={styles.cardText}>#marketplace</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pinned</Text>
          <Text style={styles.cardText}>Share your project ideas and find teammates.</Text>
          <Text style={styles.cardText}>Post workshop notes and helpful links.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Starter resources</Text>
          <Text style={styles.cardText}>GitHub basics</Text>
          <Text style={styles.cardText}>JavaScript / Python practice</Text>
          <Text style={styles.cardText}>Data structures cheat sheet</Text>
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
});
