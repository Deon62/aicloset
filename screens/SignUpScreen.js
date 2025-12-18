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
import { Ionicons } from '@expo/vector-icons';
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

export default function SignUpScreen({ onDone = () => {}, onBack = () => {} }) {
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [github, setGithub] = useState('');

  const canSubmit = useMemo(() => {
    return !saving;
  }, [saving]);

  const submit = async () => {
    const n = String(name || '').trim();

    if (!n) {
      Alert.alert('Sign up', 'Please enter your name.');
      return;
    }

    try {
      setSaving(true);
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.hasAccount, '1'],
        [STORAGE_KEYS.loggedIn, '1'],
        [STORAGE_KEYS.name, n],
        [STORAGE_KEYS.course, String(course || '').trim()],
        [STORAGE_KEYS.year, String(year || '').trim()],
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
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create account</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
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

          {renderField({
            label: 'Course',
            value: course,
            placeholder: 'Enter your course',
            onChangeText: setCourse,
            inputProps: { autoCapitalize: 'words', returnKeyType: 'next' },
          })}

          {renderField({
            label: 'Year',
            value: year,
            placeholder: 'e.g. 2nd year',
            onChangeText: setYear,
            inputProps: { returnKeyType: 'next' },
          })}

          {renderField({
            label: 'GitHub',
            value: github,
            placeholder: 'username',
            onChangeText: setGithub,
            inputProps: { autoCapitalize: 'none', autoCorrect: false },
          })}

          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={submit} disabled={!canSubmit}>
            <Text style={styles.primaryBtnText}>{saving ? 'Creating…' : 'Create account'}</Text>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 140,
    gap: 14,
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
  primaryBtn: {
    marginTop: 6,
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
});
