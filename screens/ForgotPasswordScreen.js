import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPasswordScreen({ onBack, userEmail }) {
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { resetPassword } = useAuth();

  const maskEmail = (email) => {
    if (!email || !email.includes('@')) return '';
    
    const [localPart, domain] = email.split('@');
    
    // Show first 2 characters and last 2 characters of local part
    if (localPart.length <= 4) {
      // For short emails, show first and last character
      const masked = localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
      return `${masked}@${domain}`;
    } else {
      // For longer emails, show first 2 and last 2 characters
      const masked = localPart.substring(0, 2) + '*'.repeat(localPart.length - 4) + localPart.substring(localPart.length - 2);
      return `${masked}@${domain}`;
    }
  };

  const handleSendResetLink = async () => {
    if (!userEmail) {
      Alert.alert('Error', 'No email address provided.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(userEmail);

      if (result.success) {
        setIsLinkSent(true);
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const maskedEmail = maskEmail(userEmail);

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Back Button */}
      <TouchableOpacity 
        onPress={onBack} 
        style={[styles.backButton, { top: insets.top + 10 }]}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.contentWrapper}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Ionicons 
                name={isLinkSent ? "checkmark-circle" : "mail-outline"} 
                size={64} 
                color={isLinkSent ? "#2E7D32" : "#0D0D0D"} 
              />
            </View>

            <Text style={styles.title}>
              {isLinkSent ? 'Reset Link Sent!' : 'Reset Password'}
            </Text>
            
            {!isLinkSent ? (
              <>
                <Text style={styles.subtitle}>
                  We'll send a password reset link to your registered email address.
                </Text>

                {/* Email Display */}
                <View style={styles.emailCard}>
                  <Text style={styles.emailLabel}>Reset link will be sent to:</Text>
                  <Text style={styles.emailText}>{maskedEmail}</Text>
                </View>

                {/* Security Notice */}
                <View style={styles.securityNotice}>
                  <Ionicons name="shield-checkmark" size={20} color="#2E7D32" />
                  <Text style={styles.securityText}>
                    For security, we only show part of your email address
                  </Text>
                </View>

                {/* Send Reset Link Button */}
                <TouchableOpacity
                  style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
                  onPress={handleSendResetLink}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.resetButtonText}>Get Reset Link</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  A password reset link has been sent to your email address.
                </Text>

                {/* Success Info */}
                <View style={styles.successCard}>
                  <Text style={styles.successTitle}>Check Your Email</Text>
                  <Text style={styles.successText}>
                    • Click the reset link in your email
                  </Text>
                  <Text style={styles.successText}>
                    • The link will expire in 15 minutes
                  </Text>
                  <Text style={styles.successText}>
                    • Check your spam folder if you don't see it
                  </Text>
                </View>

                {/* Resend Link */}
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleSendResetLink}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resendButtonText}>Resend Link</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backToLoginContainer}
              onPress={onBack}
            >
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#0D0D0D',
    fontFamily: 'Nunito_600SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  emailCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emailLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    letterSpacing: 1,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 32,
    width: '100%',
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#2E7D32',
    marginLeft: 8,
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  resetButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  successCard: {
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  successTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#2E7D32',
    marginBottom: 6,
    lineHeight: 20,
  },
  resendButton: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resendButtonText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  backToLoginContainer: {
    marginTop: 20,
  },
  backToLoginText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    textAlign: 'center',
  },
});
