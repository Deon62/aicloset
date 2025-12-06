import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ onBack, onSubmit, onNavigateToSignup, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passkeyEnabled, setPasskeyEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ form: '' });
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  useEffect(() => {
    checkPasskeyAvailability();
  }, []);

  const checkPasskeyAvailability = async () => {
    try {
      const passkeyStatus = await SecureStore.getItemAsync('passkey_enabled');
      const passkeyCredentials = await SecureStore.getItemAsync('passkey_credentials');
      
      if (passkeyStatus === 'true' && passkeyCredentials) {
        setPasskeyEnabled(true);
        
        // Check biometric type
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('face');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        } else {
          setBiometricType('biometric');
        }
      }
    } catch (error) {
      console.error('Error checking passkey availability:', error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with your passkey',
        subtitle: 'Use your biometric to access your account',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        const passkeyCredentials = await SecureStore.getItemAsync('passkey_credentials');
        if (passkeyCredentials) {
          const credentials = JSON.parse(passkeyCredentials);
          onSubmit({ email: credentials.email, biometric: true });
        }
      } else {
        Alert.alert(
          'Authentication Failed',
          'Biometric authentication was cancelled or failed. Please try again or use your password.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      Alert.alert(
        'Login Error',
        'There was an error with biometric login. Please use your password.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleLogin = async () => {
    let isValid = true;
    
    if (email.trim() === '' || !validateEmail(email)) {
      setIsValidEmail(false);
      isValid = false;
    } else {
      setIsValidEmail(true);
    }
    
    if (password.trim() === '') {
      setIsValidPassword(false);
      isValid = false;
    } else {
      setIsValidPassword(true);
    }

    if (isValid) {
      setIsLoading(true);
      try {
        const result = await signIn(email, password);

        if (result.success) {
          // Check if passkey setup is needed
          try {
            const passkeyEnabled = await SecureStore.getItemAsync('passkey_enabled');
            if (passkeyEnabled === 'true') {
              // Passkey already set up, auth context will handle navigation
              if (onSubmit) onSubmit({ email, password });
            } else {
              // First time login, show passkey setup
              if (onSubmit) onSubmit({ email, password, showPasskeySetup: true });
            }
          } catch (error) {
            console.error('Error checking passkey status:', error);
            // On error, show passkey setup to be safe
            if (onSubmit) onSubmit({ email, password, showPasskeySetup: true });
          }
        } else {
          setErrors({ ...errors, form: result.error });
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Back Button */}
      <TouchableOpacity 
        onPress={onBack} 
        style={[styles.backButton, { top: insets.top + 10 }]}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Content */}
          <View style={styles.content}>
            <View style={styles.contentWrapper}>
              <Text style={styles.title}>Glad to see you</Text>
              <Text style={styles.subtitle}>
                Enter your credentials to opt back in 
              </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={[
                  styles.input,
                  !isValidEmail && styles.inputError
                ]}
                placeholder="your.email@example.com"
                placeholderTextColor="#999999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setIsValidEmail(true);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {!isValidEmail && (
                <Text style={styles.errorText}>
                  Please enter a valid email address
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    !isValidPassword && styles.inputError
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor="#999999"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setIsValidPassword(true);
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#666666"
                  />
                </TouchableOpacity>
              </View>
              {!isValidPassword && (
                <Text style={styles.errorText}>
                  Please enter your password
                </Text>
              )}
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={() => onForgotPassword && onForgotPassword(email)}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (email.trim() === '' || password.trim() === '' || isLoading) && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={email.trim() === '' || password.trim() === '' || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Biometric Login Button */}
            {passkeyEnabled && (
              <View style={styles.biometricContainer}>
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>
                
                <TouchableOpacity
                  style={styles.biometricButton}
                  onPress={handleBiometricLogin}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={biometricType === 'face' ? 'scan' : 'finger-print'} 
                    size={24} 
                    color="#6D9773" 
                  />
                  <Text style={styles.biometricButtonText}>
                    Login with {biometricType === 'face' ? 'Face ID' : 'Fingerprint'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Signup Link */}
            <View style={styles.signupLinkContainer}>
              <Text style={styles.signupLinkText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onNavigateToSignup}>
                <Text style={styles.signupLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
            {errors.form && (
              <Text style={styles.errorText}>{errors.form}</Text>
            )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
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
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    lineHeight: 24,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#FF3B30',
    marginTop: 8,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
  },
  loginButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#0D0D0D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  biometricContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginHorizontal: 16,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#6D9773',
    backgroundColor: '#FFFFFF',
  },
  biometricButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#6D9773',
    marginLeft: 12,
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupLinkText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
  },
  signupLink: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#0D0D0D',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    textDecorationLine: 'underline',
  },
});
