import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BLUE = '#1B56FD';

export default function EventsScreen({ onOpenPastEvents = () => {}, onOpenEvent = () => {} }) {
  const events = useMemo(
    () => [
      {
        id: 'web-basics',
        title: 'Workshop: Web Development Basics',
        description: 'Hands-on session covering HTML, CSS, and JavaScript fundamentals.',
        date: 'Friday · 3:30 PM',
        location: 'Computer Lab',
        price: 'Free',
        image: require('../assets/tech.png'),
        images: [require('../assets/tech.png'), require('../assets/tech.png')],
      },
      {
        id: 'git-github',
        title: 'Hackathon Prep: Git + GitHub',
        description: 'Learn collaboration workflows: branches, PRs, and code reviews.',
        date: 'Next Wednesday · 4:00 PM',
        location: 'ICT Lab',
        price: 'Free',
        image: require('../assets/tech.png'),
        images: [require('../assets/tech.png'), require('../assets/tech.png')],
      },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Events</Text>
          <View style={styles.headerActions}>
            <Ionicons
              name="albums-outline"
              size={20}
              color="#1D1D1D"
              onPress={onOpenPastEvents}
              suppressHighlighting
            />
          </View>
        </View>
        <Text style={styles.subtitle}>
          Upcoming sessions, workshops, and competitions.
        </Text>

        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[styles.card, styles.cardAccent, styles.eventCard]}
            activeOpacity={0.9}
            onPress={() => onOpenEvent(event)}
          >
            <Image source={event.image} style={styles.eventHeroImage} resizeMode="cover" />
            <View style={styles.eventInfo}>
              <Text style={styles.cardHeadline}>{event.title}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>

              <View style={styles.eventMetaList}>
                <View style={styles.eventMetaRow}>
                  <Ionicons name="calendar-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.eventMetaText}>{event.date}</Text>
                </View>
                <View style={styles.eventMetaRow}>
                  <Ionicons name="location-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.eventMetaText}>{event.location}</Text>
                </View>
                <View style={styles.eventMetaRow}>
                  <Ionicons name="pricetag-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.eventMetaText}>{event.price}</Text>
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
    gap: 10,
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
