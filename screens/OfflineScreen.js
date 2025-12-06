import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';

export default function OfflineScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-offline-outline" size={120} color="#999999" />
        </View>
        
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.subtitle}>
          Please check your internet connection and try again
        </Text>
        
        <View style={styles.tipsContainer}>
          <View style={styles.tipItem}>
            <Ionicons name="wifi-outline" size={24} color="#6D9773" />
            <Text style={styles.tipText}>Check your Wi-Fi connection</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="phone-portrait-outline" size={24} color="#6D9773" />
            <Text style={styles.tipText}>Check your mobile data</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="refresh-outline" size={24} color="#6D9773" />
            <Text style={styles.tipText}>The app will reconnect automatically</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  tipsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginLeft: 16,
    flex: 1,
  },
});

