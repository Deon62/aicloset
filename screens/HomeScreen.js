import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BLUE = '#1B56FD';
const DARK = '#1D1D1D';

const MOCK_NAME = 'Deon Student';
const MOCK_COURSE = 'Computer Science';
const MOCK_ROLE = 'Member';
const MOCK_YEAR = 'Year 2';
const MOCK_BIO = 'Interested in building web apps and joining hackathons.';
const MOCK_GITHUB = 'deon62';

export default function HomeScreen() {
  const [photoUri, setPhotoUri] = useState('');

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const storedPhoto = await AsyncStorage.getItem('@profile_photo_uri');
        if (storedPhoto) setPhotoUri(storedPhoto);
      } catch (e) {
        console.warn('Failed to load profile photo', e);
      }
    };
    loadPhoto();
  }, []);

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

        </View>

        <View style={[styles.card, styles.profileCard]}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarEmpty} />
              )}
            </View>

            <View style={styles.profileMain}>
              <Text style={styles.profileName}>{MOCK_NAME}</Text>
              <Text style={styles.profileCourse}>{MOCK_COURSE}</Text>
              <Text style={styles.profileYear}>{MOCK_YEAR}</Text>
              <Text style={styles.profileBio}>{MOCK_BIO}</Text>

              <View style={styles.githubRow}>
                <Ionicons name="logo-github" size={16} color={DARK} />
                <Text style={styles.githubText}>{MOCK_GITHUB}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.roleTag, styles.metaPillDark]}>
            <Text style={[styles.roleTagText, styles.metaPillTextDark]}>{MOCK_ROLE}</Text>
          </View>
        </View>

        <View style={[styles.card, styles.cardAccent, styles.eventCard]}>
          <Image source={require('../assets/tech.png')} style={styles.eventHeroImage} resizeMode="cover" />
          <View style={styles.eventInfo}>
            <Text style={styles.cardTitle}>Next event</Text>
            <Text style={styles.cardHeadline}>Workshop: Web Development Basics</Text>
            <Text style={styles.cardMeta}>Friday · 3:30 PM · Computer Lab</Text>
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
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  profileCard: {
    paddingTop: 18,
    paddingBottom: 18,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginTop: -2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarEmpty: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5E5',
  },
  profileMain: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  profileCourse: {
    color: '#6A6A6A',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  profileYear: {
    color: '#6A6A6A',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  profileBio: {
    marginTop: 6,
    color: '#4A4A4A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_400Regular',
  },
  githubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  githubText: {
    color: '#1D1D1D',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  metaPillDark: {
    backgroundColor: DARK,
    borderColor: DARK,
  },
  metaPillTextDark: {
    color: '#FFFFFF',
  },
  roleTag: {
    position: 'absolute',
    top: 14,
    right: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  roleTagText: {
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  eventCard: {
    padding: 0,
    overflow: 'hidden',
  },
  eventHeroImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E5E5',
  },
  eventInfo: {
    padding: 18,
    gap: 6,
  },
});
