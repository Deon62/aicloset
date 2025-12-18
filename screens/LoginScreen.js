import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import LoginSvg from '../assets/icons/login.svg';
import { supabase } from '../lib/supabase';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

export default function LoginScreen({ onDone = () => {}, onNeedSignUp = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const isValidEmail = (value) => {
    const v = String(value || '').trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  };

  const syncProfileToLocal = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('github_username,name,course,year,avatar_url').eq('id', userId).single();
      if (error) return;

      await AsyncStorage.multiSet([
        ['@profile_github', String(data?.github_username || '').trim()],
        ['@profile_name', String(data?.name || '').trim()],
        ['@profile_course', String(data?.course || '').trim()],
        ['@profile_year', String(data?.year || '').trim()],
        ['@profile_bio', ''],
        ['@profile_photo_uri', String(data?.avatar_url || '').trim()],
      ]);
    } catch (e) {
      console.warn('Failed to sync profile', e);
    }
  };

  const passwordError = useMemo(() => {
    if (!attempted) return '';
    if (!String(password || '').trim()) return 'Password is required.';
    return '';
  }, [attempted, password]);

  const usernameError = useMemo(() => {
    if (!attempted) return '';
    const v = String(email || '').trim();
    if (!v) return 'Email is required.';
    if (!isValidEmail(v)) return 'Enter a valid email address.';
    return '';
  }, [attempted, email]);

  const canSubmit = useMemo(() => {
    if (loading) return false;
    return Boolean(isValidEmail(email) && String(password || '').trim());
  }, [email, loading, password]);

  const login = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAttempted(true);
    const em = String(email || '').trim().toLowerCase();
    const pwd = String(password || '').trim();
    if (!em || !isValidEmail(em) || !pwd) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: em,
        password: pwd,
      });

      if (error) {
        Alert.alert('Login failed', 'Invalid username or password.');
        return;
      }

      const userId = data?.user?.id;
      if (userId) {
        await syncProfileToLocal(userId);
      }

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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Login</Text>
          <View style={styles.illustrationWrap}>
            <LoginSvg width={260} height={260} />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#8A8A8A"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!loading}
            />
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
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
        </ScrollView>
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
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
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
