import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import WelcomeIcon from '../assets/icons/welcome.svg';
import EventsIcon from '../assets/icons/events.svg';
import MarketIcon from '../assets/icons/market.svg';
import CommunityIcon from '../assets/icons/community.svg';

const BRAND_BLUE = '#1B56FD';

export default function OnboardingScreen({ onDone = () => {} }) {
  const steps = useMemo(
    () => [
    {
      Icon: WelcomeIcon,
      title: 'Welcome to EUCOSSA',
      body: 'Your CS hub for events, opportunities, and people who actually build.',
    },
    {
      Icon: EventsIcon,
      title: 'Events that Matter',
      body: 'Hackathons, workshops, talks  know what’s happening before everyone else.',
    },
    {
      Icon: MarketIcon,
      title: 'Student Marketplace',
      body: 'Get your tech gear at student friendly prices. No middlemen.',
    },
    {
      Icon: CommunityIcon,
      title: 'Build with Others',
      body: 'Find teammates, share ideas, and turn side projects into real things.',
    },

    ],
    []
  );

  const [stepIndex, setStepIndex] = useState(0);
  const isLast = stepIndex === steps.length - 1;
  const canGoBack = stepIndex > 0;

  const step = steps[stepIndex];
  const StepIcon = step?.Icon;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <View style={styles.topRowSpacer} />
          <TouchableOpacity style={styles.skipButton} activeOpacity={0.8} onPress={onDone}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressRow}>
          {steps.map((_, idx) => {
            const active = idx === stepIndex;
            return <View key={idx} style={[styles.dot, active && styles.dotActive]} />;
          })}
        </View>

        <View style={styles.hero}>
          {StepIcon ? (
            <View style={styles.iconWrap}>
              <StepIcon width={160} height={160} />
            </View>
          ) : null}
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.body}>{step.body}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            {canGoBack ? (
              <TouchableOpacity
                style={styles.bottomBackButton}
                activeOpacity={0.85}
                onPress={() => setStepIndex((v) => Math.max(0, v - 1))}
              >
                <Ionicons name="arrow-back" size={18} color="#0B0B0F" />
              </TouchableOpacity>
            ) : (
              <View style={styles.bottomBackSpacer} />
            )}

            <TouchableOpacity
              style={styles.nextButton}
              activeOpacity={0.9}
              onPress={() => {
                if (isLast) {
                  onDone();
                  return;
                }
                setStepIndex((v) => Math.min(steps.length - 1, v + 1));
              }}
            >
              <Text style={styles.nextButtonText}>&gt;</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topRowSpacer: {
    width: 1,
    height: 1,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D8DDEA',
  },
  dotActive: {
    width: 18,
    backgroundColor: BRAND_BLUE,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 12,
    paddingTop: 16,
    maxWidth: Math.min(Dimensions.get('window').width - 48, 520),
    alignSelf: 'center',
  },
  iconWrap: {
    alignSelf: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
  },
  body: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 22,
    fontFamily: 'Nunito_400Regular',
  },
  footer: {
    paddingBottom: 12,
    alignItems: 'stretch',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBackSpacer: {
    width: 46,
    height: 46,
  },
  bottomBackButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  nextButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    marginTop: -2,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  skipText: {
    color: '#5A5A5A',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
});
