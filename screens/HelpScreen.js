import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BLUE = '#1B56FD';
const DARK = '#0B0B0F';

export default function HelpScreen({ onBack = () => {} }) {
  const faqs = [
    {
      q: 'How do I join a community?',
      a: 'Open Community, tap Join on the track you like. You can post once joined.',
    },
    {
      q: 'How do I shop items?',
      a: 'Go to Shop, scroll items, add to cart, then open the cart icon to checkout.',
    },
    {
      q: 'Need support?',
      a: 'Email eucossa@egerton.ac.ke or talk to your community leads.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.lead}>Quick tips</Text>
          {faqs.map((item, idx) => (
            <View key={item.q} style={[styles.faqRow, idx !== faqs.length - 1 && styles.faqDivider]}>
              <Text style={styles.question}>{item.q}</Text>
              <Text style={styles.answer}>{item.a}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.lead}>Contact</Text>
          <Text style={styles.answer}>Email: eucossake@gmail.com</Text>
          <Text style={styles.answer}>website: eucossa.com</Text>
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
  faqRow: { gap: 6, paddingVertical: 6 },
  faqDivider: { borderBottomWidth: 1, borderBottomColor: '#F1F1F1', paddingBottom: 10 },
  question: { color: DARK, fontSize: 14, fontFamily: 'Nunito_700Bold' },
  answer: { color: '#4A4A4A', fontSize: 13, lineHeight: 18, fontFamily: 'Nunito_600SemiBold' },
});
