import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../ui/tokens';

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
                <Ionicons name="arrow-back" size={18} color={COLORS.text} />
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
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    padding: SPACING.l,
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
    gap: SPACING.s,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.s,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderStrong,
  },
  dotActive: {
    width: 18,
    backgroundColor: COLORS.brand,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: SPACING.s,
    paddingTop: SPACING.m,
    maxWidth: Math.min(Dimensions.get('window').width - 48, 520),
    alignSelf: 'center',
  },
  iconWrap: {
    alignSelf: 'center',
    marginBottom: 6,
  },
  title: {
    ...TYPE.title,
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    ...TYPE.body,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    paddingBottom: SPACING.s,
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
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nextButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.brand,
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
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skipText: {
    ...TYPE.caption,
  },
});
