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
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../lib/supabase';

const PAYMENT_PLANS = [
  { 
    label: '1 Week', 
    value: 'week', 
    duration: 7, 
    interestRate: 5,
    description: '5% interest for 1 week'
  },
  { 
    label: '2 Weeks', 
    value: '2weeks', 
    duration: 14, 
    interestRate: 8,
    description: '8% interest for 2 weeks'
  },
  { 
    label: '1 Month', 
    value: 'month', 
    duration: 30, 
    interestRate: 12,
    description: '12% interest for 1 month'
  },
];

export default function LoanApplicationScreen({ onBack, onNavigate }) {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [securityItems, setSecurityItems] = useState([]);
  const [loanAmount, setLoanAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({});
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  useEffect(() => {
    loadRequiredData();
  }, [user?.id]);

  const loadRequiredData = async () => {
    try {
      if (!user?.id) {
        setPersonalInfo(null);
        setSecurityItems([]);
        return;
      }

      const [profileResult, securityResult] = await Promise.all([
        dbService.getUserProfile(user.id),
        dbService.listSecurityItems(user.id),
      ]);

      if (profileResult.success && profileResult.data) {
        const profile = profileResult.data;
        setPersonalInfo({
          name: profile.full_name || '',
          idNumber: profile.id_number || '',
          email: user?.email || '',
          gender: profile.gender || '',
        });
      } else {
        setPersonalInfo(null);
      }

      if (securityResult.success && securityResult.data) {
        setSecurityItems(securityResult.data || []);
      } else {
        setSecurityItems([]);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!personalInfo) {
      newErrors.profile = 'Please complete your personal information first';
    }
    
    if (securityItems.length === 0) {
      newErrors.security = 'Please add at least one security item';
    }
    
    if (!loanAmount.trim() || isNaN(loanAmount) || parseFloat(loanAmount) <= 0) {
      newErrors.amount = 'Please enter a valid loan amount';
    }
    
    if (!selectedPlan) {
      newErrors.plan = 'Please select a payment plan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      const mappedSecurityItems = securityItems.map((item) => ({
        id: item.id,
        deviceType: item.device_type || item.deviceType,
        deviceName: item.device_name || item.deviceName,
        serialNumber: item.serial_number || item.serialNumber,
      }));

      const loanData = {
        amount: parseFloat(loanAmount),
        purpose: purpose.trim(),
        paymentPlan: selectedPlan,
        personalInfo,
        securityItems: mappedSecurityItems,
      };
      
      onNavigate && onNavigate('loanReview', loanData);
    }
  };

  const getPlanLabel = () => {
    const selected = PAYMENT_PLANS.find(p => p.value === selectedPlan);
    return selected ? selected.label : 'Select payment plan';
  };

  const calculateTotalAmount = () => {
    if (!loanAmount || !selectedPlan) return 0;
    const plan = PAYMENT_PLANS.find(p => p.value === selectedPlan);
    const principal = parseFloat(loanAmount);
    const interest = (principal * plan.interestRate) / 100;
    return principal + interest;
  };

  const isFormValid = loanAmount.trim() && selectedPlan && personalInfo && securityItems.length > 0;

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
              <Text style={styles.title}>Loan Application</Text>

              {/* Requirements Check */}
              <View style={styles.requirementsSection}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                
                <View style={[
                  styles.requirementItem,
                  personalInfo && styles.requirementMet
                ]}>
                  <Text style={[
                    styles.requirementText,
                    personalInfo && styles.requirementTextMet
                  ]}>
                    ✓ Personal Information {personalInfo ? '(Complete)' : '(Required)'}
                  </Text>
                </View>
                
                <View style={[
                  styles.requirementItem,
                  securityItems.length > 0 && styles.requirementMet
                ]}>
                  <Text style={[
                    styles.requirementText,
                    securityItems.length > 0 && styles.requirementTextMet
                  ]}>
                    ✓ Security Items ({securityItems.length} added)
                  </Text>
                </View>
              </View>

              {/* Loan Amount */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Loan Amount (KES)</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.amount && styles.inputError
                  ]}
                  placeholder="Enter amount"
                  placeholderTextColor="#999999"
                  value={loanAmount}
                  onChangeText={(text) => {
                    setLoanAmount(text);
                    if (errors.amount) {
                      setErrors({...errors, amount: null});
                    }
                  }}
                  keyboardType="numeric"
                />
                {errors.amount && (
                  <Text style={styles.errorText}>{errors.amount}</Text>
                )}
              </View>

              {/* Purpose (Optional) */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Purpose (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What will you use this loan for?"
                  placeholderTextColor="#999999"
                  value={purpose}
                  onChangeText={setPurpose}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Payment Plan */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Payment Plan</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    errors.plan && styles.inputError
                  ]}
                  onPress={() => setShowPlanDropdown(true)}
                >
                  <Text style={[
                    styles.dropdownText,
                    !selectedPlan && styles.dropdownPlaceholder
                  ]}>
                    {getPlanLabel()}
                  </Text>
                  <Text style={styles.dropdownArrow}>v</Text>
                </TouchableOpacity>
                {errors.plan && (
                  <Text style={styles.errorText}>{errors.plan}</Text>
                )}
              </View>

              {/* Loan Summary */}
              {loanAmount && selectedPlan && (
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Loan Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Principal Amount:</Text>
                    <Text style={styles.summaryValue}>KES {parseFloat(loanAmount).toLocaleString()}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Interest ({PAYMENT_PLANS.find(p => p.value === selectedPlan)?.interestRate}%):</Text>
                    <Text style={styles.summaryValue}>KES {((parseFloat(loanAmount) * PAYMENT_PLANS.find(p => p.value === selectedPlan)?.interestRate) / 100).toLocaleString()}</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryTotal]}>
                    <Text style={styles.summaryTotalLabel}>Total Repayment:</Text>
                    <Text style={styles.summaryTotalValue}>KES {calculateTotalAmount().toLocaleString()}</Text>
                  </View>
                </View>
              )}

              {/* Error Messages */}
              {(errors.profile || errors.security) && (
                <View style={styles.errorContainer}>
                  {errors.profile && <Text style={styles.errorText}>{errors.profile}</Text>}
                  {errors.security && <Text style={styles.errorText}>{errors.security}</Text>}
                </View>
              )}

              {/* Continue Button */}
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !isFormValid && styles.continueButtonDisabled
                ]}
                onPress={handleContinue}
                disabled={!isFormValid}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>Continue to Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Payment Plan Modal */}
      <Modal
        visible={showPlanDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPlanDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPlanDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Plan</Text>
            {PAYMENT_PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.value}
                style={[
                  styles.modalOption,
                  selectedPlan === plan.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedPlan(plan.value);
                  setShowPlanDropdown(false);
                  if (errors.plan) {
                    setErrors({...errors, plan: null});
                  }
                }}
              >
                <View style={styles.planOption}>
                  <Text style={[
                    styles.planLabel,
                    selectedPlan === plan.value && styles.planLabelSelected
                  ]}>
                    {plan.label}
                  </Text>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>
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
    marginBottom: 24,
    textAlign: 'center',
  },
  requirementsSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 12,
  },
  requirementItem: {
    paddingVertical: 8,
  },
  requirementMet: {
    opacity: 1,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
  },
  requirementTextMet: {
    color: '#2E7D32',
    fontFamily: 'Nunito_600SemiBold',
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
  summaryCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 4,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
  },
  errorContainer: {
    marginBottom: 20,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#FF3B30',
    marginTop: 8,
  },
  continueButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionSelected: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: -24,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  planOption: {
    alignItems: 'center',
  },
  planLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
    marginBottom: 4,
  },
  planLabelSelected: {
    fontFamily: 'Nunito_600SemiBold',
  },
  planDescription: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
  },
});
