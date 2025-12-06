import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../lib/supabase';
const SUPPORT_NUMBER = '0702248984';

export default function AccountScreen({ onLogout, onNavigate }) {
  const insets = useSafeAreaInsets();
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPersonalInfo, setLoadingPersonalInfo] = useState(false);
  const { signOut, user } = useAuth();
  const userEmail = user?.email || '';

  useEffect(() => {
    loadPersonalInfo();
  }, [user?.id]);

  const loadPersonalInfo = async () => {
    try {
      setLoadingPersonalInfo(true);
      if (!user?.id) return;
      
      const { success, data } = await dbService.getUserProfile(user.id);
      if (success && data) {
        setPersonalInfo({
          name: data.full_name || '',
          email: data.email || userEmail,
          gender: data.gender || null,
        });
      }
    } catch (error) {
      console.log('Error loading personal info:', error);
    } finally {
      setLoading(false);
      setLoadingPersonalInfo(false);
    }
  };

  const getAvatarSource = () => {
    if (personalInfo?.gender === 'female') {
      return require('../assets/woman.png');
    }
    return require('../assets/boy.png');
  };

  const handleCallSupport = async () => {
    const phoneUrl = `tel:${SUPPORT_NUMBER}`;
    
    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          'Unable to make call',
          'Your device does not support making phone calls.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to make the call. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 4 }]}>
        <Text style={styles.topBarTitle}>Account</Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.profileSection}>
            {loading ? (
              <View style={styles.profileSkeleton}>
                <View style={styles.avatarSkeleton} />
                <View style={styles.nameSkeleton} />
                <View style={styles.emailSkeleton} />
              </View>
            ) : (
              <>
                <View style={styles.avatarContainer}>
                  <Image source={getAvatarSource()} style={styles.avatarImage} />
                </View>
                <Text style={styles.profileName}>
                  {personalInfo?.name || 'User'}
                </Text>
                <Text style={styles.profileEmail}>
                  {personalInfo?.email || userEmail || 'user@example.com'}
                </Text>
              </>
            )}
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate && onNavigate('personalInfo')}>
              <Text style={styles.menuItemText}>Personal Information</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate && onNavigate('paymentMethod')}>
              <Text style={styles.menuItemText}>Payment Methods</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate && onNavigate('help')}>
              <Text style={styles.menuItemText}>Help</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleCallSupport}>
              <Text style={styles.menuItemText}>Call Support</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={async () => {
              Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: async () => {
                      const result = await signOut();
                      if (result.success) {
                        // Auth context will handle navigation automatically
                        if (onLogout) onLogout();
                      } else {
                        Alert.alert('Error', result.error);
                      }
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  topBarTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
  },
  menuSection: {
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
  },
  menuItemArrow: {
    fontSize: 24,
    color: '#999999',
  },
  logoutButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  logoutButtonText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  profileSkeleton: {
    alignItems: 'center',
  },
  avatarSkeleton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
  },
  nameSkeleton: {
    width: 150,
    height: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginBottom: 8,
  },
  emailSkeleton: {
    width: 200,
    height: 18,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
});
