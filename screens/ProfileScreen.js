import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal, Pressable, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase, dbService } from '../lib/supabase';

const BRAND_BLUE = '#1B56FD';
const MOCK_NAME = 'Deon Student';
const MOCK_COURSE = 'Computer Science';
const PRESET_AVATARS = [
  'https://jfsyjlekhfyymunvsvcs.supabase.co/storage/v1/object/public/avatars/female.jpg',
  'https://jfsyjlekhfyymunvsvcs.supabase.co/storage/v1/object/public/avatars/female1.jpg',
  'https://jfsyjlekhfyymunvsvcs.supabase.co/storage/v1/object/public/avatars/male.jpg',
  'https://jfsyjlekhfyymunvsvcs.supabase.co/storage/v1/object/public/avatars/male1.jpg',
];

export default function ProfileScreen({
  onLogout = () => {},
  onOpenProfileInfo = () => {},
  onOpenSettings = () => {},
  onOpenFeedback = () => {},
  onOpenPayments = () => {},
}) {
  const [photoUri, setPhotoUri] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [saving, setSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedPhoto = await AsyncStorage.getItem('@profile_photo_uri');
        if (storedPhoto) setPhotoUri(storedPhoto);
        else setPhotoUri(PRESET_AVATARS[0]);

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

  const capturePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission?.granted) {
        Alert.alert('Camera permission', 'Please allow camera access to take a profile photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const uri = result.assets?.[0]?.uri;
      if (!uri) return;

      setSaving(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user?.id) {
        Alert.alert('Profile photo', 'Please login again to set your photo.');
        return;
      }

      const userId = authData.user.id;
      const uploadResult = await dbService.uploadProfileImage(userId, uri);
      if (!uploadResult?.success || !uploadResult?.url) {
        Alert.alert('Profile photo', 'Failed to save photo. Please try again.');
        return;
      }

      setPhotoUri(uploadResult.url);
      await AsyncStorage.setItem('@profile_photo_uri', uploadResult.url);
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: uploadResult.url }).eq('id', userId);
      if (updateError) console.warn('Failed to update profile avatar_url', updateError);
    } catch (e) {
      console.warn('Failed to capture photo', e);
      Alert.alert('Profile photo', 'Failed to capture photo. Please try again.');
    } finally {
      setSaving(false);
      setShowAvatarModal(false);
    }
  };

  const setPresetAvatar = async (uri) => {
    try {
      setSaving(true);
      setPhotoUri(uri);
      await AsyncStorage.setItem('@profile_photo_uri', uri);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.warn('Failed to get user', authError);
      } else {
        const userId = authData?.user?.id;
        if (userId) {
          const { error: updateError } = await supabase.from('profiles').update({ avatar_url: uri }).eq('id', userId);
          if (updateError) {
            console.warn('Failed to update profile avatar_url', updateError);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to set preset avatar', e);
      Alert.alert('Profile photo', 'Failed to set avatar. Please try again.');
    } finally {
      setSaving(false);
      setShowAvatarModal(false);
    }
  };

  const logout = async () => {
    try {
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
          <TouchableOpacity style={styles.avatarWrap} activeOpacity={0.9} onPress={() => setShowAvatarModal(true)}>
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
        <TouchableOpacity style={styles.linkRow} activeOpacity={0.85} onPress={onOpenSettings}>
          <Text style={styles.linkLabel}>Settings</Text>
          <Ionicons name="chevron-forward" size={18} color="#5A5A5A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} activeOpacity={0.85} onPress={onOpenFeedback}>
          <Text style={styles.linkLabel}>Send us feedback</Text>
          <Ionicons name="chevron-forward" size={18} color="#5A5A5A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} activeOpacity={0.85} onPress={onOpenPayments}>
          <Text style={styles.linkLabel}>Payments</Text>
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

        <Modal
          visible={showAvatarModal}
          transparent
          statusBarTranslucent
          presentationStyle="overFullScreen"
          animationType="fade"
          onRequestClose={() => setShowAvatarModal(false)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setShowAvatarModal(false)}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={styles.modalTitle}>Choose an avatar</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarOptions}>
                <TouchableOpacity
                  style={[styles.avatarOption, styles.avatarOptionCamera]}
                  onPress={capturePhoto}
                  disabled={saving}
                  activeOpacity={0.85}
                >
                  <Ionicons name="camera" size={28} color={BRAND_BLUE} />
                  <Text style={styles.avatarOptionCameraText}>Take photo</Text>
                </TouchableOpacity>
                {PRESET_AVATARS.map((uri) => (
                  <TouchableOpacity
                    key={uri}
                    style={[
                      styles.avatarOption,
                      photoUri === uri ? styles.avatarOptionActive : null,
                    ]}
                    onPress={() => setPresetAvatar(uri)}
                    disabled={saving}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri }} style={styles.avatarOptionImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnClose]}
                activeOpacity={0.85}
                onPress={() => setShowAvatarModal(false)}
                disabled={saving}
              >
                <Text style={styles.modalBtnText}>Close</Text>
              </TouchableOpacity>
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
  avatarOptions: {
    paddingVertical: 8,
    gap: 10,
  },
  avatarOption: {
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionActive: {
    borderColor: BRAND_BLUE,
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
  },
  avatarOptionCamera: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F7FF',
    borderColor: BRAND_BLUE,
    paddingVertical: 12,
    gap: 6,
  },
  avatarOptionCameraText: {
    color: BRAND_BLUE,
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
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
    backgroundColor: '#F9E5E7',
  },
  modalBtnDangerText: {
    color: '#0B0B0F',
  },
  modalBtnClose: {
    marginTop: 12,
  },
});
