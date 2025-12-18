import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../ui/tokens';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

const STORAGE_KEYS = {
  name: '@profile_name',
  course: '@profile_course',
  year: '@profile_year',
  bio: '@profile_bio',
  github: '@profile_github',
};

export default function ProfileInfoScreen({ onBack = () => {}, onSaved = () => {} }) {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');

  const canSave = useMemo(() => {
    return !saving;
  }, [saving]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const entries = await AsyncStorage.multiGet([
          STORAGE_KEYS.name,
          STORAGE_KEYS.course,
          STORAGE_KEYS.year,
          STORAGE_KEYS.bio,
          STORAGE_KEYS.github,
        ]);

        const map = Object.fromEntries(entries);
        setName(map[STORAGE_KEYS.name] || '');
        setCourse(map[STORAGE_KEYS.course] || '');
        setYear(map[STORAGE_KEYS.year] || '');
        setBio(map[STORAGE_KEYS.bio] || '');
        setGithub(map[STORAGE_KEYS.github] || '');
      } catch (e) {
        console.warn('Failed to load profile info', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.name, String(name || '').trim()],
        [STORAGE_KEYS.course, String(course || '').trim()],
        [STORAGE_KEYS.year, String(year || '').trim()],
        [STORAGE_KEYS.bio, String(bio || '').trim()],
        [STORAGE_KEYS.github, String(github || '').trim()],
      ]);
      setEditing(false);
      onSaved();
    } catch (e) {
      console.warn('Failed to save profile info', e);
      Alert.alert('Failed to save', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderFieldRow = ({ label, value, placeholder, onChangeText, multiline = false, inputProps = {}, isLast = false }) => {
    return (
      <View style={[styles.fieldRow, isLast && styles.fieldRowLast]}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {editing ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#8A8A8A"
            style={[styles.input, multiline && styles.inputMultiline]}
            multiline={multiline}
            {...inputProps}
          />
        ) : (
          <Text style={[styles.valueText, value ? null : styles.valueEmptyText]}>{value ? value : '—'}</Text>
        )}
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
          <Text style={styles.headerTitle}>Profile info</Text>
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.85}
            onPress={() => {
              if (loading) return;
              if (editing) {
                save();
              } else {
                setEditing(true);
              }
            }}
            disabled={!canSave || loading}
          >
            <Text style={styles.editBtnText}>{editing ? (saving ? 'Saving...' : 'Save') : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.detailsCard}>
            {renderFieldRow({
              label: 'Name',
              value: name,
              placeholder: 'Enter your name',
              onChangeText: setName,
              inputProps: { autoCapitalize: 'words', returnKeyType: 'next' },
            })}

            {renderFieldRow({
              label: 'Course',
              value: course,
              placeholder: 'Enter your course',
              onChangeText: setCourse,
              inputProps: { autoCapitalize: 'words', returnKeyType: 'next' },
            })}

            {renderFieldRow({
              label: 'Year',
              value: year,
              placeholder: 'e.g. 2nd year',
              onChangeText: setYear,
              inputProps: { returnKeyType: 'next' },
            })}

            {renderFieldRow({
              label: 'Bio',
              value: bio,
              placeholder: 'Tell us about yourself',
              onChangeText: setBio,
              multiline: true,
              inputProps: { textAlignVertical: 'top' },
            })}

            {renderFieldRow({
              label: 'GitHub',
              value: github,
              placeholder: 'github.com/username',
              onChangeText: setGithub,
              inputProps: { autoCapitalize: 'none', autoCorrect: false },
              isLast: true,
            })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
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
    borderBottomWidth: 0,
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
    ...TYPE.title,
  },
  editBtn: {
    minWidth: 64,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_BLUE,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  content: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.s,
    paddingBottom: 140,
    gap: 12,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
  },
  fieldRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  fieldRowLast: {
    borderBottomWidth: 0,
  },
  fieldLabel: {
    ...TYPE.caption,
  },
  valueText: {
    ...TYPE.bodyStrong,
  },
  valueEmptyText: {
    color: '#8A8A8A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E9ECF5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    backgroundColor: COLORS.bg,
  },
  inputMultiline: {
    minHeight: 110,
  },
});
