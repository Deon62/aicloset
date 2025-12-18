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

export default function LoginScreen({ onDone = () => {}, onBack = () => {}, onNeedSignUp = () => {} }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return !loading;
  }, [loading]);

  const login = async () => {
    const pwd = String(password || '');
    if (!pwd) {
      Alert.alert('Login', 'Please enter your password.');
      return;
    }

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
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.illustrationWrap}>
            <LoginSvg width={260} height={260} />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#8A8A8A"
              style={styles.input}
              autoCapitalize="none"
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={login} disabled={!canSubmit}>
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
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#0B0B0F',
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 14,
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
