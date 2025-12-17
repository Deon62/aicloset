import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PastEventsScreen({ onBack = () => {} }) {
  const pastEvents = useMemo(
    () => [],
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color="#1D1D1D" />
          </TouchableOpacity>
          <Text style={styles.title}>Past events</Text>
          <View style={styles.headerSpacer} />
        </View>

        {pastEvents.length === 0 ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Past events are on our website</Text>
            <Text style={styles.infoText}>
              This app won’t track past events for now. You can browse all previous events on the EUCOSSA website.
            </Text>

            <TouchableOpacity
              style={styles.infoLinkBtn}
              activeOpacity={0.9}
              onPress={() => Linking.openURL('https://eucossa.com/events')}
            >
              <Text style={styles.infoLinkText}>Browse past events</Text>
              <Ionicons name="open-outline" size={16} color="#1B56FD" />
            </TouchableOpacity>
          </View>
        ) : (
          pastEvents.map((event) => (
            <View key={event.id} style={[styles.card, styles.cardAccent, styles.pastEventCard]}>
              <View style={styles.pastEventRow}>
                <Image source={event.image} style={styles.pastEventThumb} resizeMode="cover" />
                <View style={styles.pastEventInfo}>
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
              </View>
            </View>
          ))
        )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 18,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
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
  cardHeadline: {
    color: '#1D1D1D',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Nunito_700Bold',
  },
  pastEventCard: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  pastEventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pastEventThumb: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E5E5E5',
  },
  pastEventInfo: {
    flex: 1,
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
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 10,
  },
  infoTitle: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  infoText: {
    color: '#6A6A6A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_400Regular',
  },
  infoLinkBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCE3FF',
    backgroundColor: '#EEF3FF',
  },
  infoLinkText: {
    color: '#1B56FD',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
});
