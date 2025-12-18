import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import LoginSvg from '../assets/icons/login.svg';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

const STORAGE_KEYS = {
  hasAccount: '@auth_has_account',
  loggedIn: '@auth_logged_in',
  password: '@auth_password',
};

export default function LoginScreen({ onDone = () => {}, onNeedSignUp = () => {} }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const passwordError = useMemo(() => {
    if (!attempted) return '';
    if (!String(password || '').trim()) return 'Password is required.';
    return '';
  }, [attempted, password]);

  const canSubmit = useMemo(() => {
    if (loading) return false;
    return Boolean(String(password || '').trim());
  }, [loading, password]);

  const login = async () => {
    setAttempted(true);
    const pwd = String(password || '').trim();
    if (!pwd) return;

    try {
      setLoading(true);
      const entries = await AsyncStorage.multiGet([STORAGE_KEYS.hasAccount, STORAGE_KEYS.password]);
      const map = Object.fromEntries(entries);
      const hasAccount = map[STORAGE_KEYS.hasAccount] === '1';
      const savedPassword = String(map[STORAGE_KEYS.password] || '');

      if (!hasAccount) {
        Alert.alert('Login', 'No account found on this device. Please sign up.');
        onNeedSignUp();
        return;
      }

      if (!savedPassword) {
        Alert.alert('Login', 'No password is set for this account yet. Please sign up again or set a password before logging out.');
        return;
      }

      if (savedPassword !== pwd) {
        Alert.alert('Login failed', 'Incorrect password.');
        return;
      }

      await AsyncStorage.setItem(STORAGE_KEYS.loggedIn, '1');
      onDone();
    } catch (e) {
      console.warn('Failed to login', e);
      Alert.alert('Login', 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Login</Text>
          <View style={styles.illustrationWrap}>
            <LoginSvg width={260} height={260} />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#8A8A8A"
                style={[styles.input, styles.passwordInput]}
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                activeOpacity={0.8}
                onPress={() => setShowPassword((v) => !v)}
                disabled={loading}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#5A5A5A" />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <TouchableOpacity style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]} activeOpacity={0.9} onPress={login} disabled={!canSubmit}>
            <Text style={styles.primaryBtnText}>{loading ? 'Logging in…' : 'Login'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.9} onPress={onNeedSignUp} disabled={loading}>
            <Text style={styles.secondaryBtnText}>Create a new account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 14,
  },
  pageTitle: {
    color: '#0B0B0F',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    marginTop: 6,
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 6,
  },
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    color: '#0B0B0F',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  passwordRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 46,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#D11A2A',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0B0B0F',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    backgroundColor: '#FFFFFF',
  },
  primaryBtn: {
    marginTop: 4,
    height: 50,
    borderRadius: 16,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.55,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DCE3FF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: BRAND_BLUE,
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
