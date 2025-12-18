import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import WifiSvg from '../assets/icons/wifi.svg';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

export default function OfflineScreen({ onRetry = () => {} }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.illustrationWrap}>
          <WifiSvg width={240} height={240} />
        </View>

        <Text style={styles.title}>You're offline</Text>
        <Text style={styles.subtitle}>Check your connection and try again.</Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.retryBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onRetry();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationWrap: {
    marginBottom: 18,
  },
  title: {
    color: DARK,
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: '#5A5A5A',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 18,
    backgroundColor: BRAND_BLUE,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
