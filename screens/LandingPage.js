import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingPage({ onContinue = () => {} }) {
  return (
    <ImageBackground
      source={require('../assets/closet.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay} />
        <View style={styles.container}>
          <View style={styles.spacer} />
          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={onContinue}>
              <Text style={styles.primaryButtonText}>Enter EUCOSSA</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  spacer: {
    flex: 1,
  },
  buttonSection: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#6D9773',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: '100%',
    shadowColor: '#6D9773',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#0B0B0F',
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

