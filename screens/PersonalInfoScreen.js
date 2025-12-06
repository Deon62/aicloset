import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../lib/supabase';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const UNIVERSITY_OPTIONS = [
  { label: 'Egerton University', value: 'egerton' },
  { label: 'University of Nairobi (UoN)', value: 'uon' },
  { label: 'Jomo Kenyatta University (JKUAT)', value: 'jkuat' },
  { label: 'Mount Kenya University', value: 'mount_kenya' },
  { label: 'Kenyatta University (KU)', value: 'ku' },
];

export default function PersonalInfoScreen({ onBack }) {
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [university, setUniversity] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [savedInfo, setSavedInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [errors, setErrors] = useState({});
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Keep email in sync with authenticated user (read-only)
  useEffect(() => {
    setEmail(user?.email || '');
  }, [user?.email]);

  useEffect(() => {
    loadSavedInfo();
  }, []);

  const loadSavedInfo = async () => {
    try {
      if (user?.id) {
        setLoading(true);
        const { success, data } = await dbService.getUserProfile(user.id);
        if (success && data) {
          const info = {
            name: data.full_name || '',
            idNumber: data.id_number || '',
            email: user?.email || '',
            gender: data.gender || '',
            university: data.university || '',
            regNumber: data.registration_number || '',
          };
          setSavedInfo(info);
        }
      }
    } catch (error) {
      console.log('Error loading personal info:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateIdNumber = (id) => {
    // Kenyan ID number format: 8 digits
    const idRegex = /^\d{8}$/;
    return idRegex.test(id);
  };

  const handleSave = async () => {
    // Ensure all values are strings before trimming
    const safeName = name || '';
    const safeIdNumber = idNumber || '';
    const safeRegistrationNumber = regNumber || '';
    
    // Validate inputs with safe values
    const newErrors = {};
    if (!safeName.trim()) newErrors.name = 'Full name is required';
    if (!safeIdNumber.trim()) newErrors.idNumber = 'ID number is required';
    if (!gender) newErrors.gender = 'Please select your gender';
    if (!university) newErrors.university = 'Please select your university';
    if (!safeRegistrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    try {
      setSaving(true);

      const updates = {
        full_name: safeName.trim(),
        id_number: safeIdNumber.trim(),
        gender: gender,
        university: university,
        registration_number: safeRegistrationNumber.trim(),
        profile_completed: true,
      };

      console.log('Attempting to save profile with:', updates);
      const { success, error } = await dbService.updateUserProfile(user.id, updates);

      if (!success) {
        setSaveError(error || 'Could not save your profile. Please try again.');
        return;
      }

      setSavedInfo(updates);
      setIsEditing(false);
    } catch (error) {
      setSaveError('An unexpected error occurred. Please try again.');
      console.error('Profile update exception:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = () => {
    setName(savedInfo.name);
    setIdNumber(savedInfo.idNumber);
    setEmail(savedInfo.email);
    setGender(savedInfo.gender);
    setUniversity(savedInfo.university || '');
    setRegNumber(savedInfo.regNumber || '');
    setIsEditing(true);
  };

  const getGenderLabel = () => {
    const selected = GENDER_OPTIONS.find(g => g.value === gender);
    return selected ? selected.label : 'Select gender';
  };

  const getUniversityLabel = () => {
    const selected = UNIVERSITY_OPTIONS.find(u => u.value === university);
    return selected ? selected.label : 'Select university';
  };

  const isFormValid = name.trim() && idNumber.trim() && email.trim() && gender && university && regNumber.trim();
  const showForm = !savedInfo || isEditing;

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
              <Text style={styles.title}>Personal Information</Text>

              {showForm ? (
                <>
                  {/* Name Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={[
                        styles.input,
                        !isValid && !name.trim() && styles.inputError,
                        errors.name && styles.inputError
                      ]}
                      placeholder="Enter your full name"
                      placeholderTextColor="#999999"
                      value={name}
                      onChangeText={(text) => {
                        setName(text);
                        setIsValid(true);
                        setErrors((prevErrors) => ({ ...prevErrors, name: null }));
                      }}
                    />
                    {errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>

                  {/* ID Number Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>ID Number</Text>
                    <TextInput
                      style={[
                        styles.input,
                        !isValid && !validateIdNumber(idNumber) && styles.inputError,
                        errors.idNumber && styles.inputError
                      ]}
                      placeholder="Enter 8-digit ID number"
                      placeholderTextColor="#999999"
                      value={idNumber}
                      onChangeText={(text) => {
                        setIdNumber(text);
                        setIsValid(true);
                        setErrors((prevErrors) => ({ ...prevErrors, idNumber: null }));
                      }}
                      keyboardType="numeric"
                      maxLength={8}
                    />
                    {errors.idNumber && (
                      <Text style={styles.errorText}>{errors.idNumber}</Text>
                    )}
                  </View>

                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={[
                        styles.input,
                        !isValid && !email.trim() && styles.inputError
                      ]}
                      placeholder="your.email@example.com"
                      placeholderTextColor="#999999"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setIsValid(true);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  {/* Gender Dropdown */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Gender</Text>
                    <TouchableOpacity
                      style={[
                        styles.dropdown,
                        !isValid && !gender && styles.inputError,
                        errors.gender && styles.inputError
                      ]}
                      onPress={() => setShowGenderDropdown(true)}
                    >
                      <Text style={[
                        styles.dropdownText,
                        !gender && styles.dropdownPlaceholder
                      ]}>
                        {getGenderLabel()}
                      </Text>
                      <Text style={styles.dropdownArrow}>v</Text>
                    </TouchableOpacity>
                    {errors.gender && (
                      <Text style={styles.errorText}>{errors.gender}</Text>
                    )}
                  </View>

                  {/* University Dropdown */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>University</Text>
                    <TouchableOpacity
                      style={[
                        styles.dropdown,
                        !isValid && !university && styles.inputError,
                        errors.university && styles.inputError
                      ]}
                      onPress={() => setShowUniversityDropdown(true)}
                    >
                      <Text style={[
                        styles.dropdownText,
                        !university && styles.dropdownPlaceholder
                      ]}>
                        {getUniversityLabel()}
                      </Text>
                      <Text style={styles.dropdownArrow}>v</Text>
                    </TouchableOpacity>
                    {errors.university && (
                      <Text style={styles.errorText}>{errors.university}</Text>
                    )}
                  </View>

                  {/* Registration Number Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Registration Number</Text>
                    <TextInput
                      style={[
                        styles.input,
                        !isValid && !regNumber.trim() && styles.inputError,
                        errors.registrationNumber && styles.inputError
                      ]}
                      placeholder="e.g. SC101/1234/2023"
                      placeholderTextColor="#999999"
                      value={regNumber}
                      onChangeText={(text) => {
                        setRegNumber(text);
                        setIsValid(true);
                        setErrors((prevErrors) => ({ ...prevErrors, registrationNumber: null }));
                      }}
                      autoCapitalize="characters"
                      autoCorrect={false}
                    />
                    {errors.registrationNumber && (
                      <Text style={styles.errorText}>{errors.registrationNumber}</Text>
                    )}
                  </View>

                  {!isValid && (
                    <Text style={styles.errorText}>
                      Please fill in all fields correctly
                    </Text>
                  )}

                  <TouchableOpacity
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                  >
                    <Text style={styles.saveButtonText}>
                      {saving ? 'Saving...' : 'Save Profile'}
                    </Text>
                  </TouchableOpacity>
                  
                  {saveError && (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{saveError}</Text>
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={handleSave}
                      >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                      </TouchableOpacity>
                    </View>
                  )}

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
                  {/* Saved Info Display */}
                  <View style={styles.infoCard}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Full Name</Text>
                      <Text style={styles.infoValue}>{savedInfo.name}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>ID Number</Text>
                      <Text style={styles.infoValue}>{savedInfo.idNumber}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Email Address</Text>
                      <Text style={styles.infoValue}>{savedInfo.email}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Gender</Text>
                      <Text style={styles.infoValue}>
                        {GENDER_OPTIONS.find(g => g.value === savedInfo.gender)?.label || savedInfo.gender}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>University</Text>
                      <Text style={styles.infoValue}>
                        {UNIVERSITY_OPTIONS.find(u => u.value === savedInfo.university)?.label || savedInfo.university}
                      </Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Registration Number</Text>
                      <Text style={styles.infoValue}>{savedInfo.regNumber}</Text>
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

      {/* Gender Dropdown Modal */}
      <Modal
        visible={showGenderDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  gender === option.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setGender(option.value);
                  setShowGenderDropdown(false);
                  setIsValid(true);
                  setErrors((prevErrors) => ({ ...prevErrors, gender: null }));
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  gender === option.value && styles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* University Dropdown Modal */}
      <Modal
        visible={showUniversityDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUniversityDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowUniversityDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select University</Text>
            {UNIVERSITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  university === option.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setUniversity(option.value);
                  setShowUniversityDropdown(false);
                  setIsValid(true);
                  setErrors((prevErrors) => ({ ...prevErrors, university: null }));
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  university === option.value && styles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 8,
  },
  input: {
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
  infoCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
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
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
  },
  dropdownPlaceholder: {
    color: '#999999',
  },
  dropdownArrow: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#666666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionSelected: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    fontFamily: 'Nunito_600SemiBold',
  },
  errorContainer: {
    marginTop: 16,
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#0D0D0D',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});
