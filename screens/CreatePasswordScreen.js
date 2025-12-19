import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { RADIUS } from '../ui/tokens';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

export default function CreatePasswordScreen({ onBack = () => {} }) {
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordError = useMemo(() => {
    const pwd = String(password || '');
    if (!pwd) return '';
    if (pwd.length < 4) return 'Password must be at least 4 characters.';
    return '';
  }, [password]);

  const confirmError = useMemo(() => {
    const pwd = String(password || '');
    const confirm = String(confirmPassword || '');
    if (!confirm) return '';
    if (pwd !== confirm) return 'Passwords do not match.';
    return '';
  }, [confirmPassword, password]);

  const canSave = useMemo(() => {
    const pwd = String(password || '');
    const confirm = String(confirmPassword || '');
    if (saving) return false;
    if (!pwd || !confirm) return false;
    if (pwd.length < 4) return false;
    if (pwd !== confirm) return false;
    return true;
  }, [confirmPassword, password, saving]);

  const save = async () => {
    const pwd = String(password || '');
    const confirm = String(confirmPassword || '');

    if (!pwd || !confirm || pwd.length < 4 || pwd !== confirm) return;

    try {
      setSaving(true);
      await AsyncStorage.setItem('@auth_password', pwd);
      Alert.alert('Password', 'Password created successfully.');
      onBack();
    } catch (e) {
      console.warn('Failed to save password', e);
      Alert.alert('Password', 'Failed to save password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create password</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.note}>Create a password to login after you logout.</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#8A8A8A"
                style={[styles.input, styles.passwordInput]}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!saving}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                activeOpacity={0.8}
                onPress={() => setShowPassword((v) => !v)}
                disabled={saving}
              >
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
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!saving}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                activeOpacity={0.8}
                onPress={() => setShowConfirmPassword((v) => !v)}
                disabled={saving}
              >
                <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#5A5A5A" />
              </TouchableOpacity>
            </View>
            {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, !canSave && styles.primaryBtnDisabled]}
            activeOpacity={0.9}
            onPress={save}
            disabled={!canSave}
          >
            <Text style={styles.primaryBtnText}>{saving ? 'Saving…' : 'Save password'}</Text>
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
  note: {
    color: '#6A6A6A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_400Regular',
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
    borderRadius: RADIUS.pill,
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
});
