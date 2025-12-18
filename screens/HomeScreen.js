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
  onOpenJobs = () => {},
  onOpenResources = () => {},
  onOpenProjects = () => {},
  onOpenStartups = () => {},
  onOpenEvents = () => {
    Alert.alert('Event', 'Coming soon.');
  },
  onRedeemPoints = () => {
    Alert.alert('Redeem Points', 'Rewards are coming soon.');
  },
  onRefresh = async () => {},
  profileVersion = 0,
}) {
  const [profile, setProfile] = useState({
    photoUri: '',
    name: '',
    course: '',
    year: '',
    bio: '',
    github: '',
    points: 0,
  });
  const [showPoints, setShowPoints] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileBooted, setProfileBooted] = useState(false);

  useEffect(() => {
    if (loading) setProfileBooted(false);
  }, [loading]);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const [storedPhoto, entries] = await Promise.all([
          AsyncStorage.getItem('@profile_photo_uri'),
          AsyncStorage.multiGet(['@profile_name', '@profile_course', '@profile_year', '@profile_bio', '@profile_github', '@profile_points']),
        ]);
        const map = Object.fromEntries(entries);
        const normalizedPhoto = String(storedPhoto || '').trim() || PRESET_AVATARS[0];
        const p = Number(String(map['@profile_points'] || '').replace(/[^0-9-]/g, ''));
        if (!mounted) return;
        setProfile({
          photoUri: normalizedPhoto,
          name: map['@profile_name'] || '',
          course: map['@profile_course'] || '',
          year: map['@profile_year'] || '',
          bio: map['@profile_bio'] || '',
          github: map['@profile_github'] || '',
          points: Number.isFinite(p) ? p : 0,
        });
      } catch (e) {
        console.warn('Failed to load profile photo', e);
      } finally {
        if (mounted) setProfileBooted(true);
      }
    };
    loadProfile();
    return () => {
      mounted = false;
    };
  }, [profileVersion]);

  if (loading || !profileBooted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={[styles.skeletonBlock, { height: 44, width: 120, borderRadius: 12 }]} />
              <View style={[styles.skeletonCircle, { width: 34, height: 34 }]} />
            </View>
            <View style={[styles.skeletonBlock, { height: 22, width: 220, marginTop: 8 }]} />
            <View style={[styles.skeletonBlock, { height: 14, width: '86%' }]} />
          </View>

          <View style={[styles.skeletonBlock, { height: 14, width: 220, borderRadius: 8, marginTop: 6 }]} />
          <View style={[styles.premiumCard, { backgroundColor: '#0B0B0F' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <View style={{ flex: 1, gap: 8 }}>
                <View style={[styles.skeletonBlockDark, { height: 12, width: 120 }]} />
                <View style={[styles.skeletonBlockDark, { height: 18, width: 170 }]} />
                <View style={[styles.skeletonBlockDark, { height: 14, width: 110 }]} />
                <View style={[styles.skeletonBlockDark, { height: 14, width: 140 }]} />
              </View>
              <View style={{ width: 90, alignItems: 'flex-end', gap: 10 }}>
                <View style={[styles.skeletonBlockDark, { height: 12, width: 70 }]} />
                <View style={[styles.skeletonBlockDark, { height: 26, width: 80 }]} />
              </View>
            </View>
            <View style={[styles.skeletonBlockDark, { height: 12, width: '70%', alignSelf: 'center', marginTop: 6 }]} />
          </View>

          <View style={{ alignItems: 'center' }}>
            <View style={[styles.skeletonBlock, { height: 14, width: 130, borderRadius: 8 }]} />
          </View>

          <View style={[styles.card, styles.cardAccent, styles.eventCard]}>
            <View style={styles.eventRow}>
              <View style={[styles.skeletonBlock, { width: 92, height: 92, borderRadius: 16 }]} />
              <View style={{ flex: 1, gap: 10 }}>
                <View style={[styles.skeletonBlock, { height: 12, width: 90 }]} />
                <View style={[styles.skeletonBlock, { height: 16, width: '75%' }]} />
                <View style={[styles.skeletonBlock, { height: 12, width: '85%' }]} />
                <View style={[styles.skeletonBlock, { height: 12, width: '65%' }]} />
              </View>
            </View>
          </View>

          <View style={[styles.card, styles.extrasCard]}>
            <View style={styles.extrasItem}>
              <View style={[styles.skeletonCircle, { width: 34, height: 34 }]} />
              <View style={[styles.skeletonBlock, { height: 12, width: 44 }]} />
            </View>
            <View style={styles.extrasItem}>
              <View style={[styles.skeletonCircle, { width: 34, height: 34 }]} />
              <View style={[styles.skeletonBlock, { height: 12, width: 70 }]} />
            </View>
            <View style={styles.extrasItem}>
              <View style={[styles.skeletonCircle, { width: 34, height: 34 }]} />
              <View style={[styles.skeletonBlock, { height: 12, width: 62 }]} />
            </View>
            <View style={styles.extrasItem}>
              <View style={[styles.skeletonCircle, { width: 34, height: 34 }]} />
              <View style={[styles.skeletonBlock, { height: 12, width: 62 }]} />
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
          <Text style={styles.title}>Hello {profile.name || MOCK_NAME} 🖐</Text>
          <Text style={styles.subtitle}>welcome to Your Eucossa Account</Text>
        </View>

        <Text style={styles.sectionTitle}>EUCOSSA Premium Members Card</Text>

        <View style={styles.premiumCard}>
          <View style={styles.premiumTopRow}>
            <View style={styles.premiumLeft}>
              <Text style={styles.premiumLabel}>EUCOSSA Premium</Text>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#E5E7FF" />
                <Text style={styles.premiumName}>{profile.name || MOCK_NAME}</Text>
              </View>
              <View style={styles.premiumGithubRow}>
                <Ionicons name="logo-github" size={16} color="#E5E7FF" />
                <Text style={styles.premiumGithubText}>{profile.github || 'EUCOSSA'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={16} color="#E5E7FF" />
                <Text style={styles.premiumMeta}>{profile.course || MOCK_COURSE}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#E5E7FF" />
                <Text style={styles.premiumMeta}>{profile.year || MOCK_YEAR}</Text>
              </View>
            </View>
            <View style={styles.premiumRight}>
              <View style={styles.pointsRow}>
                <Text style={styles.pointsLabel}>Points</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPoints((v) => !v)}>
                  <Ionicons name={showPoints ? 'eye' : 'eye-off'} size={18} color="#E5E7FF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.pointsValue}>{showPoints ? profile.points.toLocaleString() : '••••'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.redeemBtn}
            activeOpacity={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onRedeemPoints();
            }}
          >
            <Text style={styles.redeemBtnText}>Redeem Points</Text>
            <Ionicons name="chevron-forward" size={18} color="#0B0B0F" />
          </TouchableOpacity>
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
              <View style={styles.eventTitleRow}>
                <Text style={styles.cardHeadline} numberOfLines={1}>
                  {EVENT_TITLE}
                </Text>
                <View style={styles.upcomingTag}>
                  <Text style={styles.upcomingTagText}>Upcoming</Text>
                </View>
              </View>

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

              <TouchableOpacity style={styles.viewEventBtn} activeOpacity={0.9} onPress={onOpenEvents}>
                <Ionicons name="grid-outline" size={16} color={BRAND_BLUE} />
                <Text style={styles.viewEventBtnText}>View event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <Text style={styles.sectionTitle}>Extras</Text> */}

        <View style={[styles.card, styles.extrasCard]}>
          <TouchableOpacity style={styles.extrasItem} activeOpacity={0.85} onPress={onOpenJobs}
          >
            <View style={styles.extrasIconWrap}>
              <Ionicons name="briefcase-outline" size={22} color={DARK} />
            </View>
            <Text style={styles.extrasLabel}>Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.extrasItem} activeOpacity={0.85} onPress={onOpenResources}
          >
            <View style={styles.extrasIconWrap}>
              <Ionicons name="book-outline" size={22} color={DARK} />
            </View>
            <Text style={styles.extrasLabel}>Resources</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.extrasItem} activeOpacity={0.85} onPress={onOpenProjects}
          >
            <View style={styles.extrasIconWrap}>
              <Ionicons name="code-slash-outline" size={22} color={DARK} />
            </View>
            <Text style={styles.extrasLabel}>Projects</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.extrasItem} activeOpacity={0.85} onPress={onOpenStartups}
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
  skeletonBlock: {
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
  },
  skeletonCircle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 999,
  },
  skeletonBlockDark: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 10,
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
  redeemBtn: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7FF',
  },
  redeemBtnText: {
    color: '#0B0B0F',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
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
    height: 132,
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
    paddingVertical: 8,
    paddingRight: 14,
    gap: 4,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  upcomingTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#EEF3FF',
    borderWidth: 1,
    borderColor: '#DCE3FF',
  },
  upcomingTagText: {
    color: BRAND_BLUE,
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
  },
  eventMetaList: {
    marginTop: 4,
    gap: 4,
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
  viewEventBtn: {
    marginTop: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
  },
  viewEventBtnText: {
    color: BRAND_BLUE,
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
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
