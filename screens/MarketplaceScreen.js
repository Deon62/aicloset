import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MarketplaceScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Marketplace</Text>
        <Text style={styles.subtitle}>Buy/sell/swap tech items with club members.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Featured</Text>
          <Text style={styles.cardText}>USB-C Hub (Used) · 120 EGP</Text>
          <Text style={styles.cardText}>Mechanical Keyboard (Used) · 700 EGP</Text>
          <Text style={styles.cardText}>Arduino Starter Kit · 450 EGP</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How it works</Text>
          <Text style={styles.cardText}>1) Post an item with price and condition</Text>
          <Text style={styles.cardText}>2) Chat in Community to coordinate</Text>
          <Text style={styles.cardText}>3) Meet safely on campus</Text>
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
