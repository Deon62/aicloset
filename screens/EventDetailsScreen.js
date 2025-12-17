import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Alert, FlatList, StatusBar, Modal, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BLUE = '#1B56FD';
const DARK = '#1D1D1D';

let WebView = null;
try {
  WebView = require('react-native-webview').WebView;
} catch (e) {
  WebView = null;
}

let NavigationBar = null;
try {
  NavigationBar = require('expo-navigation-bar');
} catch (e) {
  NavigationBar = null;
}

export default function EventDetailsScreen({ event, onBack = () => {}, onRegister = () => {}, onAddToCalendar = () => {} }) {
  const insets = useSafeAreaInsets();
  const width = Dimensions.get('window').width;
  const { height: screenHeight } = Dimensions.get('window');
  const HERO_HEIGHT = Math.min(420, Math.floor(screenHeight * 0.42));
  const [activeIndex, setActiveIndex] = useState(0);
  const [mapOpen, setMapOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const run = async () => {
      if (!mapOpen) return;
      if (Platform.OS === 'android' && NavigationBar?.setVisibilityAsync) {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
        } catch (e) {
          // ignore
        }
      }
    };

    run();

    return () => {
      if (Platform.OS === 'android' && NavigationBar?.setVisibilityAsync) {
        NavigationBar.setVisibilityAsync('visible').catch(() => {});
      }
    };
  }, [mapOpen]);

  const requirements = useMemo(() => {
    const list = event?.requirements;
    if (Array.isArray(list) && list.length > 0) return list;
    return [];
  }, [event]);

  const leafletHtml = useMemo(() => {
    const lat = -0.3721;
    const lng = 35.9469;
    return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body { height: 100%; margin: 0; padding: 0; background: #ffffff; }
      #map { height: 100%; width: 100%; }
      .leaflet-control-attribution { display: none; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${lat}, ${lng}], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);
      L.marker([${lat}, ${lng}]).addTo(map).bindPopup('Egerton University, Njoro').openPopup();
      setTimeout(() => { map.invalidateSize(); }, 250);
    </script>
  </body>
</html>`;
  }, []);

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
              renderItem={({ item }) => {
                const source = typeof item === 'string' ? { uri: item } : item;
                return (
                  <View style={[styles.heroSlide, { width, height: HERO_HEIGHT }]}>
                    <Image source={source} style={[styles.heroImage, { height: HERO_HEIGHT }]} resizeMode="cover" />
                  </View>
                );
              }}
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

          {requirements.length > 0 ? (
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              <View style={styles.requirementsList}>
                {requirements.map((item, idx) => (
                  <View key={`${idx}-${String(item)}`} style={styles.requirementRow}>
                    <View style={styles.requirementDot} />
                    <Text style={styles.requirementText}>{String(item)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            {event?.venueHint ? <Text style={styles.venueHint}>{event.venueHint}</Text> : null}
            {WebView ? (
              <View style={styles.mapWrap}>
                <TouchableOpacity style={styles.mapExpandBtn} activeOpacity={0.9} onPress={() => setMapOpen(true)}>
                  <Ionicons name="expand-outline" size={18} color={DARK} />
                </TouchableOpacity>
                <WebView
                  originWhitelist={['*']}
                  source={{ html: leafletHtml }}
                  style={styles.mapWeb}
                  scrollEnabled={false}
                />
              </View>
            ) : (
              <View style={styles.mapFallback}>
                <Ionicons name="map-outline" size={18} color="#4A4A4A" />
                <Text style={styles.mapOverlayText}>Install react-native-webview to enable the map</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <Modal
          visible={mapOpen}
          animationType="slide"
          onRequestClose={() => setMapOpen(false)}
          presentationStyle="fullScreen"
          statusBarTranslucent
        >
          <View style={styles.mapModalSafe}>
            <StatusBar hidden />
            {WebView ? (
              <View style={styles.mapModalBody}>
                <TouchableOpacity
                  style={[styles.mapModalClose, { top: (insets.top || 0) + 12 }]}
                  activeOpacity={0.9}
                  onPress={() => setMapOpen(false)}
                >
                  <Ionicons name="close" size={22} color={DARK} />
                </TouchableOpacity>
                <WebView originWhitelist={['*']} source={{ html: leafletHtml }} style={styles.mapModalWeb} />
              </View>
            ) : (
              <View style={styles.mapFallback}>
                <Ionicons name="map-outline" size={18} color="#4A4A4A" />
                <Text style={styles.mapOverlayText}>Install react-native-webview to enable the map</Text>
              </View>
            )}
          </View>
        </Modal>

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
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
    marginTop: 2,
  },
  description: {
    color: '#4A4A4A',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
  venueHint: {
    color: '#4A4A4A',
    fontSize: 13,
    lineHeight: 18,
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
  requirementsList: {
    gap: 8,
    marginTop: 6,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  requirementDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: BRAND_BLUE,
    marginTop: 7,
  },
  requirementText: {
    flex: 1,
    color: '#4A4A4A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_400Regular',
  },
  mapWrap: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    overflow: 'hidden',
    height: 220,
    backgroundColor: '#FFFFFF',
  },
  mapExpandBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 5,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapWeb: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapFallback: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  mapOverlayText: {
    color: '#4A4A4A',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  mapModalSafe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapModalClose: {
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
  mapModalBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapModalWeb: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
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
