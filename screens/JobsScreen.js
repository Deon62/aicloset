import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import JobsIcon from '../assets/icons/jobs.svg';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';
const REQUEST_EMAIL = 'eucossake@gmail.com';

export default function JobsScreen({ onBack = () => {} }) {
  const clubs = useMemo(
    () => [
      {
        id: 'ieee',
        name: 'IEEE Student Branch',
        description: 'Engineering community for networking, talks, and hands-on technical activities.',
        link: 'https://www.ieee.org/',
      },
      {
        id: 'huawei',
        name: 'Huawei ICT Academy',
        description: 'Learn industry-ready networking/cloud skills and access Huawei training opportunities.',
        link: 'https://e.huawei.com/en/talent/#/ict-academy',
      },
      {
        id: 'stellar',
        name: 'Stellar Blockchain',
        description: 'Learn about blockchain and build real-world apps on the Stellar ecosystem.',
        link: 'https://www.stellar.org/',
      },
    ],
    []
  );

  const openRequestEmail = async () => {
    try {
      const url = `mailto:${REQUEST_EMAIL}`;
      const can = await Linking.canOpenURL(url);
      if (!can) {
        Alert.alert('Email not available', 'No email app found on your device.');
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Failed to open', 'Please try again.');
    }
  };

  const openLink = async (url) => {
    try {
      const can = await Linking.canOpenURL(url);
      if (!can) {
        Alert.alert('Link not available', 'Cannot open this link on your device.');
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Failed to open', 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mini Clubs</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.hero}>
            <JobsIcon width={220} height={160} />
            <Text style={styles.heroTitle}>External clubs in EUCOSSA</Text>
            <Text style={styles.heroText}>Explore partner communities and programs you can join alongside EUCOSSA.</Text>
          </View>

          <View style={styles.list}>
            {clubs.map((club) => (
              <TouchableOpacity
                key={club.id}
                style={styles.clubCard}
                activeOpacity={0.9}
                onPress={() => openLink(club.link)}
              >
                <View style={styles.clubTopRow}>
                  <Text style={styles.clubName} numberOfLines={1}>
                    {club.name}
                  </Text>
                  <Ionicons name="open-outline" size={18} color="#5A5A5A" />
                </View>
                <Text style={styles.clubDesc}>{club.description}</Text>
                <Text style={styles.clubLink} numberOfLines={1}>
                  {club.link}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={openRequestEmail}>
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 110,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0,
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
  headerTitle: {
    color: '#0B0B0F',
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 14,
  },
  heroTitle: {
    marginTop: 10,
    color: DARK,
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  heroText: {
    marginTop: 8,
    maxWidth: 340,
    color: '#4A4A4A',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold',
  },
  list: {
    marginTop: 6,
    gap: 12,
  },
  clubCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  clubTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  clubName: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  clubDesc: {
    marginTop: 8,
    color: '#4A4A4A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  clubLink: {
    marginTop: 8,
    color: BRAND_BLUE,
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  fab: {
    position: 'absolute',
    right: 26,
    bottom: 28,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
});
