import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';

export default function CardsScreen({ onBack = () => {}, onRedeemPoints = () => {} }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cards</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.lead}>EUCOSSA Premium Points</Text>
          <Text style={styles.body}>Your points are earned through participation in club activities (events, community engagement, and contributions).</Text>
          <Text style={styles.body}>Points can later be redeemed for tees and event passes inside the app once payments are automated.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.lead}>How you earn points</Text>

          <View style={styles.pointsRow}>
            <View style={styles.pointsLeft}>
              <Ionicons name="person-add-outline" size={18} color={BRAND_BLUE} />
              <Text style={styles.pointsLabel}>Create an account</Text>
            </View>
            <View style={styles.pointsPill}>
              <Text style={styles.pointsPillText}>+50</Text>
            </View>
          </View>

          <View style={styles.pointsRow}>
            <View style={styles.pointsLeft}>
              <Ionicons name="people-outline" size={18} color={BRAND_BLUE} />
              <Text style={styles.pointsLabel}>Join a community</Text>
            </View>
            <View style={styles.pointsPill}>
              <Text style={styles.pointsPillText}>+10</Text>
            </View>
          </View>

          <View style={styles.pointsRow}>
            <View style={styles.pointsLeft}>
              <Ionicons name="create-outline" size={18} color={BRAND_BLUE} />
              <Text style={styles.pointsLabel}>Create a post</Text>
            </View>
            <View style={styles.pointsPill}>
              <Text style={styles.pointsPillText}>+15</Text>
            </View>
          </View>

          <View style={styles.pointsRow}>
            <View style={styles.pointsLeft}>
              <Ionicons name="arrow-up-circle-outline" size={18} color={BRAND_BLUE} />
              <Text style={styles.pointsLabel}>Get an upvote</Text>
            </View>
            <View style={styles.pointsPill}>
              <Text style={styles.pointsPillText}>+11</Text>
            </View>
          </View>

          <View style={[styles.pointsRow, { marginBottom: 0 }]}
          >
            <View style={styles.pointsLeft}>
              <Ionicons name="arrow-down-circle-outline" size={18} color={BRAND_BLUE} />
              <Text style={styles.pointsLabel}>Get a downvote</Text>
            </View>
            <View style={[styles.pointsPill, styles.pointsPillNegative]}>
              <Text style={styles.pointsPillText}>-29</Text>
            </View>
          </View>

          <Text style={styles.smallNote}>Points update automatically after posts and votes.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.lead}>How redemption will work</Text>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>1</Text>
            <Text style={styles.stepText}>Earn points by attending events and contributing to community discussions.</Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>2</Text>
            <Text style={styles.stepText}>Use points to unlock discounts and claim rewards (tees, passes).</Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNum}>3</Text>
            <Text style={styles.stepText}>We will confirm eligibility automatically once the gateway integration is live.</Text>
          </View>

          <TouchableOpacity style={styles.redeemLink} activeOpacity={0.9} onPress={onRedeemPoints}>
            <Text style={styles.redeemLinkText}>Redeem points</Text>
            <Ionicons name="chevron-forward" size={16} color={BRAND_BLUE} />
          </TouchableOpacity>
        </View>

        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={18} color={BRAND_BLUE} />
          <Text style={styles.noteText}>This is a preview feature. Final rules and rewards may change as EUCOSSA evolves.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
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
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: DARK, fontSize: 20, fontFamily: 'Nunito_700Bold' },
  headerSpacer: { width: 40, height: 40 },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  card: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  lead: { color: DARK, fontSize: 16, fontFamily: 'Nunito_700Bold' },
  body: { color: '#4A4A4A', fontSize: 13, lineHeight: 18, fontFamily: 'Nunito_600SemiBold' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF3FF',
    borderWidth: 1,
    borderColor: '#DCE3FF',
    textAlign: 'center',
    lineHeight: 22,
    color: BRAND_BLUE,
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
  },
  stepText: { flex: 1, color: '#4A4A4A', fontSize: 13, lineHeight: 18, fontFamily: 'Nunito_600SemiBold' },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  pointsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pointsLabel: {
    color: DARK,
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  pointsPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF3FF',
    borderWidth: 1,
    borderColor: '#DCE3FF',
    minWidth: 54,
    alignItems: 'center',
  },
  pointsPillNegative: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
  },
  pointsPillText: {
    color: BRAND_BLUE,
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  smallNote: {
    marginTop: 8,
    color: '#6A6A6A',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  noteBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F6F7FB',
    alignItems: 'center',
  },
  noteText: { flex: 1, color: '#4A4A4A', fontSize: 13, lineHeight: 18, fontFamily: 'Nunito_600SemiBold' },
  redeemLink: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  redeemLinkText: {
    color: BRAND_BLUE,
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
});
