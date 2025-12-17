import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const loadNickname = async () => {
      try {
        const stored = await AsyncStorage.getItem('@profile_nickname');
        if (stored) {
          setNickname(stored);
        }
      } catch (e) {
        console.warn('Failed to load nickname', e);
      }
    };
    loadNickname();
  }, []);

  const saveNickname = async (value) => {
    try {
      setSaving(true);
      await AsyncStorage.setItem('@profile_nickname', value.trim());
    } catch (e) {
      console.warn('Failed to save nickname', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your EUCOSSA club profile.</Text>
          <View style={styles.avatarBlock}>
            <Image source={require('../assets/profile.png')} style={styles.avatar} />
            <View style={styles.nicknameRow}>
              <Text style={styles.headerName}>{nickname || 'Your nickname'}</Text>
              <TouchableOpacity
                style={styles.iconButton}
                activeOpacity={0.8}
                onPress={() => setEditing((v) => !v)}
              >
                <Ionicons name="create-outline" size={18} color="#0B0B0F" />
              </TouchableOpacity>
            </View>
            {editing && (
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter nickname"
                  placeholderTextColor="#8A8A8A"
                  value={nickname}
                  onChangeText={setNickname}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.linkButtonDisabled]}
                  activeOpacity={0.8}
                  onPress={() => {
                    saveNickname(nickname);
                    setEditing(false);
                  }}
                  disabled={saving}
                >
                  <Text style={styles.saveText}>{saving ? 'Saving' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.linkRow} activeOpacity={0.85}>
            <Text style={styles.cardTitle}>Role</Text>
            <Text style={styles.linkText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} activeOpacity={0.85}>
            <Text style={styles.cardTitle}>Interests</Text>
            <Text style={styles.linkText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} activeOpacity={0.85}>
            <Text style={styles.cardTitle}>Settings</Text>
            <Text style={styles.linkText}>Edit</Text>
          </TouchableOpacity>
        </View>

      </View>
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
    padding: 24,
    gap: 16,
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 6,
  },
  avatarBlock: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 28,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 22,
    fontFamily: 'Nunito_400Regular',
  },
  headerName: {
    fontSize: 16,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 6,
  },
  nicknameValue: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0B0B0F',
    fontFamily: 'Nunito_600SemiBold',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0B0B0F',
  },
  linkButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  card: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  cardTitle: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  cardText: {
    color: '#4A4A4A',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
  linkButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#0B0B0F',
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
