import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../lib/supabase';

export default function PaymentMethodScreen({ onBack }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [savedAccount, setSavedAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  useEffect(() => {
    loadAccountFromSupabase();
  }, [user?.id]);

  const loadAccountFromSupabase = async () => {
    try {
      if (!user?.id) return;

      const { success, data } = await dbService.getUserProfile(user.id);
      if (success && data) {
        const profileName = data.full_name || '';
        const phone = data.phone_number || '';

        setAccountName(profileName);

        if (phone) {
          const account = {
            name: profileName,
            phoneNumber: phone,
          };
          setSavedAccount(account);
          setPhoneNumber(phone);
        }
      }
    } catch (error) {
      console.log('Error loading account from Supabase:', error);
    }
  };

  const validatePhoneNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    const regex = /^(07|01|254)\d{8,9}$/;
    return regex.test(cleanNumber);
  };

  const handleSave = async () => {
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    
    if (!validatePhoneNumber(cleanNumber)) {
      setIsValid(false);
      return;
    }

    if (!accountName.trim()) {
      return;
    }

    try {
      if (!user?.id) {
        return;
      }

      const { success, error } = await dbService.updateUserProfile(user.id, {
        phone_number: cleanNumber,
      });

      if (!success) {
        return;
      }

      const account = {
        name: accountName.trim(),
        phoneNumber: cleanNumber,
      };

      setSavedAccount(account);
      setIsValid(true);
      setIsEditing(false);
    } catch (error) {
      console.log('Error saving payout account:', error);
    }
  };

  const handleUpdate = () => {
    setPhoneNumber(savedAccount.phoneNumber);
    setAccountName(savedAccount.name);
    setIsEditing(true);
  };

  const isFormValid = phoneNumber.trim().length >= 10;
  const showForm = !savedAccount || isEditing;

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Back Button */}
      <TouchableOpacity 
        onPress={onBack} 
        style={[styles.backButton, { top: insets.top + 10 }]}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.contentWrapper}>
              <Text style={styles.title}>Payout Account</Text>
              <Text style={styles.subtitle}>Loans will be disbursed to this number</Text>

              {showForm ? (
                <>
                  {/* Account Name Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Account Name</Text>
                    <TextInput
                      style={[
                        styles.nameInput,
                        !isValid && !accountName.trim() && styles.inputError
                      ]}
                      placeholder="Taken from your profile"
                      placeholderTextColor="#999999"
                      value={accountName}
                      editable={false}
                    />
                  </View>

                  {/* Phone Number Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <View style={[
                      styles.inputWrapper,
                      !isValid && !validatePhoneNumber(phoneNumber) && styles.inputError
                    ]}>
                      <Image 
                        source={require('../assets/mpesa.png')} 
                        style={styles.inputLogo}
                        resizeMode="contain"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="07XX XXX XXX"
                        placeholderTextColor="#999999"
                        value={phoneNumber}
                        onChangeText={(text) => {
                          setPhoneNumber(text);
                          setIsValid(true);
                        }}
                        keyboardType="phone-pad"
                        maxLength={12}
                      />
                    </View>
                    {!isValid && (
                      <Text style={styles.errorText}>
                        Please fill in all fields correctly
                      </Text>
                    )}
                  </View>

                  {/* Save Button */}
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      !isFormValid && styles.saveButtonDisabled
                    ]}
                    onPress={handleSave}
                    disabled={!isFormValid}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>

                  {isEditing && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setIsEditing(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  {/* Saved Account Card */}
                  <View style={styles.accountCard}>
                    <View style={styles.cardHeader}>
                      <Image 
                        source={require('../assets/mpesa.png')} 
                        style={styles.cardLogo}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.cardBody}>
                      <Text style={styles.cardName}>{savedAccount.name}</Text>
                      <Text style={styles.cardNumber}>{savedAccount.phoneNumber}</Text>
                    </View>
                  </View>

                  {/* Update Button */}
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdate}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.updateButtonText}>Update</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
  },
  backButton: {
    position: 'absolute',
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 24,
    color: '#0D0D0D',
    fontFamily: 'Nunito_600SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingLeft: 12,
  },
  inputLogo: {
    width: 40,
    height: 24,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 16,
    fontSize: 18,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
    letterSpacing: 1,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#FF3B30',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  nameInput: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#666666',
  },
  accountCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardLogo: {
    width: 60,
    height: 30,
  },
  cardBody: {
    marginTop: 4,
  },
  cardName: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    letterSpacing: 1,
  },
  updateButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});
