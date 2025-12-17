import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Alert, FlatList, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BLUE = '#1B56FD';
const DARK = '#1D1D1D';

export default function EventDetailsScreen({ event, onBack = () => {}, onRegister = () => {}, onAddToCalendar = () => {} }) {
  const insets = useSafeAreaInsets();
  const width = Dimensions.get('window').width;
  const { height: screenHeight } = Dimensions.get('window');
  const HERO_HEIGHT = Math.min(420, Math.floor(screenHeight * 0.42));
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const images = useMemo(() => {
    const input = event?.images;
    if (Array.isArray(input) && input.length > 0) return input;
    if (event?.image) return [event.image];
    return [];
  }, [event]);

  const handleRegister = () => {
    if (typeof onRegister === 'function') {
      onRegister(event);
      return;
    }
    Alert.alert('Register', 'Registration flow not configured yet.');
  };

  const handleAddToCalendar = () => {
    if (typeof onAddToCalendar === 'function') {
      onAddToCalendar(event);
      return;
    }
    Alert.alert('Add to calendar', 'Calendar integration not configured yet.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.backBtn, { top: (insets.top || 0) + 12 }]}
          activeOpacity={0.85}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={20} color={DARK} />
        </TouchableOpacity>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: (insets.bottom || 0) + 120 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.carouselWrap}>
            <FlatList
              ref={scrollRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, idx) => `${event?.id || 'event'}-img-${idx}`}
              renderItem={({ item }) => (
                <View style={[styles.heroSlide, { width, height: HERO_HEIGHT }]}>
                  <Image source={item} style={[styles.heroImage, { height: HERO_HEIGHT }]} resizeMode="cover" />
                </View>
              )}
              onMomentumScrollEnd={(e) => {
                const x = e.nativeEvent.contentOffset.x;
                const idx = Math.round(x / width);
                setActiveIndex(Math.max(0, Math.min(images.length - 1, idx)));
              }}
            />

            {images.length > 1 ? (
              <View style={styles.dotsRow}>
                {images.map((_, idx) => (
                  <View key={idx} style={[styles.dot, idx === activeIndex && styles.dotActive]} />
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.title}>{event?.title || 'Event'}</Text>
            {event?.description ? <Text style={styles.description}>{event.description}</Text> : null}

            <View style={styles.metaList}>
              {event?.date ? (
                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.metaText}>{event.date}</Text>
                </View>
              ) : null}
              {event?.location ? (
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.metaText}>{event.location}</Text>
                </View>
              ) : null}
              {event?.price ? (
                <View style={styles.metaRow}>
                  <Ionicons name="pricetag-outline" size={16} color="#5A5A5A" />
                  <Text style={styles.metaText}>{event.price}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>

        <View style={styles.stickyBar}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9} onPress={handleAddToCalendar}>
            <Ionicons name="calendar" size={16} color={DARK} />
            <Text style={styles.secondaryButtonText}>Add to calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 0,
    gap: 16,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselWrap: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  heroSlide: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    backgroundColor: '#E5E5E5',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  dotActive: {
    backgroundColor: BRAND_BLUE,
  },
  detailsSection: {
    paddingHorizontal: 24,
    paddingTop: 14,
    gap: 10,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
  },
  description: {
    color: '#4A4A4A',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
  metaList: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaText: {
    color: '#5A5A5A',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  stickyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: 'rgba(255,255,255,0.96)',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: BRAND_BLUE,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  secondaryButtonText: {
    color: DARK,
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
