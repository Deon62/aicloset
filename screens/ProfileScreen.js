import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const BRAND_BLUE = '#1B56FD';
const MOCK_NAME = 'Deon Student';
const MOCK_COURSE = 'Computer Science';

export default function ProfileScreen({ onLogout = () => {}, onOpenProfileInfo = () => {} }) {
  const [photoUri, setPhotoUri] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [saving, setSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedPhoto = await AsyncStorage.getItem('@profile_photo_uri');
        if (storedPhoto) setPhotoUri(storedPhoto);

        const entries = await AsyncStorage.multiGet(['@profile_name', '@profile_course', '@profile_year']);
        const map = Object.fromEntries(entries);
        setName(map['@profile_name'] || '');
        setCourse(map['@profile_course'] || '');
        setYear(map['@profile_year'] || '');
      } catch (e) {
        console.warn('Failed to load profile', e);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async ({ nextPhotoUri }) => {
    try {
      setSaving(true);
      const writes = [];
      if (typeof nextPhotoUri === 'string') writes.push(AsyncStorage.setItem('@profile_photo_uri', nextPhotoUri));
      await Promise.all(writes);
    } catch (e) {
      console.warn('Failed to save profile', e);
    } finally {
      setSaving(false);
    }
  };

  const pickPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission?.granted) {
        Alert.alert('Permission required', 'Please allow access to your photos to upload a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (result.canceled) return;

      const uri = result.assets?.[0]?.uri;
      if (!uri) return;

      setPhotoUri(uri);
      saveProfile({ nextPhotoUri: uri });
    } catch (e) {
      console.warn('Failed to pick image', e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['@profile_name', '@profile_course', '@profile_photo_uri']);
      setPhotoUri('');
      onLogout();
    } catch (e) {
      console.warn('Failed to logout', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatarWrap} activeOpacity={0.9} onPress={pickPhoto}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarEmpty} />
            )}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.nameText}>{name || MOCK_NAME}</Text>
          <Text style={styles.courseText}>{course || MOCK_COURSE}{year ? ` • ${year}` : ''}</Text>
        </View>

        <View style={styles.separator} />

        <TouchableOpacity style={styles.linkRow} activeOpacity={0.85} onPress={onOpenProfileInfo}>
          <Text style={styles.linkLabel}>Profile info</Text>
          <Ionicons name="chevron-forward" size={18} color="#5A5A5A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} activeOpacity={0.85}>
          <Text style={styles.linkLabel}>Settings</Text>
          <Ionicons name="chevron-forward" size={18} color="#5A5A5A" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.linkRow, styles.logoutRow]}
          activeOpacity={0.85}
          onPress={() => {
            setShowLogoutModal(true);
          }}
          disabled={saving}
        >
          <Text style={styles.logoutLabel}>{saving ? 'Saving...' : 'Logout'}</Text>
          <Ionicons name="log-out-outline" size={18} color="#D11A2A" />
        </TouchableOpacity>

        <Modal
          visible={showLogoutModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setShowLogoutModal(false)}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>Logout</Text>
              <Text style={styles.modalText}>Are you sure you want to logout?</Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalBtn}
                  activeOpacity={0.85}
                  onPress={() => setShowLogoutModal(false)}
                  disabled={saving}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnDanger]}
                  activeOpacity={0.85}
                  onPress={async () => {
                    setShowLogoutModal(false);
                    await logout();
                  }}
                  disabled={saving}
                >
                  <Text style={[styles.modalBtnText, styles.modalBtnDangerText]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

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
  title: {
    fontSize: 28,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
  },

  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 8,
  },
  avatarWrap: {
    width: 84,
    height: 84,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarEmpty: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E5E5E5',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  nameText: {
    marginTop: 4,
    color: '#0B0B0F',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  courseText: {
    color: '#4A4A4A',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: 16,
    marginBottom: 6,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  linkLabel: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  logoutRow: {
    marginTop: 4,
  },
  logoutLabel: {
    color: '#D11A2A',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  modalTitle: {
    color: '#0B0B0F',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  modalText: {
    marginTop: 8,
    color: '#4A4A4A',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
  modalActions: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    color: '#0B0B0F',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  modalBtnDanger: {
    borderColor: '#D11A2A',
    backgroundColor: '#D11A2A',
  },
  modalBtnDangerText: {
    color: '#FFFFFF',
  },
});
