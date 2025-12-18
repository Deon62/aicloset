import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUpSvg from '../assets/icons/signup.svg';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

export default function SignUpScreen({ onDone = () => {}, onNeedLogin = () => {} }) {
  const [saving, setSaving] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [github, setGithub] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValidEmail = (value) => {
    const v = String(value || '').trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  };

  const syncProfileToLocal = async (profile) => {
    try {
      await AsyncStorage.multiSet([
        ['@profile_github', String(profile?.github_username || '').trim()],
        ['@profile_name', String(profile?.name || '').trim()],
        ['@profile_course', String(profile?.course || '').trim()],
        ['@profile_year', String(profile?.year || '').trim()],
        ['@profile_bio', ''],
      ]);
    } catch (e) {
      console.warn('Failed to sync profile', e);
    }
  };

  const nameError = useMemo(() => {
    if (!attempted) return '';
    if (!String(name || '').trim()) return 'Name is required.';
    return '';
  }, [attempted, name]);

  const courseError = useMemo(() => {
    if (!attempted) return '';
    if (!String(course || '').trim()) return 'Course is required.';
    return '';
  }, [attempted, course]);

  const emailError = useMemo(() => {
    if (!attempted) return '';
    const v = String(email || '').trim();
    if (!v) return 'Email is required.';
    if (!isValidEmail(v)) return 'Enter a valid email address.';
    return '';
  }, [attempted, email]);

  const yearError = useMemo(() => {
    if (!attempted) return '';
    if (!String(year || '').trim()) return 'Year is required.';
    return '';
  }, [attempted, year]);

  const canSubmit = useMemo(() => {
    if (saving) return false;
    const n = String(name || '').trim();
    const em = String(email || '').trim();
    const c = String(course || '').trim();
    const y = String(year || '').trim();
    const gh = String(github || '').trim();
    const pwd = String(password || '');
    const confirm = String(confirmPassword || '');
    if (!n || !em || !isValidEmail(em) || !c || !y || !gh) return false;
    if (pwd.length < 6) return false;
    if (pwd !== confirm) return false;
    return true;
  }, [confirmPassword, course, email, github, name, password, saving, year]);

  const githubError = useMemo(() => {
    if (!attempted) return '';
    if (!String(github || '').trim()) return 'GitHub username is required.';
    return '';
  }, [attempted, github]);

  const passwordError = useMemo(() => {
    if (!attempted) return '';
    const pwd = String(password || '');
    if (!pwd) return 'Password is required.';
    if (pwd.length < 6) return 'Password must be at least 6 characters.';
    return '';
  }, [attempted, password]);

  const confirmError = useMemo(() => {
    if (!attempted) return '';
    const pwd = String(password || '');
    const confirm = String(confirmPassword || '');
    if (!confirm) return 'Please confirm your password.';
    if (pwd !== confirm) return 'Passwords do not match.';
    return '';
  }, [attempted, confirmPassword, password]);

  const submit = async () => {
    setAttempted(true);
    const n = String(name || '').trim();
    const em = String(email || '').trim().toLowerCase();
    const c = String(course || '').trim();
    const y = String(year || '').trim();

    const gh = String(github || '').trim();
    const pwd = String(password || '');
    const confirm = String(confirmPassword || '');

    if (!n || !em || !isValidEmail(em) || !c || !y || !gh || !pwd || pwd.length < 6 || pwd !== confirm) return;

    try {
      setSaving(true);
      const usernameLower = gh.toLowerCase();

      const { data: existing, error: existingErr } = await supabase
        .from('profiles')
        .select('id')
        .ilike('github_username', usernameLower)
        .limit(1);

      if (!existingErr && Array.isArray(existing) && existing.length > 0) {
        Alert.alert('Sign up', 'That GitHub username is already taken.');
        return;
      }

      if (existingErr) {
        console.warn('Username lookup failed', existingErr);
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: em,
        password: pwd,
        options: {
          data: {
            github_username: usernameLower,
            name: n,
          },
        },
      });

      if (signUpError) {
        console.warn('Supabase signUp error', signUpError);
        Alert.alert('Sign up', signUpError.message || 'Failed to create account. Please try again.');
        return;
      }

      let userId = signUpData?.user?.id;
      let sessionUserId = signUpData?.session?.user?.id;
      if (!userId && sessionUserId) userId = sessionUserId;

      if (!signUpData?.session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: em,
          password: pwd,
        });
        if (signInError) {
          console.warn('Supabase signIn after signUp error', signInError);
          Alert.alert('Sign up', signInError.message || 'Account created, but login failed. Please try logging in.');
          onNeedLogin();
          return;
        }
        userId = signInData?.user?.id;
      }

      if (userId) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            github_username: usernameLower,
            name: n,
            course: c,
            year: y,
          })
          .eq('id', userId);

        if (updateError) {
          console.warn('Profile update error', updateError);
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('github_username,name,course,year')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.warn('Profile fetch error', profileError);
        }

        await syncProfileToLocal(profile);
      }

      onDone();
    } catch (e) {
      console.warn('Failed to sign up', e);
      Alert.alert('Sign up', 'Failed to create account. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderField = ({ label, value, placeholder, onChangeText, multiline = false, inputProps = {} }) => {
    return (
      <View style={styles.fieldWrap}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8A8A8A"
          style={[styles.input, multiline && styles.inputMultiline]}
          multiline={multiline}
          {...inputProps}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.pageTitle}>Create account</Text>
          <View style={styles.illustrationWrap}>
            <SignUpSvg width={240} height={240} />
          </View>
          {renderField({
            label: 'Name',
            value: name,
            placeholder: 'Enter your name',
            onChangeText: setName,
            inputProps: { autoCapitalize: 'words', returnKeyType: 'next' },
          })}
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          {renderField({
            label: 'Email',
            value: email,
            placeholder: 'you@example.com',
            onChangeText: setEmail,
            inputProps: { autoCapitalize: 'none', autoCorrect: false, keyboardType: 'email-address', returnKeyType: 'next' },
          })}
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {renderField({
            label: 'Course',
            value: course,
            placeholder: 'Enter your course',
            onChangeText: setCourse,
            inputProps: { autoCapitalize: 'words', returnKeyType: 'next' },
          })}
          {courseError ? <Text style={styles.errorText}>{courseError}</Text> : null}

          {renderField({
            label: 'Year',
            value: year,
            placeholder: 'e.g. 2nd year',
            onChangeText: setYear,
            inputProps: { returnKeyType: 'next' },
          })}
          {yearError ? <Text style={styles.errorText}>{yearError}</Text> : null}

          {renderField({
            label: 'GitHub',
            value: github,
            placeholder: 'username',
            onChangeText: setGithub,
            inputProps: { autoCapitalize: 'none', autoCorrect: false },
          })}
          {githubError ? <Text style={styles.errorText}>{githubError}</Text> : null}

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
                editable={!saving}
              />
              <TouchableOpacity style={styles.eyeBtn} activeOpacity={0.8} onPress={() => setShowPassword((v) => !v)} disabled={saving}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#5A5A5A" />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Confirm password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor="#8A8A8A"
                style={[styles.input, styles.passwordInput]}
                autoCapitalize="none"
                secureTextEntry={!showConfirmPassword}
                editable={!saving}
              />
              <TouchableOpacity style={styles.eyeBtn} activeOpacity={0.8} onPress={() => setShowConfirmPassword((v) => !v)} disabled={saving}>
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#5A5A5A" />
              </TouchableOpacity>
            </View>
            {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}
          </View>

          <TouchableOpacity style={[styles.primaryBtn, !canSubmit && styles.primaryBtnDisabled]} activeOpacity={0.9} onPress={submit} disabled={!canSubmit}>
            <Text style={styles.primaryBtnText}>{saving ? 'Creating…' : 'Create account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} activeOpacity={0.85} onPress={onNeedLogin} disabled={saving}>
            <Text style={styles.loginLinkText}>Already have an account? Login</Text>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 140,
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
    paddingTop: 4,
    paddingBottom: 2,
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
  inputMultiline: {
    minHeight: 110,
  },
  errorText: {
    marginTop: -8,
    color: '#D11A2A',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  primaryBtn: {
    marginTop: 6,
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
  loginLink: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  loginLinkText: {
    color: BRAND_BLUE,
    fontSize: 13,
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
});
