import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';

const THEFT_TIMEFRAMES = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This week', value: 'this_week' },
  { label: 'Last week', value: 'last_week' },
  { label: 'This month', value: 'this_month' },
  { label: 'More than a month ago', value: 'more_than_month' },
];

export default function ReportDeviceScreen({ onBack, device }) {
  const [reporterName, setReporterName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [deviceDescription, setDeviceDescription] = useState('');
  const [whenStolen, setWhenStolen] = useState('');
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const insets = useSafeAreaInsets();

  const validateForm = () => {
    const newErrors = {};
    
    if (!reporterName.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    
    if (!mobileNumber.trim()) {
      newErrors.mobile = 'Please enter your mobile number';
    } else if (!/^07\d{8}$/.test(mobileNumber.trim())) {
      newErrors.mobile = 'Please enter a valid Kenyan mobile number (07XXXXXXXX)';
    }
    
    if (!deviceDescription.trim()) {
      newErrors.description = 'Please describe the device';
    }
    
    if (!whenStolen) {
      newErrors.whenStolen = 'Please select when the device was stolen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitReport = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Report Submitted',
        'Your theft report has been submitted successfully. We will investigate and contact you if we need more information.',
        [
          {
            text: 'OK',
            onPress: () => onBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to submit report. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeframeLabel = () => {
    const selected = THEFT_TIMEFRAMES.find(t => t.value === whenStolen);
    return selected ? selected.label : 'Select timeframe';
  };

  const isFormValid = reporterName.trim() && mobileNumber.trim() && deviceDescription.trim() && whenStolen;

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
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons name="flag" size={32} color="#D32F2F" />
                </View>
                <Text style={styles.title}>Report Stolen Device</Text>
                <Text style={styles.subtitle}>
                  Help us investigate this theft by providing your details and information about the stolen device
                </Text>
              </View>

              {/* Device Info Card */}
              {device && (
                <View style={styles.deviceCard}>
                  <Text style={styles.deviceCardTitle}>Device Being Reported</Text>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.deviceName}</Text>
                    <Text style={styles.deviceDetails}>
                      {device.deviceType === 'smartphone' ? 'Smartphone' : 'Laptop'}
                    </Text>
                    <Text style={styles.deviceSerial}>Serial: {device.serialNumber}</Text>
                  </View>
                </View>
              )}

              {/* Reporter Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Information</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.name && styles.inputError
                    ]}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999999"
                    value={reporterName}
                    onChangeText={(text) => {
                      setReporterName(text);
                      if (errors.name) {
                        setErrors({...errors, name: null});
                      }
                    }}
                    autoCapitalize="words"
                  />
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Mobile Number *</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.mobile && styles.inputError
                    ]}
                    placeholder="07XXXXXXXX"
                    placeholderTextColor="#999999"
                    value={mobileNumber}
                    onChangeText={(text) => {
                      setMobileNumber(text);
                      if (errors.mobile) {
                        setErrors({...errors, mobile: null});
                      }
                    }}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                  {errors.mobile && (
                    <Text style={styles.errorText}>{errors.mobile}</Text>
                  )}
                </View>
              </View>

              {/* Device Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Theft Details</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Device Description *</Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      errors.description && styles.inputError
                    ]}
                    placeholder="Describe the device (color, model, condition, any unique features, etc.)"
                    placeholderTextColor="#999999"
                    value={deviceDescription}
                    onChangeText={(text) => {
                      setDeviceDescription(text);
                      if (errors.description) {
                        setErrors({...errors, description: null});
                      }
                    }}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  {errors.description && (
                    <Text style={styles.errorText}>{errors.description}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>When was it stolen? *</Text>
                  <TouchableOpacity
                    style={[
                      styles.dropdown,
                      errors.whenStolen && styles.inputError
                    ]}
                    onPress={() => setShowTimeframeDropdown(true)}
                  >
                    <Text style={[
                      styles.dropdownText,
                      !whenStolen && styles.dropdownPlaceholder
                    ]}>
                      {getTimeframeLabel()}
                    </Text>
                    <Text style={styles.dropdownArrow}>v</Text>
                  </TouchableOpacity>
                  {errors.whenStolen && (
                    <Text style={styles.errorText}>{errors.whenStolen}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Additional Information (Optional)</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Any additional details about the theft, location, circumstances, etc."
                    placeholderTextColor="#999999"
                    value={additionalInfo}
                    onChangeText={setAdditionalInfo}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Warning Notice */}
              <View style={styles.warningCard}>
                <Ionicons name="warning" size={20} color="#F57C00" />
                <View style={styles.warningContent}>
                  <Text style={styles.warningTitle}>Important Notice</Text>
                  <Text style={styles.warningText}>
                    Filing a false theft report is illegal. Please ensure all information provided is accurate and truthful.
                  </Text>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!isFormValid || isSubmitting) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmitReport}
                disabled={!isFormValid || isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting Report...' : 'Submit Theft Report'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Timeframe Dropdown Modal */}
      <Modal
        visible={showTimeframeDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimeframeDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimeframeDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>When was it stolen?</Text>
            {THEFT_TIMEFRAMES.map((timeframe) => (
              <TouchableOpacity
                key={timeframe.value}
                style={[
                  styles.modalOption,
                  whenStolen === timeframe.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setWhenStolen(timeframe.value);
                  setShowTimeframeDropdown(false);
                  if (errors.whenStolen) {
                    setErrors({...errors, whenStolen: null});
                  }
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  whenStolen === timeframe.value && styles.modalOptionTextSelected
                ]}>
                  {timeframe.label}
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
    paddingBottom: 40,
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
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
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
    lineHeight: 20,
  },
  deviceCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  deviceCardTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#666666',
    marginBottom: 8,
  },
  deviceInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  deviceName: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 4,
  },
  deviceDetails: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginBottom: 2,
  },
  deviceSerial: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 16,
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
  textArea: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
    backgroundColor: '#FFFFFF',
    minHeight: 100,
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
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#F57C00',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#E65100',
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
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
});
