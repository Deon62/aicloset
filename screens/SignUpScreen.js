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

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

const STORAGE_KEYS = {
  hasAccount: '@auth_has_account',
  loggedIn: '@auth_logged_in',
  name: '@profile_name',
  course: '@profile_course',
  year: '@profile_year',
  github: '@profile_github',
};

export default function SignUpScreen({ onDone = () => {}, onNeedLogin = () => {} }) {
  const [saving, setSaving] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [github, setGithub] = useState('');

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

  const yearError = useMemo(() => {
    if (!attempted) return '';
    if (!String(year || '').trim()) return 'Year is required.';
    return '';
  }, [attempted, year]);

  const canSubmit = useMemo(() => {
    if (saving) return false;
    const n = String(name || '').trim();
    const c = String(course || '').trim();
    const y = String(year || '').trim();
    return Boolean(n && c && y);
  }, [course, name, saving, year]);

  const submit = async () => {
    setAttempted(true);
    const n = String(name || '').trim();
    const c = String(course || '').trim();
    const y = String(year || '').trim();

    if (!n || !c || !y) return;

    try {
      setSaving(true);
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.hasAccount, '1'],
        [STORAGE_KEYS.loggedIn, '1'],
        [STORAGE_KEYS.name, n],
        [STORAGE_KEYS.course, c],
        [STORAGE_KEYS.year, y],
        [STORAGE_KEYS.github, String(github || '').trim()],
      ]);
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
});
