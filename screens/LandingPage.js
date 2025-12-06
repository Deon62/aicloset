import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';

export default function LandingPage({ onContinueWithEmail, onLogin }) {
  return (
    <ImageBackground 
      source={require('../assets/lock.png')} 
      style={styles.container}
      resizeMode="cover"
      imageStyle={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay} />
        <View style={styles.content}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Welcome to Nimo</Text>
          <Text style={styles.subtitle}>Secure loans with what you own</Text>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={onContinueWithEmail}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue with Email</Text>
          </TouchableOpacity>
          
          {/* Login Button */}
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={onLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.9,
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Nunito_400Regular',
    color: '#333333',
    textAlign: 'center',
  },
  buttonSection: {
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: '#6D9773',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    alignSelf: 'center',
    width: 200,
    shadowColor: '#6D9773',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  loginButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 200,
    shadowColor: '#0D0D0D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

