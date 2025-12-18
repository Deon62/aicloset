import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Animated, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../ui/tokens';

const BRAND_BLUE = '#1B56FD';

export default function EventsScreen({ onOpenPastEvents = () => {}, onOpenEvent = () => {} }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const searchAnim = useRef(new Animated.Value(0)).current;

  const events = useMemo(
    () => [
      {
        id: 'hack-egerton',
        title: 'Hack Egerton',
        description:
          'Hack Egerton is a hybrid innovation sprint where builders ship real solutions in AI, blockchain, and hardware. The virtual phase runs from Jan 1 to Feb 25 (mentorship, team formation, online challenges), followed by an in-person finale from Feb 26 to Feb 28 at Arc Hotel, Egerton. Come with ideas, leave with a demo—and a network.',
        date: 'Jan 1 – Feb 25 (Virtual) · Feb 26 – Feb 28 (In-person)',
        startAt: new Date('2026-01-01T09:00:00').toISOString(),
        endAt: new Date('2026-02-28T18:00:00').toISOString(),
        location: 'Arc Hotel, Egerton',
        price: 'KSh 300',
        image: {
          uri: 'https://gfckrsileizyfyawanvh.supabase.co/storage/v1/object/public/eventspics/hackegerton.png',
        },
        images: [
          {
            uri: 'https://gfckrsileizyfyawanvh.supabase.co/storage/v1/object/public/eventspics/hackegerton.png',
          },
        ],
        requirements: ['Laptop', 'Internet for virtual phase', 'Team spirit'],
        venueHint: 'Hybrid: Virtual (Jan 1 – Feb 25) · In-person (Feb 26 – Feb 28) at Arc Hotel, Egerton',
      },
    ],
    []
  );

  useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: searchOpen ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished) return;
      if (searchOpen) {
        setTimeout(() => inputRef.current?.focus?.(), 10);
      } else {
        Keyboard.dismiss();
      }
    });
  }, [searchAnim, searchOpen]);

  const filteredEvents = useMemo(() => {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => {
      const hay = `${e?.title || ''} ${e?.description || ''} ${e?.location || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [events, query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Events</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.pastEventsBtn}
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onOpenPastEvents();
              }}
            >
              <Ionicons name="albums-outline" size={20} color="#1D1D1D" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.searchBtn, searchOpen && styles.searchBtnHidden]}
              activeOpacity={0.85}
              onPress={() => {
                setSearchOpen(true);
              }}
              pointerEvents={searchOpen ? 'none' : 'auto'}
            >
              <Ionicons name="search-outline" size={20} color="#1D1D1D" />
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.searchInputWrap,
                {
                  width: searchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 240],
                  }),
                  opacity: searchAnim,
                },
              ]}
              pointerEvents={searchOpen ? 'auto' : 'none'}
            >
              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                placeholder="Search events"
                placeholderTextColor="#8A8A8A"
                style={styles.searchInput}
                returnKeyType="search"
              />

              {query ? (
                <TouchableOpacity style={styles.searchClearBtn} activeOpacity={0.8} onPress={() => setQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#6A6A6A" />
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={styles.searchCloseBtn}
                activeOpacity={0.85}
                onPress={() => {
                  setSearchOpen(false);
                  setQuery('');
                }}
              >
                <Ionicons name="close" size={18} color="#6A6A6A" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Upcoming sessions, workshops, and competitions.
        </Text>

        {filteredEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[styles.card, styles.cardAccent, styles.eventCard]}
            activeOpacity={0.9}
            onPress={() => onOpenEvent(event)}
          >
            <View style={styles.eventHeroWrap}>
              <Image
                source={event.image}
                style={styles.eventHeroBlur}
                resizeMode="cover"
                blurRadius={18}
              />
              <Image source={event.image} style={styles.eventHeroImage} resizeMode="contain" />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.cardHeadline}>{event.title}</Text>

              <View style={styles.eventMetaList}>
                <View style={styles.eventMetaRow}>
                  <Ionicons name="calendar-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.eventMetaText}>
                    {event?.startAt
                      ? new Date(event.startAt).toLocaleString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })
                      : event.date}
                  </Text>
                </View>
                <View style={styles.eventMetaRow}>
                  <Ionicons name="location-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.eventMetaText}>{event.location}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.l,
    gap: SPACING.m,
    paddingBottom: 80,
  },
  title: {
    ...TYPE.title,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    width: 92,
  },
  pastEventsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtn: {
    position: 'absolute',
    right: 46,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  searchBtnHidden: {
    opacity: 0,
  },
  searchInputWrap: {
    position: 'absolute',
    right: 46,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    color: COLORS.text,
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  searchClearBtn: {
    paddingHorizontal: 10,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCloseBtn: {
    paddingHorizontal: 10,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...TYPE.body,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACING.m,
    gap: 8,
  },
  cardAccent: {
    borderColor: '#DCE3FF',
  },
  cardTitle: {
    color: '#0B0B0F',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  cardHeadline: {
    ...TYPE.section,
  },
  eventCard: {
    padding: 0,
    overflow: 'hidden',
  },
  eventHeroWrap: {
    width: '100%',
    height: 360,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  eventHeroBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    transform: [{ scale: 1.08 }],
  },
  eventHeroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  eventInfo: {
    padding: SPACING.m,
    gap: SPACING.s,
  },
  eventMetaList: {
    gap: 8,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventMetaText: {
    ...TYPE.caption,
  },
});
