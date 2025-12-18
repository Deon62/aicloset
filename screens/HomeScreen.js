import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
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
  onOpenCards = () => {},
  onRefresh = async () => {},
  profileVersion = 0,
}) {
  const [photoUri, setPhotoUri] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [showPoints, setShowPoints] = useState(true);
  const [points, setPoints] = useState(0);
  const [github, setGithub] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const storedPhoto = (await AsyncStorage.getItem('@profile_photo_uri')) || '';
        const normalizedPhoto = storedPhoto.trim() || PRESET_AVATARS[0];
        if (!mounted) return;
        setPhotoUri(normalizedPhoto);

        const entries = await AsyncStorage.multiGet(['@profile_name', '@profile_course', '@profile_year', '@profile_bio', '@profile_github', '@profile_points']);
        const map = Object.fromEntries(entries);
        if (!mounted) return;
        setName(map['@profile_name'] || '');
        setCourse(map['@profile_course'] || '');
        setYear(map['@profile_year'] || '');
        setBio(map['@profile_bio'] || '');
        setGithub(map['@profile_github'] || '');
        const p = Number(String(map['@profile_points'] || '').replace(/[^0-9-]/g, ''));
        setPoints(Number.isFinite(p) ? p : 0);
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
      setPoints(0);
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              try {
                setRefreshing(true);
                await onRefresh();
              } finally {
                setRefreshing(false);
              }
            }}
            tintColor={BRAND_BLUE}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.logosRow}>
              <Image source={require('../assets/egerton.png')} style={styles.logo} resizeMode="contain" />
              <View style={styles.logoDivider} />
              <Image source={require('../assets/eucossa.jpg')} style={styles.logo} resizeMode="contain" />
            </View>

            <TouchableOpacity
              style={styles.notBtn}
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onOpenNotifications();
              }}
            >
              <Ionicons name="notifications-outline" size={26} color={DARK} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Hello {name || MOCK_NAME} 🖐</Text>
          <Text style={styles.subtitle}>welcome to Egerton University Computer Science Student Association Club</Text>
        </View>

        <Text style={styles.sectionTitle}>EUCOSSA Premium Members Card</Text>

        <View style={styles.premiumCard}>
          <View style={styles.premiumTopRow}>
            <View style={styles.premiumLeft}>
              <Text style={styles.premiumLabel}>EUCOSSA Premium</Text>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#E5E7FF" />
                <Text style={styles.premiumName}>{name || MOCK_NAME}</Text>
              </View>
              <View style={styles.premiumGithubRow}>
                <Ionicons name="logo-github" size={16} color="#E5E7FF" />
                <Text style={styles.premiumGithubText}>{github || 'EUCOSSA'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={16} color="#E5E7FF" />
                <Text style={styles.premiumMeta}>{course || MOCK_COURSE}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#E5E7FF" />
                <Text style={styles.premiumMeta}>{year || MOCK_YEAR}</Text>
              </View>
            </View>
            <View style={styles.premiumRight}>
              <View style={styles.pointsRow}>
                <Text style={styles.pointsLabel}>Points</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPoints((v) => !v)}>
                  <Ionicons name={showPoints ? 'eye' : 'eye-off'} size={18} color="#E5E7FF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.pointsValue}>{showPoints ? points.toLocaleString() : '••••'}</Text>
            </View>
          </View>
          <Text style={styles.pointsNote}>Use points to redeem tees & event passes</Text>
        </View>

        <TouchableOpacity style={styles.cardLinkOutsideBtn} activeOpacity={0.85} onPress={onOpenCards}>
          <Ionicons name="information-circle-outline" size={16} color="#6A6A6A" />
          <Text style={styles.cardLinkOutsideText}>How card works</Text>
        </TouchableOpacity>

        {/* <Text style={styles.sectionTitle}>Featured event</Text> */}

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

        {/* <Text style={styles.sectionTitle}>Extras</Text> */}

        <View style={[styles.card, styles.extrasCard]}>
          <TouchableOpacity style={styles.extrasItem} activeOpacity={0.85} onPress={() => Alert.alert('Jobs', 'Coming soon.')}
          >
            <View style={styles.extrasIconWrap}>
              <Ionicons name="briefcase-outline" size={22} color={DARK} />
            </View>
            <Text style={styles.extrasLabel}>Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.extrasItem} activeOpacity={0.85} onPress={() => Alert.alert('Resources', 'Coming soon.')}
          >
            <View style={styles.extrasIconWrap}>
              <Ionicons name="book-outline" size={22} color={DARK} />
            </View>
            <Text style={styles.extrasLabel}>Resources</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.extrasItem} activeOpacity={0.85} onPress={() => Alert.alert('Projects', 'Coming soon.')}
          >
            <View style={styles.extrasIconWrap}>
              <Ionicons name="code-slash-outline" size={22} color={DARK} />
            </View>
            <Text style={styles.extrasLabel}>Projects</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.extrasItem} activeOpacity={0.85} onPress={() => Alert.alert('Startups', 'Coming soon.')}
          >
            <View style={styles.extrasIconWrap}>
              <Ionicons name="bulb-outline" size={22} color={DARK} />
            </View>
            <Text style={styles.extrasLabel}>Startups</Text>
          </TouchableOpacity>
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
    paddingBottom: 110,
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
  sectionTitle: {
    marginTop: 4,
    color: '#0B0B0F',
    fontSize: 13,
    letterSpacing: 0.2,
    fontFamily: 'Nunito_700Bold',
  },
  premiumCard: {
    backgroundColor: '#0B0B0F',
    borderWidth: 1,
    borderColor: '#1F1F23',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
  },
  premiumTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  premiumLeft: {
    flex: 1,
    gap: 6,
  },
  premiumRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  premiumLabel: {
    color: '#B3B3FF',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.2,
  },
  premiumName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  premiumMeta: {
    color: '#B8B8B8',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  premiumGithubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  premiumGithubText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsLabel: {
    color: '#E5E7FF',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  pointsValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.5,
  },
  pointsNote: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold',
  },
  cardLinkOutsideBtn: {
    marginTop: -4,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  cardLinkOutsideText: {
    color: '#6A6A6A',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  premiumFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  premiumTag: {
    color: '#C9CCFF',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  premiumBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7FF',
  },
  premiumBtnText: {
    color: '#0B0B0F',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 18,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
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
    backgroundColor: '#FFFFFF',
    borderColor: '#E9EEFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 10,
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
  extrasCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  extrasItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    paddingVertical: 10,
  },
  extrasIconWrap: {
    width: 34,
    height: 34,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extrasLabel: {
    color: DARK,
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Nunito_700Bold',
  },
});
