import React, { useState } from 'react';
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
import { useAuth } from '../contexts/AuthContext';

export default function EmailAuthScreen({ onBack, onSubmit, onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ form: '' });
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateAccount = async () => {
    let isValid = true;
    
    if (email.trim() === '' || !validateEmail(email)) {
      setIsValidEmail(false);
      isValid = false;
    } else {
      setIsValidEmail(true);
    }
    
    if (password.trim() === '' || password.length < 6) {
      setIsValidPassword(false);
      isValid = false;
    } else {
      setIsValidPassword(true);
    }
    
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      isValid = false;
    } else {
      setPasswordsMatch(true);
    }

    if (isValid) {
      setIsLoading(true);
      try {
        const result = await signUp(email, password, {
          full_name: '', // Can be updated later in profile
        });

        if (result.success) {
          Alert.alert(
            'Account Created!',
            result.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  // Auth context will automatically handle navigation
                  if (onSubmit) onSubmit({ email, password });
                },
              },
            ]
          );
        } else {
          setErrors({ ...errors, form: result.error });
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        console.error('Sign up error:', error);
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
              <Text style={styles.title}>Welcome to Nimo</Text>
              <Text style={styles.subtitle}>
                get started by creating your account
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
                    setPasswordsMatch(true);
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
                  Password must be at least 6 characters
                </Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    !passwordsMatch && styles.inputError
                  ]}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999999"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setPasswordsMatch(true);
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#666666"
                  />
                </TouchableOpacity>
              </View>
              {!passwordsMatch && (
                <Text style={styles.errorText}>
                  Passwords do not match
                </Text>
              )}
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              style={[
                styles.continueButton,
                (email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '' || isLoading) && styles.continueButtonDisabled
              ]}
              onPress={handleCreateAccount}
              disabled={email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '' || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.continueButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Error Message */}
            {errors.form && (
              <Text style={styles.errorText}>
                {errors.form}
              </Text>
            )}

            {/* Login Link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
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
  continueButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#0D0D0D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 24,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginLinkText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
  },
  loginLink: {
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
    backgroundColor: '#0D0D0D',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#0D0D0D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
});
