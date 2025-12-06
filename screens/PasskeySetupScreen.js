import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export default function PasskeySetupScreen({ onSetupComplete, onSkip, userEmail }) {
  const [isLoading, setIsLoading] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setIsSupported(compatible && enrolled);
      
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('face');
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('fingerprint');
      } else {
        setBiometricType('biometric');
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setIsSupported(false);
    }
  };

  const setupPasskey = async () => {
    if (!isSupported) {
      Alert.alert(
        'Biometric Not Available',
        'Your device does not support biometric authentication or no biometric data is enrolled.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Set up your passkey',
        subtitle: 'Use your biometric to create a secure passkey',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        // Store passkey credentials securely
        const passkeyData = {
          email: userEmail,
          createdAt: new Date().toISOString(),
          enabled: true,
        };

        await SecureStore.setItemAsync('passkey_credentials', JSON.stringify(passkeyData));
        await SecureStore.setItemAsync('passkey_enabled', 'true');

        Alert.alert(
          'Passkey Created!',
          'Your passkey has been successfully set up. You can now use biometric authentication for quick login.',
          [
            {
              text: 'Great!',
              onPress: () => onSetupComplete(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Setup Failed',
          'Passkey setup was cancelled or failed. You can set it up later in settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Passkey setup error:', error);
      Alert.alert(
        'Setup Error',
        'There was an error setting up your passkey. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getBiometricIcon = () => {
    switch (biometricType) {
      case 'face':
        return 'scan';
      case 'fingerprint':
        return 'finger-print';
      default:
        return 'shield-checkmark';
    }
  };

  const getBiometricText = () => {
    switch (biometricType) {
      case 'face':
        return 'Face ID';
      case 'fingerprint':
        return 'Fingerprint';
      default:
        return 'Biometric';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Set up Passkey</Text>
          <Text style={styles.subtitle}>
            Enable quick and secure login with {getBiometricText().toLowerCase()}
          </Text>
        </View>

        {/* Biometric Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons 
              name={getBiometricIcon()} 
              size={80} 
              color="#6D9773" 
            />
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Ionicons name="flash" size={24} color="#6D9773" />
            <Text style={styles.benefitText}>Lightning fast login</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="shield-checkmark" size={24} color="#6D9773" />
            <Text style={styles.benefitText}>Enhanced security</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="lock-closed" size={24} color="#6D9773" />
            <Text style={styles.benefitText}>Your data stays private</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.setupButton, !isSupported && styles.disabledButton]}
            onPress={setupPasskey}
            disabled={isLoading || !isSupported}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.setupButtonText}>
                Set up {getBiometricText()}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>

        {!isSupported && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={20} color="#F57C00" />
            <Text style={styles.warningText}>
              Biometric authentication is not available on this device
            </Text>
          </View>
        )}
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  benefitsContainer: {
    marginBottom: 40,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  benefitText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#333333',
    marginLeft: 16,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  setupButton: {
    backgroundColor: '#6D9773',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#6D9773',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    shadowColor: '#CCCCCC',
  },
  setupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#F57C00',
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
  },
});
