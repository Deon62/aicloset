import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LandingSvg from '../assets/icons/landing.svg';

const BRAND_BLUE = '#1B56FD';

export default function LandingPage({ onContinue = () => {} }) {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.spring(heroAnim, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();
  }, [buttonAnim, headerAnim, heroAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.landingHeader,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.landingName}>Egerton University Computer Science Students Association</Text>
          <Text style={styles.landingTagline}>Where dreaming girnomous is the only rule to success.</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.hero,
            {
              opacity: heroAnim,
              transform: [
                {
                  scale: heroAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <LandingSvg width={320} height={320} />
        </Animated.View>
        <Animated.View
          style={[
            styles.buttonSection,
            {
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={onContinue}>
            <Text style={styles.primaryButtonText}>Join EUCOSSA</Text>
          </TouchableOpacity>
        </Animated.View>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSection: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  landingHeader: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 18,
  },
  landingName: {
    color: '#0B0B0F',
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
  landingTagline: {
    color: '#1D1D1D',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: BRAND_BLUE,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: '100%',
    shadowColor: '#1B56FD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonText: {
    color: '#F8FFF4',
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
  },
});

