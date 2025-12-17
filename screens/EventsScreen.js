import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Animated, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BLUE = '#1B56FD';

export default function EventsScreen({ onOpenPastEvents = () => {}, onOpenEvent = () => {} }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const searchAnim = useRef(new Animated.Value(0)).current;

  const events = useMemo(
    () => [
      {
        id: 'web-basics',
        title: 'Workshop: Web Development Basics',
        description: 'Hands-on session covering HTML, CSS, and JavaScript fundamentals.',
        date: 'Friday · 3:30 PM',
        startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 90).toISOString(),
        location: 'Computer Lab',
        price: 'Free',
        image: require('../assets/tech.png'),
        images: [require('../assets/tech.png'), require('../assets/tech.png')],
        requirements: ['Laptop (recommended)', 'Basic HTML knowledge', 'Notebook & pen'],
        venueHint: 'Egerton University · Computer Lab (Main Campus)',
      },
      {
        id: 'git-github',
        title: 'Hackathon Prep: Git + GitHub',
        description: 'Learn collaboration workflows: branches, PRs, and code reviews.',
        date: 'Next Wednesday · 4:00 PM',
        startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 90).toISOString(),
        location: 'ICT Lab',
        price: 'Free',
        image: require('../assets/tech.png'),
        images: [require('../assets/tech.png'), require('../assets/tech.png')],
        requirements: ['Laptop', 'Git installed', 'GitHub account'],
        venueHint: 'Egerton University · ICT Lab',
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
            <TouchableOpacity style={styles.pastEventsBtn} activeOpacity={0.85} onPress={onOpenPastEvents}>
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
            <Image source={event.image} style={styles.eventHeroImage} resizeMode="cover" />
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
  title: {
    fontSize: 28,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
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
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    color: '#0B0B0F',
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
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 22,
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
  cardTitle: {
    color: '#0B0B0F',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  cardHeadline: {
    color: '#1D1D1D',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Nunito_700Bold',
  },
  eventCard: {
    padding: 0,
    overflow: 'hidden',
  },
  eventHeroImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#E5E5E5',
  },
  eventInfo: {
    padding: 14,
    gap: 10,
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
    color: '#5A5A5A',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
});
