import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../ui/tokens';
import { supabase } from '../lib/supabase';
import { normalizeEventRow } from '../lib/events';

const BRAND_BLUE = '#1B56FD';

export default function EventsScreen({ onOpenPastEvents = () => {}, onOpenEvent = () => {} }) {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingEvents(true);
        setEventsError('');

        const { data, error } = await supabase
          .from('events')
          .select('id, slug, title, summary, description, date_label, start_at, end_at, location, venue_hint, price_label, currency, price_amount, image, images, requirements, status')
          .eq('status', 'published')
          .order('start_at', { ascending: true });

        if (error) throw error;

        const list = Array.isArray(data) ? data.map(normalizeEventRow).filter((e) => e?.id) : [];
        if (mounted) setEvents(list);
      } catch (e) {
        console.warn('Failed to load events', e);
        if (mounted) setEventsError('Failed to load events.');
      } finally {
        if (mounted) setLoadingEvents(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredEvents = useMemo(() => events, [events]);

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
              <Ionicons name="albums-outline" size={28} color="#1D1D1D" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Upcoming sessions, workshops, and competitions.
        </Text>

        {eventsError ? <Text style={styles.subtitle}>{eventsError}</Text> : null}

        {loadingEvents ? (
          <View style={[styles.card, styles.cardAccent]}>
            <Text style={styles.cardHeadline}>Loading events…</Text>
          </View>
        ) : filteredEvents.length === 0 ? (
          <View style={[styles.card, styles.cardAccent]}>
            <Text style={styles.cardHeadline}>No events yet</Text>
            <Text style={styles.subtitle}>Check back soon.</Text>
          </View>
        ) : (
          filteredEvents.map((event) => {
            const hero = event?.image || (Array.isArray(event?.images) ? event.images[0] : null);
            return (
              <TouchableOpacity
                key={event.id}
                style={[styles.card, styles.cardAccent, styles.eventCard]}
                activeOpacity={0.9}
                onPress={() => onOpenEvent(event)}
              >
                {hero ? (
                  <View style={styles.eventHeroWrap}>
                    <Image source={hero} style={styles.eventHeroBlur} resizeMode="cover" blurRadius={18} />
                    <Image source={hero} style={styles.eventHeroImage} resizeMode="contain" />
                  </View>
                ) : null}

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
                    <View style={styles.eventMetaRow}>
                      <Ionicons name="pricetag-outline" size={16} color="#5A5A5A" />
                      <Text style={styles.eventMetaText}>{event.price || 'Free'}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
    width: 44,
  },
  pastEventsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
