import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BLUE = '#1B56FD';
const DARK = '#1D1D1D';
const PRESET_AVATARS = [
  'https://jfsyjlekhfyymunvsvcs.supabase.co/storage/v1/object/public/avatars/female.jpg',
  'https://jfsyjlekhfyymunvsvcs.supabase.co/storage/v1/object/public/avatars/female1.jpg',
  'https://jfsyjlekhfyymunvsvcs.supabase.co/storage/v1/object/public/avatars/male.jpg',
  'https://jfsyjlekhfyymunvsvcs.supabase.co/storage/v1/object/public/avatars/male1.jpg',
];

const MOCK_NAME = 'Deon Student';
const MOCK_COURSE = 'Computer Science';
const MOCK_ROLE = 'Member';
const MOCK_YEAR = 'Year 2';
const MOCK_BIO = 'Interested in building web apps and joining hackathons.';
const MOCK_GITHUB = 'deon62';

const EVENT_TITLE = 'Hack Egerton';
const EVENT_DESCRIPTION =
  'A hybrid innovation sprint focused on AI, blockchain, and hardware. Virtual phase runs Jan 1–Feb 25 (mentorship + online challenges), with an in-person finale Feb 26–28 at Arc Hotel, Egerton.';
const EVENT_DATE = 'Jan 1st – Feb 28th';
const EVENT_LOCATION = 'Arc Hotel, Egerton';
const EVENT_PRICE = 'KSh 300';
const EVENT_POSTER = 'https://gfckrsileizyfyawanvh.supabase.co/storage/v1/object/public/eventspics/hackegerton.png';

export default function HomeScreen({
  loading = false,
  onOpenNotifications = () => {},
  onOpenProfile = () => {},
  profileVersion = 0,
}) {
  const [photoUri, setPhotoUri] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const storedPhoto = (await AsyncStorage.getItem('@profile_photo_uri')) || '';
        const normalizedPhoto = storedPhoto.trim() || PRESET_AVATARS[0];
        if (!mounted) return;
        setPhotoUri(normalizedPhoto);

        const entries = await AsyncStorage.multiGet(['@profile_name', '@profile_course', '@profile_year', '@profile_bio', '@profile_github']);
        const map = Object.fromEntries(entries);
        if (!mounted) return;
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
    return () => {
      mounted = false;
      setPhotoUri('');
      setName('');
      setCourse('');
      setYear('');
      setBio('');
      setGithub('');
    };
  }, [profileVersion]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { gap: 12 }]}>
          <View style={styles.header}>
            <View style={[styles.skeletonBlock, { height: 24, width: 220, marginBottom: 8 }]} />
            <View style={[styles.skeletonBlock, { height: 14, width: '80%' }]} />
          </View>
          <View style={[styles.card, styles.profileCard]}>
            <View style={styles.profileRow}>
              <View style={[styles.avatarWrap, styles.skeletonBlock]} />
              <View style={{ flex: 1, gap: 8 }}>
                <View style={[styles.skeletonBlock, { height: 14, width: '60%' }]} />
                <View style={[styles.skeletonBlock, { height: 12, width: '40%' }]} />
                <View style={[styles.skeletonBlock, { height: 12, width: '30%' }]} />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.title}>Hello {name || MOCK_NAME} 🖐</Text>
          <Text style={styles.subtitle}>welcome to Egerton University Computer Science Student Association Club</Text>
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
              {bio ? <Text style={styles.profileBio}>{bio}</Text> : null}

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
          <View style={styles.eventRow}>
            <View style={styles.eventPosterWrap}>
              <Image source={{ uri: EVENT_POSTER }} style={styles.eventPosterBlur} resizeMode="cover" blurRadius={14} />
              <Image source={{ uri: EVENT_POSTER }} style={styles.eventPoster} resizeMode="contain" />
            </View>
            <View style={styles.eventMain}>
              <Text style={styles.cardTitle}>Next event</Text>
              <Text style={styles.cardHeadline}>{EVENT_TITLE}</Text>

              <View style={styles.eventMetaList}>
                <View style={styles.eventMetaRow}>
                  <Ionicons name="calendar-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.eventMetaText} numberOfLines={2}>
                    {EVENT_DATE}
                  </Text>
                </View>
                <View style={styles.eventMetaRow}>
                  <Ionicons name="location-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.eventMetaText} numberOfLines={1}>
                    {EVENT_LOCATION}
                  </Text>
                </View>
                <View style={styles.eventMetaRow}>
                  <Ionicons name="pricetag-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.eventMetaText} numberOfLines={1}>
                    {EVENT_PRICE}
                  </Text>
                </View>
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
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventPosterWrap: {
    width: 120,
    height: 150,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  eventPosterBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    transform: [{ scale: 1.08 }],
  },
  eventPoster: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  eventMain: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 14,
    gap: 6,
  },
  eventMetaList: {
    marginTop: 8,
    gap: 6,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  eventMetaText: {
    flex: 1,
    color: '#5A5A5A',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
});
