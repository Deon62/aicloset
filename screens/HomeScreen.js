import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
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

const EVENT_TITLE = 'Workshop: Web Development Basics';
const EVENT_DESCRIPTION = 'Hands-on session covering HTML, CSS, and JavaScript fundamentals.';
const EVENT_DATE = 'Friday · 3:30 PM';
const EVENT_LOCATION = 'Computer Lab';
const EVENT_PRICE = 'Free';

export default function HomeScreen({ onOpenNotifications = () => {}, onOpenProfile = () => {} }) {
  const [photoUri, setPhotoUri] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedPhoto = await AsyncStorage.getItem('@profile_photo_uri');
        if (storedPhoto) setPhotoUri(storedPhoto);

        const entries = await AsyncStorage.multiGet(['@profile_name', '@profile_course', '@profile_year', '@profile_bio', '@profile_github']);
        const map = Object.fromEntries(entries);
        setName(map['@profile_name'] || '');
        setCourse(map['@profile_course'] || '');
        setYear(map['@profile_year'] || '');
        setBio(map['@profile_bio'] || '');
        setGithub(map['@profile_github'] || '');
      } catch (e) {
        console.warn('Failed to load profile photo', e);
      }
    };
    loadProfile();
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

            <TouchableOpacity style={styles.notBtn} activeOpacity={0.85} onPress={onOpenNotifications}>
              <Ionicons name="notifications-outline" size={26} color={DARK} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Hello {name || MOCK_NAME}</Text>
          <Text style={styles.subtitle}>welcome to Egerton Computer Science Student Association Club</Text>
        </View>

        <TouchableOpacity style={[styles.card, styles.profileCard]} activeOpacity={0.85} onPress={onOpenProfile}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarEmpty} />
              )}
            </View>

            <View style={styles.profileMain}>
              <Text style={styles.profileName}>{name || MOCK_NAME}</Text>
              <Text style={styles.profileCourse}>{course || MOCK_COURSE}</Text>
              <Text style={styles.profileYear}>{year || MOCK_YEAR}</Text>
              <Text style={styles.profileBio}>{bio || MOCK_BIO}</Text>

              <View style={styles.githubRow}>
                <Ionicons name="logo-github" size={16} color={DARK} />
                <Text style={styles.githubText}>{github || MOCK_GITHUB}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.roleTag, styles.metaPillDark]}>
            <Text style={[styles.roleTagText, styles.metaPillTextDark]}>{MOCK_ROLE}</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.card, styles.cardAccent, styles.eventCard]}>
          <Image source={require('../assets/tech.png')} style={styles.eventHeroImage} resizeMode="cover" />
          <View style={styles.eventInfo}>
            <Text style={styles.cardTitle}>Next event</Text>
            <Text style={styles.cardHeadline}>{EVENT_TITLE}</Text>
            <Text style={styles.eventDescription}>{EVENT_DESCRIPTION}</Text>

            <View style={styles.eventMetaList}>
              <View style={styles.eventMetaRow}>
                <Ionicons name="calendar-outline" size={16} color="#5A5A5A" />
                <Text style={styles.eventMetaText}>{EVENT_DATE}</Text>
              </View>
              <View style={styles.eventMetaRow}>
                <Ionicons name="location-outline" size={16} color="#5A5A5A" />
                <Text style={styles.eventMetaText}>{EVENT_LOCATION}</Text>
              </View>
              <View style={styles.eventMetaRow}>
                <Ionicons name="pricetag-outline" size={16} color="#5A5A5A" />
                <Text style={styles.eventMetaText}>{EVENT_PRICE}</Text>
              </View>
            </View>
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
  notBtn: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 145,
    backgroundColor: '#E5E5E5',
  },
  eventInfo: {
    padding: 14,
    gap: 5,
  },
  eventDescription: {
    color: '#4A4A4A',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: 'Nunito_400Regular',
    marginTop: 2,
  },
  eventMetaList: {
    marginTop: 8,
    gap: 6,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventMetaText: {
    color: '#5A5A5A',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
});
